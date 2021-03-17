const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/Message')
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    assignHost,
} = require('./utils/Users')

const {
    Time,
    rooms,
    getCurrentTime,
    changeTime,
    initializePomodoro,
    timerSet,
    setPomodoroTime,
    setBreakTime,
    tickBreakTime,
    tickPomodoro,
    tickTimeSpent,
} = require('./utils/Timer')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        assignHost(user.room)
        io.to(user.room).emit('updateUserList', getUsersInRoom(user.room))
        socket.broadcast
            .to(user.room)
            .emit('message', generateMessage(`${user.username} has joined!`))
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback('User does not exist')
        }

        io.to(user.room).emit(
            'message',
            generateMessage(user.username, message)
        )
        callback()
    })

    socket.on('setTimer', () => {
        const user = getUser(socket.id)

        //Makes sure that the timer only gets set if timer hasnt been created yet.
        if (rooms[user.room] == undefined) {
            initializePomodoro(user.room, {})
            io.to(user.room).emit('updateTimer', getCurrentTime(user.room))
            const timer = setInterval(() => {
                if (rooms[user.room] == undefined) {
                    clearInterval(timer)
                    return
                }
                if (!rooms[user.room].paused) {
                    io.to(user.room).emit(
                        'updateTimer',
                        getCurrentTime(user.room)
                    )
                    tickPomodoro(user.room)
                }
            }, 1000)
        }
    })

    socket.on('changeTime', (minutes) => {
        const user = getUser(socket.id)
        changeTime(user.room, minutes)
        io.to(user.room).emit('updateTimer', getCurrentTime(user.room))
    })

    socket.on('pauseTimer', () => {
        const user = getUser(socket.id)
        rooms[user.room].paused = true
        io.to(user.room).emit('pauseTimer')
    })

    socket.on('playTimer', () => {
        const user = getUser(socket.id)
        rooms[user.room].paused = false
        io.to(user.room).emit('playTimer')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (
            getUsersInRoom(user.room) == undefined ||
            getUsersInRoom(user.room).length == 0
        ) {
            delete rooms[user.room]
        }
        if (user) {
            assignHost(user.room)
            io.to(user.room).emit(
                'message',
                generateMessage(`${user.username} has left!`)
            )
            io.to(user.room).emit('updateUserList', getUsersInRoom(user.room))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port http://localhost:${port}`)
})

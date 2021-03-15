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
} = require('./utils/Users')

const {
    getCurrentTime,
    initializePomodoro,
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
        //Executes an acknowledgement on the Client
        callback()
    })

    socket.on('startTimer', () => {
        const user = getUser(socket.id)
        initializePomodoro(user.room, {})
        const timer = setInterval(() => {
            io.to(user.room).emit(
                'updateTimer',
                getCurrentTime(user.room, 'pomodoro')
            )
            tickPomodoro(user.room)
        }, 1000)
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit(
                'message',
                generateMessage(`${user.username} has left!`)
            )
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port http://localhost:${port}`)
})

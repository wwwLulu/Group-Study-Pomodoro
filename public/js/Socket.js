const socket = io()

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})
vueApp.username = username
vueApp.room = room

// Client => Server
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.emit('setTimer')

// Server => Client
socket.on('updateTimer', (time) => {
    vueApp.time = time
})

socket.on('updateUserList', (userList) => {
    vueApp.userList = userList
})

socket.on('setTimer', () => {
    socket.emit('pauseTimer')
})

socket.on('playTimer', () => {
    vueApp.timerPaused = false
})

socket.on('pauseTimer', () => {
    vueApp.timerPaused = true
})

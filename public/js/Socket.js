const socket = io()

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})
// vueChat.chatsername = username
vueApp.username = username
vueApp.room = room

// Client => Server
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.emit('setTimer', () => {
    socket.emit('pauseTimer')
})

// Server => Client
socket.on('updateTimer', (time) => {
    vueApp.time = time
})

socket.on('updateUserList', (userList) => {
    socket.emit('updateTime')
    vueApp.userList = userList
    vueApp.assignHost()
})

socket.on('playTimer', () => {
    vueApp.timerPaused = false
})

socket.on('pauseTimer', () => {
    vueApp.timerPaused = true
})

// socket.on('message', ({ username, text, createdAt }) => {
//     vueApp.messages.push(username, text, createdAt)
// })

socket.on('message', ({ username, text, createdAt }) => {
    timeStamp = moment(createdAt).format('h:mm a')
    vueApp.messages.push({ username, text, createdAt: timeStamp })
    vueApp.autoScroll()
})

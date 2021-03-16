const vueApp = Vue.createApp({
    data() {
        return {
            username: '',
            room: '',
            time: '25:00',
            timerPaused: false,
            userList: [],
        }
    },
    methods: {
        setTimer() {
            socket.emit('setTimer')
        },
        pauseTimer() {
            socket.emit('pauseTimer')
        },
        playTimer() {
            socket.emit('playTimer')
        },
    },
}).mount('#app')

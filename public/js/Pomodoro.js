const vueApp = Vue.createApp({
    data() {
        return {
            username: '',
            room: '',
            time: '',
            timerPaused: true,
            userList: [],
            pomodoroMinutes: 25,
            breakMinutes: 5,
        }
    },
    methods: {
        updateTimeSettings() {
            this.pomodoroMinutes = this.$refs.pomodoroTime.value
            this.breakMinutes = this.$refs.breakTime.value
            socket.emit('changeTime', this.pomodoroMinutes, this.breakMinutes)
        },
        pauseTimer() {
            socket.emit('pauseTimer')
        },
        playTimer() {
            socket.emit('playTimer')
        },
    },
}).mount('#app')

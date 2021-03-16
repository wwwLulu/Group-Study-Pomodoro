const vueApp = Vue.createApp({
    data() {
        return {
            isHost: false,
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
        assignHost() {
            const host = this.userList.filter((user) => user.host == true)
            if (host[0].username == username) {
                console.log(username)
                this.isHost = true
            } else {
                this.isHost = false
            }
        },
    },
}).mount('#app')

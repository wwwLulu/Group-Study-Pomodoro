const vueApp = Vue.createApp({
    data() {
        return {
            currentStatus: 'pomodoro',
            pomoActive: true,
            breakActive: false,
            isHost: true,
            username: '',
            room: '',
            time: '',
            timerPaused: true,
            userList: [],
            pomodoroMinutes: 25,
            breakMinutes: 5,
            messages: [],
            messageContent: '',
        }
    },
    watch: {
        time() {
            if (this.time == '') {
                this.time = `${pomodoroMinutes}:00`
            }
        },
        currentStatus(status) {
            if (status == 'pomodoro') {
                pomoActive = true
                breakActive = false
            } else {
                pomoActive = false
                breakActive = true
            }
        },
    },
    methods: {
        autoScroll() {
            this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        },
        sendMessage() {
            socket.emit('sendMessage', this.messageContent)
            this.messageContent = ''
        },
        changeTimeToBreak() {
            socket.emit('changeTime', this.breakMinutes)
            this.currentStatus = 'break'
        },
        changeTimeToPomodoro() {
            socket.emit('changeTime', this.pomodoroMinutes)
            this.currentStatus = 'pomodoro'
        },
        updateTimeSettings() {
            this.pomodoroMinutes = this.$refs.pomodoroTime.value
            this.breakMinutes = this.$refs.breakTime.value
            socket.emit(
                'changeTime',
                this.currentStatus == 'pomodoro'
                    ? this.pomodoroMinutes
                    : this.breakMinutes
            )
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

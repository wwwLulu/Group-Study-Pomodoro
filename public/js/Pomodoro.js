const vueApp = Vue.createApp({
    data() {
        return {
            username: '',
            room: '',
            time: '',
            userList: [],
        }
    },
    methods: {
        startTimer() {
            socket.emit('startTimer')
        },
    },
}).mount('#app')

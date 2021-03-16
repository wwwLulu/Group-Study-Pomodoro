/*
    rooms = 
            room: {
                pomoTime: new Time
                breakTime: new Time
                paused: false,
            },
            room2: {
                pomoTime: new Time
                breakTime: new Time
                paused: false
            }
*/
const rooms = {}

class Time {
    constructor(hours, minutes, seconds) {
        this.initialMinutes = minutes
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds
        this.time
    }

    ChangeTime(minutes) {
        ;(this.hours = 0), (this.minutes = minutes), (this.seconds = 0)
    }

    TimeOver() {
        return this.hours === 0 && this.minutes === 0 && this.seconds === 0
            ? true
            : false
    }

    CurrentTime() {
        if (this.seconds < 10) {
            this.time = `${this.hours}:${this.minutes}:0${this.seconds}`
        } else {
            this.time = `${this.hours}:${this.minutes}:${this.seconds}`
        }

        if (this.hours == 0) {
            let index = this.time.indexOf(':')
            this.time = this.time.slice(index + 1)
        }
        return this.time
    }

    TickUp() {
        this.seconds++

        if (this.seconds >= 60) {
            this.minutes++
            this.seconds = 0
        }
        if (this.minutes >= 60) {
            this.hours++
            this.minutes = 0
        }
    }

    TickDown() {
        this.seconds--

        if (this.minutes <= 0 && this.seconds <= 0) {
            return
        }
        if (this.seconds <= 0) {
            this.minutes--
            this.seconds = 59
        }
    }
}

/**
 *
 * @param {String} room
 */
const initializePomodoro = (
    room,
    { pomodoroTime = new Time(0, 25, 0), breakTime = new Time(0, 5, 0) }
) => {
    rooms[room] = {
        pomodoroTime,
        breakTime,
        paused: true,
    }
}

/**
 *@param {String} room
 *@param {Time}
 */
const setPomodoroTime = (room, { hours = 0, minutes = 0, seconds = 0 }) => {
    rooms[room].pomodoroTime = new Time(hours, minutes, seconds)
}

/**
 *@param {String} room
 *@param {Time}
 */
const setBreakTime = (room, { hours = 0, minutes = 0, seconds = 0 }) => {
    rooms[room].breakTime = new Time(hours, minutes, seconds)
}

/**
 *@param {String} room
 */
const tickPomodoro = (room) => {
    rooms[room].pomodoroTime.TickDown()
}

/**
 *@param {String} room
 */
const tickBreakTime = (room) => {
    rooms[room].breakTime.TickDown()
}

/**
 *@param {String} room
 */
const tickTimeSpent = (room) => {
    rooms[room].pomodoroTime.TickUp()
}

/**
 *@param {String} room
 */
const getCurrentTime = (room) => {
    return rooms[room].pomodoroTime.CurrentTime()
}

/**
 *@param {String} room
 *@param {Number} minutes
 */
const changeTime = (room, minutes) => {
    rooms[room].pomodoroTime.ChangeTime(minutes)
}

module.exports = {
    changeTime,
    getCurrentTime,
    rooms,
    initializePomodoro,
    setPomodoroTime,
    setBreakTime,
    tickBreakTime,
    tickPomodoro,
    tickTimeSpent,
}

// initializePomodoro('dskl', {})
// tickPomodoro('dskl')
// tickPomodoro('dskl')
// tickPomodoro('dskl')
// tickPomodoro('dskl')
// tickPomodoro('dskl')
// changeTime('dskl', 5)
// console.log(rooms)
// tickBreakTime('dskl')

// console.log(rooms)

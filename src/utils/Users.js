/*
    user {
        id,
        username,
        room,
        task,
        host
    }
*/

const users = []

/**
 *@param {Socket.id} id
 *@param {String} username
 *@param {String} room
 */
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required!',
        }
    }
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username is in use!',
        }
    }
    const user = { id, username, room, task: '', host: false }
    users.push(user)
    assignHost(room)
    return { user }
}

/**
 *@param {Socket.id} id
 */
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    const room = users.find((user) => {
        if (user.id == id) {
            return user.room
        }
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
    assignHost(room)
}

/**
 *@param {Socket.id} id
 */
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

/**
 *@param {String} room
 */
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.trim().toLowerCase())
}
/**
 *@param {String} room
 */
const assignHost = (room) => {
    let usersInRoom = users.filter((user) => user.room === room) || []
    if (usersInRoom.length == 1) {
        //Assign new host
        users.forEach((user) => {
            if (user.room === room) {
                user.host = true
            }
        })
    }
}

// addUser({ id: 'dlakfj', username: 'poop', room: 'sdfd' })
// addUser({ id: 'dlakfj', username: 'johnny', room: 'sdfd' })

// console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    assignHost,
}

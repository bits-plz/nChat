'use strict'
const DB = new Map()
// new Map<Room , set<UserName>>() // for now
let {uid} = require('../utils/uid')
let {User} = require('../models/user')
let userDB = new Map() // just to implement the disconnect 

// new Map<userName, User>>

const addUserToRoom = (user, room, id) =>{
    room = room.trim().toLowerCase()
    user = user.trim()

    if(!room || !user) return {'error' : 'UserName or RoomName is empty'}


    if(DB.has(room) &&  DB.get(room).has(user)) return {'error' : 'User with same name already present in chat'}


    if(!DB.has(room)) DB.set(room, new Set())
    if(!userDB.has(id)) userDB.set(id, new User(room, user) ) // one to one mapping

    DB.get(room).add(user)

    
    return {'error' : null}
}

const getUserFromSocketId = (id) =>{
    return userDB.get(id)
}

const removeUserFromRoom = (id) =>{
    if(!userDB.get(id)) return {userName : null, roomname : null}
   let user = userDB.get(id)
   DB.get(user.roomName).delete(user.userName)
   userDB.delete(id)
   return {userName : user.userName, roomName : user.roomName}
}

const getroomList = (user) =>{
    let roomList =[]
    DB.forEach(Room =>{
        if(Room.has(user)) roomList.push(Room)
    })
    
    return roomList   
}
const getAllUsers = (room) =>{
   if(room) return [...DB.get(room)]
}

module.exports = {
    addUserToRoom, removeUserFromRoom, getroomList, getAllUsers, getUserFromSocketId
}






const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const colors = require('colors')
const Filter = require('bad-words')
const {prepareMessage, prepareLocationUrl}  =require('./utils/messages')
const filter = new Filter()
const {getAllUsers, addUserToRoom, getroomList, removeUserFromRoom, getUserFromSocketId} =require('./utils/users')


const PORT = process.env.PORT || 5000
const app = express()

let activeUsers = new Map()

const server = http.createServer(app)
const io = socketio(server)

const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))



/**
 * chat events , user joined, messaged, left, is typing
 */

io.on('connection', (socket)=>{

    console.log('New User Connected'.gray)

    socket.on('sendMessage', (message, cb)=>{
        if(filter.isProfane(message)) return cb('No profanity allowed')
        let user = getUserFromSocketId(socket.id)
        
        io.to(user.roomName).emit('message', prepareMessage(message, user.userName))
        cb()
    })

    socket.on('sendLoc', (pos, cb)=>{
        let user = getUserFromSocketId(socket.id)

        io.to(user.roomName).emit('recvLoc',{  lat : pos.lat, long :pos.long, createdAt : new Date().getTime() , user: user.userName})

        return cb('Delivered')
    })    


    socket.on('join', (options, callback) =>{

        socket.emit('message', prepareMessage('Welcome !', options.roomName))
    
        socket.join(options.roomName)

        let {error} = addUserToRoom(options.username, options.roomName,  socket.id)
        if(error) return callback(error)

        socket.broadcast.to(options.roomName).emit('message', prepareMessage(`${options.username} has joined the chat`, options.roomName))
        
        

        io.to(options.roomName).emit('roomData', {
            roomName : options.roomName,
            participants  : getAllUsers(options.roomName)
        })
        

        callback()

        
    })

   
    socket.on('disconnect', () =>{
       let {userName, roomName} = removeUserFromRoom(socket.id)
      
       if(userName && roomName) io.to(roomName).emit('message', prepareMessage(`${userName} has left the chat`, roomName,))
       io.to(roomName).emit('roomData', {
        roomName : roomName,
        participants  : getAllUsers(roomName)
        })
    })

})





server.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`)
})




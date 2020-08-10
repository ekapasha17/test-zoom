const socket    =   io('/')

socket.emit('join-room',roomid,10)
socket.on('user-connected',userId   =>  {
    console.log('user connect '+userId)
})
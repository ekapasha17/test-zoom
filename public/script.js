/**
 * ssdsd
 */
const socket    =   io('/')
const videogrid =   document.getElementById('video-grid')
const mypeer    =   new Peer(undefined,{
    host:'/',
    port:'3001',
})
const myvideo   =   document.createElement('video')
myvideo.muted = true
const peers =   {}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream  =>  {
    addvidstream(myvideo,stream)
    mypeer.on('call',call   =>  {
        call.answer(stream)
        const video =    document.createElement('video')
        call.on('stream',user_video_stream  =>{
            addvidstream(video,user_video_stream)
        })
    })
    socket.on('user-connected',userId   =>  {
        connect_to_new_user(userId,stream)
    })
})

socket.on('user-disconnected',userId =>{
    //console.log(userId)
    if (peers[userId]) {
        peers[userId].close()   
    }
})



mypeer.on('open',id =>  {
    socket.emit('join-room',roomid,id)
})

function connect_to_new_user(userId,stream) {
    const call  =   mypeer.call(userId,stream)
    const video =    document.createElement('video')
    call.on('stream',user_video_stream  =>  {
        addvidstream(video,user_video_stream)
    })
    call.on('close',()  =>  {
        video.remove()
    })

    peers[userId]   =   call
}

socket.on('user-connected',userId   =>  {
    console.log('user connect '+userId)
})


function addvidstream(video,stream) {
    video.srcObject =   stream
    video.addEventListener('loadedmetadata',() =>  {
        video.play()
    })
    videogrid.append(video)
}
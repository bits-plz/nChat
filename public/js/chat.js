const socket = io()

const $messageForm = document.getElementById('message-form')
const $messageInput = $messageForm.querySelector('#message')
const $messageBtn = $messageForm.querySelector('#send')
const $messages = document.getElementById('messages')

// Message Template

const messageTemplate = document.getElementById('message-template').innerHTML
const googleLocationUrlTemplate = document.getElementById('location-message-template').innerHTML

// Options
const {username, roomName} = Qs.parse(location.search, {ignoreQueryPrefix : true})
console.log(username)

const $sendLoc = document.getElementById('send-location')

const createmessageTemplate = (message) =>{
    return Mustache.render(messageTemplate , {
        text : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
}
const createLocationTemplate = (pos) =>{
    let googleMapLocationUrl = `${pos.lat},${pos.long}` ;
    let createdAt = moment(pos.createdAt).format('h:mm a')
    console.log(googleMapLocationUrl)
    return Mustache.render(googleLocationUrlTemplate, {createdAt, googleMapLocationUrl})
}



socket.on('userLeft', (message) =>{
    $messages.insertAdjacentHTML('beforeend', createmessageTemplate(message))
})

$messageBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    if($messageInput.value.trim() === '') return;
    $messageBtn.setAttribute('disabled', 'disbled')

    socket.emit('sendMessage', $messageInput.value, (err) =>{
       
        $messageInput.focus()
        $messageInput.value = ''
        
        $messageBtn.removeAttribute('disabled')
    } )

    
})

socket.on('message',(message) =>{
    
    $messages.insertAdjacentHTML('beforeend', createmessageTemplate(message))
})

document.getElementById('leaveChat').addEventListener('click', (e)=>{
    e.preventDefault()
    socket.emit('leftChat', username)
    
})

$sendLoc.addEventListener('click', (e)=>{
    e.preventDefault()
    console.log('clicked')
    if(!navigator.geolocation) return alert('geolocation not supported')
    $sendLoc.setAttribute('disabled', 'disabled')
   
    navigator.geolocation.getCurrentPosition((pos)=>{
        socket.emit('sendLoc', {
            lat : pos.coords.latitude, long : pos.coords.longitude
        }, (err)=>{
            $sendLoc.removeAttribute('disabled')
        })
    })
})

socket.on('recvLoc', pos=>{
    $messages.insertAdjacentHTML('beforeend', createLocationTemplate(pos))
})

socket.emit('join', {username, roomName}, (error) =>{
    console.log(error)
})
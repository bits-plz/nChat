const socket = io()

const $messageForm = document.getElementById('message-form')
const $messageInput = $messageForm.querySelector('#message')
const $messageBtn = $messageForm.querySelector('#send')
const $messages = document.getElementById('messages')
const $sideBar = document.getElementById('side-bar')
// Message Template

const messageTemplate = document.getElementById('message-template').innerHTML
const googleLocationUrlTemplate = document.getElementById('location-message-template').innerHTML
const sideBarTemplate  = document.getElementById('sidebar-template').innerHTML
// Options
const {username, roomName} = Qs.parse(location.search, {ignoreQueryPrefix : true})
console.log(username)

const $sendLoc = document.getElementById('send-location')

const createmessageTemplate = (message) =>{
    return Mustache.render(messageTemplate , {
        text : message.text,
        user : message.user,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
}
const createLocationTemplate = (pos) =>{
    let googleMapLocationUrl = `${pos.lat},${pos.long}` ;
    let createdAt = moment(pos.createdAt).format('h:mm a')
    let user = pos.user
    return Mustache.render(googleLocationUrlTemplate, {createdAt, googleMapLocationUrl, user})
}

const autoScroll = () =>{
    const $newMessage = $messages.lastElementChild
    const $newMessageMargin = parseInt(getComputedStyle($newMessage).marginBottom)

    const newMessageHeight = $newMessage.offsetHeight + $newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrolledOffset = $messages.scrollTop + visibleHeight
    console.log(`${containerHeight-newMessageHeight}, ${scrolledOffset}`)
    

    if(containerHeight - newMessageHeight <= scrolledOffset){
        $messages.scrollTop = $messages.scrollHeight
    }


}

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
    autoScroll()
})

$sendLoc.addEventListener('click', (e)=>{
    e.preventDefault()
    
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
    autoScroll()
})

socket.emit('join', {username, roomName}, (error) =>{
    if(error) console.log(error)
})

socket.on('roomData', roomData =>{
    $sideBar.innerHTML =''
    let html = Mustache.render(sideBarTemplate, roomData)
    $sideBar.insertAdjacentHTML('beforeend', html)
})
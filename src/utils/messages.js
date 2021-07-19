const prepareMessage = (msg, user) =>{
    return {
        text : msg,
        user : user,
        createdAt : new Date().getTime()
    }
}

const prepareLocationUrl = (user, pos) =>{
    return {
        user : user,
        lat : pos.lat,
        long : pos.long,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    prepareMessage,
    prepareLocationUrl
}
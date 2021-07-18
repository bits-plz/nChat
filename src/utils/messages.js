const prepareMessage = (msg) =>{
    return {
        text : msg,
        createdAt : new Date().getTime()
    }
}

const prepareLocationUrl = (pos) =>{
    return {
        lat : pos.lat,
        long : pos.long,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    prepareMessage,
    prepareLocationUrl
}
const Filter = require('bad-words')


const filter = new Filter()



const removeAlternates = (word) =>{
    
    let e = ''
    for(let j =0; j< word.length-2 ;++j) e +='*'

    return word[0] + e +word[word.length-1]

}

const replaceBadWords = (message) =>{
    
    return message.trim().split(' ')
   .map(str =>{
        if(filter.isProfane(str)) return removeAlternates(str)
        return str
    }).join(' ')

    
}


module.exports = {replaceBadWords}
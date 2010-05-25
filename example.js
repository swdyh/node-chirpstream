var sys = require('sys')
var chirpStrem = require('./chirpstream')

var auth = 'xxx' // base64(id + ':' + password)
var chirp = new chirpStrem.ChirpStream(auth)
var eventTypes = ['friends', 'text', 'event', 'follow', 'favorite', 'retweet', 'delete', 'other']
eventTypes.forEach(function(i) {
    chirp.addListener(i, function(chirp) {
        sys.puts('--- ' + i + ' ---')
        sys.puts(JSON.stringify(chirp))
        sys.puts('---')
    })
})
chirp.connect()

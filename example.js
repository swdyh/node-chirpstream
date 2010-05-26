var sys = require('sys')
var chirpStrem = require('./chirpstream')

var auth = 'xxx' // base64(id + ':' + password)
var chirp = new chirpStrem.ChirpStream(auth)

chirp.addListener('text', function(i) {
    sys.puts(i.user.screen_name + ': ' + i.text)
})
chirp.addListener('favorite', function(i) {
    sys.puts(i.source.screen_name + ': favorite')
    sys.puts('  ' + i.target_object.user.screen_name + ': ' +
             i.target_object.text)
})
chirp.addListener('retweet', function(i) {
    sys.puts(i.source.screen_name + ': retweet')
    sys.puts('  ' + i.target_object.user.screen_name + ': ' +
             i.target_object.text)
})
chirp.addListener('follow', function(i) {
    sys.puts(i.source.screen_name + ': follow ' + i.target.screen_name)
})
chirp.connect()

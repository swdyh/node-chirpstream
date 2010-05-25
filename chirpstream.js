//
// A Twitter ChirpUserStrems Library for Node.js
//

var sys = require('sys')
var http = require('http')
var events = require('events')

exports.ChirpStream = ChirpStream

function ChirpStream(auth) {
    // FIXME base64
    // this.auth = b64(id + ':' + pass)
    this.host = 'chirpstream.twitter.com'
    this.path = '/2b/user.json'
    this.auth = auth
    this.chunk = ''
    this.client = http.createClient(80, this.host)
    this.headers = {'host': this.host, 'Authorization': 'Basic ' + this.auth }
}
sys.inherits(ChirpStream, events.EventEmitter)

ChirpStream.prototype.connect = function() {
    var request = this.client.request('GET', this.path, this.headers)
    var that = this
    request.addListener('response', function (response) {
        response.setEncoding('utf8')
        response.addListener('data', function (chunk) {
            // sys.puts('BODY: ' + chunk + '\n--- \n');
            that.correctChunk(chunk)
        });
    });
    request.end()
}
ChirpStream.prototype.correctChunk = function(chunk) {
    var tmp = chunk.split('\r\n')
    tmp[0] = this.chunk + tmp[0]
    this.chunk = tmp.pop()
    var that = this
    tmp.forEach(function(i) {
        if (i.length > 0) {
            that.chirp(i)
        }
    })
}
ChirpStream.prototype.chirp = function(json) {
    try {
        var chirp = JSON.parse(json)
        if (chirp['friends']) {
            this.emit('friends', chirp)
        }
        else if (chirp['text']) {
            this.emit('text', chirp)
        }
        else if (chirp['delete']) {
            this.emit('delete', chirp)
        }
        else if (chirp['event']) {
            this.emit(chirp['event'], chirp)
        }
        else {
            this.emit('other', chirp)
        }
    }
    catch(e) {
        sys.puts('E:' + e)
    }
}


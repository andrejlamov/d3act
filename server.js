var http = require('http');
var jsdom = require('jsdom');
var fs = require('fs');
var d3 = require('d3');
var mustache = require('mustache');
var socketio = require('socket.io');


var index = fs.readFileSync("index.html", "utf-8");

var document = jsdom.jsdom(index);

var counter = 0;

function update(s, counter) {
    d3.select(s)
        .text(counter);
}


var app = http.createServer(function (req, res) {
    var path = __dirname + req.url;
    if(req.url.startsWith('./node_modules/')) {
        // Serve static libs
        fs.readFile(path, function (err,data) {
            res.writeHead(200);
            res.end(data);
        });
        return
    } else if(req.url.endsWith('.js')) {
        // Serve js with templated data
        fs.readFile(path, 'utf-8', function (err,js) {
            res.writeHead(200);
            res.end(mustache.to_html(js,
                             {counter: counter,
                              update: update.toString()}));
        });
    } else {
        // Update virtual DOM
        update(document.querySelector('#counter'), counter);
        res.writeHead(200, {'Content-Type': 'html'});
        res.end(jsdom.serializeDocument(document));
    }
});

var io = socketio(app);

app.listen(8080, function() {
    setInterval(function () {
        console.log(counter++);
        io.emit('counter', counter);
    }, 1000);
});

io.on('connection', function (socket) {
    console.log('a client connected');
})

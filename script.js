var socket = io('http://' + document.domain + ':' + location.port + '/');

var counter = {{counter}};

{{update}}

socket.on('counter', function (counter) {
    console.log('received data:',counter);
    update('#counter', counter)
})


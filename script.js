var counter = {{counter}};

{{update}}

setInterval(function () {
    counter++;
    update('#counter', counter);
}, 1000);


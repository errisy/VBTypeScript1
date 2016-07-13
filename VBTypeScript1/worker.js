console.log("hello world!");
var alive = true;
var countdown = 10;
process.on("message", function (data) {
    console.log("message", data);
    alive = false;
    console.log("alive", alive);
});
function listener() {
    if (alive) {
        //console.log('keep listening');
        //setTimeout(listener, 0);
        //process.emit("message", "test");
        //console.trace('here am I');
        setImmediate(listener); //setImmeditiate();
    }
    else {
        console.log('quit listening');
        kill();
    }
}
function kill() {
    while (countdown > 0) {
        countdown -= 1;
        console.log(countdown);
        setTimeout(kill, 200);
        return;
    }
    process.exit();
    //process.kill(process.pid);
}
listener();
//# sourceMappingURL=worker.js.map
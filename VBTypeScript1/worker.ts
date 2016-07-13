console.log("hello world!");

let alive: boolean = true;


let countdown: number = 10;

process.on("message", (data: string) => {
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
        //process.nextTick(()=>listener());
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


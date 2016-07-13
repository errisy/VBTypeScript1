import * as child_process from "child_process";


let child = child_process.fork('worker.js');

function killChild() {

    console.log('Try to kill child!')
    child.send("hello");
}


setTimeout(killChild, 1000);

//there is a master port and a slave port

//the master need to access the central server to get a list of machines.

//Task Server is dedicated to distributing tasks to clients;


//manager is the instance on each of the machine;



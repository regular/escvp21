#!/usr/bin/env node

const carrier = require('carrier');
const spawn = require('child_process').spawn;
const debug = require('debug')('escvp21');

const program = require('commander');
const pkg = require(__dirname + '/package.json');

program
    .version(pkg.version)
    .usage('[options] <connect-command>')
    .parse(process.argv);

const command = "sh";
const args = [
    "-c", program.args[0]
];

let queue = [
    "ERR?",
    "SNO?",
    "PWR OFF",
    "LAMP?",
    "LUMINANCE?",
    "BRIGHT?",
    "CONTRAST?",
    "TINT?",
    "HREVERSE?",
    "VREVERSE?",
    "MSEL?",
    "ASPECT?",
    "PWR?",
    "SOURCE?"
];

let pending = [];

const com = spawn(command, args);

function disconnect() {
    debug('Disconnecting ...');
    com.stdin.write("~\x04");
}

var timer;

carrier.carry(com.stdout, (line) => {
    if (timer) clearInterval(timer);
    timer = null;
    for(let response of line.split(':').slice(1)) {
        let currCommand = pending.shift();
        if (currCommand) {
            console.log(`response of ${currCommand}: ${response}`);
        }
    }
}, 'ascii', /\r/);

com.stdout.on('data', (data) => {
    debug('received', data);
    const last = data.substr(data.length-1);
    if (last == ":") {
        let currCommand = queue.shift();
        if (currCommand) {
            pending.push(currCommand);
            debug(`Sending command: ${currCommand}`);
            com.stdin.write(currCommand + "\r");
        } else {
            disconnect();
        }
    }
});

com.stderr.pipe(process.stderr);

com.on('close', (code) => {
    debug(`child process exited with code ${code}`);
});

timer = setInterval( ()=> {
    debug('Sending <CR>');
    com.stdin.write("\r");
}, 2000);

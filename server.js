const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { networkInterfaces } = require('os');
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

const colorTool = require('./tools');
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

let blobs = [];
let masses = [];
let bullets = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('start', data => {
        blobs.push({
            id: socket.id,
            ...data
        });
        let { width, height } = data;
        if (masses.length <= 0) {
            masses = massSpawn(width, height);
        }
        socket.emit('mass-spawn', masses);
    });

    socket.on('mass-eaten', massIndex => {
        let eatenMass = { ...masses[massIndex] };
        masses.splice(massIndex, 1);
        socket.broadcast.emit('mass-eaten', massIndex);
        massRespawn(eatenMass, socket, massIndex);
    });

    socket.on('bullet-eaten', bulletIndex => {
        bullets.splice(bulletIndex, 1);
        socket.broadcast.emit('bullet-eaten', bulletIndex);
    });

    socket.on('update', data => {
        let blob = blobs.find(blob => blob.id === data.id);
        if (blob) {
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
        }
        socket.broadcast.emit('update', blobs);
    });

    socket.on('eaten', socketId => {
        socket.broadcast.emit('eaten', socketId);
        blobs = blobs.filter(blob => blob.id !== socketId);
    });

    socket.on('bullet', bulletData => {
        bullets.push(bulletData);
        socket.broadcast.emit('bullet', bulletData);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('eaten', socket.id);
        blobs = blobs.filter(blob => blob.id !== socket.id);
    });
});

function massRespawn(eatenMass, socket) {
    eatenMass.x = eatenMass.x + colorTool.rand(-100, 100);
    eatenMass.y = eatenMass.y + colorTool.rand(-100, 100);

    setTimeout(() => {
        masses.push(eatenMass);
        socket.emit('mass-respawn', eatenMass);
    }, 4500);
}

function massSpawn(width, height) {
    let data = [];
    for (let i = 0; i <= 5000; i++) {
        const x = colorTool.rand(-width * 10, width * 10);
        const y = colorTool.rand(-height * 10, height * 10);
        const r = 8;
        const color = colorTool.randomColor();
        data[i] = { x, y, r, color };
    }
    return data;
}

server.listen(port, () => {
    console.log(`listening on http://${results.en0[0]}:${port}`);
});
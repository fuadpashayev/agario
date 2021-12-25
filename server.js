const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
const colorTool = require('./tools');
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

let blobs = [];
let masses = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('start', data => {
        blobs.push({
            id: socket.id,
            ...data
        });
        let {width, height} = data;
        if(masses.length <= 0){
            masses = massSpawn(width, height);
        }
        socket.emit('mass-spawn', masses);
    });
    
    socket.on('mass-eaten', massIndex => {
        masses.splice(massIndex, 1);
        socket.broadcast.emit('mass-spawn', masses);
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

    socket.on('disconnect', () => {
        socket.broadcast.emit('eaten', socket.id);
        blobs = blobs.filter(blob => blob.id !== socket.id);
    });
});

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
    console.log('listening on *:' + port);
});
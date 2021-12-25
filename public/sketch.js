let blob;
let masses = [];
let blobs = [];
let zoom = 1;
let socket;

function setup() {
  socket = io.connect();
  createCanvas(windowWidth, windowHeight);
  blob = new Blob(0, 0, 32, randomColor());
  
  socket.emit('start', {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    color: blob.color,
    width,
    height
  });

  socket.on('mass-spawn', massesData => {
    for (let i = 0; i < massesData.length; i++) {
      let {x, y, r, color} = massesData[i];
      masses[i] = new Blob(x, y, r, color);
    }
  });

  socket.on('update', blobList => {
    blobs = [];
    for (let i = 0; i < blobList.length; i++) {
      let opponentBlob = blobList[i];
      if (opponentBlob.id !== socket.id) {
        blobs.push(new Blob(opponentBlob.x, opponentBlob.y, opponentBlob.r, opponentBlob.color, opponentBlob.id));
      }
    }
  });

  socket.on('eaten', socketId => {
    blobs = blobs.filter(opponentBlob => opponentBlob.id !== socketId);
    if(socket.id === socketId){
      blob = null;
      alert('you are eaten');
      window.location.href = window.location.href;
    }
  });
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  var newZoom = 32 / blob.r;
  zoom = lerp(zoom, newZoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y)
  let { pos: { x, y }, r, color } = blob;
  socket.emit('update', { id: socket.id, x, y, r, color });


  for (let i = masses.length - 1; i >= 0; i--) {
    masses[i].show();
    if (blob.eats(masses[i])) {
      socket.emit('mass-eaten', i);
      masses.splice(i, 1);
    }
  }

  for (let i = blobs.length - 1; i >= 0; i--) {
    const opponentBlob = blobs[i];
    opponentBlob.show();
    if (blob.eats(opponentBlob)) {
      socket.emit('eaten', opponentBlob.id);
      blobs.splice(i, 1);
    }
  }

  blob.show();
  blob.update();
  blob.constrain();
}
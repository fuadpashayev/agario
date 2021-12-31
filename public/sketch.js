let blob;
let masses = [];
let blobs = [];
let bullets = [];
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
      let { x, y, r, color } = massesData[i];
      masses[i] = new Blob(x, y, r, color);
    }
  });

  socket.on('mass-respawn', massData => {
    let { x, y, r, color } = massData;
    masses.push(new Blob(x, y, r, color));
  });

  socket.on('mass-eaten', massIndex => masses.splice(massIndex, 1));
  socket.on('mass-eaten', massIndex => masses.splice(massIndex, 1));

  socket.on('update', blobList => {
    blobs = [];
    for (let i = 0; i < blobList.length; i++) {
      let {x, y, r, color, id} = blobList[i];
      if (id !== socket.id) {
        blobs.push(new Blob(x, y, r, color, id));
      }
    }
  });

  socket.on('eaten', socketId => {
    blobs = blobs.filter(opponentBlob => opponentBlob.id !== socketId);
    if (socket.id === socketId) {
      blob = null;

      tata.error('Eliminated', 'You are eaten :(')
      console.log('you are eaten')
    }
  });
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  if (blob) {
    var newZoom = 32 / blob.r;
    zoom = lerp(zoom, newZoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);
    let { pos: { x, y }, r, color } = blob;
    socket.emit('update', { id: socket.id, x, y, r, color });
  }

  for (let i = masses.length - 1; i >= 0; i--) {
    masses[i].show();
    if (blob?.eats(masses[i])) {
      socket.emit('mass-eaten', i);
      masses.splice(i, 1);
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    if (blob?.eats(bullets[i], true)) {
      socket.emit('mass-eaten', i);
      bullets.splice(i, 1);
    }
  }

  for (let i = blobs.length - 1; i >= 0; i--) {
    const opponentBlob = blobs[i];
    opponentBlob.show();
    if (blob?.eats(opponentBlob)) {
      socket.emit('eaten', opponentBlob.id);
      blobs.splice(i, 1);
    }
  }

  if (blob) {
    blob.show();
    blob.update();
    blob.constrain();
  }
}


function keyPressed() {
  const W_KEY = 87;
  const SPACE_KEY = 32;

  switch (keyCode) {
    case W_KEY:
      blob.throw(blobThrow);
      break;
  }
}


function blobThrow() {
  let [x, y, c] = [blob.pos.x, blob.pos.y, blob.color];
  let bullet = new Bullet(x, y, c);
  bullets.push(bullet);
  blob.throw();
  socket.emit('bullet', {x, y, c});
}
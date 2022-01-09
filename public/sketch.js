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

  socket.on('bullet-eaten', bulletIndex => bullets.splice(bulletIndex, 1));

  socket.on('bullet', bulletData => {
    let { x, y, mX, mY, c } = bulletData;
    let bullet = new Bullet(x, y, mX, mY, c);
    bullets.push(bullet);
  });

  socket.on('update', blobList => {
    blobs = [];
    for (let i = 0; i < blobList.length; i++) {
      let { x, y, r, color, id } = blobList[i];
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

  renderObjects();

  if (blob) {
    blob.show();
    blob.update();
    blob.constrain();
  }
}

function renderObjects() {
  let particles = blob.particles;
  let cycleCount = Math.max(blobs.length, masses.length, bullets.length, particles.length);
  for (let i = cycleCount - 1; i >= 0; i--) {
    const opponentBlob = blobs?.[i];
    const mass = masses?.[i];
    const bullet = bullets?.[i];
    let particle = particles?.[i];

    if (opponentBlob) {
      opponentBlob.show();
      if (blob?.eats(opponentBlob)) {
        socket.emit('eaten', opponentBlob.id);
        blobs.splice(i, 1);
      }
    }

    if (mass) {
      mass.show();
      if (blob?.eats(mass)) {
        socket.emit('mass-eaten', i);
        masses.splice(i, 1);
      }
    }

    if (bullet) {
      bullet.show();
      if (blob?.eats(bullet, true)) {
        socket.emit('bullet-eaten', i);
        bullets.splice(i, 1);
      }
    }

    if(particle){
      particle.show();
      particle.update();
    }

    for (let a = particles.length - 1; a >= 0; a--) {
      let particleItem = particles[a];
      if (opponentBlob && particleItem?.eats(opponentBlob)) {
        socket.emit('eaten', opponentBlob.id);
        blobs.splice(i, 1);
      }
      if (mass && particleItem?.eats(mass)) {
        socket.emit('mass-eaten', i);
        masses.splice(i, 1);
      }
      if (bullet && particleItem?.eats(bullet, true)) {
        socket.emit('bullet-eaten', i);
        bullets.splice(i, 1);
      }
    }

  }
}

function blobThrow() {
  let [x, y, mX, mY, c] = [blob.pos.x, blob.pos.y, mouseX, mouseY, blob.color];
  let bullet = new Bullet(x, y, mX, mY, c);
  bullets.push(bullet);
  blob.checkCanThrow();
  socket.emit('bullet', { x, y, mX, mY, c });
}

function blobSplit(newRadius) {
  let [x, y, mX, mY, c] = [blob.pos.x, blob.pos.y, mouseX, mouseY, blob.color];
  let particle = new Particle(x, y, mX, mY, newRadius, c);
  blob.particles.push(particle);
  console.log(blob.particles, blob)
  // blob.checkCanThrow();
  // socket.emit('bullet', { x, y, mX, mY, c });
}

function keyPressed() {
  const W_KEY = 87;
  const SPACE_KEY = 32;

  switch (keyCode) {
    case W_KEY:
      blob.checkCanThrow(blobThrow);
      break;
      
      case SPACE_KEY:
      blob.checkCanSplit(blobSplit);
      break;
  }
}
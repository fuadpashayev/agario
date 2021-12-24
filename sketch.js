let blob;
let blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);
  blob = new Blob(0, 0, 64);
  for(let i = 0; i <= 5000; i++){
    var x = random(-width * 10, width * 10);
    var y = random(-height * 10, height * 10);
    blobs[i] = new Blob(x, y, 16);
  }
}

function draw() {
  background(255);
  translate(width / 2, height /2);
  var newZoom = 64 / blob.r;
  zoom = lerp(zoom, newZoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y)
  blob.show();
  blob.update();
  for(let i = blobs.length - 1; i >= 0; i--){
    blobs[i].show();
    if(blob.eats(blobs[i])){
      blobs.splice(i, 1);
    }
  }
}
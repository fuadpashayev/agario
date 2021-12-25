function Blob(x, y, r, colorr, id = ''){
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);
    this.color = colorr;
    this.id = id;

    this.update = function() {
        var newVel = createVector(mouseX - width / 2, mouseY - height / 2);
        newVel.setMag(3);
        this.vel.lerp(newVel, 0.1)
        this.pos.add(this.vel);
    }

    this.eats = function(other) {
        var d = p5.Vector.dist(this.pos, other.pos);
        if(d < this.r + other.r && this.r > other.r * 1.2){
            var sum = PI * this.r ** 2 + PI * other.r ** 2;
            this.r = sqrt(sum / PI);
            return true;
        }
        return false;
    }

    this.constrain = () => {
        blob.pos.x = constrain(blob.pos.x, -width * 10, width * 10);
        blob.pos.y = constrain(blob.pos.y, -height * 10, height * 10);
    }

    this.show = function(){
        fill(color(this.color));
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        strokeWeight(0);
    }
}
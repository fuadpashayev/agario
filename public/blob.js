class Blob {
    vel = createVector(0, 0);
    particles = [];
    constructor(x, y, r, blobColor, id = '') {
        this.pos = createVector(x, y);
        this.r = r;
        this.color = blobColor;
        this.id = id;
    }
    
    show(score = null) {
        if (this.color) {
            fill(color(this.color));
            circle(this.pos.x, this.pos.y, this.r * 2);
            strokeWeight(0.5);
            stroke(255);
            if(score){
                textSize(14 - ((32 - this.r) / 3));
                fill(255);
                text(score, this.pos.x, this.pos.y);
                textAlign(CENTER, CENTER);
            }
        }
    };
    
    update() {
        var newVel = createVector(mouseX - width / 2, mouseY - height / 2);
        newVel.setMag(3);
        this.vel.lerp(newVel, 0.1);
        this.pos.add(this.vel);
    };

    eats(other, isBullet = false) {
        let d = p5.Vector.dist(this.pos, other.pos);
        if (isBullet && !other.eatable) d += 50;
        if (d < this.r + other.r && this.r > other.r * 1.2) {
            var sum = PI * this.r ** 2 + PI * other.r ** 2;
            this.r = sqrt(sum / PI);
            return true;
        }
        return false;
    };

    constrain() {
        blob.pos.x = constrain(blob.pos.x, -width * 5, width * 5);
        blob.pos.y = constrain(blob.pos.y, -height * 5, height * 5);
    };


    checkCanThrow(callback = () => { }) {
        if (this.r > 20) {
            this.r -= 1;
            callback();
        }
    };

    checkCanSplit(callback = () => { }) {
        if (this.r > 20) {
            let newRadius = this.r / 2;
            this.r = newRadius;
            callback(newRadius);
        }
    };
}
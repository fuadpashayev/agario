class Blob {
    constructor(x, y, r, colorr, id = '') {
        this.pos = createVector(x, y);
        this.r = r;
        this.vel = createVector(0, 0);
        this.color = colorr;
        this.id = id;
    }

    update() {
        var newVel = createVector(mouseX - width / 2, mouseY - height / 2);
        newVel.setMag(1.001);
        this.vel.lerp(newVel, 0.1);
        this.pos.add(this.vel);
    };

    eats(other, isBullet = false) {
        var d = p5.Vector.dist(this.pos, other.pos);
        if (isBullet) {
            let bullet = createVector(other.blobX, other.blobY);
            d = p5.Vector.dist(this.pos, bullet);
            if(!other.eatable) d += 50;
        }
        if (d < this.r + other.r && this.r > other.r * 1.2) {
            var sum = PI * this.r ** 2 + PI * other.r ** 2;
            this.r = sqrt(sum / PI);
            return true;
        }
        return false;
    };

    constrain() {
        blob.pos.x = constrain(blob.pos.x, -width * 10, width * 10);
        blob.pos.y = constrain(blob.pos.y, -height * 10, height * 10);
    };

    show() {
        if (this.color) {
            fill(color(this.color));
            ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
            strokeWeight(0);
        }
    };

    throw(callback = () => { }) {
        if (this.r > 20) {
            this.r -= 1;
            callback();
        }
    };
}
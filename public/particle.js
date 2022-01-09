class Particle {
    speed = 0.72;
    particles = [];
    constructor(x, y, mX, mY, r, blobColor) {
        this.pos = createVector(x, y);
        this.blobPos = {x, y};
        this.mX = mX;
        this.mY = mY;
        this.r = r;
        this.color = blobColor;
        this.vel = createVector(this.mX - windowWidth / 2, this.mY - windowHeight / 2).normalize();
    }

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

    show() {
        if (this.color) {
            fill(color(this.color));
            circle(this.pos.x, this.pos.y, this.r * 2);
            this.toMouse();
        }
    };

    toMouse() {
        this.pos.x += this.vel.x * this.speed;
        this.pos.y += this.vel.y * this.speed;
        this.vel.x = lerp(this.vel.x, 0, 0.08);
        this.vel.y = lerp(this.vel.y, 0, 0.08);
        // if (Math.abs(this.dir.x) <= 0.001 && !this.eatable) this.eatable = true;
    }

    checkCanThrow(callback = () => { }) {
        if (this.r > 20) {
            this.r -= 1;
            callback();
        }
    };
}
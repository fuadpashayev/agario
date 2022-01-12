class Particle {
    speed = 10;
    particles = [];
    throwed = false;
    returned = false;
    blob;

    constructor(x, y, mX, mY, r, blobColor) {
        this.pos = createVector(x, y);
        this.blobPos = { x, y };
        this.mX = mX;
        this.mY = mY;
        this.r = r;
        this.color = blobColor;
        this.vel = createVector(this.mX - windowWidth / 2, this.mY - windowHeight / 2).normalize();
    }

    update(blob) {
        var newVel = createVector(mouseX - width / 2, mouseY - height / 2);
        newVel.setMag(3);
        this.vel.lerp(newVel, 0.1);
        this.pos.add(this.vel);
        // this.pos.x = blob.pos.x;
        // this.pos.y = blob.pos.y;
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


    show(blob) {
        this.blob = blob;
        if (this.color) {
            fill(color(this.color));
            circle(this.pos.x, this.pos.y, this.r * 2);
            if (!this.throwed) {
                this.throwing();
            }else{
                if(this.returned){
                    this.toMouse();
                }else{
                    let dist = p5.Vector.dist(this.pos, blob.pos);
                    // console.log({dist, r: this.r, b: blob.r})
                    if (dist < this.r + blob.r) {
                        // console.log(dist)
                        this.returned = true;
                    }
                }
            }
        }
    };

    returning = false;

    throwing() {
        this.pos.x += this.vel.x * this.speed;
        this.pos.y += this.vel.y * this.speed;
        this.vel.x = lerp(this.vel.x, 0, 0.08);
        this.vel.y = lerp(this.vel.y, 0, 0.08);

        // console.log(abs(this.pos.x - this.blob.pos.x), abs(this.pos.y - this.blob.pos.y))
        // console.log(this.pos.y - this.blobPos.y, 'y')
        if(this.returning){
            this.pos.x = lerp(this.pos.x, this.blob.pos.x + 50, 0.08);
            this.pos.y = lerp(this.pos.y, this.blob.pos.y + 50, 0.08);
        }
        
        if(abs(this.vel.x) <= 1 && abs(this.vel.y) <= 1){
            console.log('dayandi')
            setTimeout(() => {
                this.returning = true;

            }, 100)
            // this.throwed = true;
        }
        if (abs(this.pos.x - this.blob.pos.x) <= 10 && abs(this.pos.y - this.blob.pos.y) <= 10) {
            // this.throwed = true;
            this.returning = false;
            console.log('collision')
        }
    }

    toMouse() {
        // this.pos.x = blob.pos.x;
        // this.pos.y = blob.pos.y;
    }

    checkCanThrow(callback = () => { }) {
        if (this.r > 20) {
            this.r -= 1;
            callback();
        }
    };
}
class Bullet {
    speed = 20;
    r = 12;
    eatable = false;

    constructor(x, y, mX, mY, colorr) {
        this.pos = createVector(x, y);
        this.mX = mX;
        this.mY = mY;

        this.vel = createVector(this.mX - windowWidth / 2, this.mY - windowHeight / 2).normalize();
        this.color = colorr;
    }

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
        if (Math.abs(this.vel.x) <= 0.001 && !this.eatable) this.eatable = true;
    }
}
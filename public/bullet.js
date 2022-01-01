class Bullet {
    speed = 20;
    r = 12;
    eatable = false;

    constructor(blobX, blobY, mX, mY, colorr) {
        this.blobX = blobX;
        this.blobY = blobY;
        this.mX = mX;
        this.mY = mY;

        this.dir = createVector(this.mX - windowWidth / 2, this.mY - windowHeight / 2).normalize();
        this.color = colorr;
    }

    show() {
        if (this.color) {
            fill(color(this.color));
            circle(this.blobX, this.blobY, this.r * 2);
            this.toMouse();
        }
    };

    toMouse() {
        this.blobX += this.dir.x * this.speed;
        this.blobY += this.dir.y * this.speed;
        this.dir.x = lerp(this.dir.x, 0, 0.08);
        this.dir.y = lerp(this.dir.y, 0, 0.08);
        if (Math.abs(this.dir.x) <= 0.001 && !this.eatable) this.eatable = true;
    }
}
class Bullet {
    constructor(blobX, blobY, colorr) {
        this.blobX = blobX;
        this.blobY = blobY;
        this.bulletStopped = false;
        this.eatable = false;


        this.dir = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2).normalize()
        this.pos = this.dir;
        this.speed = 10;
        this.r = 12;
        this.color = colorr;

        blobY - windowHeight / 2
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
        this.dir.x = lerp(this.dir.x, 0, 0.05);
        this.dir.y = lerp(this.dir.y, 0, 0.05);
        console.log({ lolo: Math.abs(this.dir.x) })
        if (Math.abs(this.dir.x) <= 0.001 && !this.eatable) this.eatable = true;
    }
}
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(x, y) {
        if (x instanceof Vector) {
            this.x += x.x;
            this.y += x.y;
        }
        else {
            this.x += x;
            this.y += y;
        }
        return this;
    }
    multiply(a) {
        this.x *= a;
        this.y *= a;
        return this;
    }

    setTo(x, y) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalise() {
        let magnitude = this.magnitude;
        this.multiply(1 / magnitude);
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    static Polar(magnitude, angle) {
        let x = magnitude * Math.cos(angle);
        let y = magnitude * Math.sin(angle);
        return new Vector(x, y);
    }
}

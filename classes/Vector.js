export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(x, y) {
        // If you're adding another vector, add its components, otherwise add the actual values
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
        // Cross product is not needed for vectors in this 
        // usage - multiplying by a constant is the very useful however
    }

    setTo(x, y) {
        // Set the vector so that if the vector is referenced elsewhere, 
        // the values can be set on all of them without having to 
        // reset their references to the same vector
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
        // Simple Pythagoras
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalise() {
        let magnitude = this.magnitude;
        this.multiply(1 / magnitude);
        // Make it a unit vector
        return this;
    }
    copy() {
        // Create a copy so the original is unchanged
        return new Vector(this.x, this.y);
    }
    get angle() {
        return Math.atan2(this.y, this.x);
        // Get the angle of the vector in radians
    }
    static Polar(magnitude, angle) {
        // Create a vector from an angle and 
        // magnitude via the sin and cos functions
        // Angles are supplied in radians.
        let x = magnitude * Math.cos(angle);
        let y = magnitude * Math.sin(angle);
        return new Vector(x, y);
    }
    static get Z() {
        // Create a new zero vector
        return new Vector(0, 0);
    }
}

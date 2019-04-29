import constants from './constants.js';
export class Projectile {
    constructor(position, velocity, damage) {
        this.position = position;
        this.velocity = velocity;
        this.damage = damage;
    }
    update(dt) {
        this.position.add(this.velocity.copy().multiply(dt)); // Move the projectile according to the velocity
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, constants.tileWidth / 8, 0, 2 * Math.PI);
        // Draw a circle with radius constants.tileWidth / 8
        ctx.closePath();
        ctx.fillStyle = "#0f0"; // Fill of green
        ctx.strokeStyle = "#000"; // Outline of black
        ctx.fill();
        ctx.stroke();
    }
}

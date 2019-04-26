import constants from './constants.js';
export class Projectile {
    constructor(position, velocity, damage) {
        this.position = position;
        this.velocity = velocity;
        this.damage = damage;
    }
    update(dt) {
        this.position.add(this.velocity.copy().multiply(dt));
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, constants.tileWidth / 8, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "#0f0";
        ctx.strokeStyle = "#fff";
        ctx.fill();
        ctx.stroke();
    }
}

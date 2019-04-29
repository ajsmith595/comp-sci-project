import { AimingTower } from './AimingTower.js';
import constants from './constants.js';

export class LaserTower extends AimingTower {
    constructor(position, range, enemies, dps = 100, enemyTargetingMode = 0) {
        super(position, range, enemies, dps, enemyTargetingMode);
    }
    render(ctx) {
        super.render(ctx); // Run the render function of the derived class
        ctx.save(); // Push the current drawing state to the stack
        ctx.translate(this.position.x, this.position.y); // Move the drawing origin to this position
        ctx.rotate(this.rotation); // Rotate by an amount

        if (this.target != null) {
            let dist = this.position.copy().add(this.target.position.copy().multiply(-1)).magnitude; // Find the distance from the tower to the enemy
            dist -= constants.tileWidth / 2; // Subtract the radius of the enemy so it goes only to the edge
            ctx.fillStyle = "#0f0"; // Set the fill to green
            ctx.fillRect(-1, -dist, 2, dist); // Fill a vertical rectangle with that distance. Since it is rotated, it will point towards the enemy
        }

        ctx.fillStyle = "#666"; // A grey fill
        ctx.strokeStyle = "#191919"; // A darker grey
        ctx.beginPath();
        ctx.rect(-2, -16, 4, 20); // Draw a rectangle - this will be the turret
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore(); // Pop the original drawing state from stack
    }
    update() {
        super.update(); // Run the update function of the derived class
    }
}

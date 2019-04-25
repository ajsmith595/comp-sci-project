import { AimingTower } from './AimingTower.js';
import constants from './constants.js';

export class LaserTower extends AimingTower {
    constructor(position, range, enemies, dps = 100, enemyTargetingMode = 0) {
        super(position, range, enemies, dps, enemyTargetingMode);
    }
    render(ctx) {
        super.render(ctx);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);

        if (this.target != null) {
            let dist = this.position.copy().add(this.target.position.copy().multiply(-1)).magnitude;
            dist -= constants.tileWidth / 2;
            ctx.fillStyle = "#0f0";
            ctx.fillRect(-1, -dist, 2, dist);
        }

        ctx.fillStyle = "#666";
        ctx.strokeStyle = "#191919";
        ctx.beginPath();
        ctx.rect(-2, -16, 4, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    update() {
        super.update();
    }
}

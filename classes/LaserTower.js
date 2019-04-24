import { AimingTower } from './AimingTower.js';

export class LaserTower extends AimingTower {
    constructor(position, range, enemies, enemyTargetingMode = 0) {
        super(position, range, enemies, enemyTargetingMode);
    }
    render(ctx) {
        super.render(ctx);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = "#666";
        ctx.strokeStyle = "#191919";
        ctx.beginPath();
        ctx.rect(-2, -16, 4, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (this.target != null) {
            let dist = this.position.copy().add(this.target.position.copy().multiply(-1)).magnitude;
            ctx.fillStyle = "#f00";
            ctx.fillRect(-1, -dist - 5, 2, dist);
        }
        ctx.restore();
    }
    update() {
        super.update();
    }
}

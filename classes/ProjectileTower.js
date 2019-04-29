import { AimingTower } from './AimingTower.js';
import constants from './constants.js';
import { Projectile } from './Projectile.js';
import { Vector } from './Vector.js';

export class ProjectileTower extends AimingTower {
    constructor(position, range, enemies, projectiles, fireRate = 100, dps = 100, enemyTargetingMode = 0) {
        super(position, range, enemies, dps, enemyTargetingMode);
        this.fireRate = fireRate;
        this.shootTime = 0;
        this.projectiles = projectiles;
    }
    render(ctx) {
        super.render(ctx);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = "#888";
        ctx.strokeStyle = "#494949";
        ctx.beginPath();
        ctx.rect(-6, -12, 12, 24);
        // Turret, centered around the point of rotation
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#333";
        ctx.fillRect(-6, -11, 12, 4); // Line on the end
        ctx.restore();
    }

    update(dt) {
        super.update(dt);

        this.shootTime += dt;
        if (this.shootTime > 60 / this.fireRate && this.shoot) {
            // If the time since the last shot is greater than the 
            // shooting interval, and it has a target to aim at, shoot!
            this.shootTime = 0;
            this.shootProjectile();
        }
    }

    shootProjectile() {
        let velocityVector = Vector.Polar(constants.tileWidth * 10, this.rotation - Math.PI / 2);
        // A velocity vector parallel to the direction of the turret itself
        let damagePerProjectile = (60 / this.fireRate) * this.dps;
        let projectile = new Projectile(this.position.copy(), velocityVector, damagePerProjectile);
        // Create a new projectile and add it to the projectiles array in Engine.
        this.projectiles.push(projectile);
    }
}

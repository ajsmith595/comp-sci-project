import constants from './constants.js';

export class AimingTower {
    constructor(position, range, enemies, enemyTargetingMode = 0) {
        this.rotation = 0;
        this.position = position;
        this.range = range;
        this.enemyTargetingMode = enemyTargetingMode;
        this.shoot = false;
        this.enemies = enemies;
        this.target = null;
    }
    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.fillStyle = "#404040";
        ctx.fillRect(-constants.tileWidth / 2, -constants.tileWidth / 2, constants.tileWidth, constants.tileWidth);
        ctx.restore();
    }
    update() {
        let target = null;
        for (let enemy of this.enemies) {
            let positionReverse = this.position.copy().multiply(-1);
            let distanceFromVector = enemy.position.copy().add(positionReverse);

            if (distanceFromVector.magnitude > this.range)
                continue;
            if (target == null)
                target = enemy;
            else {
                switch (this.enemyTargetingMode) {
                    case 0:
                        if (target.currentTargetIndex < enemy.currentTargetIndex) {
                            target = enemy;
                        }
                        break;
                    case 1:
                        if (target.health < enemy.health) {
                            target = enemy;
                        }
                        break;
                    default:
                        console.warn("Invalid enemy targeting mode detected");
                        break;
                }
            }
        }
        if (target == null)
            this.shoot = false;
        else {
            this.rotation = (target.position.copy().add(this.position.copy().multiply(-1))).angle + Math.PI / 2;
            this.shoot = true;
        }
        this.target = target;
        // if (this.target) {
        //     if (this.target.health <= 0 || this.target.position.x < 0) {
        //         this.target = null;
        //     }
        // }
    }
}

import constants from './constants.js';

export class AimingTower {
    constructor(position, range, enemies, dps = 100, enemyTargetingMode = 0) {
        this.rotation = 0;
        this.position = position;
        this.range = range;
        this.enemyTargetingMode = enemyTargetingMode;
        this.shoot = false;
        this.enemies = enemies;
        this.target = null;
        this.dps = dps;
    }
    render(ctx) {
        ctx.save(); // Push the current state to a stack
        ctx.translate(this.position.x, this.position.y); // Translate the drawing origin to the current position
        ctx.fillStyle = "#404040"; // Set the fillStyle to a grey
        ctx.fillRect(-constants.tileWidth / 2, -constants.tileWidth / 2, constants.tileWidth, constants.tileWidth);
        // Fill a rectangle at those coordinates, relative to the origin
        // So it will actually draw with the top left hand corner at
        //  (this.position.x - constants.tileWidth / 2, this.position.y - constants.tileWidth / 2)
        ctx.restore();

        // Pop the original state off the stack
    }
    update() {
        let target = null;
        for (let enemy of this.enemies) { // Iterate through each enemy
            let positionReverse = this.position.copy().multiply(-1);
            let distanceFromVector = enemy.position.copy().add(positionReverse);
            // The vector from this position to the enemy's position

            if (distanceFromVector.magnitude > this.range)
                continue;
            // If the enemy is out of range, ignore it    


            // If there's no target chosen yet, choose this one - it's better than nothing
            if (target == null)
                target = enemy;
            else {
                switch (this.enemyTargetingMode) { // Target the enemies depending on the targeting mode
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
            this.shoot = false; // If there's nothing to target, don't try to shoot
        else {
            this.rotation = (target.position.copy().add(this.position.copy().multiply(-1))).angle + Math.PI / 2;
            this.shoot = true;
            // If there is a target, point towards it and shoot
        }
        this.target = target;
        // For the derived classes
    }
}

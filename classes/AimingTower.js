export class AimingTower {
    constructor(position, range, enemies, enemyTargetingMode = 0) {
        this.rotation = 0;
        this.position = position;
        this.range = range;
        this.enemyTargetingMode = enemyTargetingMode;
        this.shoot = false;
        this.enemies = enemies;
    }
    render() {

    }
    update() {
        let target = null;
        for (let enemy of this.enemies) {
            let positionReverse = this.position.copy().multiply(-1);
            let distanceFromVector = enemy.position.copy().add(positionReverse);

            if (distanceFromVector.magnitude > this.range)
                continue;

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
}

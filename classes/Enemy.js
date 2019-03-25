import { Vector } from './Vector.js';
import constants from './constants.js';
export class Enemy {
    constructor() {
        this.velocity = Vector.Z;
        this.position = Vector.Z;
        this.health = 100;
        this.speed = 10;
        this.targetPositions = [];
        this.currentTargetIndex = 0;
    }

    update(dt) {
        let dPosition = this.velocity.copy().multiply(dt);
        this.position.add(dPosition);
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, constants.tileWidth / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "#f00";
        ctx.fill();
    }
}

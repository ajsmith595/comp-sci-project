import { Vector } from './Vector.js';
import constants from './constants.js';
export class Enemy {
    constructor(tilePos = 1) {
        this.velocity = new Vector(0, Enemy.speed);
        let tileX = 3 + tilePos;
        this.position = new Vector(constants.tileWidth * (tileX - 0.5), 0);
        this.health = 100;
    }

    update(dt) {
        let dPosition = this.velocity.copy().multiply(dt);
        this.position.add(dPosition);
        let tilePos = this.position.copy().multiply(1 / constants.tileWidth);
        let tileX = Math.floor(tilePos.x - 0.5 * Math.sign(this.velocity.x));
        let tileY = Math.floor(tilePos.y - 0.5 * Math.sign(this.velocity.y));

        let turnValue = constants.map[tileY];
        if (turnValue)
            turnValue = turnValue[tileX];
        switch (turnValue) {
            case 'u':
                this.velocity = new Vector(0, -Enemy.speed);
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth);
                break;
            case 'd':
                this.velocity = new Vector(0, Enemy.speed);
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth);
                break;
            case 'r':
                this.velocity = new Vector(Enemy.speed, 0);
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth);
                break;
            case 'l':
                this.velocity = new Vector(-Enemy.speed, 0);
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth);
                break;
            default:
                // Do nothing
                break;
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, constants.tileWidth / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "#f00";
        ctx.fill();


    }
}
Enemy.speed = constants.tileWidth * 3;

/*

import { Vector } from './Vector.js';
import constants from './constants.js';
export class Enemy {
    constructor() {
        this.velocity = new Vector(0, Enemy.speed);
        this.position = new Vector(constants.tileWidth * 4 - constants.tileWidth / 2, 0);
        this.health = 100;
    }

    update(dt) {
        let dPosition = this.velocity.copy().multiply(dt);
        this.position.add(dPosition);
        let tilePos = this.position.copy().multiply(1 / constants.tileWidth);
        let tileX = Math.floor(tilePos.x);
        let tileY = Math.floor(tilePos.y);

        let tileFloorPos = new Vector(tileX + .5, tileY + .5);
        let diff = tileFloorPos.copy().add(tilePos.multiply(-1));


        if (diff.magnitude < .01) {
            let turnValue = constants.map[tileY][tileX];
            switch (turnValue) {
                case 'u':
                    this.velocity = new Vector(0, -Enemy.speed);
                    this.position.setTo(tileFloorPos.x * constants.tileWidth, tileFloorPos.y * constants.tileWidth);
                    break;
                case 'd':
                    this.velocity = new Vector(0, Enemy.speed);
                    this.position.setTo(tileFloorPos.x * constants.tileWidth, tileFloorPos.y * constants.tileWidth);
                    break;
                case 'r':
                    this.velocity = new Vector(Enemy.speed, 0);
                    this.position.setTo(tileFloorPos.x * constants.tileWidth, tileFloorPos.y * constants.tileWidth);
                    break;
                case 'l':
                    this.velocity = new Vector(-Enemy.speed, 0);
                    this.position.setTo(tileFloorPos.x * constants.tileWidth, tileFloorPos.y * constants.tileWidth);
                    break;
                default:
                    // Do nothing
                    break;
            }
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, constants.tileWidth / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "#f00";
        ctx.fill();
        ctx.fillStyle = "#0f0";
        ctx.fillRect(this.position.x, this.position.y, 2, 2);
    }
}
Enemy.speed = constants.tileWidth * 3;
*/

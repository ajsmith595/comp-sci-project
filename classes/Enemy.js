import { Vector } from './Vector.js';
import constants from './constants.js';
export class Enemy {
    constructor(tilePos = 1) {
        this.velocity = new Vector(0, Enemy.speed); // Set it moving downwards with the current enemy speed
        let tileX = 3 + tilePos; // Depending on the parameter given, choose the initial tile position.
        this.position = new Vector(constants.tileWidth * (tileX - 0.5), 0);
        this.health = 100;
        this.maxHealth = this.health;
    }

    update(dt) {
        let dPosition = this.velocity.copy().multiply(dt); // Amount of position that needs to be added
        this.position.add(dPosition);
        let tilePos = this.position.copy().multiply(1 / constants.tileWidth);
        let tileX = Math.floor(tilePos.x - 0.5 * Math.sign(this.velocity.x));
        let tileY = Math.floor(tilePos.y - 0.5 * Math.sign(this.velocity.y));

        let turnValue = constants.map[tileY];
        if (turnValue)
            turnValue = turnValue[tileX];
        // If on the map it reaches a 'u', 'd', 'r' or 'l', change direction
        switch (turnValue) {
            case 'u':
                this.velocity = new Vector(0, -Enemy.speed); // Move up
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth);
                break;
            case 'd':
                this.velocity = new Vector(0, Enemy.speed); // Move down
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth);
                break;
            case 'r':
                this.velocity = new Vector(Enemy.speed, 0); // Move right
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth);
                break;
            case 'l':
                this.velocity = new Vector(-Enemy.speed, 0); // Move left
                this.position.setTo(tilePos.x * constants.tileWidth, tilePos.y * constants.tileWidth); // Set the positions so they go on the exact path needed
                break;
            default:
                // Do nothing
                break;
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, constants.tileWidth / 2, 0, 2 * Math.PI); // Draw a circle of radius constants.tileWidth / 2
        ctx.closePath();
        ctx.fillStyle = "#f00"; // Red
        ctx.fill();

        if (this.maxHealth > this.health) { // If it is not on max health, draw the healthbar
            ctx.fillStyle = "#0f0"; // Green fill
            ctx.strokeStyle = "#000"; // Black outline
            ctx.beginPath();
            let width = constants.tileWidth * (this.health / this.maxHealth); // The width should be proportional to the proportion of health remaining
            ctx.rect(this.position.x - width / 2, this.position.y - constants.tileWidth / 2, width, 5);
            // draw a rectangle in the midpoint on the x direction, just above on the y
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}
Enemy.speed = constants.tileWidth;

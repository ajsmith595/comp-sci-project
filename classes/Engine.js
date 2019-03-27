import constants from './constants.js';
import { Vector } from './Vector.js';
import { Enemy } from './Enemy.js';
export class Engine {
    constructor() {
        let canvas = document.createElement('CANVAS'); // Create the canvas
        canvas.width = constants.width; // Set the width and height
        canvas.height = constants.height;

        document.getElementById('game').appendChild(canvas); // Add the canvas to the game div
        document.getElementById('menu').style.height = constants.height.toString() + "px"; // Set the height of the menu div = game height

        this.canvas = canvas;

        let ctx = canvas.getContext('2d');
        this.ctx = ctx;

        let mapCanvas = new OffscreenCanvas(constants.width, constants.height);
        this.mapCanvas = mapCanvas;
        this.mapCtx = mapCanvas.getContext('2d');

        this.renderMap();

        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        requestAnimationFrame(this.render);
        setInterval(this.update, 1 / 100);

        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.shields = [];
        this.previousTime = performance.now();

        let enemy = new Enemy();
        enemy.velocity = new Vector(10, 10);
        this.enemies.push(enemy);


        this.money = 0;
        this.lives = 100;
    }
    render() {
        let ctx = this.ctx;
        ctx.drawImage(this.mapCanvas, 0, 0);

        for (let enemy of this.enemies) {
            enemy.render(ctx);
        }

        requestAnimationFrame(this.render);
    }
    update() {
        let timeNow = performance.now();
        let deltaTime = (timeNow - this.previousTime) / 1000;

        for (let enemy of this.enemies) {
            enemy.update(deltaTime);
        }

        this.previousTime = timeNow;
    }
    mousePressed(e) {

    }
    keyPressed(e) {

    }

    renderMap() {
        let ctx = this.mapCtx;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, constants.width, constants.height);


        ctx.fillStyle = "#000";
        ctx.shadowBlur = 45;
        ctx.shadowColor = "#666";
        for (let i = 0; i < constants.width / constants.tileWidth; i++) { // For every row
            for (let j = 0; j < constants.height / constants.tileWidth; j++) { // For every character
                if (constants.map[j][i] == 'f') { // If it's an 'f', draw a rectangle
                    ctx.fillRect(i * constants.tileWidth, j * constants.tileWidth, constants.tileWidth, constants.tileWidth);
                }
            }
        }

        ctx.shadowBlur = 2;
        ctx.shadowColor = "#888";
        ctx.fillStyle = "#aaa";
        for (let i = 0; i < constants.width / constants.tileWidth; i++) {
            for (let j = 0; j < constants.height / constants.tileWidth; j++) {
                if (constants.map[j][i] != 'f') {
                    ctx.fillRect(i * constants.tileWidth, j * constants.tileWidth, constants.tileWidth, constants.tileWidth);
                }
            }
        }
    }
}

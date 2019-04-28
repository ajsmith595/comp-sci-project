import constants from './constants.js';
import { Vector } from './Vector.js';
import { Enemy } from './Enemy.js';
import { LaserTower } from './LaserTower.js';
import { ProjectileTower } from './ProjectileTower.js';
import { Projectile } from './Projectile.js';
import { Shield } from './Shield.js';

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
        this.startWave = this.startWave.bind(this);
        this.mousePressed = this.mousePressed.bind(this);
        this.answerQuestion = this.answerQuestion.bind(this);
        requestAnimationFrame(this.render);
        setInterval(this.update, 1 / 100);

        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.shields = [];
        this.previousTime = performance.now();

        this.enemyTimer = 0;
        this.enemyInterval = 1;

        this.wave = 50;
        this.enemiesLeftToSpawn = 0;


        this.money = 100;
        this.lives = 100;

        this.timeScale = 1;

        let startWaveBtn = document.getElementById('startWaveButton');
        startWaveBtn.onclick = this.startWave;
        let answerQuestionBtn = document.getElementById('answerButton');
        answerQuestionBtn.onclick = this.answerQuestion;

        let projectileTower = new ProjectileTower(new Vector(constants.tileWidth * (5 + 1 / 2), constants.tileWidth * (5 + 1 / 2)), constants.tileWidth * 5, this.enemies, this.projectiles);
        this.towers.push(projectileTower);

        let laserTower = new LaserTower(new Vector(constants.tileWidth * (4 + 1 / 2), constants.tileWidth * (5 + 1 / 2)), constants.tileWidth * 5, this.enemies);
        this.towers.push(laserTower);


        document.onmousedown = this.mousePressed;

    }
    startWave() {
        if (this.enemies.length == 0 && this.enemiesLeftToSpawn <= 0) {
            this.enemiesLeftToSpawn = this.wave * 2 + 10;
            this.wave++;
            this.updateUI();
            Enemy.speed = constants.tileWidth * Math.pow(this.wave, 1 / 4);
            this.enemyInterval = 1 / Math.pow(this.wave, 1 / 4);
        }
    }
    render() {
        let ctx = this.ctx;
        ctx.drawImage(this.mapCanvas, 0, 0);

        for (let enemy of this.enemies) {
            enemy.render(ctx);
        }
        for (let tower of this.towers) {
            tower.render(ctx);
        }
        for (let projectile of this.projectiles) {
            projectile.render(ctx);
        }
        for (let shield of this.shields) {
            shield.render(ctx);
        }

        requestAnimationFrame(this.render);
    }
    update() {
        let timeNow = performance.now();
        let deltaTime = (timeNow - this.previousTime) / 1000;
        deltaTime = Math.min(deltaTime, 1 / 15);
        deltaTime *= this.timeScale;

        this.enemyTimer += deltaTime;

        if (this.enemyTimer > this.enemyInterval && this.enemiesLeftToSpawn > 0) {
            let e = new Enemy(Math.floor(Math.random() * 3));
            this.enemies.push(e);
            if (Math.random() < 0.05) {
                let shield = new Shield(e.position, e);
                e.shield = true;
                this.shields.push(shield);
            }
            this.enemyTimer = 0;
            this.enemiesLeftToSpawn--;
        }

        for (let enemy of this.enemies) {
            enemy.update(deltaTime);
            if (enemy.position.x < 0) {
                this.lives--;
                removeElement(this.enemies, enemy);
                this.updateUI();
            }
            if (enemy.health <= 0)
                removeElement(this.enemies, enemy);
        }

        for (let tower of this.towers) {
            tower.update(deltaTime);
            if (tower instanceof LaserTower) {
                if (tower.target && tower.shoot) {
                    if (!tower.target.shield)
                        tower.target.health -= deltaTime * tower.dps;
                }
            }
        }
        for (let projectile of this.projectiles) {
            projectile.update(deltaTime);
            if (projectile.position.x < 0 || projectile.position.y < 0 || projectile.position.x > constants.width || projectile.position.y > constants.height) {
                removeElement(this.projectiles, projectile);
            }
            else {
                let minDistance = constants.tileWidth / 2 + constants.tileWidth / 8;
                for (let enemy of this.enemies) {
                    let projectileToEnemyVector = enemy.position.copy().add(projectile.position.copy().multiply(-1));
                    if (projectileToEnemyVector.magnitude <= minDistance) {
                        if (!enemy.shield)
                            enemy.health -= projectile.damage;
                        removeElement(this.projectiles, projectile);
                        break;
                    }
                }
            }
        }
        this.previousTime = timeNow;
    }
    mousePressed(e) {
        if (e.button == 0) {
            let mousePos = new Vector(e.clientX, e.clientY);
            for (let shield of this.shields) {
                if (shield.position.copy().add(mousePos.copy().multiply(-1)).magnitude < constants.tileWidth * 5 / 8) {
                    this.selectShield(shield);
                }
            }
        }
    }
    keyPressed(e) {

    }

    answerQuestion() {
        let answer = document.getElementById('answerInput').value;
        document.getElementById('questionDiv').style.display = "none";
        let actualAnswer = String(eval(answer));
        if (!this.shieldSelected.checkAnswer(actualAnswer)) {
            this.lives -= 10;
        }

        this.shieldSelected.enemyBound.shield = null;
        removeElement(this.shields, this.shieldSelected);
        this.shieldSelected = null;

        this.updateUI();
    }

    selectShield(shield) {
        document.getElementById('questionDiv').style.display = "block";
        document.getElementById('questionText').innerHTML = shield.question;
        this.shieldSelected = shield;
    }
    updateUI() {
        document.getElementById('moneyText').innerHTML = "&pound;" + this.money;
        document.getElementById('livesText').innerHTML = this.lives;
        document.getElementById('wavesText').innerHTML = this.wave;
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

function removeElement(array, item) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == item) {
            array.splice(i, 1);
            break;
        }
    }
}

import constants from './constants.js';
import { Vector } from './Vector.js';
import { Enemy } from './Enemy.js';
import { LaserTower } from './LaserTower.js';
import { ProjectileTower } from './ProjectileTower.js';
import { Shield } from './Shield.js';

export class Engine {
    constructor() {
        let canvas = document.createElement('CANVAS'); // Create the canvas
        canvas.width = constants.width; // Set the width and height
        canvas.height = constants.height;

        document.getElementById('game').appendChild(canvas); // Add the canvas to the game div
        document.getElementById('menu').style.height = constants.height.toString() + "px"; // Set the height of the menu div = game height

        this.canvas = canvas;

        let ctx = canvas.getContext('2d'); // Get the context so it can be drawn to
        this.ctx = ctx;

        let mapCanvas = new OffscreenCanvas(constants.width, constants.height);
        this.mapCanvas = mapCanvas;
        this.mapCtx = mapCanvas.getContext('2d');
        this.renderMap();
        // Render the map onto a virtual canvas so that it can be drawn much more easily to the main canvas each frame, 
        // as calculations to draw the map with functions such as shadowBlur slow down framerate significantly.


        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.startWave = this.startWave.bind(this);
        this.mousePressed = this.mousePressed.bind(this);
        this.answerQuestion = this.answerQuestion.bind(this);

        // Makes sure that the functions are run with 'this' as the current object, as they are called from an outside function.

        requestAnimationFrame(this.render); // Runs when the GPU is ready for the next frame


        setInterval(this.update, 1 / 100); // Runs the update method every 0.01 seconds, at maximum.

        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.shields = [];
        this.previousTime = performance.now(); // Gets the current time in milliseconds efficiently

        this.enemyTimer = 0;
        this.enemyInterval = 1;

        this.wave = 0;
        this.enemiesLeftToSpawn = 0;


        this.money = 100;
        this.lives = 100;

        this.timeScale = 1;

        let startWaveBtn = document.getElementById('startWaveButton'); // Get the buttons and bind them to their corresponding methods
        startWaveBtn.onclick = this.startWave;
        let answerQuestionBtn = document.getElementById('answerButton');
        answerQuestionBtn.onclick = this.answerQuestion;

        this.towerToAdd = null;

        document.getElementById('laserTowerButton').onclick = () => {
            this.towerToAdd = new LaserTower(Vector.Z, constants.tileWidth * 5, this.enemies);
        }
        document.getElementById('projectileTowerButton').onclick = () => {
            this.towerToAdd = new ProjectileTower(Vector.Z, constants.tileWidth * 5, this.enemies, this.projectiles);
        }

        // For each of the tower buttons, set them to create a new tower to follow the mouse position



        document.onmousedown = this.mousePressed;
        document.onmousemove = (e) => {
            if (this.towerToAdd) {
                let x = (Math.round(e.clientX / constants.tileWidth - 0.5) + 0.5) * constants.tileWidth;
                let y = (Math.round(e.clientY / constants.tileWidth - 0.5) + 0.5) * constants.tileWidth;
                let pos = new Vector(x, y);
                this.towerToAdd.position.setTo(pos);
            }
            // If the mouse moves, move the current tower to that of the mouse position's
        }

    }
    startWave() {
        if (this.enemies.length == 0 && this.enemiesLeftToSpawn <= 0) {
            // If there are no enemies left, and there are no enemies left to spawn, a new wave can be started
            this.enemiesLeftToSpawn = this.wave * 2 + 10;
            this.wave++;
            this.updateUI();
            Enemy.speed = constants.tileWidth * Math.pow(this.wave, 1 / 4);
            this.enemyInterval = 1 / Math.pow(this.wave, 1 / 4);
        }
    }
    render() {
        let ctx = this.ctx;
        ctx.drawImage(this.mapCanvas, 0, 0); // Draw the map onto the main canvas

        for (let enemy of this.enemies) {
            enemy.render(ctx);
        } // Render all enemies
        for (let tower of this.towers) {
            tower.render(ctx);
        } // Render all towers
        for (let projectile of this.projectiles) {
            projectile.render(ctx);
        } // Render all the projectiles
        for (let shield of this.shields) {
            shield.render(ctx);
        } // Render all the shields
        if (this.towerToAdd) {
            this.towerToAdd.render(ctx);
        } // Render the tower being placed currently

        requestAnimationFrame(this.render); // Request the GPU for the next frame to be drawn
    }
    update() {
        let timeNow = performance.now();
        let deltaTime = (timeNow - this.previousTime) / 1000; // Find the time since the last run of the update method
        deltaTime = Math.min(deltaTime, 1 / 15);
        // Make sure that the game is not making too large of timesteps, to ensure enemies do not go offscreen
        deltaTime *= this.timeScale;
        // Speed up the game by an amount

        this.enemyTimer += deltaTime;

        if (this.enemyTimer > this.enemyInterval && this.enemiesLeftToSpawn > 0) {
            // If there's still enemies to spawn and the time since the last enemy spawn is large enough, spawn an enemy
            let e = new Enemy(Math.floor(Math.random() * 3));
            this.enemies.push(e);
            if (Math.random() < 0.05) {
                // Give 5% of enemies a shield.
                let shield = new Shield(e.position, e);
                e.shield = true;
                this.shields.push(shield);
            }
            this.enemyTimer = 0;
            this.enemiesLeftToSpawn--;
            // Reset the timer and decrement the No enemies to spawn
        }

        for (let enemy of this.enemies) {
            // Update the positions of the enemies
            enemy.update(deltaTime);
            // If the enemy is off to the left, it has reached the end of its path
            if (enemy.position.x < 0) {
                // Deduct a life for the enemy reaching its goal
                this.lives--;
                if (enemy.shield) {
                    for (let shield of this.shields) {
                        if (shield.enemyBound == enemy) {
                            // If it has a shield, find the correct shield, remove it, and deduct 10 lives for not answering the question.
                            removeElement(this.shields, shield);
                            this.lives -= 10;
                            break;
                        }
                    }
                }
                // Remove the enemy from the enemies
                removeElement(this.enemies, enemy);

                // Update the UI so the lives display adjusts
                this.updateUI();
            }
            else if (enemy.health <= 0) {
                // If the towers make the enemies die, add 3 money, remove the enemy, and update the UI
                this.money += 3;
                this.updateUI();
                removeElement(this.enemies, enemy);
            }
        }

        for (let tower of this.towers) {
            // Make the towers update their targets and aim at their new targets
            tower.update(deltaTime);
            if (tower instanceof LaserTower) {
                // If it is a LaserTower, and it has a target, it should damage its target
                if (tower.target && tower.shoot) {
                    if (!tower.target.shield)
                        tower.target.health -= deltaTime * tower.dps;
                }
            }
        }
        for (let projectile of this.projectiles) {
            // Move the projectiles
            projectile.update(deltaTime);

            // If they are offscreen, delete them - they're never going to hit anything now
            if (projectile.position.x < 0 || projectile.position.y < 0 || projectile.position.x > constants.width || projectile.position.y > constants.height) {
                removeElement(this.projectiles, projectile);
            }
            else {
                // The minimum distance between them if they are colliding is the sum of their radii.
                // The enemies have radius constants.tileWidth / 2 and the projectiles have radius constants.tileWidth / 8
                let minDistance = constants.tileWidth / 2 + constants.tileWidth / 8;

                // For each enemy, check if they are close enough to have collided
                for (let enemy of this.enemies) {
                    let projectileToEnemyVector = enemy.position.copy().add(projectile.position.copy().multiply(-1));
                    if (projectileToEnemyVector.magnitude <= minDistance) {
                        // If they have collided, remove the projectile
                        // If they don't have a shield, apply damage to the enemy
                        if (!enemy.shield)
                            enemy.health -= projectile.damage;
                        removeElement(this.projectiles, projectile);
                        break;
                    }
                }
            }
        }
        this.previousTime = timeNow;
        // Used for the next frame
    }
    // Run when the mouse is pressed
    mousePressed(e) {
        if (!this.towerToAdd) {
            // If a tower is not being placed
            if (e.button == 0) {
                // If the left mouse button has been pressed, capture its position, and check if it is over one of the shields
                let mousePos = new Vector(e.clientX, e.clientY);
                for (let shield of this.shields) {
                    if (shield.position.copy().add(mousePos.copy().multiply(-1)).magnitude < constants.tileWidth * 5 / 8) {
                        this.selectShield(shield);
                    }
                }
            }
        }
        else {
            // If a tower is being placed, and the left mouse button is pressed
            if (e.button == 0) {

                // Get the x and y in terms of tiles
                let x = Math.floor(this.towerToAdd.position.x / constants.tileWidth);
                let y = Math.floor(this.towerToAdd.position.y / constants.tileWidth);


                if (constants.map[y] && constants.map[y][x] == "f") {
                    // If it is not part of the path, then a tower can be placed
                    this.towers.push(this.towerToAdd);
                    this.towerToAdd = null;
                    this.money -= 100;
                    this.updateUI();
                    // Remove the relevant amount of money and unset the towerToAdd property so that it no longer shows a tower following the mouse.
                }
            }
        }
    }

    answerQuestion() {
        let answer = document.getElementById('answerInput').value; // Get the value of the input box
        document.getElementById('answerInput').value = ""; // Reset the value of the input box for the next question
        document.getElementById('questionDiv').style.display = "none"; // Hide the question box
        try {
            let val = eval(answer.replace("sqrt", "Math.sqrt")); // Replace that so the user does not have to type the full 'Math.sqrt'
            val = Math.round(val * 100000) / 100000; // Round so that the error on the value does not affect whether the player gets the correct answer
            let actualAnswer = String(val); // Convert the answer to a string so that it can be searched for in the array.
            if (!this.shieldSelected.checkAnswer(actualAnswer)) {
                this.lives -= 10; // If it's not the correct answer, remove 10 lives
            }
        }
        catch (e) {
            this.lives -= 10; // If the user enters something invalid, remove 10 lives
        }

        this.shieldSelected.enemyBound.shield = null;
        removeElement(this.shields, this.shieldSelected); // Remove the shield
        this.shieldSelected = null;

        this.updateUI(); // Update the UI for the lives, if they have changed
    }

    selectShield(shield) {
        document.getElementById('questionDiv').style.display = "block"; // Show the question box
        document.getElementById('questionText').innerHTML = shield.question; // Change the question to that of the question assigned to the shield
        this.shieldSelected = shield; // Set the shield to that of the one clicked
    }
    updateUI() {
        document.getElementById('moneyText').innerHTML = "&pound;" + this.money; // Set the money text to a pound sign and then the value of the money
        document.getElementById('livesText').innerHTML = this.lives; // Set the lives text to the value of lives
        document.getElementById('wavesText').innerHTML = this.wave; // Set the waves text to the value of waves
        if (this.money < 100) { // If the money is insufficient, do not allow either tower-placing buttons to be clicked
            document.getElementById('laserTowerButton').disabled = true;
            document.getElementById('projectileTowerButton').disabled = true;
        }
        else { // Otherwise, allow them.
            document.getElementById('laserTowerButton').disabled = false;
            document.getElementById('projectileTowerButton').disabled = false;
        }
    }

    renderMap() {
        let ctx = this.mapCtx; // Get the map ctx instead of the regular context
        ctx.fillStyle = "#000"; // Fill of black
        ctx.fillRect(0, 0, constants.width, constants.height); // Fill a background with black
        // ctx.fillRect(x, y, width, height)


        ctx.fillStyle = "#000";
        ctx.shadowBlur = 45;
        ctx.shadowColor = "#666"; // Extremely slow operation - colour is a grey
        for (let i = 0; i < constants.width / constants.tileWidth; i++) { // For every row
            for (let j = 0; j < constants.height / constants.tileWidth; j++) { // For every character
                if (constants.map[j][i] == 'f') { // If it's an 'f', draw a rectangle
                    ctx.fillRect(i * constants.tileWidth, j * constants.tileWidth, constants.tileWidth, constants.tileWidth);
                }
            }
        }

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#888"; // Grey
        ctx.fillStyle = "#aaa"; // Lighter grey
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
    for (let i = 0; i < array.length; i++) { // For each element in the array
        if (array[i] == item) { // If it's the element we want to delete
            array.splice(i, 1); // Remove it from the array
            break; // No need to check any more
        }
    }
}

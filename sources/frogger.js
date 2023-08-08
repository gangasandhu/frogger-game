const backgroundCanvas = document.getElementById('backgroundCanvas');
const spriteCanvas = document.getElementById('spriteCanvas');
const interfaceCanvas = document.getElementById('interfaceCanvas');

interfaceCanvas.addEventListener('click', startGame);

// ctx for canvas
const interfaceCtx = interfaceCanvas.getContext('2d');
const spriteCtx = spriteCanvas.getContext('2d');
const backgroundCtx = backgroundCanvas.getContext('2d');

// loading images
const spritesImg = new Image();
const deadImg = new Image();
spritesImg.src = "../assets/sprites.png";
deadImg.src = "../assets/dead.png";

// frog object
const frog = {
    x: interfaceCanvas.width / 2 - 17.5,
    y: 490,
    direction: "up",
    speed: 30,
    width: 25,
    height: 20
}

// player
const player = {
    time: 60,
    lives: 5,
    state: "start",
    score: 0,
    safeHomes: ["available", "available", "available", "available"]
}


//sprites
class Sprite {
    constructor(width, height, ix, iy, x) {
        this.width = width;
        this.height = height;
        this.ix = ix;
        this.iy = iy;
        this.x = x;
    }
}


// lanes

// logs
let log1 = new Sprite(180, 30, 5, 160, spriteCanvas.width / 2 - 90);
let log2 = new Sprite(120, 30, 5, 190, 10);
let log3 = new Sprite(120, 30, 5, 190, spriteCanvas.width - 142);
let log4 = new Sprite(100, 30, 3, 230, 30);
let log5 = new Sprite(100, 30, 3, 230, spriteCanvas.width / 2 - 30);
let log6 = new Sprite(100, 30, 3, 230, 320);
let log7 = new Sprite(180, 30, 5, 160, 10);
let log8 = new Sprite(180, 30, 5, 160, 230);

//cars
let car1 = new Sprite(35, 30, 3, 260, spriteCanvas.width / 2 - 30);
let car2 = new Sprite(50, 30, 100, 300, 10);
let car3 = new Sprite(50, 30, 100, 300, 110);
let car4 = new Sprite(50, 30, 100, 300, 210);
let car5 = new Sprite(50, 30, 100, 300, 310);
let car6 = new Sprite(35, 30, 3, 300, spriteCanvas.width / 2 - 30);
let car7 = new Sprite(35, 30, 75, 260, 50);
let car8 = new Sprite(35, 30, 75, 260, 300);
let car9 = new Sprite(35, 30, 40, 260, spriteCanvas.width / 2 - 30);
let car10 = new Sprite(35, 30, 3, 260, 50);
let car11 = new Sprite(35, 30, 3, 260, 200);
let car12 = new Sprite(35, 30, 3, 260, 350);

// riverlanes
let riverLane1 = new Lane(1, 2, [log1], 240, true);
let riverLane2 = new Lane(-1, 2, [log2, log3], 245 - frog.speed - 5, true)
let riverLane3 = new Lane(1, 2, [log4, log5, log6], 245 - frog.speed * 2, true)
let riverLane4 = new Lane(-1, 2, [log7, log8], 240 - frog.speed * 3, true)
let riverLane5 = new Lane(1, 2, [log4, log5, log6], 245 - frog.speed * 4, true)
let riverLane6 = new Lane(-1, 2, [log7, log8], 240 - frog.speed * 5, true)

//road lanes
let roadLane1 = new Lane(1, 4, [car1], 300, false)
let roadLane2 = new Lane(-1, 4, [car2, car3, car4, car5], 335, false)
let roadLane3 = new Lane(1, 6, [car6], 365, false)
let roadLane4 = new Lane(-1, 6, [car7, car8], 390, false)
let roadLane5 = new Lane(1, 2, [car9], 420, false)
let roadLane6 = new Lane(-1, 2, [car10, car11, car12], 450, false)

const lanes = [riverLane1, riverLane2, riverLane3, riverLane4, riverLane5, riverLane6, roadLane1, roadLane2, roadLane3, roadLane4, roadLane5, roadLane6]



// start button variables
const btnWidth = 100;
const btnHeight = 40;
const btnX = interfaceCanvas.width / 2 - btnWidth / 2;
const btnY = interfaceCanvas.height / 2;

// safeHomes

const sH1 = { x: 45, y: 60, width: 50, height: 35 }
const sH2 = { x: 130, y: 60, width: 50, height: 35 }
const sH3 = { x: 215, y: 60, width: 50, height: 35 }
const sH4 = { x: 300, y: 60, width: 50, height: 35 }

const safeHomeAreas = [sH1, sH2, sH3, sH4];



// isPointCollision function
function isPointCollision(px, py, bx, by, bw, bh) {
    return (px >= bx && px <= bx + bw) && (py >= by && py <= by + bh)
}

// isBoxCollision function 
function isBoxCollision(b1x, b1y, b1w, b1h, b2x, b2y, b2w, b2h) {
    let b1cx = b1x + b1w / 2;
    let b1cy = b1y + b1h / 2;

    let b2cx = b2x + b2w / 2;
    let b2cy = b2y + b2h / 2;

    let dx = Math.abs(b2cx - b1cx);
    let dy = Math.abs(b2cy - b1cy);

    return dx < b1w / 2 + b2w / 2 && dy < b1h / 2 + b2h / 2;
}

// Start Screen
function showStartScreen() {
    //drawing the black background
    interfaceCtx.fillStyle = "black";
    interfaceCtx.fillRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);

    // drawing the title
    interfaceCtx.drawImage(spritesImg, 0, 0, 400, 50, 0.06 * interfaceCanvas.clientWidth, interfaceCanvas.clientHeight / 4, 400, 50);

    // drawing the start button
    interfaceCtx.fillStyle = "green";
    interfaceCtx.fillRect(btnX, btnY, btnWidth, btnHeight);
    interfaceCtx.fillStyle = "black";
    interfaceCtx.font = "20px serif";
    interfaceCtx.fillText("Start", btnX + 30, btnY + 25);
}


// Game Starts
let interval;
let isDead = false;

// Start Game when the start button is clicked
function startGame(event) {
    // Add event listener for the "Start Again" button
    interfaceCanvas.addEventListener('click', restartGame);

    if (player.state == "start") {
        // checking if the start button is clicked
        let start = isPointCollision(event.offsetX, event.offsetY, btnX, btnY, btnWidth, btnHeight)

        //changing the state of player to playing
        if (start) {
            player.state = "playing";

            // clear the interface
            interfaceCtx.clearRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);

            // render the details
            let interval = setInterval(function () {
                renderBackground();
                renderLives();
                renderTime();
                renderScore();
                renderSprites();
                renderFrog();

                // if frog reached safe home
                renderSafeFrogs();


                //car collision
                if (!isDead)
                    isDead = checkCarCollision();

                // river collision
                if (!isDead && frog.y <= 272)
                    isDead = checkRiverCollision();

                // frog died and then respawn if lives
                if (isDead) {
                    interfaceCtx.clearRect(frog.x, frog.y, frog.width, frog.height);
                    interfaceCtx.drawImage(deadImg, frog.x, frog.y, deadImg.width, deadImg.height)
                    setTimeout(() => {
                        if (player.lives > 0) {
                            frog.x = interfaceCanvas.width / 2 - 17.5;
                            frog.y = 490;
                        }
                        isDead = false;
                    }, 1000)
                }



            }, 50)

            // update time
            const timeInterval = setInterval(function () {
                if (player.time > 0)
                    player.time--;
                else {
                    player.state = "end";
                    clearInterval(interval);
                    clearInterval(timeInterval);
                    showEndingPage();
                }
            }, 1000);

            // update frog in safe homes
            const safeHomeInterval = setInterval(function () {
                numSafeHomesTaken = 0;
                for(let i = 0; i < player.safeHomes.length; i++) {
                    if (player.safeHomes[i == "taken"])
                        numSafeHomesTaken++;
                }
                if (numSafeHomesTaken === 4) {
                    player.state = "end";
                    clearInterval(interval);
                    clearInterval(safeHomeInterval);
                    showEndingPage();
                }
            }, 100);

            // check for lives become 0 condition
            const livesInterval = setInterval(function () {
                if (player.lives === 0) {
                    player.state = "end";
                    clearInterval(interval);
                    clearInterval(timeInterval);
                    clearInterval(safeHomeInterval);
                    clearInterval(livesInterval);
                    showEndingPage();
                }
            }, 100);


        }
    }
}

// render the background screen
function renderBackground() {
    // background
    backgroundCtx.fillStyle = "black";
    backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    // screen title
    backgroundCtx.drawImage(spritesImg, 0, 0, 400, 50, 30, 5, 400, 40);

    // water
    backgroundCtx.fillStyle = "blue";
    backgroundCtx.fillRect(0, 50, backgroundCanvas.width, 230);

    // Safe Areas
    backgroundCtx.drawImage(spritesImg, 0, 60, 400, 45, 0, 50, backgroundCanvas.width, 45);

    // Border lanes
    backgroundCtx.drawImage(spritesImg, 0, 120, 400, 30, 0, 485, backgroundCanvas.width, 30);
    backgroundCtx.drawImage(spritesImg, 0, 120, 400, 30, 0, 272, backgroundCanvas.width, 30);

}

// renders the frog
function renderFrog() {
    interfaceCtx.clearRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);
    interfaceCtx.drawImage(spritesImg, 10, 368, frog.width, frog.height, frog.x, frog.y, frog.width, frog.height)
}

//renders the lives available
function renderLives() {
    for (let i = 0; i < player.lives; i++) {
        backgroundCtx.drawImage(spritesImg, 10, 368, frog.width, frog.height, i * frog.width, 0.92 * backgroundCanvas.height, 2 / 3 * frog.width, 2 / 3 * frog.height)
    }
}

// renders the current score
function renderScore() {
    backgroundCtx.fillStyle = "yellow";
    backgroundCtx.font = "24px serif"
    backgroundCtx.fillText("Score: " + player.score, 0, 0.98 * backgroundCanvas.height)
}

// renders the time available
function renderTime() {
    backgroundCtx.clearRect(backgroundCanvas.width, 0.98 * backgroundCanvas.height, 100, 0.02 * interfaceCanvas.height);
    backgroundCtx.fillStyle = "yellow";
    backgroundCtx.font = "24px serif"
    backgroundCtx.fillText("Time: " + player.time, backgroundCanvas.width - 100, 0.98 * backgroundCanvas.height)
}

function renderSafeFrogs() {
    for (let i = 0; i < player.safeHomes.length; i++) {
        if (player.safeHomes[i] == "taken") {
            winnerX = safeHomeAreas[i].x + safeHomeAreas[i].width / 2 - frog.width / 2;
            winnerY = safeHomeAreas[i].y + safeHomeAreas[i].height / 2 - frog.height / 2;
            backgroundCtx.drawImage(spritesImg, 10, 368, frog.width, frog.height, winnerX, winnerY, frog.width, frog.height)
        }
    }
}


// Part 2

document.addEventListener("keydown", moveFrog);

function moveFrog(event) {
    if (isDead)
        return;

    let newX = frog.x, newY = frog.y;

    if (event.key == "ArrowUp") {
        newY = frog.y - frog.speed
    } else if (event.key == "ArrowDown") {
        newY = frog.y + frog.speed
    } else if (event.key == "ArrowLeft") {
        newX = frog.x - frog.speed
    } else if (event.key == "ArrowRight") {
        newX = frog.x + frog.speed
    } else {
        return;
    }
    let inSafeHome = checkSafeHomes(newX, newY);

    let inBox = newX > 0 && newX + frog.width < interfaceCanvas.width && newY > 50 && newY + frog.height < 515;


    if (inBox) {
        if (inSafeHome == -1) {
            console.log("already taken")
        } else if (inSafeHome == 1) {
            return;
        } else {
            frog.x = newX;
            frog.y = newY;
        }

    }

}

// checks if frog landed in the safe homes
function checkSafeHomes(newX, newY) {

    for (let i = 0; i < safeHomeAreas.length; i++) {
        const safeHome = safeHomeAreas[i]

        if (newY < safeHome.y + safeHome.height && newX + frog.width >= safeHome.x && newX <= safeHome.x + safeHome.width) {
            if (player.safeHomes[i] == "available") {

                player.safeHomes[i] = "taken"
                player.score += 100;
                if (player.lives > 0) {
                    frog.x = interfaceCanvas.width / 2 - 17.5
                    frog.y = 490
                }
                player.lives--;
                console.log("Frog reached Safe home " + (i + 1))
                return 1;
            } else if (player.safeHomes[i] == "taken")
                return -1
        }
    }
    return 0

}

//check if frog collided with cars
function checkCarCollision() {

    for (let i = 6; i < lanes.length; i++) {
        let lane = lanes[i];
        for (let j = 0; j < lane.sprites.length; j++) {
            let car = lane.sprites[j]
            if (isBoxCollision(frog.x, frog.y, frog.width, frog.height, car.x, lane.y, car.width, car.height)) {
                player.lives--;
                return true;
            }

        }
    }
}

//check if frog is in river or on log
function checkRiverCollision() {
    //car collision

    for (let i = 0; i < lanes.length - 6; i++) {
        let lane = lanes[i];
        for (let j = 0; j < lane.sprites.length; j++) {
            let log = lane.sprites[j]
            if (isBoxCollision(frog.x, frog.y, frog.width, frog.height, log.x, lane.y, log.width, log.height)) {
                console.log("landed on log");
                if (frog.x > 0 && frog.x + frog.width < interfaceCanvas.width)
                    frog.x += lane.direction * lane.speed;
                return false;
            }

        }
    }
    player.lives--;
    return true;
}


// sprites

function Lane(direction, speed, sprites, y, isInRiver) {
    this.direction = direction;
    this.speed = speed;
    this.sprites = sprites;
    this.y = y;
    this.isInRiver = isInRiver;
}

function renderSprites() {
    spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
    for (let i = 0; i < lanes.length; i++) {
        let lane = lanes[i];
        for (let j = 0; j < lane.sprites.length; j++) {
            let sprite = lane.sprites[j]
            spriteCtx.drawImage(spritesImg, sprite.ix, sprite.iy, sprite.width, sprite.height, sprite.x, lane.y, sprite.width, sprite.height);
            sprite.x += lane.speed * lane.direction;
            if (sprite.x + sprite.width <= 0)
                sprite.x = spriteCanvas.width;
            else if (sprite.x >= spriteCanvas.width)
                sprite.x = -1 * sprite.width;
        }
    }

}

// end game

// setTimeout(gameOver, 100);

// function gameOver() {
//     clearInterval(interval);
//     player.state == "end"
//     interfaceCtx.clearRect(0, 0, interfaceCtx.width, interfaceCtx.height);
// }

function showEndingPage() {
    // Clear the interface and sprite canvases
    interfaceCtx.clearRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);
    spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);

    // Display the ending screen
    interfaceCtx.fillStyle = "black";
    interfaceCtx.fillRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);

    //display title
    interfaceCtx.fillStyle = "yellow";
    interfaceCtx.font = "34px serif";
    interfaceCtx.fillText("Game Over ", interfaceCanvas.width / 2 - 80, interfaceCanvas.height / 2 - 100);


    // Display the player's score
    interfaceCtx.font = "24px serif";
    interfaceCtx.fillText("Your Score: " + player.score, interfaceCanvas.width / 2 - 70, interfaceCanvas.height / 2 - 50);

    // Display the "Start Again" button
    interfaceCtx.fillStyle = "green";
    interfaceCtx.fillRect(btnX, btnY, btnWidth, btnHeight);
    interfaceCtx.fillStyle = "black";
    interfaceCtx.font = "18px serif";
    interfaceCtx.fillText("Start Again", btnX + 10, btnY + 25);

    // Add event listener for the "Start Again" button
    interfaceCanvas.addEventListener('click', restartGame);
}

function restartGame(event) {
    if (player.state === "end") {
        // Check if the "Start Again" button is clicked
        let startAgain = isPointCollision(event.offsetX, event.offsetY, btnX, btnY, btnWidth, btnHeight);

        if (startAgain) {
            // Reset player's data
            player.state = "start";
            player.time = 60;
            player.lives = 5;
            player.score = 0;
            player.safeHomes = ["available", "available", "available", "available"];

            // Reset frog position
            frog.x = interfaceCanvas.width / 2 - 17.5;
            frog.y = 490;

            // Clear any previous interval
            clearInterval(interval);

            // Show the start screen again
            showStartScreen();
        }
    }
}

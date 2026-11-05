const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart");
const gameStatus = document.getElementById("gameStatus");

const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

const gridSize = 20;

let snake;
let food;

let direction;
let nextDirection;

let score;

let gameRunning;
let gameLoop;


// ========================================
// START HRY
// ========================================

function startGame() {

    snake = [
        { x: 240, y: 200 },
        { x: 220, y: 200 },
        { x: 200, y: 200 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;

    gameRunning = true;

    scoreElement.textContent = score;

    gameStatus.textContent = "🟢 GAME RUNNING";
    gameStatus.style.color = "#16852b";

    createFood();

    clearInterval(gameLoop);

    gameLoop = setInterval(updateGame, 120);

    drawGame();
}


// ========================================
// HLAVNÍ CYKLUS HRY
// ========================================

function updateGame() {

    if (!gameRunning) {
        return;
    }

    direction = nextDirection;

    moveSnake();

    if (checkCollision()) {
        endGame();
        return;
    }

    checkFood();

    drawGame();
}


// ========================================
// POHYB HADA
// ========================================

function moveSnake() {

    const head = {
        x: snake[0].x,
        y: snake[0].y
    };

    if (direction === "UP") {
        head.y -= gridSize;
    }

    if (direction === "DOWN") {
        head.y += gridSize;
    }

    if (direction === "LEFT") {
        head.x -= gridSize;
    }

    if (direction === "RIGHT") {
        head.x += gridSize;
    }

    snake.unshift(head);

    // Pokud had nesnědl jídlo,
    // odstraníme poslední článek
    if (!isFoodOnHead()) {
        snake.pop();
    }
}


// ========================================
// VYTVOŘENÍ JÍDLA
// ========================================

function createFood() {

    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };

    // Jídlo nesmí být uvnitř hada
    for (let part of snake) {

        if (food.x === part.x && food.y === part.y) {
            createFood();
            return;
        }
    }
}


// ========================================
// KONTROLA JÍDLA
// ========================================

function isFoodOnHead() {

    return (
        snake[0].x === food.x &&
        snake[0].y === food.y
    );
}


function checkFood() {

    if (isFoodOnHead()) {

        score += 1;

        scoreElement.textContent = score;

        createFood();
    }
}


// ========================================
// KOLIZE
// ========================================

function checkCollision() {

    const head = snake[0];

    // Kolize se stěnou
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        return true;
    }

    // Kolize se sebou
    for (let i = 1; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            return true;
        }
    }

    return false;
}


// ========================================
// KONEC HRY
// ========================================

function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);

    gameStatus.textContent = "🔴 GAME OVER";
    gameStatus.style.color = "#d62828";

    drawGame();

    // Text Game Over
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Klikni na RESTART",
        canvas.width / 2,
        canvas.height / 2 + 40
    );
}


// ========================================
// KRESLENÍ HRY
// ========================================

function drawGame() {

    // Pozadí
    ctx.fillStyle = "#07120d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Mřížka
    drawGrid();

    // Jídlo
    drawFood();

    // Had
    drawSnake();
}


// ========================================
// MŘÍŽKA
// ========================================

function drawGrid() {

    ctx.strokeStyle = "rgba(0, 255, 80, 0.10)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += gridSize) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        ctx.stroke();
    }
}


// ========================================
// KRESLENÍ HADA
// ========================================

function drawSnake() {

    snake.forEach((part, index) => {

        if (index === 0) {
            ctx.fillStyle = "#70ff32";
        } else {
            ctx.fillStyle = "#35d629";
        }

        ctx.fillRect(
            part.x + 1,
            part.y + 1,
            gridSize - 2,
            gridSize - 2
        );
    });

    // Oči hlavy
    drawSnakeEyes();
}


// ========================================
// OČI HADA
// ========================================

function drawSnakeEyes() {

    const head = snake[0];

    ctx.fillStyle = "white";

    if (direction === "RIGHT") {

        ctx.beginPath();
        ctx.arc(head.x + 14, head.y + 6, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(head.x + 14, head.y + 14, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    if (direction === "LEFT") {

        ctx.beginPath();
        ctx.arc(head.x + 6, head.y + 6, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(head.x + 6, head.y + 14, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    if (direction === "UP") {

        ctx.beginPath();
        ctx.arc(head.x + 6, head.y + 6, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(head.x + 14, head.y + 6, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    if (direction === "DOWN") {

        ctx.beginPath();
        ctx.arc(head.x + 6, head.y + 14, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(head.x + 14, head.y + 14, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}


// ========================================
// KRESLENÍ JABLKA
// ========================================

function drawFood() {

    const centerX = food.x + gridSize / 2;
    const centerY = food.y + gridSize / 2;

    // Jablko
    ctx.fillStyle = "#ff3b16";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY + 2,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // List
    ctx.fillStyle = "#5edb3b";

    ctx.beginPath();

    ctx.ellipse(
        centerX + 7,
        centerY - 8,
        5,
        3,
        -0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Stopka
    ctx.strokeStyle = "#704214";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(centerX, centerY - 7);
    ctx.lineTo(centerX + 2, centerY - 12);

    ctx.stroke();
}


// ========================================
// OVLÁDÁNÍ KLÁVESNICÍ
// ========================================

document.addEventListener("keydown", function(event) {
    const keys = [ 
        "ArrowUp",
         "ArrowDown",
         "ArrowLeft", 
         "ArrowRight" 
    ];
    if (keys.includes(event.key)) {
        event.preventDefault(); 
    }

    if (event.key === "ArrowUp") {
        changeDirection("UP");
    }

    if (event.key === "ArrowDown") {
        changeDirection("DOWN");
    }

    if (event.key === "ArrowLeft") {
        changeDirection("LEFT");
    }

    if (event.key === "ArrowRight") {
        changeDirection("RIGHT");
    }
});


// ========================================
// ZMĚNA SMĚRU
// ========================================

function changeDirection(newDirection) {

    // Had se nemůže otočit přímo proti sobě

    if (
        newDirection === "UP" &&
        direction !== "DOWN"
    ) {
        nextDirection = "UP";
    }

    if (
        newDirection === "DOWN" &&
        direction !== "UP"
    ) {
        nextDirection = "DOWN";
    }

    if (
        newDirection === "LEFT" &&
        direction !== "RIGHT"
    ) {
        nextDirection = "LEFT";
    }

    if (
        newDirection === "RIGHT" &&
        direction !== "LEFT"
    ) {
        nextDirection = "RIGHT";
    }
}


// ========================================
// OVLÁDACÍ TLAČÍTKA
// ========================================

upButton.addEventListener("click", function() {
    changeDirection("UP");
});

downButton.addEventListener("click", function() {
    changeDirection("DOWN");
});

leftButton.addEventListener("click", function() {
    changeDirection("LEFT");
});

rightButton.addEventListener("click", function() {
    changeDirection("RIGHT");
});


// ========================================
// RESTART
// ========================================

restartButton.addEventListener("click", startGame);


// ========================================
// SPUŠTĚNÍ HRY
// ========================================

startGame();
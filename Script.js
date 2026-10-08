const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

let score = 0;
let coins = 0;
let gameOver = false;

let speed = 5;
let frame = 0;

// Road
const road = {
    x: 60,
    width: 280
};

// Player
const player = {
    lane: 1,
    x: 0,
    y: 570,
    width: 45,
    height: 70,

    jumping: false,
    jumpVelocity: 0,

    color: "#2196f3"
};

// Three lanes
const lanes = [
    115,
    177,
    239
];

player.x = lanes[player.lane];

// Obstacles
let obstacles = [];

// Coins
let coinList = [];

// -----------------------------
// Draw Background
// -----------------------------

function drawBackground() {

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Buildings
    ctx.fillStyle = "#777";

    ctx.fillRect(0, 100, 50, 300);
    ctx.fillRect(350, 80, 50, 320);

    // Windows
    ctx.fillStyle = "#FFD54F";

    for (let y = 120; y < 350; y += 40) {
        ctx.fillRect(10, y, 15, 20);
        ctx.fillRect(370, y, 15, 20);
    }

    // Ground
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 400, canvas.width, 300);

    // Road
    ctx.fillStyle = "#333";
    ctx.fillRect(road.x, 400, road.width, 300);

    // Lane lines
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.setLineDash([25, 20]);

    ctx.beginPath();
    ctx.moveTo(153, 400);
    ctx.lineTo(153, 700);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(247, 400);
    ctx.lineTo(247, 700);
    ctx.stroke();

    ctx.setLineDash([]);
}

// -----------------------------
// Draw Player
// -----------------------------

function drawPlayer() {

    // Body
    ctx.fillStyle = player.color;

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    // Head
    ctx.fillStyle = "#ffcc80";

    ctx.beginPath();

    ctx.arc(
        player.x + 22,
        player.y - 12,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Hair
    ctx.fillStyle = "#222";

    ctx.beginPath();

    ctx.arc(
        player.x + 22,
        player.y - 18,
        18,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();
}

// -----------------------------
// Create Obstacle
// -----------------------------

function createObstacle() {

    const lane = Math.floor(Math.random() * 3);

    obstacles.push({
        x: lanes[lane],
        y: -100,
        width: 55,
        height: 80,
        lane: lane
    });
}

// -----------------------------
// Draw Obstacles
// -----------------------------

function drawObstacles() {

    obstacles.forEach(obstacle => {

        // Train
        ctx.fillStyle = "#e53935";

        ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );

        // Windows
        ctx.fillStyle = "#90caf9";

        ctx.fillRect(
            obstacle.x + 8,
            obstacle.y + 10,
            15,
            20
        );

        ctx.fillRect(
            obstacle.x + 32,
            obstacle.y + 10,
            15,
            20
        );

        // Front light
        ctx.fillStyle = "#fff59d";

        ctx.fillRect(
            obstacle.x + 10,
            obstacle.y + 55,
            12,
            10
        );

        ctx.fillRect(
            obstacle.x + 33,
            obstacle.y + 55,
            12,
            10
        );
    });
}

// -----------------------------
// Create Coin
// -----------------------------

function createCoin() {

    const lane = Math.floor(Math.random() * 3);

    coinList.push({
        x: lanes[lane] + 20,
        y: -30,
        radius: 10,
        lane: lane
    });
}

// -----------------------------
// Draw Coins
// -----------------------------

function drawCoins() {

    coinList.forEach(coin => {

        ctx.fillStyle = "#FFD700";

        ctx.beginPath();

        ctx.arc(
            coin.x,
            coin.y,
            coin.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = "#FFA000";
        ctx.lineWidth = 3;

        ctx.stroke();
    });
}

// -----------------------------
// Move Objects
// -----------------------------

function moveObjects() {

    obstacles.forEach(obstacle => {
        obstacle.y += speed;
    });

    coinList.forEach(coin => {
        coin.y += speed;
    });

    obstacles = obstacles.filter(
        obstacle => obstacle.y < canvas.height + 100
    );

    coinList = coinList.filter(
        coin => coin.y < canvas.height + 50
    );
}

// -----------------------------
// Collision Detection
// -----------------------------

function checkCollision() {

    obstacles.forEach(obstacle => {

        const playerLeft = player.x;
        const playerRight = player.x + player.width;

        const playerTop = player.y;
        const playerBottom = player.y + player.height;

        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;

        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + obstacle.height;

        if (
            playerLeft < obstacleRight &&
            playerRight > obstacleLeft &&
            playerTop < obstacleBottom &&
            playerBottom > obstacleTop
        ) {

            gameOver = true;

            document.getElementById("finalScore").textContent =
                Math.floor(score);

            document.getElementById("gameOver").style.display =
                "block";
        }
    });
}

// -----------------------------
// Collect Coins
// -----------------------------

function collectCoins() {

    coinList.forEach((coin, index) => {

        const distance = Math.sqrt(
            Math.pow(
                player.x + player.width / 2 - coin.x,
                2
            ) +
            Math.pow(
                player.y + player.height / 2 - coin.y,
                2
            )
        );

        if (distance < 40) {

            coins++;

            score += 10;

            coinList.splice(index, 1);

            document.getElementById("coins").textContent =
                coins;
        }
    });
}

// -----------------------------
// Player Jump
// -----------------------------

function jump() {

    if (!player.jumping) {

        player.jumping = true;

        player.jumpVelocity = -15;
    }
}

// -----------------------------
// Update Player
// -----------------------------

function updatePlayer() {

    if (player.jumping) {

        player.y += player.jumpVelocity;

        player.jumpVelocity += 0.7;

        if (player.y >= 570) {

            player.y = 570;

            player.jumping = false;
            player.jumpVelocity = 0;
        }
    }
}

// -----------------------------
// Move Left
// -----------------------------

function moveLeft() {

    if (player.lane > 0) {

        player.lane--;

        player.x = lanes[player.lane];
    }
}

// -----------------------------
// Move Right
// -----------------------------

function moveRight() {

    if (player.lane < 2) {

        player.lane++;

        player.x = lanes[player.lane];
    }
}

// -----------------------------
// Keyboard Controls
// -----------------------------

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {
        moveLeft();
    }

    if (event.key === "ArrowRight") {
        moveRight();
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        jump();
    }
});

// -----------------------------
// Mobile Controls
// -----------------------------

document.getElementById("leftBtn")
    .addEventListener("click", moveLeft);

document.getElementById("rightBtn")
    .addEventListener("click", moveRight);

document.getElementById("jumpBtn")
    .addEventListener("click", jump);

// -----------------------------
// Game Loop
// -----------------------------

function gameLoop() {

    if (gameOver) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();

    moveObjects();

    updatePlayer();

    drawCoins();

    drawObstacles();

    drawPlayer();

    checkCollision();

    collectCoins();

    frame++;

    // Increase score
    if (frame % 10 === 0) {

        score++;

        document.getElementById("score").textContent =
            score;
    }

    // Create obstacles
    if (frame % 100 === 0) {
        createObstacle();
    }

    // Create coins
    if (frame % 60 === 0) {
        createCoin();
    }

    // Increase speed
    if (frame % 500 === 0) {
        speed += 0.5;
    }

    requestAnimationFrame(gameLoop);
}

// -----------------------------
// Restart Game
// -----------------------------

function restartGame() {

    score = 0;
    coins = 0;

    speed = 5;
    frame = 0;

    gameOver = false;

    obstacles = [];
    coinList = [];

    player.lane = 1;
    player.x = lanes[1];

    player.y = 570;

    player.jumping = false;

    document.getElementById("score").textContent = "0";
    document.getElementById("coins").textContent = "0";

    document.getElementById("gameOver").style.display =
        "none";

    gameLoop();
}

// Start game
gameLoop();
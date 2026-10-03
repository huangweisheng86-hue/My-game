const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const paddle = {
    width: 80,
    height: 12,
    x: 160,
    y: 470,
    speed: 7
};

const ball = {
    x: 200,
    y: 100,
    radius: 8,
    dx: 3,
    dy: 3
};

let score = 0;
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});

function update() {
    if (leftPressed && paddle.x > 0) paddle.x -= paddle.speed;
    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += paddle.speed;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.dy > 0
    ) {
        ball.dy = -ball.dy;
        score++;
        scoreEl.textContent = score;
    }

    if (ball.y - ball.radius > canvas.height) {
        ball.x = 200;
        ball.y = 100;
        ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = 3;
        score = 0;
        scoreEl.textContent = score;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e94560';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

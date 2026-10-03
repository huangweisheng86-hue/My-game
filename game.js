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

// --- 键盘控制（电脑用）---
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});

// --- 触屏控制（手机用）---
// 获取 canvas 在屏幕上的位置，用来把手指位置转换成游戏里的坐标
function getTouchX(touch) {
    const rect = canvas.getBoundingClientRect();
    return touch.clientX - rect.left;
}

canvas.addEventListener('touchstart', e => {
    e.preventDefault(); // 防止页面跟着滑动
    if (e.touches.length > 0) {
        paddle.x = getTouchX(e.touches[0]) - paddle.width / 2;
    }
}, { passive: false });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length > 0) {
        paddle.x = getTouchX(e.touches[0]) - paddle.width / 2;
    }
}, { passive: false });

canvas.addEventListener('touchend', e => {
    e.preventDefault();
}, { passive: false });

// --- 更新游戏状态 ---
function update() {
    // 键盘控制（如果按了键盘）
    if (leftPressed && paddle.x > 0) paddle.x -= paddle.speed;
    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += paddle.speed;

    // 边界限制（防止挡板跑出画布）
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;

    // 球移动
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 撞左右墙
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
    }

    // 撞上墙
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // 撞挡板
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

    // 掉到底部 → 重置
    if (ball.y - ball.radius > canvas.height) {
        ball.x = 200;
        ball.y = 100;
        ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = 3;
        score = 0;
        scoreEl.textContent = score;
    }
}

// --- 绘制画面 ---
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

// --- 游戏主循环 ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

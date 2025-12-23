const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d', { alpha: true }); // Явно указываем alpha для прозрачности
let particles = [];
let isAnimating = false;

// Настройка размеров холста
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Класс частицы
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color; // Ожидаем массив RGB, например [255, 0, 0]
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 4 + 2;
        
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        
        this.alpha = 1;
        this.friction = 0.96;
        this.gravity = 0.05;
		

    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.015;
    }

    draw() {
        // ОПТИМИЗАЦИЯ: Используем fillRect вместо arc. 
        // Это значительно снижает нагрузку на GPU.
        // (x | 0) округляет число до целого быстрее, чем Math.floor
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color; 
        ctx.fillRect(this.x | 0, this.y | 0, 10, 10);
    }
}

// Функция запуска
function launchFireworks() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height / 2);
            createExplosion(x, y);
        }, i * 300);
    }
    createExplosion(50, window.innerHeight - 50);
}

function createExplosion(x, y) {
    // Используем готовые строки цветов, чтобы не парсить их каждый кадр
    const colors = ['#ff0043', '#14fc56', '#1e90ff', '#ffeb3b', '#ff00ff', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y, color));
    }

    // Запускаем цикл анимации только если он еще не идет
    if (!isAnimating) {
        isAnimating = true;
        animate();
    }
}

function animate() {
    // ОПТИМИЗАЦИЯ: Если частиц нет, останавливаем рендеринг полностью
    if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isAnimating = false;
        return;
    }

    requestAnimationFrame(animate);

    // Полная очистка быстрее, чем рисование полупрозрачного фона
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ОПТИМИЗАЦИЯ: Обратный цикл позволяет безопасно использовать splice
    // и работает быстрее forEach
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }

        p.update();
        p.draw();
    }
}
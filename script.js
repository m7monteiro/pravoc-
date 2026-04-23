document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const startOverlay = document.getElementById('start-overlay');
    const bgMusic = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const musicProgress = document.getElementById('music-progress');
    const slides = document.querySelectorAll('.slide');
    const nextArea = document.getElementById('next-area');
    const prevArea = document.getElementById('prev-area');
    const progressStepsContainer = document.getElementById('progress-steps');

    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 segundos por slide
    let isPlaying = false;

    // Criar barras de progresso dinamicamente
    function createProgressBars() {
        progressStepsContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const bar = document.createElement('div');
            bar.className = 'step-bar';
            if (i === 0) bar.classList.add('active');
            progressStepsContainer.appendChild(bar);
        }
    }

    // Iniciar Experiência
    startBtn.addEventListener('click', () => {
        startOverlay.classList.add('hidden');
        createProgressBars();
        bgMusic.play();
        isPlaying = true;
        updatePlayPauseIcon(true);
        startSlideShow();
    });

    // Controle de Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            isPlaying = true;
            updatePlayPauseIcon(true);
            resumeSlideShow();
        } else {
            bgMusic.pause();
            isPlaying = false;
            updatePlayPauseIcon(false);
            pauseSlideShow();
        }
    });

    function updatePlayPauseIcon(isPlayingNow) {
        const icon = playPauseBtn.querySelector('i');
        icon.className = isPlayingNow ? 'fas fa-pause' : 'fas fa-play';
    }

    // Atualizar Barra de Progresso da Música
    bgMusic.addEventListener('timeupdate', () => {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        musicProgress.style.width = `${progress}%`;
    });

    // Quando a música terminar, reiniciar
    bgMusic.addEventListener('ended', () => {
        bgMusic.currentTime = 0;
        bgMusic.play();
    });

    // Lógica de Slideshow
    function startSlideShow() {
        showSlide(currentSlide);
        resetInterval();
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        const stepBars = document.querySelectorAll('.step-bar');
        stepBars.forEach((bar, i) => {
            bar.classList.remove('active', 'completed');
            if (i < index) bar.classList.add('completed');
        });

        slides[index].classList.add('active');
        if (stepBars[index]) stepBars[index].classList.add('active');
        currentSlide = index;

        // Adicionar efeito de transição suave
        addTransitionEffect();

        // Se for o último slide, iniciar fogos
        if (index === slides.length - 1) {
            startFireworks();
        } else {
            stopFireworks();
        }
    }

    function addTransitionEffect() {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.animation = 'none';
            setTimeout(() => {
                activeSlide.style.animation = 'fadeInUp 0.8s ease forwards';
            }, 10);
        }
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
            resetInterval();
        } else {
            showSlide(0);
            resetInterval();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
            resetInterval();
        }
    }

    function resetInterval() {
        clearInterval(slideInterval);
        if (isPlaying) {
            slideInterval = setInterval(nextSlide, slideDuration);
        }
    }

    function pauseSlideShow() {
        clearInterval(slideInterval);
        const activeBar = document.querySelector('.step-bar.active');
        if (activeBar) {
            activeBar.style.animationPlayState = 'paused';
        }
    }

    function resumeSlideShow() {
        resetInterval();
        const activeBar = document.querySelector('.step-bar.active');
        if (activeBar) {
            activeBar.style.animationPlayState = 'running';
        }
    }

    // Navegação por Clique
    nextArea.addEventListener('click', nextSlide);
    prevArea.addEventListener('click', prevSlide);

    // Efeito de Fogos de Artifício
    let fireworkInterval;
    function startFireworks() {
        const container = document.querySelector('.fireworks-container');
        if (!container) return;

        fireworkInterval = setInterval(() => {
            createFirework(container);
        }, 400);
    }

    function stopFireworks() {
        clearInterval(fireworkInterval);
        const container = document.querySelector('.fireworks-container');
        if (container) container.innerHTML = '';
    }

    function createFirework(container) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        firework.style.left = x + '%';
        firework.style.top = y + '%';
        firework.style.backgroundColor = color;
        firework.style.boxShadow = `0 0 20px ${color}`;
        
        container.appendChild(firework);
        
        // Criar partículas da explosão
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.backgroundColor = color;
            
            const angle = (i / 20) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');
            
            firework.appendChild(particle);
        }
        
        setTimeout(() => firework.remove(), 1000);
    }

    // Efeito de Corações Flutuantes (Slide Final)
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's';
        heart.style.opacity = Math.random();
        heart.style.fontSize = Math.random() * 30 + 20 + 'px';
        
        const container = document.querySelector('.heart-explosion');
        if (container) {
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }
    }

    setInterval(() => {
        const lastSlide = slides[slides.length - 1];
        if (lastSlide && lastSlide.classList.contains('active')) {
            createHeart();
        }
    }, 200);

    // Suporte a teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === ' ') {
            e.preventDefault();
            playPauseBtn.click();
        }
    });
});

// Adicionar estilos dinâmicos para fogos e corações
const style = document.createElement('style');
style.innerHTML = `
    .firework {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        animation: explode 1s ease-out forwards;
    }
    @keyframes explode {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(20); opacity: 0; }
    }
    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        animation: particleMove 1s ease-out forwards;
    }
    @keyframes particleMove {
        to {
            transform: translate(var(--vx), var(--vy));
            opacity: 0;
        }
    }
    .floating-heart {
        position: fixed;
        bottom: -50px;
        color: #ff4d6d;
        z-index: 15;
        animation: floatUp linear forwards;
        pointer-events: none;
        text-shadow: 0 0 10px rgba(255, 77, 109, 0.5);
    }
    @keyframes floatUp {
        to {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
        }
    }
    .heart-explosion {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

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
        createConfetti();
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
            // Voltar ao início e continuar
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

    // Efeito de corações flutuantes no último slide
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's';
        heart.style.opacity = Math.random();
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        
        const container = document.querySelector('.floating-hearts');
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
    }, 300);

    // Efeito de Confete
    function createConfetti() {
        const confettiContainer = document.querySelector('.confetti-animation');
        if (!confettiContainer) return;

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = Math.random() > 0.5 ? '#ff69b4' : '#ffd700';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confettiContainer.appendChild(confetti);
        }
    }

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

// Adicionar estilos para corações flutuantes e confete dinamicamente
const style = document.createElement('style');
style.innerHTML = `
    .floating-heart {
        position: fixed;
        bottom: -20px;
        color: #ff69b4;
        z-index: 5;
        animation: floatUp linear forwards;
        pointer-events: none;
    }
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    .floating-hearts {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    }
    .confetti-piece {
        position: absolute;
        width: 10px;
        height: 10px;
        top: -10px;
        animation: confettiFall 3s linear forwards;
    }
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

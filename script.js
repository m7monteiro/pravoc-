document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const startOverlay = document.getElementById('start-overlay');
    const bgMusic = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const musicProgress = document.getElementById('music-progress');
    const slides = document.querySelectorAll('.slide');
    const stepBars = document.querySelectorAll('.step-bar');
    const nextArea = document.getElementById('next-area');
    const prevArea = document.getElementById('prev-area');

    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 segundos por slide

    // Iniciar Experiência
    startBtn.addEventListener('click', () => {
        startOverlay.classList.add('hidden');
        bgMusic.play();
        updatePlayPauseIcon(true);
        startSlideShow();
    });

    // Controle de Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            updatePlayPauseIcon(true);
            resumeSlideShow();
        } else {
            bgMusic.pause();
            updatePlayPauseIcon(false);
            pauseSlideShow();
        }
    });

    function updatePlayPauseIcon(isPlaying) {
        const icon = playPauseBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    // Atualizar Barra de Progresso da Música
    bgMusic.addEventListener('timeupdate', () => {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        musicProgress.style.width = `${progress}%`;
    });

    // Lógica de Slideshow
    function startSlideShow() {
        showSlide(currentSlide);
        resetInterval();
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        stepBars.forEach((bar, i) => {
            bar.classList.remove('active', 'completed');
            if (i < index) bar.classList.add('completed');
        });

        slides[index].classList.add('active');
        stepBars[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
            resetInterval();
        } else {
            // Reiniciar ou parar no último
            pauseSlideShow();
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
        slideInterval = setInterval(nextSlide, slideDuration);
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
        if (slides[4].classList.contains('active')) {
            createHeart();
        }
    }, 300);
});

// Adicionar estilo para corações flutuantes dinamicamente
const style = document.createElement('style');
style.innerHTML = `
    .floating-heart {
        position: absolute;
        bottom: -20px;
        color: #ff4d6d;
        z-index: 5;
        animation: floatUp linear forwards;
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
`;
document.head.appendChild(style);

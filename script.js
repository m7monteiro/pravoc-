/* ============================================================
   SCRIPT PRINCIPAL - ANIVERSÁRIO 21 ANOS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Elementos ---- */
    const startBtn       = document.getElementById('start-btn');
    const startOverlay   = document.getElementById('start-overlay');
    const bgMusic        = document.getElementById('bg-music');
    const playPauseBtn   = document.getElementById('play-pause-btn');
    const musicProgress  = document.getElementById('music-progress');
    const albumArt       = document.getElementById('album-art');
    const slides         = document.querySelectorAll('.slide');
    const nextArea       = document.getElementById('next-area');
    const prevArea       = document.getElementById('prev-area');
    const progressStepsContainer = document.getElementById('progress-steps');

    let currentSlide  = 0;
    let slideInterval = null;
    const slideDuration = 6000;
    let isPlaying = false;

    /* ============================================================
       PARTÍCULAS DO OVERLAY
       ============================================================ */
    const pCanvas = document.getElementById('particles-canvas');
    const pCtx    = pCanvas.getContext('2d');
    let particles  = [];

    function resizeParticles() {
        pCanvas.width  = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x    = Math.random() * pCanvas.width;
            this.y    = Math.random() * pCanvas.height;
            this.r    = Math.random() * 2 + 0.5;
            this.vx   = (Math.random() - 0.5) * 0.4;
            this.vy   = (Math.random() - 0.5) * 0.4;
            this.life = Math.random();
            this.hue  = Math.random() * 60 + 300; // rosa/roxo
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life += 0.005;
            if (this.x < 0 || this.x > pCanvas.width || this.y < 0 || this.y > pCanvas.height) this.reset();
        }
        draw() {
            const alpha = Math.sin(this.life * Math.PI) * 0.8;
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            pCtx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
            pCtx.fill();
        }
    }

    for (let i = 0; i < 180; i++) particles.push(new Particle());

    function animParticles() {
        if (!startOverlay.classList.contains('hidden')) {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            // Linhas de conexão
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 80) {
                        pCtx.beginPath();
                        pCtx.moveTo(particles[i].x, particles[i].y);
                        pCtx.lineTo(particles[j].x, particles[j].y);
                        pCtx.strokeStyle = `rgba(255, 100, 200, ${0.15 * (1 - dist/80)})`;
                        pCtx.lineWidth = 0.5;
                        pCtx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(animParticles);
    }
    animParticles();

    /* ============================================================
       INICIAR EXPERIÊNCIA
       ============================================================ */
    startBtn.addEventListener('click', () => {
        startOverlay.classList.add('hidden');
        createProgressBars();
        bgMusic.play().catch(() => {});
        isPlaying = true;
        updatePlayPauseIcon(true);
        albumArt.classList.add('spinning');
        startSlideShow();
    });

    /* ============================================================
       PLAYER
       ============================================================ */
    playPauseBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            isPlaying = true;
            updatePlayPauseIcon(true);
            albumArt.classList.add('spinning');
            resumeSlideShow();
        } else {
            bgMusic.pause();
            isPlaying = false;
            updatePlayPauseIcon(false);
            albumArt.classList.remove('spinning');
            pauseSlideShow();
        }
    });

    function updatePlayPauseIcon(playing) {
        playPauseBtn.querySelector('i').className = playing ? 'fas fa-pause' : 'fas fa-play';
    }

    bgMusic.addEventListener('timeupdate', () => {
        if (bgMusic.duration) {
            const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
            musicProgress.style.width = pct + '%';
        }
    });

    /* ============================================================
       SLIDESHOW
       ============================================================ */
    function createProgressBars() {
        progressStepsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const bar = document.createElement('div');
            bar.className = 'step-bar' + (i === 0 ? ' active' : '');
            progressStepsContainer.appendChild(bar);
        });
    }

    function startSlideShow() {
        showSlide(0);
        resetInterval();
    }

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        const bars = document.querySelectorAll('.step-bar');
        bars.forEach((b, i) => {
            b.classList.remove('active', 'completed');
            if (i < index) b.classList.add('completed');
        });

        slides[index].classList.add('active');
        if (bars[index]) bars[index].classList.add('active');
        currentSlide = index;

        // Re-trigger animation
        const content = slides[index].querySelector('.content');
        if (content) {
            content.style.animation = 'none';
            void content.offsetWidth;
            content.style.animation = '';
        }

        // Iniciar canvas do slide ativo
        startSlideCanvas(index);

        // Contador cyberpunk no slide 5
        if (index === 4) startCounters();

        // Fogos no slide 9
        if (index === slides.length - 1) {
            startFireworksCanvas();
            startHearts();
        } else {
            stopFireworksCanvas();
        }
    }

    function nextSlide() {
        showSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0);
        resetInterval();
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
            resetInterval();
        }
    }

    function resetInterval() {
        clearInterval(slideInterval);
        if (isPlaying) slideInterval = setInterval(nextSlide, slideDuration);
    }

    function pauseSlideShow() {
        clearInterval(slideInterval);
        const activeBar = document.querySelector('.step-bar.active');
        if (activeBar) activeBar.style.animationPlayState = 'paused';
    }

    function resumeSlideShow() {
        resetInterval();
        const activeBar = document.querySelector('.step-bar.active');
        if (activeBar) activeBar.style.animationPlayState = 'running';
    }

    nextArea.addEventListener('click', nextSlide);
    prevArea.addEventListener('click', prevSlide);

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft')  prevSlide();
        if (e.key === ' ') { e.preventDefault(); playPauseBtn.click(); }
    });

    /* ============================================================
       CANVAS SLIDE 1: GALÁXIA
       ============================================================ */
    const galaxyCanvas = document.getElementById('galaxy-canvas');
    const gCtx = galaxyCanvas.getContext('2d');
    let galaxyStars = [];
    let galaxyRAF;

    function initGalaxy() {
        galaxyCanvas.width  = galaxyCanvas.offsetWidth;
        galaxyCanvas.height = galaxyCanvas.offsetHeight;
        galaxyStars = [];
        for (let i = 0; i < 300; i++) {
            galaxyStars.push({
                x: Math.random() * galaxyCanvas.width,
                y: Math.random() * galaxyCanvas.height,
                r: Math.random() * 1.8 + 0.2,
                speed: Math.random() * 0.3 + 0.05,
                hue: Math.random() * 60 + 200,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.05 + 0.01
            });
        }
    }

    function animGalaxy() {
        if (!slides[0].classList.contains('active')) return;
        gCtx.fillStyle = 'rgba(2, 0, 15, 0.15)';
        gCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

        galaxyStars.forEach(s => {
            s.twinkle += s.twinkleSpeed;
            const alpha = 0.4 + Math.sin(s.twinkle) * 0.6;
            const size  = s.r * (0.8 + Math.sin(s.twinkle) * 0.4);
            gCtx.beginPath();
            gCtx.arc(s.x, s.y, size, 0, Math.PI * 2);
            gCtx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${alpha})`;
            gCtx.fill();
            s.y += s.speed;
            if (s.y > galaxyCanvas.height) { s.y = 0; s.x = Math.random() * galaxyCanvas.width; }
        });

        // Nebulosa
        const time = Date.now() * 0.0003;
        const grad = gCtx.createRadialGradient(
            galaxyCanvas.width * 0.5 + Math.sin(time) * 80,
            galaxyCanvas.height * 0.5 + Math.cos(time * 0.7) * 60,
            0,
            galaxyCanvas.width * 0.5, galaxyCanvas.height * 0.5, galaxyCanvas.width * 0.6
        );
        grad.addColorStop(0, 'rgba(120, 0, 200, 0.06)');
        grad.addColorStop(0.5, 'rgba(0, 50, 200, 0.04)');
        grad.addColorStop(1, 'transparent');
        gCtx.fillStyle = grad;
        gCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

        galaxyRAF = requestAnimationFrame(animGalaxy);
    }

    /* ============================================================
       CANVAS SLIDE 3: AURORA BOREAL
       ============================================================ */
    const auroraCanvas = document.getElementById('aurora-canvas');
    const aCtx = auroraCanvas.getContext('2d');
    let auroraRAF;

    function initAurora() {
        auroraCanvas.width  = auroraCanvas.offsetWidth;
        auroraCanvas.height = auroraCanvas.offsetHeight;
    }

    function animAurora() {
        if (!slides[2].classList.contains('active')) return;
        const t = Date.now() * 0.0005;
        aCtx.fillStyle = 'rgba(0, 5, 15, 0.2)';
        aCtx.fillRect(0, 0, auroraCanvas.width, auroraCanvas.height);

        const colors = [
            [0, 255, 150],
            [0, 200, 255],
            [150, 0, 255],
            [255, 0, 150]
        ];

        for (let c = 0; c < 4; c++) {
            const [r, g, b] = colors[c];
            const offset = c * 1.2;
            aCtx.beginPath();
            aCtx.moveTo(0, auroraCanvas.height * 0.3);
            for (let x = 0; x <= auroraCanvas.width; x += 8) {
                const y = auroraCanvas.height * 0.3
                    + Math.sin(x * 0.008 + t + offset) * 80
                    + Math.sin(x * 0.015 + t * 1.5 + offset) * 40
                    + Math.cos(x * 0.005 + t * 0.8 + offset) * 60;
                aCtx.lineTo(x, y);
            }
            aCtx.lineTo(auroraCanvas.width, 0);
            aCtx.lineTo(0, 0);
            aCtx.closePath();
            const grad = aCtx.createLinearGradient(0, 0, 0, auroraCanvas.height * 0.5);
            grad.addColorStop(0, `rgba(${r},${g},${b},0.0)`);
            grad.addColorStop(0.5, `rgba(${r},${g},${b},0.12)`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
            aCtx.fillStyle = grad;
            aCtx.fill();
        }
        auroraRAF = requestAnimationFrame(animAurora);
    }

    /* ============================================================
       CANVAS SLIDE 4: BOLHAS
       ============================================================ */
    const bubblesCanvas = document.getElementById('bubbles-canvas');
    const bCtx = bubblesCanvas.getContext('2d');
    let bubbles = [];
    let bubblesRAF;

    function initBubbles() {
        bubblesCanvas.width  = bubblesCanvas.offsetWidth;
        bubblesCanvas.height = bubblesCanvas.offsetHeight;
        bubbles = [];
        for (let i = 0; i < 40; i++) {
            bubbles.push({
                x: Math.random() * bubblesCanvas.width,
                y: Math.random() * bubblesCanvas.height,
                r: Math.random() * 60 + 20,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                hue: Math.random() * 80 + 260,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function animBubbles() {
        if (!slides[3].classList.contains('active')) return;
        bCtx.fillStyle = 'rgba(10, 0, 30, 0.15)';
        bCtx.fillRect(0, 0, bubblesCanvas.width, bubblesCanvas.height);

        const t = Date.now() * 0.001;
        bubbles.forEach(b => {
            b.x += b.vx + Math.sin(t + b.phase) * 0.3;
            b.y += b.vy + Math.cos(t * 0.7 + b.phase) * 0.3;
            if (b.x < -b.r) b.x = bubblesCanvas.width + b.r;
            if (b.x > bubblesCanvas.width + b.r) b.x = -b.r;
            if (b.y < -b.r) b.y = bubblesCanvas.height + b.r;
            if (b.y > bubblesCanvas.height + b.r) b.y = -b.r;

            const grad = bCtx.createRadialGradient(b.x - b.r*0.3, b.y - b.r*0.3, 0, b.x, b.y, b.r);
            grad.addColorStop(0, `hsla(${b.hue}, 80%, 80%, 0.12)`);
            grad.addColorStop(0.6, `hsla(${b.hue}, 80%, 60%, 0.06)`);
            grad.addColorStop(1, `hsla(${b.hue}, 80%, 40%, 0.0)`);
            bCtx.beginPath();
            bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            bCtx.fillStyle = grad;
            bCtx.fill();

            // Borda
            bCtx.beginPath();
            bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            bCtx.strokeStyle = `hsla(${b.hue}, 80%, 80%, 0.08)`;
            bCtx.lineWidth = 1;
            bCtx.stroke();
        });
        bubblesRAF = requestAnimationFrame(animBubbles);
    }

    /* ============================================================
       CANVAS SLIDE 5: GRADE CYBERPUNK
       ============================================================ */
    const gridCanvas = document.getElementById('grid-canvas');
    const grCtx = gridCanvas.getContext('2d');
    let gridRAF;

    function initGrid() {
        gridCanvas.width  = gridCanvas.offsetWidth;
        gridCanvas.height = gridCanvas.offsetHeight;
    }

    function animGrid() {
        if (!slides[4].classList.contains('active')) return;
        grCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        const t = Date.now() * 0.001;
        const spacing = 50;
        const vanishX = gridCanvas.width / 2;
        const vanishY = gridCanvas.height * 0.5;
        const offset  = (t * 30) % spacing;

        grCtx.strokeStyle = 'rgba(0, 245, 255, 0.08)';
        grCtx.lineWidth = 1;

        // Linhas horizontais em perspectiva
        for (let y = vanishY; y < gridCanvas.height + spacing; y += spacing) {
            const yOff = y + offset;
            if (yOff > gridCanvas.height) continue;
            const progress = (yOff - vanishY) / (gridCanvas.height - vanishY);
            grCtx.globalAlpha = progress * 0.4;
            grCtx.beginPath();
            grCtx.moveTo(0, yOff);
            grCtx.lineTo(gridCanvas.width, yOff);
            grCtx.stroke();
        }

        // Linhas verticais em perspectiva
        for (let i = -10; i <= 20; i++) {
            const xBase = vanishX + i * spacing;
            grCtx.globalAlpha = 0.15;
            grCtx.beginPath();
            grCtx.moveTo(vanishX, vanishY);
            grCtx.lineTo(xBase, gridCanvas.height);
            grCtx.stroke();
        }

        grCtx.globalAlpha = 1;
        gridRAF = requestAnimationFrame(animGrid);
    }

    /* ============================================================
       CANVAS SLIDE 6: ONDAS
       ============================================================ */
    const wavesCanvas = document.getElementById('waves-canvas');
    const wCtx = wavesCanvas.getContext('2d');
    let wavesRAF;

    function initWaves() {
        wavesCanvas.width  = wavesCanvas.offsetWidth;
        wavesCanvas.height = wavesCanvas.offsetHeight;
    }

    function animWaves() {
        if (!slides[5].classList.contains('active')) return;
        wCtx.fillStyle = 'rgba(10, 0, 30, 0.2)';
        wCtx.fillRect(0, 0, wavesCanvas.width, wavesCanvas.height);

        const t = Date.now() * 0.001;
        const waveColors = [
            { h: 310, s: 100, l: 60 },
            { h: 280, s: 80, l: 55 },
            { h: 340, s: 90, l: 65 },
            { h: 260, s: 70, l: 60 }
        ];

        waveColors.forEach((col, i) => {
            wCtx.beginPath();
            wCtx.moveTo(0, wavesCanvas.height);
            for (let x = 0; x <= wavesCanvas.width; x += 5) {
                const y = wavesCanvas.height * 0.5
                    + Math.sin(x * 0.01 + t + i * 0.8) * (60 + i * 20)
                    + Math.cos(x * 0.007 + t * 1.3 + i) * (30 + i * 10);
                wCtx.lineTo(x, y);
            }
            wCtx.lineTo(wavesCanvas.width, wavesCanvas.height);
            wCtx.closePath();
            const grad = wCtx.createLinearGradient(0, 0, 0, wavesCanvas.height);
            grad.addColorStop(0, `hsla(${col.h},${col.s}%,${col.l}%,0.0)`);
            grad.addColorStop(0.5, `hsla(${col.h},${col.s}%,${col.l}%,0.12)`);
            grad.addColorStop(1, `hsla(${col.h},${col.s}%,${col.l}%,0.0)`);
            wCtx.fillStyle = grad;
            wCtx.fill();
        });
        wavesRAF = requestAnimationFrame(animWaves);
    }

    /* ============================================================
       CANVAS SLIDE 7: CONFETES 3D
       ============================================================ */
    const confettiCanvas = document.getElementById('confetti-canvas');
    const cCtx = confettiCanvas.getContext('2d');
    let confettiPieces = [];
    let confettiRAF;

    function initConfetti() {
        confettiCanvas.width  = confettiCanvas.offsetWidth;
        confettiCanvas.height = confettiCanvas.offsetHeight;
        confettiPieces = [];
        const colors = ['#ff4d8d','#ffd700','#00f5ff','#ff8c42','#a855f7','#22d3ee','#f472b6'];
        for (let i = 0; i < 120; i++) {
            confettiPieces.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height - confettiCanvas.height,
                w: Math.random() * 10 + 6,
                h: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 2 + 1,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.15,
                swing: Math.random() * 0.05 + 0.01,
                swingOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }

    function animConfetti() {
        if (!slides[6].classList.contains('active')) return;
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        const t = Date.now() * 0.001;

        confettiPieces.forEach(p => {
            p.y += p.speed;
            p.angle += p.spin;
            p.x += Math.sin(t * p.swing + p.swingOffset) * 1.5;
            if (p.y > confettiCanvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * confettiCanvas.width;
            }
            cCtx.save();
            cCtx.translate(p.x, p.y);
            cCtx.rotate(p.angle);
            cCtx.globalAlpha = p.opacity;
            cCtx.fillStyle = p.color;
            // Forma 3D (elipse achatada)
            cCtx.beginPath();
            cCtx.ellipse(0, 0, p.w/2, p.h/2 * Math.abs(Math.cos(p.angle)), 0, 0, Math.PI*2);
            cCtx.fill();
            cCtx.restore();
        });
        confettiRAF = requestAnimationFrame(animConfetti);
    }

    /* ============================================================
       CANVAS SLIDE 8: PÉTALAS
       ============================================================ */
    const petalsCanvas = document.getElementById('petals-canvas');
    const ptCtx = petalsCanvas.getContext('2d');
    let petalsList = [];
    let petalsRAF;

    function initPetals() {
        petalsCanvas.width  = petalsCanvas.offsetWidth;
        petalsCanvas.height = petalsCanvas.offsetHeight;
        petalsList = [];
        for (let i = 0; i < 60; i++) {
            petalsList.push({
                x: Math.random() * petalsCanvas.width,
                y: Math.random() * petalsCanvas.height,
                r: Math.random() * 12 + 6,
                speed: Math.random() * 1.5 + 0.5,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.04,
                swing: Math.random() * 0.03 + 0.01,
                swingOffset: Math.random() * Math.PI * 2,
                hue: Math.random() * 30 + 330,
                opacity: Math.random() * 0.4 + 0.2
            });
        }
    }

    function drawPetal(ctx, x, y, r, angle, hue, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.bezierCurveTo(r * 0.8, -r * 0.5, r * 0.8, r * 0.5, 0, r);
        ctx.bezierCurveTo(-r * 0.8, r * 0.5, -r * 0.8, -r * 0.5, 0, -r);
        const grad = ctx.createRadialGradient(0, -r*0.3, 0, 0, 0, r);
        grad.addColorStop(0, `hsla(${hue}, 90%, 90%, 1)`);
        grad.addColorStop(1, `hsla(${hue}, 80%, 65%, 0.5)`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }

    function animPetals() {
        if (!slides[7].classList.contains('active')) return;
        ptCtx.fillStyle = 'rgba(15, 0, 20, 0.15)';
        ptCtx.fillRect(0, 0, petalsCanvas.width, petalsCanvas.height);
        const t = Date.now() * 0.001;

        petalsList.forEach(p => {
            p.y += p.speed;
            p.angle += p.spin;
            p.x += Math.sin(t * p.swing + p.swingOffset) * 1.2;
            if (p.y > petalsCanvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * petalsCanvas.width;
            }
            drawPetal(ptCtx, p.x, p.y, p.r, p.angle, p.hue, p.opacity);
        });
        petalsRAF = requestAnimationFrame(animPetals);
    }

    /* ============================================================
       CANVAS SLIDE 9: FOGOS DE ARTIFÍCIO
       ============================================================ */
    const fwCanvas = document.getElementById('fireworks-canvas');
    const fwCtx = fwCanvas.getContext('2d');
    let fwRockets = [];
    let fwParticles = [];
    let fwRAF;
    let fwRunning = false;

    function initFireworksCanvas() {
        fwCanvas.width  = fwCanvas.offsetWidth;
        fwCanvas.height = fwCanvas.offsetHeight;
    }

    class Rocket {
        constructor() {
            this.x = Math.random() * fwCanvas.width;
            this.y = fwCanvas.height;
            this.tx = Math.random() * fwCanvas.width;
            this.ty = Math.random() * fwCanvas.height * 0.5 + fwCanvas.height * 0.1;
            const angle = Math.atan2(this.ty - this.y, this.tx - this.x);
            const speed = 8 + Math.random() * 4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.hue = Math.random() * 360;
            this.trail = [];
        }
        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 8) this.trail.shift();
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1; // gravidade
            const dx = this.tx - this.x;
            const dy = this.ty - this.y;
            if (Math.sqrt(dx*dx + dy*dy) < 15 || this.y < this.ty) return true;
            return false;
        }
        draw() {
            this.trail.forEach((p, i) => {
                const alpha = i / this.trail.length;
                fwCtx.beginPath();
                fwCtx.arc(p.x, p.y, 2 * alpha, 0, Math.PI * 2);
                fwCtx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha * 0.6})`;
                fwCtx.fill();
            });
        }
        explode() {
            const count = 80 + Math.floor(Math.random() * 60);
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                fwParticles.push(new FWParticle(this.x, this.y, this.hue, angle, speed));
            }
        }
    }

    class FWParticle {
        constructor(x, y, hue, angle, speed) {
            this.x = x; this.y = y;
            this.hue = hue + (Math.random() - 0.5) * 30;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.r = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.08;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.life -= this.decay;
        }
        draw() {
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, this.r * this.life, 0, Math.PI * 2);
            fwCtx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.life})`;
            fwCtx.fill();
        }
    }

    let fwLaunchTimer = 0;

    function animFireworks() {
        if (!fwRunning) return;
        fwCtx.fillStyle = 'rgba(0, 0, 5, 0.18)';
        fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

        fwLaunchTimer++;
        if (fwLaunchTimer % 40 === 0) {
            fwRockets.push(new Rocket());
        }

        fwRockets = fwRockets.filter(r => {
            r.draw();
            const done = r.update();
            if (done) { r.explode(); return false; }
            return true;
        });

        fwParticles = fwParticles.filter(p => {
            p.draw();
            p.update();
            return p.life > 0;
        });

        fwRAF = requestAnimationFrame(animFireworks);
    }

    function startFireworksCanvas() {
        if (fwRunning) return;
        initFireworksCanvas();
        fwRunning = true;
        fwRockets = [];
        fwParticles = [];
        fwLaunchTimer = 0;
        animFireworks();
    }

    function stopFireworksCanvas() {
        fwRunning = false;
        cancelAnimationFrame(fwRAF);
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    }

    /* ============================================================
       CORAÇÕES FLUTUANTES (SLIDE 9)
       ============================================================ */
    let heartInterval;

    function startHearts() {
        clearInterval(heartInterval);
        heartInterval = setInterval(() => {
            if (!slides[slides.length - 1].classList.contains('active')) return;
            const heart = document.createElement('div');
            heart.style.cssText = `
                position: absolute;
                bottom: -50px;
                left: ${Math.random() * 100}%;
                font-size: ${Math.random() * 24 + 16}px;
                pointer-events: none;
                z-index: 15;
                animation: floatHeart ${Math.random() * 3 + 4}s ease-out forwards;
                opacity: ${Math.random() * 0.5 + 0.5};
            `;
            heart.innerHTML = Math.random() > 0.5 ? '❤️' : '💕';
            document.querySelector('.heart-explosion').appendChild(heart);
            setTimeout(() => heart.remove(), 7000);
        }, 250);
    }

    /* ============================================================
       CONTADOR ANIMADO (SLIDE 5)
       ============================================================ */
    function startCounters() {
        document.querySelectorAll('.counter').forEach(el => {
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current.toLocaleString('pt-BR');
                if (current >= target) clearInterval(timer);
            }, 30);
        });
    }

    /* ============================================================
       INICIAR CANVAS DO SLIDE ATIVO
       ============================================================ */
    const canvasInits = [
        () => { initGalaxy(); animGalaxy(); },
        null,
        () => { initAurora(); animAurora(); },
        () => { initBubbles(); animBubbles(); },
        () => { initGrid(); animGrid(); },
        () => { initWaves(); animWaves(); },
        () => { initConfetti(); animConfetti(); },
        () => { initPetals(); animPetals(); },
        null
    ];

    function startSlideCanvas(index) {
        if (canvasInits[index]) canvasInits[index]();
    }

    /* ============================================================
       RESIZE
       ============================================================ */
    window.addEventListener('resize', () => {
        if (slides[0].classList.contains('active'))  initGalaxy();
        if (slides[2].classList.contains('active'))  initAurora();
        if (slides[3].classList.contains('active'))  initBubbles();
        if (slides[4].classList.contains('active'))  initGrid();
        if (slides[5].classList.contains('active'))  initWaves();
        if (slides[6].classList.contains('active'))  initConfetti();
        if (slides[7].classList.contains('active'))  initPetals();
        if (slides[8].classList.contains('active'))  initFireworksCanvas();
    });

    /* ============================================================
       ESTILOS DINÂMICOS
       ============================================================ */
    const dynStyle = document.createElement('style');
    dynStyle.innerHTML = `
        @keyframes floatHeart {
            0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
            100% { transform: translateY(-110vh) rotate(${Math.random() > 0.5 ? '' : '-'}360deg) scale(0.5); opacity: 0; }
        }
    `;
    document.head.appendChild(dynStyle);

    /* ============================================================
       SVG DEFS PARA GRADIENTE DO ANEL
       ============================================================ */
    const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.setAttribute('class', 'svg-defs');
    svgDefs.innerHTML = `
        <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff4d8d"/>
                <stop offset="100%" stop-color="#ffd700"/>
            </linearGradient>
        </defs>
    `;
    document.body.appendChild(svgDefs);

    /* ============================================================
       BOTÃO COMPARTILHAR
       ============================================================ */
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const text = '🎉 Feliz Aniversário! 21 anos de uma pessoa incrível! 🎂❤️';
            if (navigator.share) {
                navigator.share({ text });
            } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }
        });
    }

});

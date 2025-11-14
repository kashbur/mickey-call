// sparkles.js
(function (global) {
  const MagicSparkles = (() => {
    let canvas, ctx;
    let width = 0;
    let height = 0;
    let particles = [];
    let running = false;

    const defaults = {
      maxParticles: 150,
      hueMin: 35,   // warm gold range
      hueMax: 55,
      sizeMin: 2,
      sizeMax: 6,
      decayMin: 0.015,
      decayMax: 0.03
    };

    let config = { ...defaults };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = rand(config.sizeMin, config.sizeMax);
        this.speedX = rand(-1.2, 1.2);
        this.speedY = rand(-1.2, 1.2);
        this.life = 1;
        this.decay = rand(config.decayMin, config.decayMax);
        this.hue = rand(config.hueMin, config.hueMax);
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        if (this.size > 0.05) {
          this.size -= 0.05;
        }
      }

      draw(ctx) {
        if (this.life <= 0 || this.size <= 0.05) return;
        const alpha = Math.max(this.life, 0);
        const radius = this.size * 4;

        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, radius
        );

        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 90%, ${alpha})`);
        gradient.addColorStop(0.3, `hsla(${this.hue}, 100%, 70%, ${alpha * 0.9})`);
        gradient.addColorStop(0.7, `hsla(${this.hue}, 90%, 50%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 90%, 40%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // tiny bright core
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.hue}, 100%, 95%, ${alpha})`;
        ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function burst(x, y, count = 5) {
      if (!canvas) return;
      for (let i = 0; i < count; i++) {
        if (particles.length >= config.maxParticles) break;
        particles.push(new Particle(x, y));
      }
    }

    function step() {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0 || p.size <= 0.05) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(step);
    }

    function init(selector = "#canvas1", options = {}) {
      canvas = typeof selector === "string" ? document.querySelector(selector) : selector;
      if (!canvas) {
        console.warn("MagicSparkles: canvas not found for selector", selector);
        return;
      }
      ctx = canvas.getContext("2d");
      config = { ...defaults, ...options };

      resize();
      window.addEventListener("resize", resize);

      if (!running) {
        running = true;
        requestAnimationFrame(step);
      }
    }

    function start() {
      if (!running) {
        running = true;
        requestAnimationFrame(step);
      }
    }

    function stop() {
      running = false;
    }

    function setConfig(options = {}) {
      config = { ...config, ...options };
    }

    return { init, burst, start, stop, setConfig, resize };
  })();

  // Expose globally for simple <script> usage
  global.MagicSparkles = MagicSparkles;
})(window);

// main.js
document.addEventListener("DOMContentLoaded", () => {
  // Initialize sparkles on your full-screen canvas
  MagicSparkles.init("#canvas1", {
    maxParticles: 140,
    hueMin: 40,  // gold range tweakable per project
    hueMax: 55
  });

  // Example 1: mouse trail sparkles
  document.addEventListener("mousemove", (e) => {
    MagicSparkles.burst(e.clientX, e.clientY, 5);
  });

  // Example 2: gentle ambient sparkles around center/bottom
  setInterval(() => {
    const x = window.innerWidth / 2;
    const y = window.innerHeight * 0.75;
    MagicSparkles.burst(x, y, 2);
  }, 150);
});

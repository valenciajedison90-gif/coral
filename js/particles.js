// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// ==========================================================================

// Sistema ligero de partículas para efectos visuales (polvo, chispas, confeti)
class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  // Genera n partículas con parámetros aleatorios
  spawn(config) {
    const count = config.count || 8;
    for (let i = 0; i < count; i++) {
      const angle = config.angle !== undefined ? config.angle + (Math.random() - 0.5) * (config.spread || 0.5) : Math.random() * Math.PI * 2;
      const speed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);
      const life = config.lifeMin + Math.random() * (config.lifeMax - config.lifeMin);

      this.particles.push({
        x: config.x + (Math.random() - 0.5) * (config.jitterX || 4),
        y: config.y + (Math.random() - 0.5) * (config.jitterY || 4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin),
        color: Array.isArray(config.color) ? config.color[Math.floor(Math.random() * config.color.length)] : config.color,
        gravity: config.gravity || 0,
        alpha: 1,
        life: life,
        maxLife: life,
        shape: config.shape || 'circle'
      });
    }
  }

  // Polvo al saltar o aterrizar
  createDust(x, y) {
    this.spawn({
      x: x,
      y: y,
      count: 6,
      angle: -Math.PI / 2,
      spread: Math.PI * 0.8,
      speedMin: 20,
      speedMax: 60,
      lifeMin: 0.2,
      lifeMax: 0.4,
      sizeMin: 3,
      sizeMax: 6,
      color: ['#e2e8f0', '#cbd5e1', '#94a3b8'],
      gravity: 50,
      jitterX: 8,
      jitterY: 2
    });
  }

  // Destellos dorados al recolectar monedas
  createCoinSparkles(x, y) {
    this.spawn({
      x: x,
      y: y,
      count: 12,
      angle: -Math.PI / 2,
      spread: Math.PI,
      speedMin: 40,
      speedMax: 120,
      lifeMin: 0.3,
      lifeMax: 0.6,
      sizeMin: 3,
      sizeMax: 7,
      color: ['#facc15', '#fef08a', '#fbbf24', '#ffffff'],
      gravity: 100,
      shape: 'star'
    });
  }

  // Explosión de humo al aplastar un enemigo
  createEnemyDefeatPoof(x, y) {
    this.spawn({
      x: x,
      y: y,
      count: 14,
      speedMin: 30,
      speedMax: 90,
      lifeMin: 0.3,
      lifeMax: 0.5,
      sizeMin: 4,
      sizeMax: 9,
      color: ['#ef4444', '#f87171', '#fca5a5', '#ffffff'],
      gravity: 80
    });
  }

  // Confeti de celebración al ganar
  createVictoryConfetti(x, y) {
    this.spawn({
      x: x,
      y: y,
      count: 35,
      angle: -Math.PI / 2,
      spread: Math.PI * 0.9,
      speedMin: 120,
      speedMax: 260,
      lifeMin: 1.0,
      lifeMax: 2.0,
      sizeMin: 4,
      sizeMax: 8,
      color: ['#38bdf8', '#4ade80', '#fbbf24', '#f472b6', '#a855f7', '#f97316'],
      gravity: 150,
      shape: 'rect'
    });
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
    }
  }

  draw(ctx, cameraX, cameraY) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      const drawX = p.x - cameraX;
      const drawY = p.y - cameraY;

      if (p.shape === 'rect') {
        ctx.fillRect(drawX - p.size / 2, drawY - p.size / 2, p.size, p.size * 0.7);
      } else if (p.shape === 'star') {
        // Rombo / estrella simple
        ctx.beginPath();
        ctx.moveTo(drawX, drawY - p.size);
        ctx.lineTo(drawX + p.size * 0.6, drawY);
        ctx.lineTo(drawX, drawY + p.size);
        ctx.lineTo(drawX - p.size * 0.6, drawY);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
  }
}

window.particleSystem = new ParticleSystem();

// © jjedi90 — Todos los derechos reservados.

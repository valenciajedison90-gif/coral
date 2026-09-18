// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/items/Projectile.js — Balitas de Burbuja Mágica (Proyectiles de la Flor de la Vida)
// ==========================================================================

export class BubbleBullet {
  constructor(x, y, dirX, dirY, speed = 460) {
    this.x = x;
    this.y = y;
    this.radius = 14; // Tamaño más generoso y fácil de impactar
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.speed = speed;

    // Si no hay dirección definida, disparar hacia adelante
    const len = Math.hypot(dirX, dirY) || 1;
    this.vx = (dirX / len) * speed;
    this.vy = (dirY / len) * speed;

    this.life = 2.2; // segundos de alcance
    this.maxLife = 2.2;
    this.active = true;
    this.isDead = false;
    this.animTimer = Math.random() * Math.PI * 2;
  }

  update(dt, obstacles = []) {
    if (this.isDead || !this.active) return;

    this.life -= dt;
    if (this.life <= 0) {
      this.isDead = true;
      this.active = false;
      return;
    }

    this.animTimer += dt * 8;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Colisión con obstáculos sólidos (el proyectil estalla al chocar con una roca)
    const box = {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };

    for (const obs of obstacles) {
      if (
        box.x < obs.x + obs.width &&
        box.x + box.width > obs.x &&
        box.y < obs.y + obs.height &&
        box.y + box.height > obs.y
      ) {
        this.isDead = true;
        this.active = false;
        break;
      }
    }
  }

  isCollidingWith(enemy) {
    if (this.isDead || !this.active || enemy.isDead) return false;

    // Colisión circular generosa con tolerancia (+6px) para niños
    const hitRadius = this.radius + 6;
    const closestX = Math.max(enemy.x, Math.min(this.x, enemy.x + enemy.width));
    const closestY = Math.max(enemy.y, Math.min(this.y, enemy.y + enemy.height));

    const dx = this.x - closestX;
    const dy = this.y - closestY;

    return (dx * dx + dy * dy) <= (hitRadius * hitRadius);
  }

  draw(ctx, camera) {
    if (this.isDead) return;
    if (!camera.isVisible(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const pulse = Math.sin(this.animTimer) * 1.5;

    ctx.save();
    ctx.translate(drawX, drawY);

    // 1. Halo resplandeciente exterior
    ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 4 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 2. Esfera de burbuja iridiscente
    const bubGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, this.radius);
    bubGrad.addColorStop(0, '#ffffff');
    bubGrad.addColorStop(0.4, '#fbcfe8');
    bubGrad.addColorStop(0.7, '#67e8f9');
    bubGrad.addColorStop(1, '#f472b6');

    ctx.fillStyle = bubGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + pulse * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Borde brillante de agua
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Destello de flor / estrella interior
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-1.5, -4, 3, 8);
    ctx.fillRect(-4, -1.5, 8, 3);

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

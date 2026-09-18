// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/enemies/Jellyfish.js — Medusa (Movimiento Vertical Sinusoidal y Tentáculos)
// ==========================================================================

import { Enemy } from './Enemy.js';

export class Jellyfish extends Enemy {
  constructor(x, y, rangeY = 120, speed = 40) {
    super(x, y, 36, 44, 1, 'la Medusa');
    this.minY = y - rangeY / 2;
    this.maxY = y + rangeY / 2;
    this.speed = speed;
    this.vy = speed;
  }

  update(dt) {
    super.update(dt);

    this.y += this.vy * dt;

    if (this.y <= this.minY) {
      this.y = this.minY;
      this.vy = Math.abs(this.speed);
    } else if (this.y >= this.maxY) {
      this.y = this.maxY;
      this.vy = -Math.abs(this.speed);
    }
  }

  draw(ctx, camera) {
    if (this.isDead) return;
    if (!camera.isVisible(this.x, this.y, this.width, this.height)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const pulse = Math.sin(this.animTimer * 3) * 3;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);

    // 1. Sombrilla de la medusa (Campana translúcida)
    const bellGrad = ctx.createRadialGradient(0, -6, 2, 0, -6, 16);
    bellGrad.addColorStop(0, 'rgba(236, 72, 153, 0.9)');
    bellGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.6)');
    bellGrad.addColorStop(1, 'rgba(56, 189, 248, 0.3)');

    ctx.fillStyle = bellGrad;
    ctx.beginPath();
    ctx.arc(0, -6 + pulse, 16 + pulse * 0.5, Math.PI, 0);
    ctx.quadraticCurveTo(0, 4 + pulse, -16 - pulse * 0.5, -6 + pulse);
    ctx.closePath();
    ctx.fill();

    // Ojos tiernos en la campana
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5, -6 + pulse, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -6 + pulse, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(-5, -6 + pulse, 1.2, 0, Math.PI * 2);
    ctx.arc(5, -6 + pulse, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Tentáculos flotantes ondulando
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.75)';
    ctx.lineWidth = 1.8;

    for (let i = -10; i <= 10; i += 5) {
      const wave = Math.sin(this.animTimer * 4 + i) * 5;
      ctx.beginPath();
      ctx.moveTo(i, 2 + pulse);
      ctx.quadraticCurveTo(i + wave, 12, i - wave, 22);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/enemies/Crab.js — Cangrejo Travieso (Patrulla en el Lecho Marino)
// ==========================================================================

import { Enemy } from './Enemy.js';

export class Crab extends Enemy {
  constructor(x, y, patrolDistance = 140, speed = 50) {
    super(x, y, 42, 28, 1, 'el Cangrejo Travieso');
    this.minX = x - patrolDistance / 2;
    this.maxX = x + patrolDistance / 2;
    this.speed = speed;
    this.vx = speed;
  }

  update(dt) {
    super.update(dt);

    this.x += this.vx * dt;

    if (this.x <= this.minX) {
      this.x = this.minX;
      this.vx = Math.abs(this.speed);
      this.facing = 1;
    } else if (this.x >= this.maxX) {
      this.x = this.maxX;
      this.vx = -Math.abs(this.speed);
      this.facing = -1;
    }
  }

  draw(ctx, camera) {
    if (this.isDead) return;
    if (!camera.isVisible(this.x, this.y, this.width, this.height)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const pincerOpen = Math.sin(this.animTimer * 4) * 3;
    const legWiggle = Math.sin(this.animTimer * 6) * 3;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
    ctx.scale(this.facing, 1);

    // Patitas inferiores
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-14, 6 + legWiggle, 4, 8);
    ctx.fillRect(-6, 6 - legWiggle, 4, 8);
    ctx.fillRect(6, 6 + legWiggle, 4, 8);
    ctx.fillRect(14, 6 - legWiggle, 4, 8);

    // Cuerpo redondo de cangrejo
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ojos saltones amigables
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-6, -10, 4.5, 0, Math.PI * 2);
    ctx.arc(6, -10, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-5, -10, 2, 0, Math.PI * 2);
    ctx.arc(7, -10, 2, 0, Math.PI * 2);
    ctx.fill();

    // Pinzas animadas abriéndose y cerrándose
    // Pinza izquierda
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(-18, -2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(-20, -2);
    ctx.lineTo(-26, -5 - pincerOpen);
    ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fill();

    // Pinza derecha
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(18, -2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(20, -2);
    ctx.lineTo(26, -5 - pincerOpen);
    ctx.lineTo(24, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

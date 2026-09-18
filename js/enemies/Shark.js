// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/enemies/Shark.js — Tiburón Guardián (Patrulla Rápida de 2 Corazones)
// ==========================================================================

import { Enemy } from './Enemy.js';

export class Shark extends Enemy {
  constructor(x, y, patrolDistance = 260, speed = 85) {
    super(x, y, 70, 32, 2, 'el Tiburón Guardián');
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

    const tailWag = Math.sin(this.animTimer * 6) * 4;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
    ctx.scale(this.facing, 1);

    // Aleta dorsal superior
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(8, -24);
    ctx.lineTo(14, -10);
    ctx.closePath();
    ctx.fill();

    // Cola y aleta caudal trasera
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-38, -14 + tailWag);
    ctx.lineTo(-30, 0);
    ctx.lineTo(-38, 14 + tailWag);
    ctx.closePath();
    ctx.fill();

    // Cuerpo aerodinámico del tiburón
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vientre blanco claro
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(2, 6, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ojo y branquias
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(18, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(19, -4, 1, 0, Math.PI * 2);
    ctx.fill();

    // Hendiduras branquiales
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    for (let i = 4; i <= 12; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, -4);
      ctx.lineTo(i - 2, 4);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

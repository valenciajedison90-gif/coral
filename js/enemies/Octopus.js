// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/enemies/Octopus.js — Pulpo Oscuro (Patrulla Zonal y Nube de Tinta)
// ==========================================================================

import { Enemy } from './Enemy.js';

export class Octopus extends Enemy {
  constructor(x, y, radius = 90, speed = 45) {
    super(x, y, 44, 40, 1, 'el Pulpo de las Profundidades');
    this.centerX = x;
    this.centerY = y;
    this.radius = radius;
    this.speed = speed;
    this.angle = Math.random() * Math.PI * 2;
  }

  update(dt) {
    super.update(dt);
    this.angle += (this.speed / this.radius) * dt;
    this.x = this.centerX + Math.cos(this.angle) * this.radius;
    this.y = this.centerY + Math.sin(this.angle) * (this.radius * 0.6);
  }

  draw(ctx, camera) {
    if (this.isDead) return;
    if (!camera.isVisible(this.x, this.y, this.width, this.height)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const tentacleWave = Math.sin(this.animTimer * 3) * 4;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);

    // Tentáculos ondulantes
    ctx.fillStyle = '#4a044e';
    for (let i = -16; i <= 16; i += 8) {
      ctx.beginPath();
      ctx.ellipse(i, 12, 4, 10 + Math.abs(tentacleWave), (i / 16) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cabeza bulbosa del pulpo
    ctx.fillStyle = '#701a75';
    ctx.beginPath();
    ctx.ellipse(0, -4, 18, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ojos misteriosos pero adaptados a niños
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-7, -4, 4, 0, Math.PI * 2);
    ctx.arc(7, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-6, -4, 2, 0, Math.PI * 2);
    ctx.arc(8, -4, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

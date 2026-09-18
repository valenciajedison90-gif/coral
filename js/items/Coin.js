// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/items/Coin.js — Monedas Submarinas (Normal 1 / Dorada 5)
// ==========================================================================

import { Collectible } from '../world/Collectible.js';

export class Coin extends Collectible {
  constructor(x, y, isGold = false) {
    super(x, y, isGold ? 13 : 11);
    this.isGold = isGold;
    this.value = isGold ? 5 : 1;
  }

  draw(ctx, camera) {
    if (this.collected) return;
    if (!camera.isVisible(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const scaleX = Math.cos(this.animTimer * 1.5);

    ctx.save();
    ctx.translate(drawX, drawY);
    ctx.scale(scaleX, 1);

    if (this.isGold) {
      // Moneda Dorada (+5)
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffd152';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius - 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Detalle de estrella en el centro
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1.5, -5, 3, 10);
      ctx.fillRect(-5, -1.5, 10, 3);
    } else {
      // Moneda Normal (+1)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius - 2, 0, Math.PI * 2);
      ctx.fill();

      // Círculo concéntrico
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius - 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

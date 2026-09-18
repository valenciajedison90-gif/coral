// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/items/Pearl.js — Perla Mágica (+10 Monedas y Resplandor Iridiscente)
// ==========================================================================

import { Collectible } from '../world/Collectible.js';

export class Pearl extends Collectible {
  constructor(x, y) {
    super(x, y, 14);
    this.value = 10;
  }

  draw(ctx, camera) {
    if (this.collected) return;
    if (!camera.isVisible(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const pulse = Math.sin(this.animTimer * 2) * 2;

    ctx.save();
    ctx.translate(drawX, drawY);

    // Halo mágico exterior
    const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, this.radius + 6 + pulse);
    auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    auraGrad.addColorStop(0.5, 'rgba(42, 213, 196, 0.5)');
    auraGrad.addColorStop(1, 'rgba(157, 78, 221, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 6 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo de la perla iridiscente
    const pearlGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, this.radius);
    pearlGrad.addColorStop(0, '#ffffff');
    pearlGrad.addColorStop(0.4, '#e0f2fe');
    pearlGrad.addColorStop(0.8, '#fbcfe8');
    pearlGrad.addColorStop(1, '#a5f3fc');

    ctx.fillStyle = pearlGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Destello de brillo especular
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4, -4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

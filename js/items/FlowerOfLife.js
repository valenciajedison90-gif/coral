// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/items/FlowerOfLife.js — Coleccionable Místico "Flor de la Vida"
// Desbloquea el poder sagrado de disparar balitas de burbuja a los animales malos
// ==========================================================================

import { Collectible } from '../world/Collectible.js';

export class FlowerOfLife extends Collectible {
  constructor(x, y) {
    super(x, y, 18);
    this.animTimer = Math.random() * Math.PI * 2;
  }

  draw(ctx, camera) {
    if (this.collected) return;
    if (!camera.isVisible(this.x - this.radius - 10, this.y - this.radius - 10, (this.radius + 10) * 2, (this.radius + 10) * 2)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const pulse = Math.sin(this.animTimer * 3) * 3;
    const rot = this.animTimer * 0.5;

    ctx.save();
    ctx.translate(drawX, drawY);

    // 1. Halo resplandeciente exterior sagrado
    const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26 + pulse);
    auraGrad.addColorStop(0, 'rgba(255, 240, 138, 0.9)');
    auraGrad.addColorStop(0.4, 'rgba(244, 114, 182, 0.6)');
    auraGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.3)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 26 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 2. Pétalos de flor de loto sagrada (8 pétalos simétricos)
    ctx.rotate(rot);
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 4);

      // Pétalo exterior rosa coral
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(6, -10 - pulse * 0.4, 0, -18 - pulse * 0.5);
      ctx.quadraticCurveTo(-6, -10 - pulse * 0.4, 0, 0);
      ctx.fill();

      // Pétalo interior blanco perla
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(3, -6, 0, -12);
      ctx.quadraticCurveTo(-3, -6, 0, 0);
      ctx.fill();

      ctx.restore();
    }

    // 3. Núcleo brillante dorado de la Flor de la Vida
    ctx.fillStyle = '#ffd152';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-1.5, -1.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

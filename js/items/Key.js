// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/items/Key.js — Llaves del Saber, Valentía y Amistad
// ==========================================================================

import { Collectible } from '../world/Collectible.js';

export class Key extends Collectible {
  constructor(x, y, keyType = 'saber') {
    super(x, y, 16);
    this.keyType = keyType; // 'saber', 'valentia', 'amistad'

    const config = {
      saber: { name: 'Llave del Saber', color: '#38bdf8', icon: '📖' },
      valentia: { name: 'Llave de la Valentía', color: '#ef4444', icon: '🔥' },
      amistad: { name: 'Llave de la Amistad', color: '#10b981', icon: '🐬' }
    };

    this.info = config[keyType] || config.saber;
  }

  draw(ctx, camera) {
    if (this.collected) return;
    if (!camera.isVisible(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const bob = Math.sin(this.animTimer * 2) * 4;

    ctx.save();
    ctx.translate(drawX, drawY + bob);

    // Halo místico
    ctx.fillStyle = 'rgba(255, 209, 82, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Cabeza de la llave (anillo dorado)
    ctx.fillStyle = '#ffd152';
    ctx.beginPath();
    ctx.arc(0, -8, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0b3c5d';
    ctx.beginPath();
    ctx.arc(0, -8, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Vástago de la llave
    ctx.fillStyle = '#ffd152';
    ctx.fillRect(-2.5, 0, 5, 18);

    // Dientes de la llave
    ctx.fillRect(2.5, 8, 5, 3.5);
    ctx.fillRect(2.5, 14, 6, 3.5);

    // Gema mágica incrustada en el anillo según el tipo de llave
    ctx.fillStyle = this.info.color;
    ctx.beginPath();
    ctx.arc(0, -8, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

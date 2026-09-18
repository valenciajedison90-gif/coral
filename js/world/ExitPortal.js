// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/ExitPortal.js — Portal Marino Hacia la Siguiente Zona
// ==========================================================================

export class ExitPortal {
  constructor(x, y, label = 'Hacia el Bosque de Algas') {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 80;
    this.label = label;
    this.animTimer = 0;
    this.coopPlayersInside = 0;
    this.coopTotalPlayers = 1;
  }

  setCoopStatus(inside, total) {
    this.coopPlayersInside = inside;
    this.coopTotalPlayers = total;
  }

  isCollidingWith(box) {
    return (
      box.x < this.x + this.width &&
      box.x + box.width > this.x &&
      box.y < this.y + this.height &&
      box.y + box.height > this.y
    );
  }

  update(dt) {
    this.animTimer += dt * 3;
  }

  draw(ctx, camera) {
    if (!camera.isVisible(this.x - 40, this.y - 40, this.width + 80, this.height + 60)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const pulse = Math.sin(this.animTimer) * 4;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);

    // Vórtice de agua brillante
    const vortexGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 32 + pulse);
    vortexGrad.addColorStop(0, '#ffffff');
    vortexGrad.addColorStop(0.4, '#2ad5c4');
    vortexGrad.addColorStop(0.8, '#0b3c5d');
    vortexGrad.addColorStop(1, 'rgba(5, 22, 34, 0)');

    ctx.fillStyle = vortexGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26 + pulse, 38 + pulse, 0, 0, Math.PI * 2);
    ctx.fill();

    // Anillo giratorio de perlas luminosas
    const ringAngle = this.animTimer * 1.5;
    ctx.fillStyle = '#ffd152';
    for (let i = 0; i < 6; i++) {
      const a = ringAngle + (i * Math.PI) / 3;
      const rx = Math.cos(a) * 28;
      const ry = Math.sin(a) * 38;
      ctx.beginPath();
      ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Indicador Cooperativo Multijugador
    if (this.coopTotalPlayers > 1) {
      const isComplete = this.coopPlayersInside >= this.coopTotalPlayers;
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const tagText = isComplete
        ? `✨ ¡EQUIPO COMPLETO! (${this.coopPlayersInside}/${this.coopTotalPlayers})`
        : `🧜‍♀️ Esperando equipo: ${this.coopPlayersInside}/${this.coopTotalPlayers}`;

      const textWidth = ctx.measureText(tagText).width;
      const bgY = -56;

      ctx.fillStyle = isComplete ? 'rgba(42, 213, 196, 0.9)' : 'rgba(3, 18, 30, 0.85)';
      ctx.strokeStyle = isComplete ? '#ffd152' : '#2ad5c4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-textWidth / 2 - 8, bgY - 10, textWidth + 16, 20, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isComplete ? '#03121e' : '#ffffff';
      ctx.fillText(tagText, 0, bgY);
    }

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

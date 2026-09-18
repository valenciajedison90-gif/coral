// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/Lumi.js — Mascota Mágica Submarina (Criatura Bioluminiscente)
// ==========================================================================

export class Lumi {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 28;
    this.height = 24;
    this.animTimer = 0;
    this.isRescued = false;
  }

  update(dt) {
    this.animTimer += dt * 4;
    this.y = this.baseY + Math.sin(this.animTimer) * 6;
  }

  isCollidingWith(box) {
    if (!box) return false;
    return (
      box.x < this.x + this.width &&
      box.x + box.width > this.x &&
      box.y < this.y + this.height &&
      box.y + box.height > this.y
    );
  }

  draw(ctx, camera) {
    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const glow = Math.sin(this.animTimer * 2) * 3;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);

    // Halo mágico dorado / cian
    const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 20 + glow);
    auraGrad.addColorStop(0, 'rgba(255, 209, 82, 0.85)');
    auraGrad.addColorStop(0.6, 'rgba(42, 213, 196, 0.45)');
    auraGrad.addColorStop(1, 'rgba(42, 213, 196, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 20 + glow, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo brillante de ajolote/hada marina
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pequeñas branquias radiantes en forma de coronita
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-8, -6, 3, 0, Math.PI * 2);
    ctx.arc(8, -6, 3, 0, Math.PI * 2);
    ctx.arc(0, -9, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Ojos brillantes grandes y tiernos
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-4, -1, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3, -2, 1, 0, Math.PI * 2);
    ctx.arc(5, -2, 1, 0, Math.PI * 2);
    ctx.fill();

    // Colita mágica
    const tailWiggle = Math.sin(this.animTimer * 3) * 4;
    ctx.fillStyle = '#ffd152';
    ctx.beginPath();
    ctx.moveTo(-3, 6);
    ctx.quadraticCurveTo(-6, 12, -4 + tailWiggle, 16);
    ctx.lineTo(4 + tailWiggle, 16);
    ctx.quadraticCurveTo(6, 12, 3, 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

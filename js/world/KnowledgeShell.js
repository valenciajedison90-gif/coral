// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/KnowledgeShell.js — Concha del Saber (Estación Educativa Interactiva)
// ==========================================================================

export class KnowledgeShell {
  constructor(x, y, category = null, difficulty = null, id = 1) {
    this.x = x;
    this.y = y;
    this.width = 46;
    this.height = 42;
    this.category = category;
    this.difficulty = difficulty;
    this.id = id;
    this.opened = false;
    this.animTimer = Math.random() * Math.PI * 2;
  }

  isCollidingWith(box) {
    if (this.opened) return false;
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
    if (!camera.isVisible(this.x, this.y, this.width, this.height)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const pulse = Math.sin(this.animTimer) * 3;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);

    // Halo místico dorado/cian si aún no está abierta
    if (!this.opened) {
      ctx.fillStyle = 'rgba(42, 213, 196, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 24 + pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    // 1. Concha inferior (Valva base)
    ctx.fillStyle = this.opened ? '#94a3b8' : '#ff8e53';
    ctx.beginPath();
    ctx.ellipse(0, 4, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Concha superior (Valva superior)
    ctx.fillStyle = this.opened ? '#cbd5e1' : '#ff6b8b';
    ctx.beginPath();
    if (this.opened) {
      // Concha abierta hacia arriba mostrando la perla interior
      ctx.ellipse(0, -10, 17, 10, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(0, -2, 18, 14, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Ranuras decorativas de la concha
    ctx.strokeStyle = this.opened ? '#64748b' : '#c2410c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-12, 6);
    ctx.lineTo(0, -6);
    ctx.lineTo(12, 6);
    ctx.moveTo(-6, 8);
    ctx.lineTo(0, -8);
    ctx.lineTo(6, 8);
    ctx.stroke();

    // 3. Perla mágica interior del conocimiento
    const pearlColor = this.opened ? '#ffd152' : '#ffffff';
    ctx.fillStyle = pearlColor;
    ctx.beginPath();
    ctx.arc(0, this.opened ? -2 : 0, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Brillo de la perla
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2, (this.opened ? -2 : 0) - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

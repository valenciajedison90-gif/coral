// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/Checkpoint.js — Islas de Coral (Puntos de Guardado y Altar Marino)
// ==========================================================================

export class Checkpoint {
  constructor(x, y, level = 1, id = 'cp_1') {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 70;
    this.level = level;
    this.id = id;
    this.activated = false;
    this.animTimer = 0;
  }

  isCollidingWith(box) {
    return (
      box.x < this.x + this.width &&
      box.x + box.width > this.x &&
      box.y < this.y + this.height &&
      box.y + box.height > this.y
    );
  }

  activate(game) {
    if (this.activated) return false;
    this.activated = true;

    if (game.audioManager) {
      game.audioManager.playCheckpoint();
    }

    if (game.worldManager) {
      game.worldManager.spawnSparkles(this.x + this.width / 2, this.y + 20, 20);
    }

    // Mostrar notificación agradable para niños
    if (game.showToast) {
      game.showToast("🌟 ¡Punto de Coral activado! Tu progreso está seguro.");
    }

    // Guardar en LocalStorage
    game.saveProgress(this.x + 10, this.y);
    return true;
  }

  update(dt) {
    this.animTimer += dt * 3;
  }

  draw(ctx, camera) {
    if (!camera.isVisible(this.x, this.y, this.width, this.height)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    const glow = Math.sin(this.animTimer) * 4;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height);

    // 1. Base rocosa de coral
    ctx.fillStyle = '#0f3a53';
    ctx.beginPath();
    ctx.ellipse(0, -6, 32, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e5f8a';
    ctx.beginPath();
    ctx.roundRect(-24, -20, 48, 16, 6);
    ctx.fill();

    // 2. Columnas y cristales marinos
    const crystalColor = this.activated ? '#2ad5c4' : '#64748b';
    const auraColor = this.activated ? 'rgba(42, 213, 196, 0.4)' : 'rgba(100, 116, 139, 0.15)';

    // Aura bioluminiscente si está activado
    if (this.activated) {
      ctx.fillStyle = auraColor;
      ctx.beginPath();
      ctx.arc(0, -42, 28 + glow, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cristal central
    ctx.fillStyle = crystalColor;
    ctx.beginPath();
    ctx.moveTo(0, -60 - (this.activated ? glow : 0));
    ctx.lineTo(10, -42);
    ctx.lineTo(0, -22);
    ctx.lineTo(-10, -42);
    ctx.closePath();
    ctx.fill();

    // Reflejo brillante del cristal
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -56 - (this.activated ? glow : 0));
    ctx.lineTo(4, -42);
    ctx.lineTo(0, -28);
    ctx.closePath();
    ctx.fill();

    // Cristales laterales más pequeños
    ctx.fillStyle = this.activated ? '#ffd152' : '#475569';
    ctx.beginPath();
    ctx.moveTo(-16, -42);
    ctx.lineTo(-11, -30);
    ctx.lineTo(-16, -18);
    ctx.lineTo(-21, -30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(16, -42);
    ctx.lineTo(21, -30);
    ctx.lineTo(16, -18);
    ctx.lineTo(11, -30);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

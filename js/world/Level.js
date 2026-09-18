// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/Level.js — Clase Base de Nivel y Gestión de Entidades
// ==========================================================================

export class Level {
  constructor(config) {
    this.id = config.id || 1;
    this.name = config.name || 'Nivel';
    this.worldWidth = config.worldWidth || 3200;
    this.worldHeight = config.worldHeight || 2000;
    this.playerStart = config.playerStart || { x: 180, y: 600 };

    this.obstacles = config.obstacles || [];
    this.coins = config.coins || [];
    this.pearls = config.pearls || [];
    this.keys = config.keys || [];
    this.shells = config.shells || [];
    this.flowers = config.flowers || []; // Flores de la Vida
    this.enemies = config.enemies || [];
    this.checkpoints = config.checkpoints || [];
    this.lumiClues = config.lumiClues || [];
    this.exitPortal = config.exitPortal || null;
  }

  update(dt, solidObstacles) {
    for (const c of this.coins) c.update(dt);
    for (const p of this.pearls) p.update(dt);
    for (const k of this.keys) k.update(dt);
    for (const s of this.shells) s.update(dt);
    for (const f of this.flowers) f.update(dt);
    for (const cp of this.checkpoints) cp.update(dt);
    for (const e of this.enemies) e.update(dt, solidObstacles);
    if (this.exitPortal) this.exitPortal.update(dt);
    if (this.lumi) this.lumi.update(dt);
  }

  draw(ctx, camera) {
    // 1. Dibujar Obstáculos (Arrecifes, rocas, pilares)
    for (const obs of this.obstacles) {
      obs.draw(ctx, camera);
    }

    // 2. Dibujar Pistas luminosas de Lumi
    for (const clue of this.lumiClues) {
      if (camera.isVisible(clue.x - 20, clue.y - 20, 40, 40)) {
        const sp = camera.worldToScreen(clue.x, clue.y);
        ctx.save();
        ctx.fillStyle = 'rgba(255, 209, 82, 0.4)';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 14 + Math.sin(Date.now() / 300) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 3. Dibujar Puntos de Control (Islas de Coral)
    for (const cp of this.checkpoints) {
      cp.draw(ctx, camera);
    }

    // 4. Dibujar Conchas del Saber
    for (const shell of this.shells) {
      shell.draw(ctx, camera);
    }

    // 5. Dibujar Flores de la Vida
    for (const flower of this.flowers) {
      flower.draw(ctx, camera);
    }

    // 6. Dibujar Coleccionables (Monedas, Perlas, Llaves)
    for (const coin of this.coins) coin.draw(ctx, camera);
    for (const pearl of this.pearls) pearl.draw(ctx, camera);
    for (const key of this.keys) key.draw(ctx, camera);

    // 7. Dibujar Portal de Salida
    if (this.exitPortal) {
      this.exitPortal.draw(ctx, camera);
    }

    // 8. Dibujar Criaturas Enemigas
    for (const enemy of this.enemies) {
      enemy.draw(ctx, camera);
    }

    // 9. Dibujar Mascota Lumi (Nivel 5)
    if (this.lumi) {
      this.lumi.draw(ctx, camera);
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

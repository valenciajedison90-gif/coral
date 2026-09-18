// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/enemies/Enemy.js — Clase Base para Criaturas Enemigas con Derrota por Balitas
// ==========================================================================

export class Enemy {
  constructor(x, y, width, height, damage = 1, name = 'Enemigo') {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.damage = damage;
    this.name = name;
    this.id = `enemy_${Math.round(x)}_${Math.round(y)}`;
    this.animTimer = Math.random() * Math.PI * 2;
    this.facing = 1;
    this.isDead = false;
  }

  update(dt, solidObstacles) {
    if (this.isDead) return;
    this.animTimer += dt * 3;
  }

  isCollidingWith(box) {
    if (this.isDead || !box) return false;

    // Si es un proyectil circular (balita de burbuja)
    if (box.radius !== undefined) {
      const closestX = Math.max(this.x, Math.min(box.x, this.x + this.width));
      const closestY = Math.max(this.y, Math.min(box.y, this.y + this.height));
      const dx = box.x - closestX;
      const dy = box.y - closestY;
      const r = box.radius + 6; // Tolerancia generosa
      return (dx * dx + dy * dy) <= (r * r);
    }

    const bW = box.width || 0;
    const bH = box.height || 0;
    return (
      box.x < this.x + this.width &&
      box.x + bW > this.x &&
      box.y < this.y + this.height &&
      box.y + bH > this.y
    );
  }

  onHitPlayer(game, mermaid) {
    if (this.isDead) return false;

    // Si la sirena tiene escudo activo, el escudo absorbe el golpe sin daño
    if (mermaid.hasActiveShield) {
      mermaid.hasActiveShield = false;
      mermaid.invulnerableTimer = 1.2;
      if (game.audioManager) game.audioManager.playShieldDeflect();
      if (game.showToast) game.showToast("🛡️ ¡Tu escudo absorbió el impacto!");
      return false;
    }

    // Si la sirena no es invulnerable, aplicar daño
    if (mermaid.invulnerableTimer <= 0) {
      game.lives = Math.max(0, game.lives - this.damage);
      mermaid.invulnerableTimer = 1.8;
      mermaid.vx = -this.facing * 180;
      mermaid.vy = -120;

      if (game.audioManager) game.audioManager.playDamage();

      if (game.showToast) {
        game.showToast(`⚠️ ¡Te rozó ${this.name}!`);
      }

      if (game.playerManager.totalPlayers > 1) {
        game.playerManager.penalizeCurrentPlayerTurn();
      }

      if (game.lives <= 0) {
        game.handlePlayerDefeat();
      } else {
        game.updateHUD();
      }
      return true;
    }
    return false;
  }

  // Se llama cuando una balita de burbuja de la Flor de la Vida impacta a este enemigo
  takeHit(game, bullet) {
    if (this.isDead) return false;

    this.isDead = true;

    if (game.audioManager) {
      game.audioManager.playEnemyPoof();
    }

    if (game.worldManager) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      game.worldManager.spawnBubbles(centerX, centerY, 10);
      game.worldManager.spawnSparkles(centerX, centerY, 16, '#f472b6');
      game.worldManager.addFloatingText('+30 XP 🌸', centerX, centerY - 15, '#f472b6');
    }

    game.xp += 30;
    game.coins += 2;
    game.updateHUD();

    return true;
  }
}

// © jjedi90 — Todos los derechos reservados.

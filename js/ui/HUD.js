// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/ui/HUD.js — Visualización Superior en Pantalla (Vidas, Monedas, XP, Llaves)
// ==========================================================================

export class HUD {
  constructor(game) {
    this.game = game;
    this.livesEl = document.getElementById('hud-lives-display');
    this.coinsEl = document.getElementById('hud-coins-display');
    this.xpEl = document.getElementById('hud-xp-display');
    this.keysEl = document.getElementById('hud-keys-display');
    this.charAvatarEl = document.getElementById('hud-avatar-icon');
    this.flowerBadge = document.getElementById('hud-flower-badge');
    this.coopPortalBadge = document.getElementById('hud-coop-portal-badge');
    this.soundBtn = document.getElementById('btn-toggle-sound');
    this.pauseBtn = document.getElementById('btn-open-pause');

    this.bindEvents();
  }

  bindEvents() {
    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        const isMuted = this.game.audioManager.toggleMute();
        this.soundBtn.textContent = isMuted ? '🔇' : '🔊';
        this.game.saveProgress();
      });
    }

    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => {
        this.game.togglePause();
      });
    }
  }

  update(lives, coins, xp, keysCount = 0, characterId = 'aria', hasFlowerPower = false) {
    if (this.livesEl) {
      const heartCount = Math.max(0, Math.min(3, lives));
      this.livesEl.innerHTML = '❤️'.repeat(heartCount) + '🤍'.repeat(3 - heartCount);
    }

    if (this.coinsEl) {
      this.coinsEl.textContent = coins;
    }

    if (this.xpEl) {
      this.xpEl.textContent = `${xp} XP`;
    }

    if (this.keysEl) {
      this.keysEl.textContent = `${keysCount}/3`;
    }

    if (this.flowerBadge) {
      this.flowerBadge.style.display = hasFlowerPower ? 'flex' : 'none';
    }
  }

  updateCoopPortalBadge(current, total) {
    if (!this.coopPortalBadge) return;
    if (total > 1 && current > 0) {
      this.coopPortalBadge.style.display = 'flex';
      this.coopPortalBadge.textContent = `🧜‍♀️ Portal: ${current}/${total}`;
      if (current >= total) {
        this.coopPortalBadge.textContent = `✨ ¡Equipo listo!`;
      }
    } else {
      this.coopPortalBadge.style.display = 'none';
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

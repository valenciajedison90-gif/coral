// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/ui/PauseMenu.js — Menú de Pausa y Tienda Rápida de Monedas
// ==========================================================================

import { POWERUPS } from '../items/PowerUp.js';

export class PauseMenu {
  constructor(game) {
    this.game = game;
    this.overlay = document.getElementById('pause-modal-overlay');
    this.resumeBtn = document.getElementById('btn-pause-resume');
    this.restartBtn = document.getElementById('btn-pause-restart');
    this.mainMenuBtn = document.getElementById('btn-pause-main-menu');
    this.shopContainer = document.getElementById('pause-shop-grid');

    this.bindEvents();
  }

  bindEvents() {
    if (this.resumeBtn) {
      this.resumeBtn.addEventListener('click', () => {
        this.game.togglePause();
      });
    }

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        this.close();
        this.game.restartLevel();
      });
    }

    if (this.mainMenuBtn) {
      this.mainMenuBtn.addEventListener('click', () => {
        this.close();
        this.game.returnToMainMenu();
      });
    }
  }

  show() {
    this.renderShop();
    this.overlay.classList.remove('hidden');
  }

  close() {
    this.overlay.classList.add('hidden');
  }

  renderShop() {
    if (!this.shopContainer) return;
    this.shopContainer.innerHTML = '';

    Object.values(POWERUPS).forEach(item => {
      const card = document.createElement('div');
      card.className = 'shop-item-card';

      const canAfford = this.game.coins >= item.cost;
      const isMaxHealth = (item.id === 'corazon' && this.game.lives >= 3);

      card.innerHTML = `
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <button class="shop-buy-btn" ${(!canAfford || isMaxHealth) ? 'disabled' : ''}>
          ${item.cost} 🪙 Comprar
        </button>
      `;

      const buyBtn = card.querySelector('.shop-buy-btn');
      buyBtn.addEventListener('click', () => {
        if (item.apply(this.game)) {
          if (this.game.audioManager) this.game.audioManager.playCheckpoint();
          if (this.game.showToast) this.game.showToast(`✨ ¡Compraste ${item.name}!`);
          this.game.updateHUD();
          this.renderShop();
        }
      });

      this.shopContainer.appendChild(card);
    });
  }
}

// © jjedi90 — Todos los derechos reservados.

// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/ui/ResultsScreen.js — Pantalla Final de Misión Cumplida y Estadísticas
// ==========================================================================

export class ResultsScreen {
  constructor(game) {
    this.game = game;
    this.overlay = document.getElementById('results-modal-overlay');
    this.coinsStatEl = document.getElementById('stat-results-coins');
    this.xpStatEl = document.getElementById('stat-results-xp');
    this.correctStatEl = document.getElementById('stat-results-correct');
    this.incorrectStatEl = document.getElementById('stat-results-incorrect');
    this.timeStatEl = document.getElementById('stat-results-time');
    this.playAgainBtn = document.getElementById('btn-results-play-again');

    this.bindEvents();
  }

  bindEvents() {
    if (this.playAgainBtn) {
      this.playAgainBtn.addEventListener('click', () => {
        this.overlay.classList.add('hidden');
        this.game.returnToMainMenu();
      });
    }
  }

  show(stats) {
    if (this.coinsStatEl) this.coinsStatEl.textContent = stats.coins;
    if (this.xpStatEl) this.xpStatEl.textContent = `${stats.xp} XP`;
    if (this.correctStatEl) this.correctStatEl.textContent = stats.correct;
    if (this.incorrectStatEl) this.incorrectStatEl.textContent = stats.incorrect;

    if (this.timeStatEl) {
      const minutes = Math.floor(stats.timeInSeconds / 60);
      const seconds = Math.floor(stats.timeInSeconds % 60);
      this.timeStatEl.textContent = `${minutes}m ${seconds}s`;
    }

    this.overlay.classList.remove('hidden');
  }
}

// © jjedi90 — Todos los derechos reservados.

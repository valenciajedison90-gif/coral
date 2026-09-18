// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/ui/MainMenu.js — Menú Principal, Selector de Sirenas, Historia y Logros
// ==========================================================================

import { MERMAID_PROFILES } from '../player/MermaidAbilities.js';

export class MainMenu {
  constructor(game) {
    this.game = game;

    // Elementos del Menú Principal
    this.mainMenuOverlay = document.getElementById('main-menu-overlay');
    this.btnPlay = document.getElementById('btn-menu-play');
    this.btnMultiplayer = document.getElementById('btn-menu-multiplayer');
    this.btnSelectChar = document.getElementById('btn-menu-select-char');
    this.btnStory = document.getElementById('btn-menu-story');
    this.btnAchievements = document.getElementById('btn-menu-achievements');
    this.btnSettings = document.getElementById('btn-menu-settings');

    // Modales Secundarios
    this.charSelectOverlay = document.getElementById('character-select-overlay');
    this.storyOverlay = document.getElementById('story-modal-overlay');
    this.achievementsOverlay = document.getElementById('achievements-modal-overlay');
    this.settingsOverlay = document.getElementById('settings-modal-overlay');

    this.selectedCharId = 'aria';

    this.bindEvents();
    this.renderCharacterCards();
  }

  bindEvents() {
    if (this.btnPlay) {
      this.btnPlay.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();
        this.hideAll();
        this.game.startAdventure(this.selectedCharId);
      });
    }

    if (this.btnMultiplayer) {
      this.btnMultiplayer.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();
        if (this.game.multiplayerLobbyModal) {
          this.game.multiplayerLobbyModal.show();
        }
      });
    }

    if (this.btnSelectChar) {
      this.btnSelectChar.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();
        this.showModal(this.charSelectOverlay);
      });
    }

    if (this.btnStory) {
      this.btnStory.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();
        this.showModal(this.storyOverlay);
      });
    }

    if (this.btnAchievements) {
      this.btnAchievements.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();
        this.renderAchievements();
        this.showModal(this.achievementsOverlay);
      });
    }

    if (this.btnSettings) {
      this.btnSettings.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();
        this.showModal(this.settingsOverlay);
      });
    }

    // Botones de cierre de modales
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.audioManager.playClick();
        this.hideModal(btn.closest('.menu-overlay'));
      });
    });

    // Botón borrar progreso en configuración
    const btnReset = document.getElementById('btn-reset-save');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas borrar todo tu progreso guardado?')) {
          this.game.clearSaveData();
          alert('Progreso reiniciado con éxito.');
        }
      });
    }

    // Botón alternar controles táctiles en configuración
    const btnToggleTouch = document.getElementById('btn-toggle-touch-controls');
    if (btnToggleTouch) {
      btnToggleTouch.addEventListener('click', () => {
        const dpad = document.getElementById('touch-dpad-container');
        const action = document.getElementById('touch-action-container');
        if (dpad && action) {
          dpad.classList.toggle('active-touch');
          action.classList.toggle('active-touch');
        }
      });
    }
  }

  show() {
    this.mainMenuOverlay.classList.remove('hidden');
    if (this.game.audioManager) {
      this.game.audioManager.playMusic('menu');
    }
  }

  hideAll() {
    this.mainMenuOverlay.classList.add('hidden');
    if (this.charSelectOverlay) this.charSelectOverlay.classList.add('hidden');
    if (this.storyOverlay) this.storyOverlay.classList.add('hidden');
    if (this.achievementsOverlay) this.achievementsOverlay.classList.add('hidden');
    if (this.settingsOverlay) this.settingsOverlay.classList.add('hidden');
  }

  showModal(modal) {
    if (modal) modal.classList.remove('hidden');
  }

  hideModal(modal) {
    if (modal) modal.classList.add('hidden');
  }

  renderCharacterCards() {
    const grid = document.getElementById('character-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.values(MERMAID_PROFILES).forEach(profile => {
      const card = document.createElement('div');
      card.className = `character-card ${profile.id === this.selectedCharId ? 'selected' : ''}`;
      card.dataset.charId = profile.id;

      card.innerHTML = `
        <canvas class="char-avatar-canvas" width="90" height="90"></canvas>
        <div class="char-name">${profile.name}</div>
        <div class="char-title">${profile.title}</div>
        <div class="char-ability-box">
          <span class="char-ability-tag">${profile.abilityIcon} ${profile.abilityName}</span>
          ${profile.abilityDesc}
        </div>
      `;

      const canvas = card.querySelector('.char-avatar-canvas');
      this.drawMermaidPreview(canvas, profile);

      card.addEventListener('click', () => {
        this.selectedCharId = profile.id;
        document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.game.audioManager.playClick();
      });

      grid.appendChild(card);
    });
  }

  drawMermaidPreview(canvas, profile) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 90, 90);

    ctx.save();
    ctx.translate(45, 45);

    // Fondo circular
    ctx.fillStyle = 'rgba(11, 60, 93, 0.7)';
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fill();

    // Cola
    ctx.fillStyle = profile.colorTail;
    ctx.beginPath();
    ctx.moveTo(-4, 6);
    ctx.quadraticCurveTo(-14, 16, -16, 28);
    ctx.lineTo(-8, 28);
    ctx.quadraticCurveTo(-4, 16, 4, 6);
    ctx.fill();

    // Aleta
    ctx.fillStyle = profile.colorFin;
    ctx.beginPath();
    ctx.moveTo(-12, 28);
    ctx.lineTo(-20, 36);
    ctx.lineTo(-12, 32);
    ctx.lineTo(-4, 36);
    ctx.fill();

    // Torso
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.roundRect(-7, -8, 14, 16, 3);
    ctx.fill();

    // Top
    ctx.fillStyle = profile.colorTop;
    ctx.beginPath();
    ctx.arc(-3, -3, 3.5, 0, Math.PI * 2);
    ctx.arc(3, -3, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Cabeza
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -14, 9, 0, Math.PI * 2);
    ctx.fill();

    // Cabello
    ctx.fillStyle = profile.colorHair;
    ctx.beginPath();
    ctx.moveTo(0, -23);
    ctx.quadraticCurveTo(-16, -14, -12, 0);
    ctx.quadraticCurveTo(-6, -6, 0, -14);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -17, 9.5, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Ojos
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(2, -14, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderAchievements() {
    const list = document.getElementById('achievements-items-list');
    if (!list) return;
    list.innerHTML = '';

    const achievementsData = [
      { id: 'primeraAventura', title: 'Primera Aventura', icon: '🪙', desc: 'Recoge tu primera moneda submarina.' },
      { id: 'pequenaExploradora', title: 'Pequeña Exploradora', icon: '🌊', desc: 'Completa el Nivel 1: Arrecife de Coral.' },
      { id: 'granEstudiante', title: 'Gran Estudiante', icon: '🎓', desc: 'Responde correctamente 10 preguntas educativas.' },
      { id: 'coleccionista', title: 'Coleccionista de Perlas', icon: '✨', desc: 'Obtén 50 monedas o perlas.' },
      { id: 'sinMiedo', title: 'Sirena Valiente', icon: '🦀', desc: 'Esquiva las criaturas sin perder corazones.' },
      { id: 'rescatista', title: 'Gran Rescatista', icon: '🐬', desc: 'Encuentra y libera a la mascota Lumi.' }
    ];

    const saved = this.game.saveData ? this.game.saveData.achievements : {};

    achievementsData.forEach(ach => {
      const isUnlocked = saved && saved[ach.id];
      const item = document.createElement('div');
      item.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
      item.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <h4>${ach.title} ${isUnlocked ? '✅' : '🔒'}</h4>
          <p>${ach.desc}</p>
        </div>
      `;
      list.appendChild(item);
    });
  }
}

// © jjedi90 — Todos los derechos reservados.

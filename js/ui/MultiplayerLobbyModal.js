// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/ui/MultiplayerLobbyModal.js — Interfaz de Sala de Espera Multijugador
// ==========================================================================

import { MERMAID_PROFILES } from '../player/MermaidAbilities.js';

export class MultiplayerLobbyModal {
  constructor(game) {
    this.game = game;
    this.overlay = document.getElementById('multiplayer-lobby-overlay');

    // Paneles internos
    this.panelChoice = document.getElementById('mp-panel-choice');
    this.panelRoom = document.getElementById('mp-panel-room');

    // Inputs y botones de elección
    this.inputPlayerName = document.getElementById('mp-input-name');
    this.charSelectContainer = document.getElementById('mp-char-select-list');
    this.btnCreateRoom = document.getElementById('btn-mp-create-room');
    this.btnShowJoin = document.getElementById('btn-mp-show-join');
    this.joinForm = document.getElementById('mp-join-form');
    this.inputRoomCode = document.getElementById('mp-input-code');
    this.btnConfirmJoin = document.getElementById('btn-mp-confirm-join');
    this.btnClose = document.getElementById('btn-mp-close');

    // Elementos de la sala activa
    this.roomCodeDisplay = document.getElementById('mp-room-code-display');
    this.btnCopyCode = document.getElementById('btn-mp-copy-code');
    this.playersGrid = document.getElementById('mp-players-grid');
    this.hostControls = document.getElementById('mp-host-controls');
    this.clientWaitingMsg = document.getElementById('mp-client-waiting');
    this.btnStartGame = document.getElementById('btn-mp-start-game');
    this.btnLeaveRoom = document.getElementById('btn-mp-leave-room');

    this.selectedCharId = 'aria';
    this.isCreating = false;

    this.init();
  }

  init() {
    this.renderCharSelector();
    this.bindEvents();

    // Conectar callbacks con NetworkManager
    if (this.game.networkManager) {
      this.game.networkManager.onLobbyUpdate = (players) => this.renderLobbyPlayers(players);
      this.game.networkManager.onGameStart = (levelIndex, players) => this.onStartGameTriggered(levelIndex, players);
    }
  }

  renderCharSelector() {
    if (!this.charSelectContainer) return;
    this.charSelectContainer.innerHTML = '';

    const chars = Object.values(MERMAID_PROFILES);
    chars.forEach((char) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mp-char-card ${char.id === this.selectedCharId ? 'selected' : ''}`;
      btn.dataset.charId = char.id;
      btn.innerHTML = `
        <div class="mp-char-icon" style="background: radial-gradient(circle, ${char.colorTail} 0%, #082942 90%);">
          🧜‍♀️
        </div>
        <div class="mp-char-info">
          <span class="mp-char-name">${char.name}</span>
          <small class="mp-char-role">${char.title}</small>
        </div>
      `;

      btn.addEventListener('click', () => {
        this.game.audioManager.playClick();
        this.selectedCharId = char.id;
        this.charSelectContainer.querySelectorAll('.mp-char-card').forEach(c => c.classList.remove('selected'));
        btn.classList.add('selected');
      });

      this.charSelectContainer.appendChild(btn);
    });
  }

  bindEvents() {
    // 1. Crear Sala
    if (this.btnCreateRoom) {
      this.btnCreateRoom.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();

        const name = (this.inputPlayerName.value || '').trim() || 'Anfitriona';
        this.btnCreateRoom.disabled = true;
        this.btnCreateRoom.textContent = '⏳ Creando sala...';

        this.game.networkManager.createRoom(
          name,
          this.selectedCharId,
          (roomCode) => {
            this.btnCreateRoom.disabled = false;
            this.btnCreateRoom.textContent = '👑 Crear Sala Nueva';
            this.showRoomView(roomCode, true);
          },
          (err) => {
            this.btnCreateRoom.disabled = false;
            this.btnCreateRoom.textContent = '👑 Crear Sala Nueva';
            alert(err);
          }
        );
      });
    }

    // 2. Mostrar Formulario de Unirse
    if (this.btnShowJoin) {
      this.btnShowJoin.addEventListener('click', () => {
        this.game.audioManager.playClick();
        this.joinForm.classList.toggle('hidden');
        if (!this.joinForm.classList.contains('hidden')) {
          this.inputRoomCode.focus();
        }
      });
    }

    // 3. Confirmar Unirse a Sala
    if (this.btnConfirmJoin) {
      this.btnConfirmJoin.addEventListener('click', () => {
        this.game.audioManager.init();
        this.game.audioManager.playClick();

        const name = (this.inputPlayerName.value || '').trim() || 'Aventurera';
        const code = (this.inputRoomCode.value || '').trim().toUpperCase();

        if (!code) {
          alert('Por favor escribe el código de la sala.');
          return;
        }

        this.btnConfirmJoin.disabled = true;
        this.btnConfirmJoin.textContent = '⏳ Conectando...';

        this.game.networkManager.joinRoom(
          code,
          name,
          this.selectedCharId,
          (roomCode) => {
            this.btnConfirmJoin.disabled = false;
            this.btnConfirmJoin.textContent = 'Entrar ➔';
            this.showRoomView(roomCode, false);
          },
          (err) => {
            this.btnConfirmJoin.disabled = false;
            this.btnConfirmJoin.textContent = 'Entrar ➔';
            alert(err);
          }
        );
      });
    }

    // 4. Copiar Código de Sala
    if (this.btnCopyCode) {
      this.btnCopyCode.addEventListener('click', () => {
        const code = this.game.networkManager.roomCode;
        if (code && navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            this.game.showToast('📋 ¡Código copiado al portapapeles!');
          }).catch(() => {
            this.game.showToast(`Código: ${code}`);
          });
        }
      });
    }

    // 5. Iniciar Partida (Host)
    if (this.btnStartGame) {
      this.btnStartGame.addEventListener('click', () => {
        this.game.audioManager.playClick();
        this.btnStartGame.disabled = true;
        this.btnStartGame.textContent = '⏳ ¡Iniciando para todos...! 🚀';
        this.game.networkManager.startGame();
      });
    }

    // 6. Salir de la Sala
    if (this.btnLeaveRoom) {
      this.btnLeaveRoom.addEventListener('click', () => {
        this.game.audioManager.playClick();
        this.game.networkManager.reset();
        this.showChoiceView();
      });
    }

    // 7. Cerrar Modal Completo
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => {
        this.game.audioManager.playClick();
        this.game.networkManager.reset();
        this.hide();
      });
    }
  }

  show() {
    this.showChoiceView();
    this.overlay.classList.remove('hidden');
  }

  hide() {
    this.overlay.classList.add('hidden');
  }

  showChoiceView() {
    this.panelChoice.classList.remove('hidden');
    this.panelRoom.classList.add('hidden');
    if (this.joinForm) this.joinForm.classList.add('hidden');
  }

  showRoomView(roomCode, isHost) {
    this.panelChoice.classList.add('hidden');
    this.panelRoom.classList.remove('hidden');

    if (this.roomCodeDisplay) {
      this.roomCodeDisplay.textContent = roomCode;
    }

    if (isHost) {
      this.hostControls.classList.remove('hidden');
      this.clientWaitingMsg.classList.add('hidden');
      if (this.btnStartGame) {
        this.btnStartGame.disabled = false;
        this.btnStartGame.innerHTML = '🚀 Iniciar Juego ▶';
      }
    } else {
      this.hostControls.classList.add('hidden');
      this.clientWaitingMsg.classList.remove('hidden');
    }

    this.renderLobbyPlayers(this.game.networkManager.lobbyPlayers);
  }

  renderLobbyPlayers(players) {
    if (!this.playersGrid) return;
    this.playersGrid.innerHTML = '';

    const maxSlots = 4;
    for (let i = 0; i < maxSlots; i++) {
      const player = players[i];
      const slotEl = document.createElement('div');
      slotEl.className = 'mp-slot-card';

      if (player) {
        const char = MERMAID_PROFILES[player.characterId] || MERMAID_PROFILES.aria;
        slotEl.classList.add('occupied');
        slotEl.innerHTML = `
          <div class="mp-slot-avatar" style="border-color: ${char.colorTail};">
            🧜‍♀️
          </div>
          <div class="mp-slot-name">
            ${player.name} ${player.isHost ? '👑' : ''}
          </div>
          <div class="mp-slot-mermaid" style="color: ${char.colorTail};">
            ${char.name}
          </div>
          <div class="mp-slot-status ready">
            ✨ ¡Lista para nadar!
          </div>
        `;
      } else {
        slotEl.classList.add('empty');
        slotEl.innerHTML = `
          <div class="mp-slot-avatar empty-avatar">➕</div>
          <div class="mp-slot-name empty-text">Esperando compañera...</div>
          <div class="mp-slot-status waiting">⏳ Código: ${this.game.networkManager.roomCode}</div>
        `;
      }

      this.playersGrid.appendChild(slotEl);
    }

    // Actualizar botón de Iniciar Juego para el Anfitrión
    if (this.btnStartGame && this.game.networkManager.isHost) {
      const count = players.length;
      if (count > 1) {
        this.btnStartGame.innerHTML = `🚀 Iniciar Juego (${count} Sirenas Conectadas) ▶`;
      } else {
        this.btnStartGame.innerHTML = `🚀 Iniciar Juego (Solo Tú) ▶`;
      }
      this.btnStartGame.disabled = false;
    }
  }

  onStartGameTriggered(levelIndex, players) {
    this.hide();
    if (this.game.mainMenu) {
      this.game.mainMenu.hideAll();
    }
    this.game.startMultiplayerAdventure(levelIndex, players);
  }
}

// © jjedi90 — Todos los derechos reservados.

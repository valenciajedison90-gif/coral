// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/core/Game.js — Orquestador Principal y Bucle del Videojuego
// ==========================================================================

import { GameStateManager, STATES } from './GameState.js';
import { InputManager } from './InputManager.js';
import { Camera } from './Camera.js';
import { AudioManager } from './AudioManager.js';
import { SaveManager } from './SaveManager.js';
import { PlayerManager } from '../player/PlayerManager.js';
import { QuestionManager } from '../education/QuestionManager.js';
import { WorldManager } from '../world/WorldManager.js';
import { CardManager } from '../cards/CardManager.js';

import { HUD } from '../ui/HUD.js';
import { QuestionModal } from '../ui/QuestionModal.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { MainMenu } from '../ui/MainMenu.js';
import { ResultsScreen } from '../ui/ResultsScreen.js';
import { MultiplayerLobbyModal } from '../ui/MultiplayerLobbyModal.js';
import { InstallPromptManager } from '../pwa/InstallPromptManager.js';
import { NetworkManager } from '../network/NetworkManager.js';
import { BubbleBullet } from '../items/Projectile.js';

import { createLevel1 } from '../levels/level1.js';
import { createLevel2 } from '../levels/level2.js';
import { createLevel3 } from '../levels/level3.js';
import { createLevel4 } from '../levels/level4.js';
import { createLevel5 } from '../levels/level5.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('viewport-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Resolución lógica fija del mundo visible (16:9 de alta definición)
    this.width = 1280;
    this.height = 720;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Subsistemas Centrales
    this.stateManager = new GameStateManager(STATES.MENU);
    this.input = new InputManager();
    this.userCustomZoom = false;
    const initialZoom = this.calculateAutoZoom();
    this.camera = new Camera(this.width, this.height, 3200, 2000, initialZoom);
    this.audioManager = new AudioManager();
    this.playerManager = new PlayerManager();
    this.questionManager = new QuestionManager();
    this.worldManager = new WorldManager();
    this.cardManager = new CardManager();

    // Datos de Partida
    this.saveData = SaveManager.loadGame();
    this.coins = this.saveData.coins || 0;
    this.xp = this.saveData.xp || 0;
    this.lives = this.saveData.lives || 3;
    this.currentLevelIndex = this.saveData.currentLevel || 1;
    this.unlockedLevels = new Set(this.saveData.unlockedLevels || [1]);
    this.collectedKeys = { ...this.saveData.collectedKeys };
    this.inventory = { pistas: 0, segundaOportunidad: 0 };

    this.currentLevel = null;
    this.startTime = Date.now();
    this.lastTime = 0;
    this.toastTimer = 0;
    this.projectiles = [];
    this.hasFlowerPower = this.saveData.hasFlowerPower || false;

    // Multijugador en Línea y UI
    this.networkManager = new NetworkManager(this);
    this.hud = new HUD(this);
    this.questionModal = new QuestionModal(this);
    this.pauseMenu = new PauseMenu(this);
    this.mainMenu = new MainMenu(this);
    this.resultsScreen = new ResultsScreen(this);
    this.multiplayerLobbyModal = new MultiplayerLobbyModal(this);
    this.installPromptManager = new InstallPromptManager(this);
    this.toastEl = document.getElementById('game-toast');

    this.init();
  }

  init() {
    this.setupResize();

    // Inicializar controles táctiles
    this.input.initTouchControls(
      document.getElementById('touch-dpad-container'),
      document.getElementById('touch-action-container')
    );

    // Ajustar silencio si estaba guardado
    if (this.saveData.soundMuted) {
      this.audioManager.setMuted(true);
      const sBtn = document.getElementById('btn-toggle-sound');
      if (sBtn) sBtn.textContent = '🔇';
    }

    // Iniciar loop de renderizado
    requestAnimationFrame((t) => this.loop(t));

    // Desbloquear audio y reproducir música en la primera interacción del jugador
    const unlockAudio = () => {
      this.audioManager.init();
      if (this.stateManager.is(STATES.MENU)) {
        this.audioManager.playMusic('menu');
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
  }

  setupResize() {
    const resize = () => {
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;
      const isMobile = windowW <= 860 || windowH <= 520 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

      // Resolución optimizada: 960x540 en móviles (44% menos píxeles para GPU rápida a 60 FPS) y 1280x720 en PC
      const targetW = isMobile ? 960 : 1280;
      const targetH = isMobile ? 540 : 720;

      if (this.width !== targetW || this.height !== targetH) {
        this.width = targetW;
        this.height = targetH;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        if (this.camera) {
          this.camera.setViewportSize(this.width, this.height);
        }
      }

      const targetRatio = this.width / this.height;
      const windowRatio = windowW / windowH;

      let rW, rH;
      if (windowRatio > targetRatio) {
        rH = windowH;
        rW = rH * targetRatio;
      } else {
        rW = windowW;
        rH = rW / targetRatio;
      }

      this.canvas.style.width = `${Math.floor(rW)}px`;
      this.canvas.style.height = `${Math.floor(rH)}px`;

      if (!this.userCustomZoom && this.camera) {
        this.camera.setZoom(this.calculateAutoZoom());
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 200));
    resize();
  }

  calculateAutoZoom() {
    const isMobile = window.innerWidth <= 860 || window.innerHeight <= 520 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    // En móviles a 960x540, el zoom 1.25x produce dibujos grandes (+66%) con altísima tasa de cuadros (60 FPS)
    return isMobile ? 1.25 : 1.15;
  }

  toggleZoom() {
    this.userCustomZoom = true;
    const current = this.camera.zoom;
    let nextZoom = 1.65;
    if (current < 1.35) nextZoom = 1.65;
    else if (current < 1.8) nextZoom = 2.0;
    else nextZoom = 1.15;

    this.camera.setZoom(nextZoom);
    const label = nextZoom >= 1.9 ? 'Extra Grande (2.0x)' : (nextZoom >= 1.5 ? 'Celular / Grande (1.65x)' : 'Panorámico (1.15x)');
    this.showToast(`🔍 Zoom de cámara: ${label}`);
  }

  startAdventure(characterId) {
    this.saveData.selectedCharacter = characterId;
    this.loadLevel(this.currentLevelIndex, characterId);
    this.stateManager.changeState(STATES.PLAYING);
    this.updateHUD();

    if (!this.saveData.hasSeenTutorial) {
      this.showToast("👋 ¡Bienvenida! Nada con las flechas o el D-Pad y busca las Conchas del Saber.");
      this.saveData.hasSeenTutorial = true;
      this.saveProgress();
    }
  }

  // Inicia la partida en modo multijugador cooperativo
  startMultiplayerAdventure(levelIndex = 1, players = []) {
    this.playerManager.clearRemoteMermaids();
    const myChar = this.networkManager.myCharacterId || 'aria';
    this.saveData.selectedCharacter = myChar;

    this.loadLevel(levelIndex, myChar);

    // Registrar compañeras remotas
    for (const p of players) {
      if (p.peerId !== this.networkManager.myPeerId) {
        this.playerManager.addRemoteMermaid(
          p.peerId,
          p.name,
          p.characterId,
          this.currentLevel.playerStart.x,
          this.currentLevel.playerStart.y
        );
      }
    }

    if (this.currentLevel && this.currentLevel.exitPortal) {
      this.currentLevel.exitPortal.setCoopStatus(0, players.length);
    }

    this.stateManager.changeState(STATES.PLAYING);
    this.updateHUD();
    this.showToast(`🌊 ¡Aventura en equipo iniciada con ${players.length} sirenas! Avancen juntas para triunfar.`);
  }

  handleRemotePlayerShoot(bulletData) {
    if (!bulletData) return;
    const b = new BubbleBullet(bulletData.x, bulletData.y, bulletData.vx / 520, bulletData.vy / 520, 520);
    this.projectiles.push(b);
    this.audioManager.playShoot();
  }

  handleRemoteItemCollected(itemType, itemId, value) {
    if (itemType === 'coin') {
      this.coins += value || 1;
      this.audioManager.playCoin();
      this.updateHUD();
    } else if (itemType === 'pearl') {
      this.coins += 10;
      this.xp += 15;
      this.audioManager.playPearl();
      this.updateHUD();
    } else if (itemType === 'key') {
      this.collectedKeys[itemId] = true;
      this.audioManager.playKey();
      this.updateHUD();
      this.showToast('🔑 ¡Una compañera ha recogido una Llave misteriosa!');
    }
  }

  handleRemoteEnemyDefeated(enemyId) {
    if (!this.currentLevel) return;
    const enemy = this.currentLevel.enemies.find(e => e.id === enemyId);
    if (enemy && !enemy.isDead) {
      enemy.takeHit(this, null);
    }
  }

  updateCooperativePortalHUD(current, total) {
    this.hud.updateCoopPortalBadge(current, total);
    if (this.currentLevel && this.currentLevel.exitPortal) {
      this.currentLevel.exitPortal.setCoopStatus(current, total);
    }
  }

  handleCooperativeLevelClear(nextLevel) {
    this.audioManager.playCheckpoint();
    this.hud.updateCoopPortalBadge(0, 0);

    if (nextLevel <= 5) {
      this.showToast(`🌟 ¡Nivel completado en equipo! Nadando hacia el Nivel ${nextLevel}...`);
      setTimeout(() => {
        this.loadLevel(nextLevel, this.networkManager.myCharacterId);
        if (this.currentLevel && this.currentLevel.exitPortal) {
          this.currentLevel.exitPortal.setCoopStatus(0, this.networkManager.lobbyPlayers.length);
        }
      }, 1200);
    } else {
      this.handleCooperativeVictory();
    }
  }

  handleCooperativeVictory() {
    this.stateManager.changeState(STATES.VICTORY);
    this.audioManager.playLumiRescue();
    this.audioManager.playMusic('victory');
    this.showToast('💖 ¡Misión Cumplida! ¡Han rescatado a Lumi juntas!');
    const stats = {
      coins: this.coins,
      xp: this.xp,
      correct: this.questionManager.stats.correct,
      incorrect: this.questionManager.stats.incorrect,
      timeInSeconds: (Date.now() - this.startTime) / 1000
    };
    this.resultsScreen.show(stats);
  }

  loadLevel(levelIndex, characterId = this.saveData.selectedCharacter || 'aria') {
    this.currentLevelIndex = levelIndex;

    const levelLoaders = {
      1: createLevel1,
      2: createLevel2,
      3: createLevel3,
      4: createLevel4,
      5: createLevel5
    };

    const loader = levelLoaders[levelIndex] || createLevel1;
    this.currentLevel = loader();

    // Iniciar canción de fondo para este nivel
    this.audioManager.playMusic('level' + levelIndex);

    // Configurar cámara
    this.camera.setWorldSize(this.currentLevel.worldWidth, this.currentLevel.worldHeight);

    // Configurar jugadora
    const startX = this.saveData.checkpoint?.level === levelIndex ? this.saveData.checkpoint.x : this.currentLevel.playerStart.x;
    const startY = this.saveData.checkpoint?.level === levelIndex ? this.saveData.checkpoint.y : this.currentLevel.playerStart.y;

    this.playerManager.setupSinglePlayer(characterId, startX, startY);
    const mermaid = this.playerManager.getActiveMermaid();
    if (mermaid) {
      mermaid.hasFlowerPower = this.hasFlowerPower;
    }
    this.projectiles = [];
    this.camera.follow(startX, startY, true);

    this.updateHUD();
  }

  updateHUD() {
    const activeKeys = Object.values(this.collectedKeys).filter(Boolean).length;
    this.hud.update(this.lives, this.coins, this.xp, activeKeys, this.saveData.selectedCharacter, this.hasFlowerPower);
  }

  showToast(message) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3200);
  }

  togglePause() {
    if (this.stateManager.is(STATES.PLAYING)) {
      this.stateManager.changeState(STATES.PAUSED);
      this.audioManager.pauseMusic();
      this.pauseMenu.show();
    } else if (this.stateManager.is(STATES.PAUSED)) {
      this.stateManager.changeState(STATES.PLAYING);
      this.audioManager.resumeMusic();
      this.pauseMenu.close();
    }
  }

  restartLevel() {
    this.lives = 3;
    this.loadLevel(this.currentLevelIndex);
    this.stateManager.changeState(STATES.PLAYING);
  }

  returnToMainMenu() {
    this.stateManager.changeState(STATES.MENU);
    this.mainMenu.show();
    this.audioManager.playMusic('menu');
  }

  handlePlayerDefeat() {
    // Al perder todos los corazones, regresa a la última Isla de Coral sin frustración
    this.audioManager.playHeartLost();
    this.showToast("💙 ¡No te preocupes! Regresas a la última Isla de Coral.");
    this.lives = 3;
    this.updateHUD();

    const mermaid = this.playerManager.getActiveMermaid();
    const cp = this.saveData.checkpoint || { x: this.currentLevel.playerStart.x, y: this.currentLevel.playerStart.y };

    if (mermaid) {
      mermaid.resetPosition(cp.x, cp.y);
      this.camera.follow(cp.x, cp.y, true);
    }
  }

  resumeFromQuestion() {
    this.stateManager.changeState(STATES.PLAYING);
    this.audioManager.unduckMusic();
  }

  saveProgress(cpX = null, cpY = null) {
    if (cpX !== null && cpY !== null) {
      this.saveData.checkpoint = {
        level: this.currentLevelIndex,
        x: cpX,
        y: cpY
      };
    }

    this.saveData.coins = this.coins;
    this.saveData.xp = this.xp;
    this.saveData.lives = this.lives;
    this.saveData.currentLevel = this.currentLevelIndex;
    this.saveData.unlockedLevels = Array.from(this.unlockedLevels);
    this.saveData.collectedKeys = { ...this.collectedKeys };
    this.saveData.soundMuted = this.audioManager.muted;
    this.saveData.hasFlowerPower = this.hasFlowerPower;

    SaveManager.saveGame(this.saveData);
  }

  clearSaveData() {
    SaveManager.clearSave();
    this.saveData = SaveManager.getDefaultData();
    this.coins = 0;
    this.xp = 0;
    this.lives = 3;
    this.currentLevelIndex = 1;
    this.unlockedLevels = new Set([1]);
    this.collectedKeys = { saber: false, valentia: false, amistad: false };
    this.hasFlowerPower = false;
    this.projectiles = [];
    const mermaid = this.playerManager.getActiveMermaid();
    if (mermaid) mermaid.hasFlowerPower = false;
    this.updateHUD();
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (dt > 0.1) dt = 0.1; // Limitar delta time para evitar saltos

    if (this.stateManager.is(STATES.PLAYING)) {
      this.update(dt);
    }

    this.render();
    this.input.clearFrame();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    const mermaid = this.playerManager.getActiveMermaid();
    const level = this.currentLevel;
    if (!mermaid || !level) return;

    // 1. Actualizar Sirena
    mermaid.update(
      dt,
      this.input,
      level.obstacles,
      { width: level.worldWidth, height: level.worldHeight },
      this.worldManager,
      this.audioManager
    );

    // 1.5. Sincronización de Multijugador en Línea
    if (this.networkManager.isOnline) {
      this.playerManager.updateAllRemote(dt, this.worldManager);
      this.networkManager.sendLocalPlayerSync(mermaid);
    }

    // 2. Cámara sigue suavemente a la sirena
    this.camera.follow(mermaid.x + mermaid.width / 2, mermaid.y + mermaid.height / 2);
    this.camera.update();

    // 2.5. Disparo de balitas de flor
    if (this.input.shoot || this.input.shootPressed) {
      if (mermaid.hasFlowerPower) {
        const bullet = mermaid.shoot(this.audioManager, this.worldManager);
        if (bullet) {
          this.projectiles.push(bullet);
          if (this.networkManager.isOnline) {
            this.networkManager.broadcastShoot(bullet);
          }
        }
      } else if (this.input.shootPressed) {
        if (!this._lastFlowerHintTime || Date.now() - this._lastFlowerHintTime > 4000) {
          this._lastFlowerHintTime = Date.now();
          this.showToast('🌸 ¡Encuentra la Flor de la Vida para activar tus balitas de burbuja!');
        }
      }
    }

    // 2.6. Actualizar proyectiles y detectar colisiones con obstáculos y enemigos
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt, level.obstacles, this.worldManager);
      if (p.isDead || !p.active) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Colisión con criaturas enemigas
      for (const enemy of level.enemies) {
        if (!enemy.isDead && (p.isCollidingWith(enemy) || enemy.isCollidingWith(p))) {
          p.isDead = true;
          p.active = false;
          enemy.takeHit(this, p);
          if (this.networkManager.isOnline) {
            this.networkManager.broadcastEnemyDefeated(enemy.id);
          }
          this.worldManager.spawnSparkles(p.x, p.y, 16, '#ff66b2');
          this.projectiles.splice(i, 1);
          break;
        }
      }
    }

    // 3. Actualizar Nivel y Criaturas
    level.update(dt, level.obstacles);

    // 4. Actualizar Efectos del Mundo
    this.worldManager.update(dt, this.camera);

    // 5. Colisiones con Monedas
    for (const coin of level.coins) {
      if (!coin.collected && coin.isCollidingWith(mermaid)) {
        coin.collected = true;
        this.coins += coin.value;
        this.updateHUD();
        this.audioManager.playCoin();
        this.worldManager.spawnSparkles(coin.x, coin.y, 8, coin.isGold ? '#ffd152' : '#f59e0b');
        this.worldManager.addFloatingText(`+${coin.value}`, coin.x, coin.y - 10, coin.isGold ? '#ffd152' : '#ffffff');

        if (this.networkManager.isOnline) {
          this.networkManager.broadcastItemCollected('coin', coin.x, coin.value);
        }

        // Logro de primera moneda
        if (!this.saveData.achievements.primeraAventura) {
          this.saveData.achievements.primeraAventura = true;
          this.showToast("🏆 ¡Logro desbloqueado: Primera Aventura!");
          this.saveProgress();
        }
      }
    }

    // 6. Colisiones con Perlas Mágicas
    for (const pearl of level.pearls) {
      if (!pearl.collected && pearl.isCollidingWith(mermaid)) {
        pearl.collected = true;
        this.coins += pearl.value;
        this.xp += 15;
        this.updateHUD();
        this.audioManager.playPearl();
        this.worldManager.spawnSparkles(pearl.x, pearl.y, 16, '#2ad5c4');
        this.worldManager.addFloatingText('+10 🪙 (+15 XP)', pearl.x, pearl.y - 14, '#2ad5c4');

        if (this.networkManager.isOnline) {
          this.networkManager.broadcastItemCollected('pearl', pearl.x, pearl.value);
        }
      }
    }

    // 6.5. Colisiones con Flores de la Vida
    if (level.flowers) {
      for (const flower of level.flowers) {
        if (!flower.collected && flower.isCollidingWith(mermaid)) {
          flower.collected = true;
          this.hasFlowerPower = true;
          mermaid.hasFlowerPower = true;
          this.audioManager.playFlowerPower();
          this.worldManager.spawnSparkles(flower.x, flower.y, 25, '#ff4fa8');
          this.worldManager.spawnPetals(flower.x, flower.y, 18);
          this.worldManager.addFloatingText('🌸 ¡PODER FLORAL!', flower.x, flower.y - 20, '#ff4fa8');
          this.showToast('🌸 ¡Has obtenido la Flor de la Vida! Ahora puedes disparar balitas mágicas.');
          this.updateHUD();
          this.saveProgress();
        }
      }
    }

    // 7. Colisiones con Llaves
    for (const key of level.keys) {
      if (!key.collected && key.isCollidingWith(mermaid)) {
        key.collected = true;
        this.collectedKeys[key.keyType] = true;
        this.updateHUD();
        this.audioManager.playKey();
        this.worldManager.spawnSparkles(key.x, key.y, 20, '#ffd152');
        this.showToast(`🔑 ¡Has encontrado la ${key.info.name}!`);
        this.saveProgress();

        if (this.networkManager.isOnline) {
          this.networkManager.broadcastItemCollected('key', key.keyType, 1);
        }
      }
    }

    // 8. Colisiones con Puntos de Control (Islas de Coral)
    for (const cp of level.checkpoints) {
      if (!cp.activated && cp.isCollidingWith(mermaid)) {
        cp.activate(this);
      }
    }

    // 9. Colisiones con Conchas del Saber
    for (const shell of level.shells) {
      if (!shell.opened && shell.isCollidingWith(mermaid)) {
        this.stateManager.changeState(STATES.QUESTION);
        this.audioManager.playShellOpen();
        this.audioManager.duckMusic(0.12);
        const question = this.questionManager.getRandomQuestion(shell.category, shell.difficulty);
        this.questionModal.show(question, shell);
        break;
      }
    }

    // 10. Colisiones con Criaturas Enemigas
    for (const enemy of level.enemies) {
      if (enemy.isCollidingWith(mermaid)) {
        enemy.onHitPlayer(this, mermaid);
      }
    }

    // 11. Colisión con Portal de Salida / Meta del Nivel (Cooperativo)
    if (this.networkManager.isOnline) {
      const inPortal = !!(level.exitPortal && level.exitPortal.isCollidingWith(mermaid));
      this.networkManager.sendPortalPresence(inPortal);
    } else {
      if (level.exitPortal && level.exitPortal.isCollidingWith(mermaid)) {
        this.handleLevelClear();
      }
    }

    // 12. Encuentro con Lumi en el Castillo de Morgana (Nivel 5)
    if (level.lumi && level.lumi.isCollidingWith(mermaid)) {
      this.audioManager.playLumiRescue();
      if (this.networkManager.isOnline) {
        if (this.networkManager.isHost) {
          this.networkManager.broadcastVictory();
          this.handleCooperativeVictory();
        }
      } else {
        this.handleLevelClear();
      }
    }
  }

  handleLevelClear() {
    this.audioManager.playPortal();
    this.audioManager.playLevelComplete();

    if (this.currentLevelIndex === 1 && !this.saveData.achievements.pequenaExploradora) {
      this.saveData.achievements.pequenaExploradora = true;
      this.showToast("🏆 ¡Logro desbloqueado: Pequeña Exploradora!");
    }

    if (this.currentLevelIndex < 5) {
      const nextLevel = this.currentLevelIndex + 1;
      this.unlockedLevels.add(nextLevel);
      this.showToast(`🌟 ¡Nivel ${this.currentLevelIndex} completado! Nadando hacia el siguiente nivel...`);
      this.saveProgress();

      setTimeout(() => {
        this.loadLevel(nextLevel);
      }, 1200);
    } else {
      // Fin del Juego (Castillo de Morgana completado, Lumi rescatada)
      this.stateManager.changeState(STATES.VICTORY);
      this.audioManager.playLumiRescue();
      this.audioManager.playMusic('victory');
      this.saveData.achievements.rescatista = true;
      this.saveProgress();

      const stats = {
        coins: this.coins,
        xp: this.xp,
        correct: this.questionManager.stats.correct,
        incorrect: this.questionManager.stats.incorrect,
        timeInSeconds: (Date.now() - this.startTime) / 1000
      };

      this.resultsScreen.show(stats);
    }
  }

  render() {
    const { ctx, width, height, camera, currentLevel } = this;
    ctx.clearRect(0, 0, width, height);

    if (!currentLevel) return;

    ctx.save();
    if (camera.zoom && camera.zoom !== 1.0) {
      ctx.scale(camera.zoom, camera.zoom);
    }

    // 1. Fondo submarino con parallax, rayos de sol y algas
    this.worldManager.drawBackground(ctx, camera, currentLevel);

    // 2. Dibujar entidades del nivel (Arrecifes, monedas, perlas, conchas, enemigos, portal)
    currentLevel.draw(ctx, camera);

    // 2.5. Dibujar proyectiles de burbujas florales
    for (const projectile of this.projectiles) {
      projectile.draw(ctx, camera);
    }

    // 3. Dibujar la sirena local
    const mermaid = this.playerManager.getActiveMermaid();
    if (mermaid) {
      mermaid.draw(ctx, camera);
    }

    // 3.5. Dibujar sirenas de compañeras en línea (Multijugador)
    if (this.networkManager.isOnline) {
      this.playerManager.drawAllRemote(ctx, camera);
    }

    // 4. Dibujar efectos de primer plano (burbujas, destellos, textos flotantes)
    this.worldManager.drawForeground(ctx, camera);

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

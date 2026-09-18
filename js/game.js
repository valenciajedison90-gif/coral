// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// ==========================================================================

// Bucle principal del juego, lógica de colisiones, cámara y ciclo de vida

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Resolución interna fija para consistencia en cualquier pantalla
    this.width = 800;
    this.height = 450;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Cámara con seguimiento suave (Lerp)
    this.cameraX = 0;
    this.cameraY = 0;

    // Estado del juego
    this.state = 'MENU'; // 'MENU', 'PLAYING', 'LEVEL_COMPLETE', 'GAME_OVER'
    this.score = 0;
    this.lives = 3;
    this.currentLevelIndex = 1;
    this.levelData = null;
    this.player = null;

    // Temporizadores
    this.lastTime = 0;
    this.victoryTimer = 0;

    // Elementos DOM de la interfaz
    this.scoreEl = document.getElementById('hud-score');
    this.livesEl = document.getElementById('hud-lives');
    this.levelEl = document.getElementById('hud-level');
    this.screenOverlay = document.getElementById('screen-overlay');
    this.overlayTitle = document.getElementById('overlay-title');
    this.overlaySubtitle = document.getElementById('overlay-subtitle');
    this.overlayBtn = document.getElementById('overlay-btn');

    this.init();
  }

  init() {
    this.setupResize();
    this.initHUDButtons();

    // Iniciar controles táctiles
    window.inputManager.initTouchButtons(
      document.getElementById('btn-left'),
      document.getElementById('btn-right'),
      document.getElementById('btn-jump')
    );

    // Configurar botón del menú principal
    this.overlayBtn.addEventListener('click', () => this.handleOverlayAction());
    this.overlayBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.handleOverlayAction();
    });

    this.showScreen('¡SUPER AVENTURA 2D!', 'Toca el botón para jugar. Usa los botones en pantalla para moverte y saltar.', 'JUGAR');

    // Arrancar el ciclo de animación
    requestAnimationFrame((t) => this.loop(t));
  }

  setupResize() {
    const resize = () => {
      const container = document.getElementById('game-container');
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;

      // Calcular escala manteniendo relación de aspecto 16:9
      const targetRatio = this.width / this.height;
      const windowRatio = windowW / windowH;

      let renderW, renderH;
      if (windowRatio > targetRatio) {
        renderH = windowH;
        renderW = renderH * targetRatio;
      } else {
        renderW = windowW;
        renderH = renderW / targetRatio;
      }

      this.canvas.style.width = `${Math.floor(renderW)}px`;
      this.canvas.style.height = `${Math.floor(renderH)}px`;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 200));
    resize();
  }

  initHUDButtons() {
    // Botón de sonido
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = window.audioManager.toggleMute();
        soundBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }

    // Botón de pantalla completa
    const fullBtn = document.getElementById('btn-fullscreen');
    if (fullBtn) {
      fullBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    this.levelData = window.levelManager.loadLevel(levelIndex);
    this.player = new Player(this.levelData.playerStart.x, this.levelData.playerStart.y);
    this.cameraX = 0;
    this.cameraY = 0;
    window.particleSystem.clear();
    window.inputManager.reset();
    this.updateHUD();
  }

  handleOverlayAction() {
    if (window.audioManager) {
      window.audioManager.init();
      window.audioManager.playClick();
    }

    if (this.state === 'MENU' || this.state === 'GAME_OVER') {
      this.score = 0;
      this.lives = 3;
      this.loadLevel(1);
      this.state = 'PLAYING';
      this.hideScreen();
    } else if (this.state === 'LEVEL_COMPLETE') {
      if (this.currentLevelIndex < window.levelManager.totalLevels) {
        this.loadLevel(this.currentLevelIndex + 1);
        this.state = 'PLAYING';
        this.hideScreen();
      } else {
        // Victoria final del juego
        this.state = 'MENU';
        this.showScreen('🏆 ¡CAMPEÓN TOTAL!', `¡Has completado todos los niveles con ${this.score} puntos!`, 'VOLVER A JUGAR');
      }
    }
  }

  showScreen(title, subtitle, btnText) {
    this.overlayTitle.textContent = title;
    this.overlaySubtitle.textContent = subtitle;
    this.overlayBtn.textContent = btnText;
    this.screenOverlay.classList.remove('hidden');
  }

  hideScreen() {
    this.screenOverlay.classList.add('hidden');
  }

  updateHUD() {
    if (this.scoreEl) this.scoreEl.textContent = this.score;
    if (this.livesEl) {
      this.livesEl.innerHTML = '❤️'.repeat(Math.max(0, this.lives));
    }
    if (this.levelEl && this.levelData) {
      this.levelEl.textContent = `Nivel ${this.currentLevelIndex}`;
    }
  }

  // Bucle de actualización y dibujo
  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Limitar delta time para evitar saltos bruscos si la pestaña queda en segundo plano
    if (dt > 0.1) dt = 0.1;

    if (this.state === 'PLAYING') {
      this.update(dt);
    } else if (this.state === 'LEVEL_COMPLETE') {
      // Continuar animando partículas de victoria
      window.particleSystem.update(dt);
      if (Math.random() < 0.15) {
        window.particleSystem.createVictoryConfetti(
          this.cameraX + Math.random() * this.width,
          this.height - 20
        );
      }
    }

    this.render();
    window.inputManager.clearFrame();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    const { player, levelData } = this;
    const input = window.inputManager;

    // Actualizar plataformas móviles
    for (const plat of levelData.platforms) {
      plat.update(dt);
    }

    // Actualizar jugador
    player.update(dt, input, levelData.platforms);

    // Actualizar monedas
    for (const coin of levelData.coins) {
      coin.update(dt);
      // Recolección de monedas
      if (!coin.collected && player.checkCollision(player, {
        x: coin.x - coin.radius,
        y: coin.y - coin.radius,
        width: coin.radius * 2,
        height: coin.radius * 2
      })) {
        coin.collected = true;
        this.score += 100;
        this.updateHUD();
        if (window.audioManager) window.audioManager.playCoin();
        if (window.particleSystem) window.particleSystem.createCoinSparkles(coin.x, coin.y);
      }
    }

    // Actualizar enemigos y colisiones con el jugador
    for (const enemy of levelData.enemies) {
      if (enemy.isDead) continue;
      enemy.update(dt, levelData.platforms);

      // Chequeo de colisión con jugador
      if (player.checkCollision(player, enemy)) {
        // ¿El jugador cae sobre el enemigo? (Aplastamiento estilo plataformas)
        const playerBottom = player.y + player.height;
        const enemyTop = enemy.y;

        if (player.vy > 0 && (player.y + player.height <= enemy.y + enemy.height * 0.75 || playerBottom - player.vy * dt <= enemyTop + 16)) {
          enemy.isDead = true;
          player.vy = -340; // Rebote hacia arriba
          this.score += 200;
          this.updateHUD();
          if (window.audioManager) window.audioManager.playStomp();
          if (window.particleSystem) {
            window.particleSystem.createEnemyDefeatPoof(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
          }
        } else if (player.invulnerableTimer <= 0) {
          // Daño al jugador
          this.playerHit();
        }
      }
    }

    // Chequeo de peligros (pinchos)
    for (const hazard of levelData.hazards) {
      if (player.checkCollision(player, hazard) && player.invulnerableTimer <= 0) {
        this.playerHit();
      }
    }

    // Caída al abismo (por debajo del mundo)
    if (player.y > levelData.worldHeight + 50) {
      this.playerHit(true);
    }

    // Actualizar Meta y comprobar victoria
    levelData.goal.update(dt);
    if (player.checkCollision(player, levelData.goal)) {
      this.levelComplete();
    }

    // Actualizar partículas
    window.particleSystem.update(dt);

    // Cámara suave siguiendo al jugador (Horizontal con Lerp)
    const targetCamX = player.x - this.width * 0.35;
    this.cameraX += (targetCamX - this.cameraX) * 0.1;
    // Limitar la cámara dentro de los límites del nivel
    this.cameraX = Math.max(0, Math.min(this.cameraX, levelData.worldWidth - this.width));
    this.cameraY = 0; // En este juego de desplazamiento lateral, la altura se mantiene estable
  }

  playerHit(instantRespawn = false) {
    this.lives -= 1;
    this.updateHUD();

    if (window.audioManager) window.audioManager.playHurt();

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      if (instantRespawn) {
        this.player.reset(this.levelData.playerStart.x, this.levelData.playerStart.y);
      } else {
        // Empuje de retroceso y tiempo invulnerable
        this.player.vy = -260;
        this.player.vx = -this.player.facing * 180;
        this.player.invulnerableTimer = 1.6;
      }
    }
  }

  levelComplete() {
    this.state = 'LEVEL_COMPLETE';
    if (window.audioManager) window.audioManager.playWin();

    for (let i = 0; i < 5; i++) {
      window.particleSystem.createVictoryConfetti(
        this.levelData.goal.x + 20 + (Math.random() - 0.5) * 60,
        this.levelData.goal.y + 40
      );
    }

    const nextText = this.currentLevelIndex < window.levelManager.totalLevels ? 'SIGUIENTE NIVEL' : 'FINALIZAR';
    this.showScreen('🎉 ¡NIVEL COMPLETADO!', `¡Excelente trabajo! Puntuación acumulada: ${this.score} pts.`, nextText);
  }

  gameOver() {
    this.state = 'GAME_OVER';
    if (window.audioManager) window.audioManager.playGameOver();
    this.showScreen('💀 ¡FIN DE LA PARTIDA!', `Te has quedado sin vidas. Puntuación obtenida: ${this.score} pts.`, 'REINTENTAR');
  }

  render() {
    const { ctx, width, height, cameraX, cameraY, levelData, player } = this;

    ctx.clearRect(0, 0, width, height);

    if (!levelData) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // 1. Dibujar fondo con efecto Parallax
    window.levelManager.drawBackground(ctx, cameraX, levelData, width, height);

    // 2. Dibujar Peligros (Pinchos)
    for (const hazard of levelData.hazards) {
      hazard.draw(ctx, cameraX, cameraY);
    }

    // 3. Dibujar Plataformas
    for (const plat of levelData.platforms) {
      // Optimización: solo dibujar si está en pantalla
      if (plat.x + plat.width >= cameraX - 50 && plat.x <= cameraX + width + 50) {
        plat.draw(ctx, cameraX, cameraY);
      }
    }

    // 4. Dibujar Monedas
    for (const coin of levelData.coins) {
      if (coin.x + coin.radius >= cameraX && coin.x - coin.radius <= cameraX + width) {
        coin.draw(ctx, cameraX, cameraY);
      }
    }

    // 5. Dibujar Meta
    levelData.goal.draw(ctx, cameraX, cameraY);

    // 6. Dibujar Enemigos
    for (const enemy of levelData.enemies) {
      if (enemy.x + enemy.width >= cameraX - 50 && enemy.x <= cameraX + width + 50) {
        enemy.draw(ctx, cameraX, cameraY);
      }
    }

    // 7. Dibujar Partículas
    window.particleSystem.draw(ctx, cameraX, cameraY);

    // 8. Dibujar Jugador
    player.draw(ctx, cameraX, cameraY);
  }
}

// Inicializar juego una vez cargado el DOM
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});

// © jjedi90 — Todos los derechos reservados.

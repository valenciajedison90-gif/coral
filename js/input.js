// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// ==========================================================================

// Gestor de entradas: Teclado y Controles Táctiles Móviles Multitáctil
class InputManager {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpPressed = false; // Solo se activa en el fotograma inicial del salto

    // Rastro de punteros activos para soportar multitouch en los botones virtuales
    this.activePointers = new Map();

    this.initKeyboard();
  }

  initTouchButtons(leftBtn, rightBtn, jumpBtn) {
    const bindButton = (el, action) => {
      if (!el) return;

      const handleDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.audioManager) window.audioManager.init();

        this.activePointers.set(e.pointerId, action);
        this.updateStateFromPointers();
        el.classList.add('active');
      };

      const handleUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.activePointers.delete(e.pointerId);
        this.updateStateFromPointers();
        el.classList.remove('active');
      };

      el.addEventListener('pointerdown', handleDown, { passive: false });
      el.addEventListener('pointerup', handleUp, { passive: false });
      el.addEventListener('pointercancel', handleUp, { passive: false });
      el.addEventListener('pointerleave', handleUp, { passive: false });
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    };

    bindButton(leftBtn, 'left');
    bindButton(rightBtn, 'right');
    bindButton(jumpBtn, 'jump');

    // Prevenir menú contextual o selección de texto en todo el contenedor de controles
    const controlsContainer = document.getElementById('touch-controls');
    if (controlsContainer) {
      controlsContainer.addEventListener('contextmenu', (e) => e.preventDefault());
      controlsContainer.addEventListener('touchstart', (e) => {
        if (window.audioManager) window.audioManager.init();
      }, { passive: true });
    }
  }

  updateStateFromPointers() {
    let hasLeft = false;
    let hasRight = false;
    let hasJump = false;

    for (const action of this.activePointers.values()) {
      if (action === 'left') hasLeft = true;
      if (action === 'right') hasRight = true;
      if (action === 'jump') hasJump = true;
    }

    this.left = hasLeft || this.keyLeft;
    this.right = hasRight || this.keyRight;

    const newJump = hasJump || this.keyJump;
    if (newJump && !this.jump) {
      this.jumpPressed = true;
    }
    this.jump = newJump;
  }

  initKeyboard() {
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;

    window.addEventListener('keydown', (e) => {
      if (window.audioManager) window.audioManager.init();

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keyLeft = true;
        this.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keyRight = true;
        this.right = true;
      }
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') {
        if (!this.jump) {
          this.jumpPressed = true;
        }
        this.keyJump = true;
        this.jump = true;
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keyLeft = false;
        this.left = this.hasTouchAction('left');
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keyRight = false;
        this.right = this.hasTouchAction('right');
      }
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') {
        this.keyJump = false;
        this.jump = this.hasTouchAction('jump');
      }
    });
  }

  hasTouchAction(action) {
    for (const act of this.activePointers.values()) {
      if (act === action) return true;
    }
    return false;
  }

  // Se llama al final de cada fotograma para limpiar los triggers de un solo pulso
  clearFrame() {
    this.jumpPressed = false;
  }

  reset() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpPressed = false;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.activePointers.clear();
    const btns = document.querySelectorAll('.touch-btn');
    btns.forEach(b => b.classList.remove('active'));
  }
}

window.inputManager = new InputManager();

// © jjedi90 — Todos los derechos reservados.

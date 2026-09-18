// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/core/InputManager.js — Gestor de Teclado y Controles Táctiles (Turbo y Disparo)
// ==========================================================================

export class InputManager {
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    // Habilidad especial (⚡)
    this.action = false;
    this.actionPressed = false;

    // Turbo / Sprint (Nadar más rápido 🚀)
    this.sprint = false;

    // Disparo de balitas de la Flor de la Vida (🌸)
    this.shoot = false;
    this.shootPressed = false;

    // Estados de teclas
    this.keyUp = false;
    this.keyDown = false;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyAction = false;
    this.keySprint = false;
    this.keyShoot = false;

    // Punteros activos para multitouch
    this.activePointers = new Map();
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    this.initKeyboard();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // Movimiento
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.keyUp = true;
        this.up = true;
        e.preventDefault();
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.keyDown = true;
        this.down = true;
        e.preventDefault();
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.keyLeft = true;
        this.left = true;
        e.preventDefault();
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.keyRight = true;
        this.right = true;
        e.preventDefault();
      }

      // Turbo (Nadar más rápido con Shift o J)
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') {
        this.keySprint = true;
        this.sprint = true;
        e.preventDefault();
      }

      // Disparo de Balitas mágicas (Espacio o F)
      if (e.code === 'Space' || e.code === 'KeyF') {
        if (!this.shoot) this.shootPressed = true;
        this.keyShoot = true;
        this.shoot = true;
        e.preventDefault();
      }

      // Habilidad Especial de la Sirena (E o Q)
      if (e.code === 'KeyE' || e.code === 'KeyQ') {
        if (!this.action) this.actionPressed = true;
        this.keyAction = true;
        this.action = true;
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.keyUp = false;
        this.up = this.hasTouchAction('up');
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.keyDown = false;
        this.down = this.hasTouchAction('down');
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.keyLeft = false;
        this.left = this.hasTouchAction('left');
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.keyRight = false;
        this.right = this.hasTouchAction('right');
      }

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') {
        this.keySprint = false;
        this.sprint = this.hasTouchAction('sprint');
      }

      if (e.code === 'Space' || e.code === 'KeyF') {
        this.keyShoot = false;
        this.shoot = this.hasTouchAction('shoot');
      }

      if (e.code === 'KeyE' || e.code === 'KeyQ') {
        this.keyAction = false;
        this.action = this.hasTouchAction('action');
      }
    });
  }

  // Inicializa los controles virtuales táctiles en pantalla
  initTouchControls(dpadContainer, actionContainer) {
    if (this.isTouchDevice && dpadContainer && actionContainer) {
      dpadContainer.classList.add('active-touch');
      actionContainer.classList.add('active-touch');
    }

    const bindButton = (el, actionName) => {
      if (!el) return;

      const handleDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.activePointers.set(e.pointerId, actionName);
        el.classList.add('pressed');
        this.updateStateFromPointers();
      };

      const handleUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.activePointers.delete(e.pointerId);
        el.classList.remove('pressed');
        this.updateStateFromPointers();
      };

      el.addEventListener('pointerdown', handleDown, { passive: false });
      el.addEventListener('pointerup', handleUp, { passive: false });
      el.addEventListener('pointercancel', handleUp, { passive: false });
      el.addEventListener('pointerleave', handleUp, { passive: false });
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    };

    // D-Pad
    bindButton(document.getElementById('btn-dpad-up'), 'up');
    bindButton(document.getElementById('btn-dpad-down'), 'down');
    bindButton(document.getElementById('btn-dpad-left'), 'left');
    bindButton(document.getElementById('btn-dpad-right'), 'right');

    // Botones de acción táctiles
    bindButton(document.getElementById('btn-touch-action'), 'action');
    bindButton(document.getElementById('btn-touch-turbo'), 'sprint');
    bindButton(document.getElementById('btn-touch-shoot'), 'shoot');
  }

  updateStateFromPointers() {
    let tUp = false, tDown = false, tLeft = false, tRight = false;
    let tAction = false, tSprint = false, tShoot = false;

    for (const act of this.activePointers.values()) {
      if (act === 'up') tUp = true;
      if (act === 'down') tDown = true;
      if (act === 'left') tLeft = true;
      if (act === 'right') tRight = true;
      if (act === 'action') tAction = true;
      if (act === 'sprint') tSprint = true;
      if (act === 'shoot') tShoot = true;
    }

    this.up = tUp || this.keyUp;
    this.down = tDown || this.keyDown;
    this.left = tLeft || this.keyLeft;
    this.right = tRight || this.keyRight;

    // Turbo
    this.sprint = tSprint || this.keySprint;

    // Disparo
    const newShoot = tShoot || this.keyShoot;
    if (newShoot && !this.shoot) {
      this.shootPressed = true;
    }
    this.shoot = newShoot;

    // Habilidad
    const newAction = tAction || this.keyAction;
    if (newAction && !this.action) {
      this.actionPressed = true;
    }
    this.action = newAction;
  }

  hasTouchAction(actionName) {
    for (const act of this.activePointers.values()) {
      if (act === actionName) return true;
    }
    return false;
  }

  clearFrame() {
    this.actionPressed = false;
    this.shootPressed = false;
  }

  reset() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.action = false;
    this.actionPressed = false;
    this.sprint = false;
    this.shoot = false;
    this.shootPressed = false;

    this.keyUp = false;
    this.keyDown = false;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyAction = false;
    this.keySprint = false;
    this.keyShoot = false;

    this.activePointers.clear();
    document.querySelectorAll('.dpad-touch-btn, .action-touch-btn').forEach(btn => btn.classList.remove('pressed'));
  }
}

// © jjedi90 — Todos los derechos reservados.

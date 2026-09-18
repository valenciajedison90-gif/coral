// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/core/GameState.js — Máquina de Estados del Juego
// ==========================================================================

export const STATES = {
  MENU: 'MENU',
  CHARACTER_SELECT: 'CHARACTER_SELECT',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  QUESTION: 'QUESTION',
  CHECKPOINT_ACTIVE: 'CHECKPOINT_ACTIVE',
  VICTORY: 'VICTORY',
  GAME_OVER: 'GAME_OVER'
};

export class GameStateManager {
  constructor(initialState = STATES.MENU) {
    this.currentState = initialState;
    this.previousState = null;
    this.listeners = [];
  }

  changeState(newState) {
    if (this.currentState === newState) return;
    this.previousState = this.currentState;
    this.currentState = newState;
    this.notify(newState, this.previousState);
  }

  is(state) {
    return this.currentState === state;
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify(newState, oldState) {
    for (const listener of this.listeners) {
      try {
        listener(newState, oldState);
      } catch (err) {
        console.error("Error en cambio de estado:", err);
      }
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

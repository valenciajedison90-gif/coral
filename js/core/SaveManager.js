// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/core/SaveManager.js — Persistencia con LocalStorage
// ==========================================================================

const STORAGE_KEY = 'CORAL_SUBMARINE_ADVENTURE_SAVE';

export class SaveManager {
  static getDefaultData() {
    return {
      currentLevel: 1,
      coins: 0,
      xp: 0,
      lives: 3,
      unlockedLevels: [1],
      collectedKeys: {
        saber: false,
        valentia: false,
        amistad: false
      },
      checkpoint: {
        level: 1,
        x: 180,
        y: 600
      },
      selectedCharacter: 'aria',
      achievements: {
        primeraAventura: false,  // Recoge primera moneda
        pequenaExploradora: false, // Completa nivel 1
        granEstudiante: false,   // 10 preguntas correctas
        coleccionista: false,    // 50 monedas
        sinMiedo: false,         // Zona peligrosa
        rescatista: false        // Rescata a Lumi
      },
      soundMuted: false,
      hasSeenTutorial: false
    };
  }

  static hasSave() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  static saveGame(data) {
    try {
      const merged = { ...this.loadGame(), ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return true;
    } catch (e) {
      console.warn("No se pudo guardar la partida en LocalStorage:", e);
      return false;
    }
  }

  static loadGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaultData();
      const parsed = JSON.parse(raw);
      return { ...this.getDefaultData(), ...parsed };
    } catch (e) {
      console.warn("Error leyendo partida guardada, usando predeterminada:", e);
      return this.getDefaultData();
    }
  }

  static clearSave() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/player/PlayerManager.js — Gestión de Jugadores y Arquitectura de Turnos
// ==========================================================================

import { Mermaid } from './Mermaid.js';
import { RemoteMermaid } from './RemoteMermaid.js';

export class PlayerManager {
  constructor() {
    this.players = [];
    this.activePlayerIndex = 0;
    this.totalPlayers = 1; // Por defecto modo individual (1P), preparado para 2P, 3P, 4P
    this.remoteMermaids = new Map(); // Jugadores remotos conectados en línea
  }

  setupSinglePlayer(characterId, startX, startY) {
    this.players = [
      {
        id: 1,
        name: 'Jugador 1',
        mermaid: new Mermaid(startX, startY, characterId),
        coins: 0,
        xp: 0,
        lives: 3,
        missedTurns: 0
      }
    ];
    this.activePlayerIndex = 0;
    this.totalPlayers = 1;
  }

  setupMultiPlayer(playerConfigs, startX, startY) {
    this.players = playerConfigs.map((cfg, idx) => ({
      id: idx + 1,
      name: cfg.name || `Jugador ${idx + 1}`,
      mermaid: new Mermaid(startX, startY, cfg.characterId),
      coins: 0,
      xp: 0,
      lives: 3,
      missedTurns: 0
    }));
    this.activePlayerIndex = 0;
    this.totalPlayers = this.players.length;
  }

  getActivePlayer() {
    return this.players[this.activePlayerIndex] || null;
  }

  getActiveMermaid() {
    const active = this.getActivePlayer();
    return active ? active.mermaid : null;
  }

  // Pasa el turno al siguiente jugador (para cuando un enemigo atrapa a la sirena en multijugador)
  nextTurn() {
    if (this.totalPlayers <= 1) return null;

    let attempts = 0;
    do {
      this.activePlayerIndex = (this.activePlayerIndex + 1) % this.totalPlayers;
      attempts++;
    } while (this.players[this.activePlayerIndex].missedTurns > 0 && attempts < this.totalPlayers);

    // Reducir turnos perdidos pendientes
    this.players.forEach(p => {
      if (p.missedTurns > 0) p.missedTurns -= 1;
    });

    return this.getActivePlayer();
  }

  penalizeCurrentPlayerTurn(reason = "¡Te atrapó un enemigo! Pierdes este turno.") {
    const active = this.getActivePlayer();
    if (active && this.totalPlayers > 1) {
      active.missedTurns += 1;
      return this.nextTurn();
    }
    return null;
  }

  // --- Gestión de Jugadores en Línea (Multijugador Cooperativo) ---
  addRemoteMermaid(peerId, name, characterId, x, y) {
    const rm = new RemoteMermaid(peerId, name, characterId, x, y);
    this.remoteMermaids.set(peerId, rm);
    return rm;
  }

  removeRemoteMermaid(peerId) {
    this.remoteMermaids.delete(peerId);
  }

  updateRemoteMermaid(peerId, data) {
    let rm = this.remoteMermaids.get(peerId);
    if (!rm && data) {
      rm = this.addRemoteMermaid(peerId, data.name || 'Compañera', data.characterId || 'marina', data.x || 180, data.y || 600);
    }
    if (rm && data) {
      rm.setTargetState(data);
    }
    return rm;
  }

  updateAllRemote(dt, worldManager) {
    for (const rm of this.remoteMermaids.values()) {
      rm.updateRemote(dt, worldManager);
    }
  }

  drawAllRemote(ctx, camera) {
    for (const rm of this.remoteMermaids.values()) {
      rm.draw(ctx, camera);
    }
  }

  getAllMermaids() {
    const localMermaid = this.getActiveMermaid();
    const all = [];
    if (localMermaid) all.push(localMermaid);
    for (const rm of this.remoteMermaids.values()) {
      all.push(rm);
    }
    return all;
  }

  clearRemoteMermaids() {
    this.remoteMermaids.clear();
  }
}

// © jjedi90 — Todos los derechos reservados.

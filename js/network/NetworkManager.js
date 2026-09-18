// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/network/NetworkManager.js — Sincronización Multijugador WebRTC P2P (PeerJS)
// ==========================================================================

export const MSG_TYPES = {
  HELLO: 'HELLO',
  LOBBY_UPDATE: 'LOBBY_UPDATE',
  ROOM_FULL: 'ROOM_FULL',
  START_GAME: 'START_GAME',
  PLAYER_SYNC: 'PLAYER_SYNC',
  PLAYERS_STATE: 'PLAYERS_STATE',
  SHOOT: 'SHOOT',
  ITEM_COLLECTED: 'ITEM_COLLECTED',
  ENEMY_DEFEATED: 'ENEMY_DEFEATED',
  PORTAL_STATUS: 'PORTAL_STATUS',
  PORTAL_PROGRESS: 'PORTAL_PROGRESS',
  LEVEL_CLEAR: 'LEVEL_CLEAR',
  RESCUE_LUMI: 'RESCUE_LUMI',
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  PLAYER_LEFT: 'PLAYER_LEFT'
};

export class NetworkManager {
  constructor(game) {
    this.game = game;
    this.isOnline = false;
    this.isHost = false;
    this.roomCode = null;
    this.myPeerId = null;
    this.playerName = 'Sirena';
    this.myCharacterId = 'aria';

    this.peer = null;
    this.connections = new Map(); // Para el Host: peerId -> DataConnection
    this.hostConnection = null;   // Para el Cliente: DataConnection hacia el Host

    this.lobbyPlayers = [];
    this.portalPresence = new Map(); // peerId -> boolean (si está dentro del portal)
    this.syncInterval = null;
    this.lastSyncSent = 0;

    // Callbacks para la UI
    this.onLobbyUpdate = null;
    this.onGameStart = null;
    this.onStatusChange = null;
  }

  // Genera un código de sala de 5 caracteres amigable para niños (evitando caracteres confusos)
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // 1. CREAR SALA (HOST / ANFITRIÓN)
  createRoom(playerName, characterId, onReady, onError) {
    if (typeof window.Peer === 'undefined') {
      if (onError) onError('PeerJS no está disponible. Revisa tu conexión a internet.');
      return;
    }

    this.reset();
    this.playerName = playerName || 'Anfitriona';
    this.myCharacterId = characterId || 'aria';
    this.roomCode = this.generateRoomCode();
    const peerId = `coral-ocean-${this.roomCode.toLowerCase()}`;

    try {
      this.peer = new window.Peer(peerId, {
        debug: 1
      });
    } catch (e) {
      if (onError) onError('Error al crear la sala: ' + e.message);
      return;
    }

    this.peer.on('open', (id) => {
      this.isOnline = true;
      this.isHost = true;
      this.myPeerId = id;

      this.lobbyPlayers = [
        {
          peerId: this.myPeerId,
          name: this.playerName,
          characterId: this.myCharacterId,
          isHost: true,
          ready: true
        }
      ];

      if (onReady) onReady(this.roomCode);
      if (this.onLobbyUpdate) this.onLobbyUpdate(this.lobbyPlayers);
    });

    this.peer.on('connection', (conn) => {
      this.handleHostIncomingConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.warn('Peer error (Host):', err);
      if (err.type === 'unavailable-id') {
        // Código colisionado en el servidor global, reintentar con otro código
        this.createRoom(playerName, characterId, onReady, onError);
      } else {
        if (onError) onError('Error de conexión: ' + (err.message || err.type));
      }
    });

    this.peer.on('disconnected', () => {
      if (this.peer && !this.peer.destroyed) {
        this.peer.reconnect();
      }
    });
  }

  // Manejo de conexión entrante de un nuevo jugador (Host)
  handleHostIncomingConnection(conn) {
    conn.on('open', () => {
      // Si la sala ya tiene 4 jugadores, rechazar
      if (this.lobbyPlayers.length >= 4) {
        conn.send({ type: MSG_TYPES.ROOM_FULL });
        setTimeout(() => conn.close(), 600);
        return;
      }

      this.connections.set(conn.peer, conn);

      conn.on('data', (data) => {
        this.handleHostReceivedData(conn.peer, data);
      });

      conn.on('close', () => {
        this.handlePlayerDisconnected(conn.peer);
      });

      conn.on('error', (err) => {
        console.warn('Error en conexión de cliente:', err);
        this.handlePlayerDisconnected(conn.peer);
      });
    });
  }

  // 2. UNIRSE A SALA EXISTENTE (CLIENTE)
  joinRoom(roomCode, playerName, characterId, onConnected, onError) {
    if (typeof window.Peer === 'undefined') {
      if (onError) onError('PeerJS no está disponible. Revisa tu conexión a internet.');
      return;
    }

    this.reset();
    const cleanCode = (roomCode || '').trim().toUpperCase();
    if (!cleanCode) {
      if (onError) onError('Por favor ingresa un código de sala válido.');
      return;
    }

    this.playerName = playerName || 'Aventurera';
    this.myCharacterId = characterId || 'marina';
    this.roomCode = cleanCode;
    const targetHostPeerId = `coral-ocean-${cleanCode.toLowerCase()}`;

    try {
      this.peer = new window.Peer(null, { debug: 1 });
    } catch (e) {
      if (onError) onError('Error al iniciar multijugador: ' + e.message);
      return;
    }

    this.peer.on('open', (myId) => {
      this.myPeerId = myId;
      this.isOnline = true;
      this.isHost = false;

      // Conectar al anfitrión
      const conn = this.peer.connect(targetHostPeerId, { reliable: true });
      this.hostConnection = conn;

      conn.on('open', () => {
        // Enviar saludo inicial con nombre y sirena seleccionada
        conn.send({
          type: MSG_TYPES.HELLO,
          peerId: this.myPeerId,
          name: this.playerName,
          characterId: this.myCharacterId
        });

        if (onConnected) onConnected(this.roomCode);
      });

      conn.on('data', (data) => {
        this.handleClientReceivedData(data);
      });

      conn.on('close', () => {
        this.game.showToast('⚠️ Se perdió la conexión con el anfitrión.');
        this.reset();
        this.game.returnToMainMenu();
      });

      conn.on('error', (err) => {
        if (onError) onError('No se pudo conectar con la sala: ' + (err.message || 'Código incorrecto o sala cerrada.'));
      });
    });

    this.peer.on('error', (err) => {
      console.warn('Peer error (Client):', err);
      if (onError) onError('Error al conectar: ' + (err.message || err.type));
    });
  }

  // --- PROCESAMIENTO DE MENSAJES EN EL HOST ---
  handleHostReceivedData(fromPeerId, msg) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case MSG_TYPES.HELLO: {
        // Registrar nuevo jugador
        const newPlayer = {
          peerId: fromPeerId,
          name: msg.name || 'Compañera',
          characterId: msg.characterId || 'marina',
          isHost: false,
          ready: true
        };
        this.lobbyPlayers.push(newPlayer);

        // Notificar a todos la nueva lista de jugadores
        this.broadcast({
          type: MSG_TYPES.LOBBY_UPDATE,
          players: this.lobbyPlayers
        });

        if (this.onLobbyUpdate) this.onLobbyUpdate(this.lobbyPlayers);
        this.game.showToast(`👋 ¡${newPlayer.name} se ha unido a la sala!`);
        break;
      }

      case MSG_TYPES.PLAYER_SYNC: {
        // El Host actualiza la sirena remota correspondiente
        this.game.playerManager.updateRemoteMermaid(fromPeerId, msg.data);
        // Retransmitir a los demás clientes
        this.broadcastExcept(fromPeerId, {
          type: MSG_TYPES.PLAYERS_STATE,
          peerId: fromPeerId,
          data: msg.data
        });
        break;
      }

      case MSG_TYPES.SHOOT: {
        // Un cliente disparó una balita
        this.game.handleRemotePlayerShoot(msg.bullet);
        this.broadcastExcept(fromPeerId, msg);
        break;
      }

      case MSG_TYPES.ITEM_COLLECTED: {
        // Sincronizar recolección de monedas/llaves para todo el equipo
        this.game.handleRemoteItemCollected(msg.itemType, msg.itemId, msg.value);
        this.broadcastExcept(fromPeerId, msg);
        break;
      }

      case MSG_TYPES.ENEMY_DEFEATED: {
        this.game.handleRemoteEnemyDefeated(msg.enemyId);
        this.broadcastExcept(fromPeerId, msg);
        break;
      }

      case MSG_TYPES.PORTAL_STATUS: {
        // Estado de si este jugador está en el portal
        this.portalPresence.set(fromPeerId, !!msg.inPortal);
        this.evaluateCooperativePortalProgression();
        break;
      }
    }
  }

  // --- PROCESAMIENTO DE MENSAJES EN EL CLIENTE ---
  handleClientReceivedData(msg) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case MSG_TYPES.LOBBY_UPDATE: {
        this.lobbyPlayers = msg.players || [];
        if (this.onLobbyUpdate) this.onLobbyUpdate(this.lobbyPlayers);
        break;
      }

      case MSG_TYPES.ROOM_FULL: {
        alert('La sala ya tiene el límite máximo de 4 jugadores.');
        this.reset();
        break;
      }

      case MSG_TYPES.START_GAME: {
        this.lobbyPlayers = msg.players || [];
        if (this.onGameStart) this.onGameStart(msg.levelIndex, this.lobbyPlayers);
        break;
      }

      case MSG_TYPES.PLAYERS_STATE: {
        if (msg.peerId !== this.myPeerId) {
          this.game.playerManager.updateRemoteMermaid(msg.peerId, msg.data);
        }
        break;
      }

      case MSG_TYPES.SHOOT: {
        if (msg.fromPeerId !== this.myPeerId) {
          this.game.handleRemotePlayerShoot(msg.bullet);
        }
        break;
      }

      case MSG_TYPES.ITEM_COLLECTED: {
        this.game.handleRemoteItemCollected(msg.itemType, msg.itemId, msg.value);
        break;
      }

      case MSG_TYPES.ENEMY_DEFEATED: {
        this.game.handleRemoteEnemyDefeated(msg.enemyId);
        break;
      }

      case MSG_TYPES.PORTAL_PROGRESS: {
        this.game.updateCooperativePortalHUD(msg.current, msg.total);
        break;
      }

      case MSG_TYPES.LEVEL_CLEAR: {
        this.game.handleCooperativeLevelClear(msg.nextLevel);
        break;
      }

      case MSG_TYPES.RESCUE_LUMI: {
        this.game.handleCooperativeVictory();
        break;
      }

      case MSG_TYPES.PLAYER_LEFT: {
        this.game.playerManager.removeRemoteMermaid(msg.peerId);
        this.game.showToast(`🧜‍♀️ ${msg.name || 'Una compañera'} ha salido de la aventura.`);
        break;
      }
    }
  }

  // Desconexión de un jugador
  handlePlayerDisconnected(peerId) {
    this.connections.delete(peerId);
    this.portalPresence.delete(peerId);
    const playerIndex = this.lobbyPlayers.findIndex(p => p.peerId === peerId);
    let playerName = 'Una compañera';

    if (playerIndex !== -1) {
      playerName = this.lobbyPlayers[playerIndex].name;
      this.lobbyPlayers.splice(playerIndex, 1);
    }

    this.game.playerManager.removeRemoteMermaid(peerId);
    this.game.showToast(`🧜‍♀️ ${playerName} se ha desconectado.`);

    if (this.isHost) {
      this.broadcast({
        type: MSG_TYPES.PLAYER_LEFT,
        peerId,
        name: playerName
      });
      if (this.onLobbyUpdate) this.onLobbyUpdate(this.lobbyPlayers);
      this.evaluateCooperativePortalProgression();
    }
  }

  // Iniciar la aventura (Solo el Anfitrión)
  startGame() {
    if (!this.isHost) return;
    this.broadcast({
      type: MSG_TYPES.START_GAME,
      levelIndex: 1,
      players: this.lobbyPlayers
    });
    if (this.onGameStart) this.onGameStart(1, this.lobbyPlayers);
  }

  // Emisión regular de posición local (20 a 30 veces por segundo)
  sendLocalPlayerSync(mermaid) {
    if (!this.isOnline || !mermaid) return;

    const now = Date.now();
    if (now - this.lastSyncSent < 35) return; // ~28 Hz
    this.lastSyncSent = now;

    const data = {
      name: this.playerName,
      characterId: mermaid.character.id,
      x: Math.round(mermaid.x),
      y: Math.round(mermaid.y),
      vx: Math.round(mermaid.vx),
      vy: Math.round(mermaid.vy),
      facing: mermaid.facing,
      isSprinting: mermaid.isSprinting,
      hasFlowerPower: mermaid.hasFlowerPower,
      lives: this.game.lives
    };

    if (this.isHost) {
      // El Host retransmite su posición a todos los clientes
      this.broadcast({
        type: MSG_TYPES.PLAYERS_STATE,
        peerId: this.myPeerId,
        data
      });
    } else if (this.hostConnection && this.hostConnection.open) {
      // El Cliente envía su posición al Host
      this.hostConnection.send({
        type: MSG_TYPES.PLAYER_SYNC,
        data
      });
    }
  }

  // Notificar disparo de balita mágica floral
  broadcastShoot(bullet) {
    if (!this.isOnline || !bullet) return;
    const msg = {
      type: MSG_TYPES.SHOOT,
      fromPeerId: this.myPeerId,
      bullet: {
        x: Math.round(bullet.x),
        y: Math.round(bullet.y),
        vx: Math.round(bullet.vx),
        vy: Math.round(bullet.vy)
      }
    };

    if (this.isHost) {
      this.broadcast(msg);
    } else if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(msg);
    }
  }

  // Notificar recolección de ítem (moneda, perla, llave)
  broadcastItemCollected(itemType, itemId, value) {
    if (!this.isOnline) return;
    const msg = {
      type: MSG_TYPES.ITEM_COLLECTED,
      itemType,
      itemId,
      value,
      collectedBy: this.playerName
    };

    if (this.isHost) {
      this.broadcast(msg);
    } else if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(msg);
    }
  }

  // Notificar criatura enemiga neutralizada
  broadcastEnemyDefeated(enemyId) {
    if (!this.isOnline) return;
    const msg = {
      type: MSG_TYPES.ENEMY_DEFEATED,
      enemyId
    };

    if (this.isHost) {
      this.broadcast(msg);
    } else if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(msg);
    }
  }

  // Enviar estado de presencia en el portal cooperativo
  sendPortalPresence(isInside) {
    if (!this.isOnline) return;

    if (this.isHost) {
      this.portalPresence.set(this.myPeerId, isInside);
      this.evaluateCooperativePortalProgression();
    } else if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send({
        type: MSG_TYPES.PORTAL_STATUS,
        inPortal: isInside
      });
    }
  }

  // Evalúa si todas las sirenas conectadas están en el portal (Solo Host)
  evaluateCooperativePortalProgression() {
    if (!this.isHost || !this.isOnline) return;

    const totalPlayers = this.lobbyPlayers.length;
    let inPortalCount = 0;

    for (const player of this.lobbyPlayers) {
      if (this.portalPresence.get(player.peerId)) {
        inPortalCount++;
      }
    }

    // Informar a todos del progreso
    this.broadcast({
      type: MSG_TYPES.PORTAL_PROGRESS,
      current: inPortalCount,
      total: totalPlayers
    });
    this.game.updateCooperativePortalHUD(inPortalCount, totalPlayers);

    // ¿Están todas las sirenas en el portal?
    if (inPortalCount === totalPlayers && totalPlayers > 0) {
      const nextLevel = this.game.currentLevelIndex + 1;
      this.broadcast({
        type: MSG_TYPES.LEVEL_CLEAR,
        nextLevel
      });
      this.game.handleCooperativeLevelClear(nextLevel);
    }
  }

  // Notificar victoria final cooperativa
  broadcastVictory() {
    if (this.isHost) {
      this.broadcast({ type: MSG_TYPES.RESCUE_LUMI });
    }
  }

  // Enviar mensaje a todas las conexiones activas (Host)
  broadcast(msg) {
    for (const conn of this.connections.values()) {
      if (conn.open) {
        conn.send(msg);
      }
    }
  }

  // Enviar mensaje a todas las conexiones excepto a una (Host)
  broadcastExcept(exceptPeerId, msg) {
    for (const [id, conn] of this.connections.entries()) {
      if (id !== exceptPeerId && conn.open) {
        conn.send(msg);
      }
    }
  }

  reset() {
    this.isOnline = false;
    this.isHost = false;
    this.roomCode = null;
    this.lobbyPlayers = [];
    this.portalPresence.clear();

    if (this.connections) {
      for (const conn of this.connections.values()) {
        try { conn.close(); } catch (_) {}
      }
      this.connections.clear();
    }

    if (this.hostConnection) {
      try { this.hostConnection.close(); } catch (_) {}
      this.hostConnection = null;
    }

    if (this.peer) {
      try { this.peer.destroy(); } catch (_) {}
      this.peer = null;
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

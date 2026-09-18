// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/player/RemoteMermaid.js — Sirena de Jugadores Compañeros en Multijugador
// ==========================================================================

import { Mermaid } from './Mermaid.js';

export class RemoteMermaid extends Mermaid {
  constructor(peerId, name, characterId, x, y) {
    super(x, y, characterId);
    this.peerId = peerId;
    this.name = name || 'Sirena Compañera';
    this.targetX = x;
    this.targetY = y;
    this.interpolationSpeed = 14; // Factor Lerp para suavizado de red
    this.lastPacketTime = Date.now();
  }

  setTargetState(data) {
    if (typeof data.x === 'number') this.targetX = data.x;
    if (typeof data.y === 'number') this.targetY = data.y;
    if (typeof data.vx === 'number') this.vx = data.vx;
    if (typeof data.vy === 'number') this.vy = data.vy;
    if (typeof data.facing === 'number') this.facing = data.facing;
    if (typeof data.isSprinting === 'boolean') this.isSprinting = data.isSprinting;
    if (typeof data.hasFlowerPower === 'boolean') this.hasFlowerPower = data.hasFlowerPower;
    if (data.characterId && data.characterId !== this.character.id) {
      this.setCharacter(data.characterId);
    }
    this.lastPacketTime = Date.now();
  }

  updateRemote(dt, worldManager) {
    // Interpolación suave (lerp) hacia la última posición recibida
    const factor = Math.min(1, this.interpolationSpeed * dt);
    this.x += (this.targetX - this.x) * factor;
    this.y += (this.targetY - this.y) * factor;

    // Velocidad aparente para animación de nado
    const isMoving = Math.abs(this.targetX - this.x) > 0.5 || Math.abs(this.targetY - this.y) > 0.5 || Math.abs(this.vx) > 5 || Math.abs(this.vy) > 5;
    if (isMoving) {
      this.animTimer += dt * (this.isSprinting ? 9.0 : 5.5);
    }

    if (this.shootCooldown > 0) {
      this.shootCooldown -= dt;
    }

    // Estela de burbujas en compañeras
    if (worldManager && isMoving) {
      const bubbleChance = this.isSprinting ? 0.35 : 0.08;
      if (Math.random() < bubbleChance) {
        const bX = this.x + (this.facing === 1 ? 0 : this.width);
        const bY = this.y + this.height - 10;
        worldManager.spawnBubbles(bX, bY, 1);
      }
    }
  }

  draw(ctx, camera) {
    super.draw(ctx, camera);

    // Dibujar etiqueta flotante con nombre sobre la sirena
    if (camera.isVisible(this.x - 30, this.y - 30, this.width + 60, 24)) {
      const sp = camera.worldToScreen(this.x + this.width / 2, this.y - 12);
      ctx.save();
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const label = `🧜‍♀️ ${this.name}`;
      const metrics = ctx.measureText(label);
      const padX = 7;
      const padY = 3;

      // Fondo de la etiqueta con borde del color de la sirena
      ctx.fillStyle = 'rgba(3, 18, 30, 0.85)';
      ctx.strokeStyle = this.character.colorTail || '#2ad5c4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(sp.x - metrics.width / 2 - padX, sp.y - 8 - padY, metrics.width + padX * 2, 16 + padY, 8);
      ctx.fill();
      ctx.stroke();

      // Texto blanco luminoso
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, sp.x, sp.y);
      ctx.restore();
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

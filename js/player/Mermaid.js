// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/player/Mermaid.js — Física de Nado, Turbo, Disparos y Gráficos Embellecidos
// ==========================================================================

import { MERMAID_PROFILES } from './MermaidAbilities.js';
import { BubbleBullet } from '../items/Projectile.js';

export class Mermaid {
  constructor(x, y, characterId = 'aria') {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = 44;
    this.height = 50;

    this.vx = 0;
    this.vy = 0;
    this.baseSpeed = 195;
    this.speed = this.baseSpeed;
    this.acceleration = 720;
    this.waterDrag = 0.88; // Inercia fluida del agua

    this.facing = 1; // 1: Derecha, -1: Izquierda
    this.character = MERMAID_PROFILES[characterId] || MERMAID_PROFILES.aria;

    // Habilidades y Poderes
    this.abilityTimer = 0;
    this.abilityCooldownTimer = 0;
    this.hasActiveShield = false;
    this.hasFreeRetry = (characterId === 'coral');
    this.hasFreeHint = (characterId === 'aria');

    // Novedades: Modo Turbo y Poder de la Flor de la Vida
    this.isSprinting = false;
    this.hasFlowerPower = false;
    this.shootCooldown = 0;

    // Efectos de Invulnerabilidad y Animación
    this.invulnerableTimer = 0;
    this.animTimer = 0;
    this.bubbleTimer = 0;
  }

  setCharacter(characterId) {
    this.character = MERMAID_PROFILES[characterId] || MERMAID_PROFILES.aria;
    this.hasFreeRetry = (characterId === 'coral');
    this.hasFreeHint = (characterId === 'aria');
    this.hasActiveShield = false;
    this.abilityTimer = 0;
    this.abilityCooldownTimer = 0;
  }

  resetPosition(x = this.startX, y = this.startY) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.invulnerableTimer = 1.6;
    this.isSprinting = false;
  }

  triggerAbility(audioManager) {
    if (this.character.id === 'marina') {
      if (this.abilityCooldownTimer <= 0) {
        this.abilityTimer = 3.5;
        this.abilityCooldownTimer = this.character.cooldown;
        if (audioManager) audioManager.playDash();
        return true;
      }
    } else if (this.character.id === 'naya') {
      if (this.abilityCooldownTimer <= 0 && !this.hasActiveShield) {
        this.hasActiveShield = true;
        this.abilityCooldownTimer = this.character.cooldown;
        if (audioManager) audioManager.playShield();
        return true;
      }
    }
    return false;
  }

  // Disparo de balita de burbuja mágica (requiere Flor de la Vida)
  shoot(audioManager, worldManager) {
    if (!this.hasFlowerPower || this.shootCooldown > 0) return null;

    this.shootCooldown = 0.22; // Recarga ágil y divertida

    // Posición de salida desde las manos de la sirena
    const spawnX = this.x + this.width / 2 + this.facing * 20;
    const spawnY = this.y + this.height / 2 - 2;

    // Vector de disparo ligeramente influenciado por el nado vertical
    let dirX = this.facing;
    let dirY = (this.vy / (this.speed || 1)) * 0.45;

    const bullet = new BubbleBullet(spawnX, spawnY, dirX, dirY, 520);

    if (audioManager) {
      audioManager.playShoot();
    }

    if (worldManager) {
      worldManager.spawnSparkles(spawnX, spawnY, 8, '#f472b6');
      worldManager.spawnBubbles(spawnX, spawnY, 2);
    }

    return bullet;
  }

  update(dt, input, solidObstacles = [], worldBounds, worldManager, audioManager) {
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.abilityCooldownTimer > 0) this.abilityCooldownTimer -= dt;
    if (this.shootCooldown > 0) this.shootCooldown -= dt;

    // Comprobar si está nadando en Turbo (Sprint)
    this.isSprinting = !!input.sprint;

    let targetSpeed = this.baseSpeed;
    if (this.abilityTimer > 0) {
      this.abilityTimer -= dt;
      targetSpeed *= 1.4; // Boost de Marina
    }

    if (this.isSprinting) {
      targetSpeed *= 1.75; // ¡Turbo activado!
    }
    this.speed = targetSpeed;

    // Activar habilidad si se presiona la tecla de acción
    if (input.actionPressed) {
      this.triggerAbility(audioManager);
    }

    // Movimiento en 4 Direcciones
    let moveX = 0;
    let moveY = 0;

    if (input.left) moveX -= 1;
    if (input.right) moveX += 1;
    if (input.up) moveY -= 1;
    if (input.down) moveY += 1;

    if (moveX !== 0 && moveY !== 0) {
      const invSqrt = 0.7071;
      moveX *= invSqrt;
      moveY *= invSqrt;
    }

    if (moveX !== 0 || moveY !== 0) {
      const currentAccel = this.isSprinting ? this.acceleration * 1.6 : this.acceleration;
      this.vx += moveX * currentAccel * dt;
      this.vy += moveY * currentAccel * dt;

      const currentSpeed = Math.hypot(this.vx, this.vy);
      if (currentSpeed > this.speed) {
        this.vx = (this.vx / currentSpeed) * this.speed;
        this.vy = (this.vy / currentSpeed) * this.speed;
      }

      if (moveX !== 0) {
        this.facing = moveX > 0 ? 1 : -1;
      }

      // Animación más rápida en turbo
      this.animTimer += dt * (this.isSprinting ? 15 : 8);

      // Emisión de burbujas y sonido de turbo (más abundante en turbo)
      if (this.isSprinting && audioManager) {
        audioManager.playSprint();
      }
      this.bubbleTimer += dt;
      const bubbleInterval = this.isSprinting ? 0.05 : 0.12;
      if (this.bubbleTimer > bubbleInterval && worldManager) {
        this.bubbleTimer = 0;
        worldManager.spawnBubbles(
          this.x + this.width / 2 - this.facing * 20,
          this.y + this.height / 2 + 6,
          this.isSprinting ? 4 : 2
        );
      }
    } else {
      this.vx *= this.waterDrag;
      this.vy *= this.waterDrag;
      if (Math.abs(this.vx) < 4) this.vx = 0;
      if (Math.abs(this.vy) < 4) this.vy = 0;
      this.animTimer += dt * 2.5;
    }

    // Colisiones con obstáculos sólidos
    this.x += this.vx * dt;
    this.handleCollisionsX(solidObstacles);

    this.y += this.vy * dt;
    this.handleCollisionsY(solidObstacles);

    // Delimitar dentro del mundo
    if (worldBounds) {
      this.x = Math.max(10, Math.min(this.x, worldBounds.width - this.width - 10));
      this.y = Math.max(10, Math.min(this.y, worldBounds.height - this.height - 10));
    }
  }

  handleCollisionsX(obstacles) {
    const box = { x: this.x + 4, y: this.y + 4, width: this.width - 8, height: this.height - 8 };
    for (const obs of obstacles) {
      if (this.intersects(box, obs)) {
        if (this.vx > 0) this.x = obs.x - this.width + 4;
        else if (this.vx < 0) this.x = obs.x + obs.width - 4;
        this.vx = 0;
        break;
      }
    }
  }

  handleCollisionsY(obstacles) {
    const box = { x: this.x + 4, y: this.y + 4, width: this.width - 8, height: this.height - 8 };
    for (const obs of obstacles) {
      if (this.intersects(box, obs)) {
        if (this.vy > 0) this.y = obs.y - this.height + 4;
        else if (this.vy < 0) this.y = obs.y + obs.height - 4;
        this.vy = 0;
        break;
      }
    }
  }

  intersects(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  draw(ctx, camera) {
    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 90) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
    ctx.scale(this.facing, 1);

    const tailWave = Math.sin(this.animTimer) * 7;
    const bodyTilt = (this.vy / this.speed) * 0.28;
    ctx.rotate(bodyTilt);

    // Halo sagrado de la Flor de la Vida si tiene el poder
    if (this.hasFlowerPower) {
      const flowerPulse = Math.sin(Date.now() / 200) * 3;
      ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
      ctx.beginPath();
      ctx.arc(0, 0, 32 + flowerPulse, 0, Math.PI * 2);
      ctx.fill();
    }

    // Estela de velocidad si está en Turbo
    if (this.isSprinting) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.beginPath();
      ctx.ellipse(-14, 14, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Escudo de burbuja si está activo
    if (this.hasActiveShield) {
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 32 + Math.sin(this.animTimer * 2) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    }

    // 1. Cola de Sirena Ondulante con Escamas Detalladas
    const { colorTail, colorFin, colorHair, colorTop } = this.character;

    // Gradiente de cola
    const tailGrad = ctx.createLinearGradient(-4, 6, -18 - tailWave, 28);
    tailGrad.addColorStop(0, colorTail);
    tailGrad.addColorStop(1, colorFin);

    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(-4, 6);
    ctx.quadraticCurveTo(-14 - tailWave * 0.5, 14, -18 - tailWave, 28);
    ctx.lineTo(-11 - tailWave, 28);
    ctx.quadraticCurveTo(-7 - tailWave * 0.5, 14, 4, 6);
    ctx.closePath();
    ctx.fill();

    // Textura de escamas brillantes en la cola
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    for (let r = 10; r <= 24; r += 5) {
      const offsetX = -r * 0.4 - tailWave * (r / 28);
      ctx.beginPath();
      ctx.arc(offsetX, r, 3, 0.2 * Math.PI, 1.2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(offsetX + 5, r + 2, 3, 0.2 * Math.PI, 1.2 * Math.PI);
      ctx.stroke();
    }

    // Aleta caudal doble con reflejos irisados
    ctx.fillStyle = colorFin;
    ctx.beginPath();
    ctx.moveTo(-15 - tailWave, 28);
    ctx.quadraticCurveTo(-28 - tailWave, 38, -22 - tailWave, 43);
    ctx.lineTo(-15 - tailWave, 32);
    ctx.lineTo(-8 - tailWave, 43);
    ctx.quadraticCurveTo(-2 - tailWave, 38, -15 - tailWave, 28);
    ctx.fill();

    // Líneas finas decorativas de la aleta
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-15 - tailWave, 28);
    ctx.lineTo(-20 - tailWave, 39);
    ctx.moveTo(-15 - tailWave, 28);
    ctx.lineTo(-10 - tailWave, 39);
    ctx.stroke();

    // 2. Torso de la Sirena
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.roundRect(-8, -10, 16, 18, 4);
    ctx.fill();

    // Top de conchas marinas con perla central
    ctx.fillStyle = colorTop;
    ctx.beginPath();
    ctx.arc(-4, -4, 5, 0, Math.PI * 2);
    ctx.arc(4, -4, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -4, 2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Cabeza y Rostro Encantador
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -16, 11, 0, Math.PI * 2);
    ctx.fill();

    // Mejillas sonrosadas
    ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
    ctx.beginPath();
    ctx.arc(-5, -13, 2.8, 0, Math.PI * 2);
    ctx.arc(5, -13, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Cabello flotante ondeando en capas
    ctx.fillStyle = colorHair;
    ctx.beginPath();
    ctx.moveTo(0, -27);
    ctx.quadraticCurveTo(-18 - tailWave * 0.6, -18, -16 - tailWave * 0.8, -2);
    ctx.quadraticCurveTo(-8, -10, -2, -18);
    ctx.closePath();
    ctx.fill();

    // Capa frontal y flequillo
    ctx.beginPath();
    ctx.arc(0, -20, 11.5, Math.PI * 0.85, Math.PI * 2.15);
    ctx.fill();

    // Ojos grandes expresivos tipo animación moderna
    // Esclerótica
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(3.5, -16, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Iris brillante
    ctx.fillStyle = colorTail;
    ctx.beginPath();
    ctx.arc(4.2, -16, 2.4, 0, Math.PI * 2);
    ctx.fill();

    // Pupila
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(4.5, -16, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Doble brillo en el ojo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(3.8, -17.2, 1, 0, Math.PI * 2);
    ctx.arc(5.2, -15.2, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Sonrisa tierna
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(4, -12.5, 2.8, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Corona de la Flor de la Vida (si tiene el poder) o Diadema de Estrella
    if (this.hasFlowerPower) {
      // Flores mágicas brillantes en el cabello
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(6, -24, 4, 0, Math.PI * 2);
      ctx.arc(-2, -26, 3.5, 0, Math.PI * 2);
      ctx.arc(12, -21, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Centro dorado de las flores
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(6, -24, 1.8, 0, Math.PI * 2);
      ctx.arc(-2, -26, 1.5, 0, Math.PI * 2);
      ctx.arc(12, -21, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Estrella dorada normal
      ctx.fillStyle = '#ffd152';
      ctx.beginPath();
      ctx.arc(6, -23, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Brazos nadando (posicionamiento según si dispara o nada)
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    if (this.shootCooldown > 0) {
      // Brazo extendido hacia adelante disparando
      ctx.ellipse(9, -6, 8, 3, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(6, -6, 3.5, 7.5, Math.PI / 4, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

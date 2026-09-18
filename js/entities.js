// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// ==========================================================================

// Entidades del juego: Jugador, Enemigos, Monedas, Plataformas, Peligros y Meta

class Player {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 38;

    this.vx = 0;
    this.vy = 0;
    this.speed = 220;
    this.jumpForce = -420;
    this.gravity = 980;

    this.onGround = false;
    this.facing = 1; // 1: Derecha, -1: Izquierda
    this.standingOnPlatform = null;

    // Mejoras de control estilo juego profesional
    this.coyoteTimer = 0;
    this.maxCoyoteTime = 0.12; // segundos permitidos para saltar tras caer de una repisa
    this.jumpBuffer = 0;
    this.maxJumpBuffer = 0.12; // segundos para recordar la pulsación de salto antes de tocar el suelo

    // Estados visuales y de daño
    this.invulnerableTimer = 0;
    this.animTimer = 0;
    this.isDead = false;
  }

  reset(x = this.startX, y = this.startY) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.standingOnPlatform = null;
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;
    this.invulnerableTimer = 1.0; // Breve protección tras revivir
    this.isDead = false;
  }

  update(dt, input, platforms) {
    if (this.isDead) return;

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Temporizadores de coyote y buffer
    if (this.onGround) {
      this.coyoteTimer = this.maxCoyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    if (input.jumpPressed) {
      this.jumpBuffer = this.maxJumpBuffer;
    } else {
      this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    }

    // Movimiento Horizontal
    let moveDir = 0;
    if (input.left) moveDir -= 1;
    if (input.right) moveDir += 1;

    if (moveDir !== 0) {
      this.facing = moveDir;
      this.vx = moveDir * this.speed;
      this.animTimer += dt * 12;
    } else {
      this.vx *= 0.7; // Fricción al detenerse
      if (Math.abs(this.vx) < 5) this.vx = 0;
      this.animTimer = 0;
    }

    // Salto con altura variable
    if (this.jumpBuffer > 0 && this.coyoteTimer > 0) {
      this.vy = this.jumpForce;
      this.onGround = false;
      this.standingOnPlatform = null;
      this.coyoteTimer = 0;
      this.jumpBuffer = 0;
      if (window.audioManager) window.audioManager.playJump();
      if (window.particleSystem) window.particleSystem.createDust(this.x + this.width / 2, this.y + this.height);
    }

    // Salto corto si suelta el botón antes de la cúspide
    if (!input.jump && this.vy < -100) {
      this.vy *= 0.55;
    }

    // Gravedad
    this.vy += this.gravity * dt;
    if (this.vy > 650) this.vy = 650; // Velocidad terminal

    // Si estaba sobre una plataforma móvil descendente, mantenerlo adherido suavemente
    if (this.onGround && this.standingOnPlatform && this.standingOnPlatform.isMoving) {
      if (this.standingOnPlatform.vy > 0) {
        this.y = this.standingOnPlatform.y - this.height;
      }
    }

    // Actualización y colisiones en dos ejes separados (X, luego Y)
    this.x += this.vx * dt;
    this.handleHorizontalCollisions(platforms);

    const wasOnGround = this.onGround;
    this.y += this.vy * dt;
    this.onGround = false;
    this.standingOnPlatform = null;
    this.handleVerticalCollisions(platforms, dt);

    // Si acabamos de aterrizar, generar polvo
    if (!wasOnGround && this.onGround && this.vy >= 0) {
      if (window.particleSystem) window.particleSystem.createDust(this.x + this.width / 2, this.y + this.height);
    }
  }

  handleHorizontalCollisions(platforms) {
    // Caja de prueba ligeramente recortada verticalmente para evitar falsos positivos con el suelo
    const testBox = {
      x: this.x,
      y: this.y + 4,
      width: this.width,
      height: this.height - 8
    };

    for (const plat of platforms) {
      if (plat.isOneWay) continue; // Plataformas semi-sólidas no chocan en horizontal
      if (this.checkCollision(testBox, plat)) {
        if (this.vx > 0) {
          this.x = plat.x - this.width;
        } else if (this.vx < 0) {
          this.x = plat.x + plat.width;
        }
        this.vx = 0;
        testBox.x = this.x;
      }
    }
  }

  handleVerticalCollisions(platforms, dt) {
    for (const plat of platforms) {
      if (plat.isOneWay) {
        // Solo colisiona al caer desde arriba
        const prevBottom = (this.y - this.vy * dt) + this.height;
        const currentBottom = this.y + this.height;
        if (
          this.vy >= 0 &&
          prevBottom <= plat.y + 12 &&
          currentBottom >= plat.y &&
          this.x + this.width > plat.x + 4 &&
          this.x < plat.x + plat.width - 4
        ) {
          this.y = plat.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.standingOnPlatform = plat;
          if (plat.vx) this.x += plat.vx * dt;
        }
        continue;
      }

      // Caja de prueba vertical ligeramente recortada horizontalmente
      const testBox = {
        x: this.x + 3,
        y: this.y,
        width: this.width - 6,
        height: this.height
      };

      if (this.checkCollision(testBox, plat)) {
        if (this.vy > 0) {
          this.y = plat.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.standingOnPlatform = plat;
          if (plat.vx) this.x += plat.vx * dt;
        } else if (this.vy < 0) {
          this.y = plat.y + plat.height;
          this.vy = 0;
        }
      }
    }
  }

  checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  draw(ctx, cameraX, cameraY) {
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y - cameraY);

    // Parpadeo durante invulnerabilidad
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
    ctx.scale(this.facing, 1);

    const legOffset = this.onGround && Math.abs(this.vx) > 10 ? Math.sin(this.animTimer) * 5 : 0;
    const bodyBob = this.onGround && Math.abs(this.vx) > 10 ? Math.abs(Math.cos(this.animTimer)) * 2 : 0;

    // Sombra suave en el suelo si está cerca
    if (this.onGround) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(0, this.height / 2 - 2, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Piernas / Zapatos
    ctx.fillStyle = '#0f172a';
    if (!this.onGround) {
      // Piernas encogidas en el aire
      ctx.fillRect(-10, this.height / 2 - 12, 8, 10);
      ctx.fillRect(2, this.height / 2 - 8, 8, 8);
    } else {
      ctx.fillRect(-10, this.height / 2 - 10 + legOffset, 8, 10 - legOffset);
      ctx.fillRect(2, this.height / 2 - 10 - legOffset, 8, 10 + legOffset);
    }

    // Cuerpo / Traje (Azul eléctrico vibrante)
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(-12, -10 + bodyBob, 24, 22, 6);
    ctx.fill();

    // Cinturón / Detalle
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-12, 4 + bodyBob, 24, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3, 3 + bodyBob, 6, 6);

    // Cabeza / Casco (Color cian / blanco con visor)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -11 + bodyBob, 12, 0, Math.PI * 2);
    ctx.fill();

    // Visor oscuro con reflejo brillante
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(1, -16 + bodyBob, 10, 8, 3);
    ctx.fill();

    // Brillo del visor
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(4, -15 + bodyBob, 4, 3);

    // Gorro / Pompón divertido arriba del casco
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -23 + bodyBob, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Enemy {
  constructor(x, y, patrolDist = 90, speed = 55) {
    this.startX = x;
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 24;
    this.minX = x - patrolDist / 2;
    this.maxX = x + patrolDist / 2;
    this.speed = speed;
    this.vx = speed;
    this.isDead = false;
    this.animTimer = Math.random() * 10;
  }

  update(dt, platforms) {
    if (this.isDead) return;

    this.animTimer += dt * 6;
    this.x += this.vx * dt;

    // Cambiar de dirección al llegar a los límites de patrulla
    if (this.x <= this.minX) {
      this.x = this.minX;
      this.vx = Math.abs(this.speed);
    } else if (this.x >= this.maxX) {
      this.x = this.maxX;
      this.vx = -Math.abs(this.speed);
    }

    // Colisión con paredes de bloques
    for (const plat of platforms) {
      if (plat.isOneWay) continue;
      if (
        this.x < plat.x + plat.width &&
        this.x + this.width > plat.x &&
        this.y < plat.y + plat.height &&
        this.y + this.height > plat.y
      ) {
        this.vx = -this.vx;
        if (this.vx > 0) this.x = plat.x + plat.width + 1;
        else this.x = plat.x - this.width - 1;
        break;
      }
    }
  }

  draw(ctx, cameraX, cameraY) {
    if (this.isDead) return;

    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y - cameraY);
    const squash = Math.sin(this.animTimer) * 2;

    ctx.save();
    ctx.translate(drawX + this.width / 2, drawY + this.height);

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, -2, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo de slime / monstruito rojo
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, -11 + squash, 13, 11 - squash, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pequeños cuernos
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(-7, -20 + squash);
    ctx.lineTo(-4, -14 + squash);
    ctx.lineTo(-9, -15 + squash);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(7, -20 + squash);
    ctx.lineTo(9, -15 + squash);
    ctx.lineTo(4, -14 + squash);
    ctx.fill();

    // Ojos amenazantes pero simpáticos
    const eyeDir = this.vx > 0 ? 2 : -2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4 + eyeDir, -12 + squash, 3.5, 0, Math.PI * 2);
    ctx.arc(4 + eyeDir, -12 + squash, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-3 + eyeDir * 1.3, -12 + squash, 1.8, 0, Math.PI * 2);
    ctx.arc(5 + eyeDir * 1.3, -12 + squash, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.radius = 11;
    this.collected = false;
    this.animTimer = Math.random() * Math.PI * 2;
  }

  update(dt) {
    if (this.collected) return;
    this.animTimer += dt * 4;
    this.y = this.baseY + Math.sin(this.animTimer) * 4;
  }

  draw(ctx, cameraX, cameraY) {
    if (this.collected) return;

    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y - cameraY);

    // Efecto 3D de giro de la moneda comprimiendo el ancho
    const scaleX = Math.cos(this.animTimer);

    ctx.save();
    ctx.translate(drawX, drawY);
    ctx.scale(scaleX, 1);

    // Borde dorado
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Relleno brillante
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius - 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Signo de estrella o brillo central
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2, -5, 4, 10);
    ctx.fillRect(-5, -2, 10, 4);

    ctx.restore();
  }
}

class Platform {
  constructor(x, y, width, height, options = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isOneWay = options.isOneWay || false; // Solo colisiona cayendo
    this.color = options.color || '#15803d'; // Verde césped
    this.bodyColor = options.bodyColor || '#78350f'; // Tierra

    // Soporte para plataforma móvil
    this.isMoving = options.isMoving || false;
    if (this.isMoving) {
      this.startX = x;
      this.startY = y;
      this.moveDistX = options.moveDistX || 0;
      this.moveDistY = options.moveDistY || 0;
      this.moveSpeed = options.moveSpeed || 40;
      this.moveProgress = 0;
      this.vx = 0;
      this.vy = 0;
    }
  }

  update(dt) {
    if (!this.isMoving) return;

    this.moveProgress += dt * (this.moveSpeed / 60);
    const sinVal = (Math.sin(this.moveProgress) + 1) / 2; // 0 a 1

    const nextX = this.startX + this.moveDistX * sinVal;
    const nextY = this.startY + this.moveDistY * sinVal;

    this.vx = dt > 0 ? (nextX - this.x) / dt : 0;
    this.vy = dt > 0 ? (nextY - this.y) / dt : 0;

    this.x = nextX;
    this.y = nextY;
  }

  draw(ctx, cameraX, cameraY) {
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y - cameraY);

    ctx.save();

    if (this.isOneWay) {
      // Repisa de madera/nube flotante
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, this.width, this.height, 4);
      ctx.fill();

      // Borde superior más claro
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(drawX + 2, drawY + 1, this.width - 4, 3);
    } else {
      // Bloque sólido con capa de césped superior
      // Cuerpo de tierra
      ctx.fillStyle = this.bodyColor;
      ctx.fillRect(drawX, drawY, this.width, this.height);

      // Textura sutil de tierra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let ox = 6; ox < this.width; ox += 18) {
        ctx.fillRect(drawX + ox, drawY + 14, 6, 6);
      }

      // Capa de césped superior
      ctx.fillStyle = this.color;
      ctx.fillRect(drawX, drawY, this.width, 10);

      // Pequeñas briznas decorativas de césped colgando
      ctx.fillStyle = this.color;
      for (let ox = 2; ox < this.width - 6; ox += 10) {
        ctx.beginPath();
        ctx.moveTo(drawX + ox, drawY + 10);
        ctx.lineTo(drawX + ox + 3, drawY + 14);
        ctx.lineTo(drawX + ox + 6, drawY + 10);
        ctx.fill();
      }

      // Borde inferior oscuro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(drawX, drawY + this.height - 3, this.width, 3);
    }

    ctx.restore();
  }
}

class Hazard {
  constructor(x, y, width, height = 16) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx, cameraX, cameraY) {
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y - cameraY);
    const spikeWidth = 14;
    const count = Math.floor(this.width / spikeWidth);

    ctx.save();
    ctx.fillStyle = '#94a3b8';

    for (let i = 0; i < count; i++) {
      const sx = drawX + i * spikeWidth;
      ctx.beginPath();
      ctx.moveTo(sx, drawY + this.height);
      ctx.lineTo(sx + spikeWidth / 2, drawY);
      ctx.lineTo(sx + spikeWidth, drawY + this.height);
      ctx.closePath();
      ctx.fill();

      // Sombra metálica del pincho
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(sx + spikeWidth / 2, drawY);
      ctx.lineTo(sx + spikeWidth, drawY + this.height);
      ctx.lineTo(sx + spikeWidth / 2, drawY + this.height);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#64748b';
    }
    ctx.restore();
  }
}

class Goal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 36;
    this.height = 100;
    this.animTimer = 0;
  }

  update(dt) {
    this.animTimer += dt * 4;
  }

  draw(ctx, cameraX, cameraY) {
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y - cameraY);

    ctx.save();

    // Base de la meta
    ctx.fillStyle = '#475569';
    ctx.fillRect(drawX + 8, drawY + this.height - 8, 20, 8);

    // Poste metálico
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 16, drawY, 4, this.height - 8);

    // Bola dorada superior
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(drawX + 18, drawY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Bandera ondulante dorada / verde
    const wave = Math.sin(this.animTimer) * 3;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(drawX + 20, drawY + 6);
    ctx.quadraticCurveTo(drawX + 32, drawY + 12 + wave, drawX + 44, drawY + 8);
    ctx.lineTo(drawX + 44, drawY + 28);
    ctx.quadraticCurveTo(drawX + 32, drawY + 32 + wave, drawX + 20, drawY + 26);
    ctx.closePath();
    ctx.fill();

    // Estrella en la bandera
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(drawX + 30, drawY + 18 + wave / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.Player = Player;
window.Enemy = Enemy;
window.Coin = Coin;
window.Platform = Platform;
window.Hazard = Hazard;
window.Goal = Goal;

// © jjedi90 — Todos los derechos reservados.

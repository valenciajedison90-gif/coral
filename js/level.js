// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// ==========================================================================

// Diseñador de Niveles y Elementos de Fondo con Parallax

class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.totalLevels = 2;
  }

  loadLevel(levelIndex) {
    this.currentLevel = levelIndex;

    if (levelIndex === 1) {
      return this.getLevel1();
    } else {
      return this.getLevel2();
    }
  }

  getLevel1() {
    const worldWidth = 3200;
    const worldHeight = 600;

    // Plataformas sólidas y semi-sólidas
    const platforms = [
      // Zona Inicial
      new Platform(0, 520, 700, 80),
      new Platform(240, 430, 100, 20, { isOneWay: true }),
      new Platform(400, 360, 120, 20, { isOneWay: true }),

      // Primer Salto sobre Foso Pequeño
      new Platform(780, 520, 500, 80),
      new Platform(920, 420, 90, 20, { isOneWay: true }),
      new Platform(1070, 340, 110, 20, { isOneWay: true }),

      // Plataforma Móvil sobre Foso de Pinchos
      new Platform(1340, 480, 100, 20, {
        isOneWay: true,
        isMoving: true,
        moveDistX: 180,
        moveDistY: 0,
        moveSpeed: 45
      }),

      // Isla Central y Escalones
      new Platform(1680, 520, 400, 80),
      new Platform(1740, 430, 80, 20, { isOneWay: true }),
      new Platform(1880, 350, 90, 20, { isOneWay: true }),
      new Platform(2000, 270, 80, 20, { isOneWay: true }),

      // Plataforma Móvil Vertical (Ascensor)
      new Platform(2150, 420, 90, 20, {
        isOneWay: true,
        isMoving: true,
        moveDistX: 0,
        moveDistY: -150,
        moveSpeed: 40
      }),

      // Sección Final elevada y recta hacia la meta
      new Platform(2320, 380, 180, 30),
      new Platform(2580, 470, 140, 30),
      new Platform(2800, 520, 450, 80)
    ];

    // Peligros / Pinchos
    const hazards = [
      new Hazard(700, 560, 80, 16),
      new Hazard(1280, 560, 400, 16),
      new Hazard(2080, 560, 240, 16),
      new Hazard(2500, 560, 80, 16)
    ];

    // Monedas en arcos y recompensas
    const coins = [
      new Coin(280, 380),
      new Coin(310, 380),
      new Coin(440, 310),
      new Coin(480, 310),

      // Arco sobre el primer foso
      new Coin(720, 450),
      new Coin(740, 430),
      new Coin(760, 450),

      // Monedas en isla intermedia
      new Coin(960, 370),
      new Coin(1120, 290),

      // Moneda sobre plataforma móvil
      new Coin(1420, 430),

      // Recompensa alta
      new Coin(1780, 380),
      new Coin(1920, 300),
      new Coin(2040, 220),

      // Recta final
      new Coin(2380, 330),
      new Coin(2440, 330),
      new Coin(2640, 420),
      new Coin(2880, 470),
      new Coin(2920, 470),
      new Coin(2960, 470)
    ];

    // Enemigos con áreas de patrulla
    const enemies = [
      new Enemy(480, 496, 120, 50),
      new Enemy(1000, 496, 140, 60),
      new Enemy(1850, 496, 150, 65),
      new Enemy(2400, 356, 90, 50),
      new Enemy(2950, 496, 120, 60)
    ];

    // Bandera final
    const goal = new Goal(3100, 420);

    return {
      name: 'Nivel 1: Pradera Colina',
      worldWidth,
      worldHeight,
      playerStart: { x: 80, y: 460 },
      platforms,
      hazards,
      coins,
      enemies,
      goal,
      skyColor: '#38bdf8',
      hillColor1: '#86efac',
      hillColor2: '#4ade80'
    };
  }

  getLevel2() {
    const worldWidth = 3400;
    const worldHeight = 600;

    // Nivel 2 con más plataformas flotantes y desafíos
    const platforms = [
      new Platform(0, 520, 450, 80),
      new Platform(200, 420, 90, 20, { isOneWay: true }),
      new Platform(340, 330, 90, 20, { isOneWay: true }),

      // Plataforma oscilante
      new Platform(520, 350, 100, 20, {
        isOneWay: true,
        isMoving: true,
        moveDistX: 160,
        moveDistY: -60,
        moveSpeed: 50
      }),

      // Isla flotante
      new Platform(850, 440, 180, 30),
      new Platform(1120, 390, 100, 20, { isOneWay: true }),
      new Platform(1280, 310, 100, 20, { isOneWay: true }),

      // Isla de tierra firme
      new Platform(1460, 520, 500, 80),

      // Doble plataforma móvil coordinada
      new Platform(2030, 460, 90, 20, {
        isOneWay: true,
        isMoving: true,
        moveDistX: 140,
        moveDistY: 0,
        moveSpeed: 55
      }),
      new Platform(2240, 370, 90, 20, {
        isOneWay: true,
        isMoving: true,
        moveDistX: -120,
        moveDistY: 0,
        moveSpeed: 55
      }),

      // Fortaleza final
      new Platform(2480, 440, 160, 30),
      new Platform(2720, 360, 160, 30),
      new Platform(2960, 520, 450, 80)
    ];

    const hazards = [
      new Hazard(450, 560, 1010, 16),
      new Hazard(1960, 560, 1000, 16)
    ];

    const coins = [
      new Coin(240, 370),
      new Coin(380, 280),
      new Coin(600, 260),
      new Coin(900, 390),
      new Coin(940, 390),
      new Coin(1160, 340),
      new Coin(1320, 260),
      new Coin(1600, 470),
      new Coin(1650, 470),
      new Coin(1700, 470),
      new Coin(2100, 400),
      new Coin(2300, 310),
      new Coin(2540, 390),
      new Coin(2780, 310),
      new Coin(3100, 470),
      new Coin(3150, 470)
    ];

    const enemies = [
      new Enemy(280, 496, 120, 60),
      new Enemy(920, 416, 90, 60),
      new Enemy(1620, 496, 200, 75),
      new Enemy(1780, 496, 150, 70),
      new Enemy(2540, 416, 80, 55),
      new Enemy(3120, 496, 120, 65)
    ];

    const goal = new Goal(3250, 420);

    return {
      name: 'Nivel 2: Cumbres del Viento',
      worldWidth,
      worldHeight,
      playerStart: { x: 80, y: 460 },
      platforms,
      hazards,
      coins,
      enemies,
      goal,
      skyColor: '#f97316', // Atardecer vibrante
      hillColor1: '#fdba74',
      hillColor2: '#fb923c'
    };
  }

  // Dibuja el fondo parallax con colinas suaves y nubes
  drawBackground(ctx, cameraX, levelData, canvasWidth, canvasHeight) {
    // 1. Degradado del cielo
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    if (this.currentLevel === 1) {
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.7, '#bae6fd');
      skyGrad.addColorStop(1, '#e0f2fe');
    } else {
      skyGrad.addColorStop(0, '#f97316');
      skyGrad.addColorStop(0.6, '#fed7aa');
      skyGrad.addColorStop(1, '#ffedd5');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Sol o luna resplandeciente
    ctx.fillStyle = this.currentLevel === 1 ? '#fef08a' : '#fef3c7';
    ctx.beginPath();
    ctx.arc(canvasWidth - 100, 70, 36, 0, Math.PI * 2);
    ctx.fill();

    // 3. Nubes con parallax suave
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    const cloudParallax = cameraX * 0.15;
    for (let i = 0; i < 8; i++) {
      const cx = (i * 450 - cloudParallax) % (canvasWidth + 400) - 100;
      const cy = 40 + (i % 3) * 35;
      this.drawCloud(ctx, cx, cy, 1 + (i % 2) * 0.3);
    }

    // 4. Capa lejana de colinas (Parallax 0.3x)
    ctx.fillStyle = levelData.hillColor1;
    const hillParallax1 = cameraX * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    for (let x = 0; x <= canvasWidth + 100; x += 60) {
      const worldX = x + hillParallax1;
      const y = canvasHeight - 120 + Math.sin(worldX * 0.003) * 60 + Math.cos(worldX * 0.006) * 30;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.closePath();
    ctx.fill();

    // 5. Capa cercana de colinas (Parallax 0.55x)
    ctx.fillStyle = levelData.hillColor2;
    const hillParallax2 = cameraX * 0.55;
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    for (let x = 0; x <= canvasWidth + 100; x += 40) {
      const worldX = x + hillParallax2;
      const y = canvasHeight - 70 + Math.sin(worldX * 0.005) * 45;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.closePath();
    ctx.fill();
  }

  drawCloud(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.arc(16, -6, 22, 0, Math.PI * 2);
    ctx.arc(36, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.levelManager = new LevelManager();

// © jjedi90 — Todos los derechos reservados.

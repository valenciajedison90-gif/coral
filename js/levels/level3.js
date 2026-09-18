// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/levels/level3.js — Nivel 3: Volcán Submarino
// ==========================================================================

import { Level } from '../world/Level.js';
import { CoralObstacle } from '../world/TileMap.js';
import { Coin } from '../items/Coin.js';
import { Pearl } from '../items/Pearl.js';
import { Key } from '../items/Key.js';
import { FlowerOfLife } from '../items/FlowerOfLife.js';
import { Checkpoint } from '../world/Checkpoint.js';
import { KnowledgeShell } from '../world/KnowledgeShell.js';
import { Crab } from '../enemies/Crab.js';
import { Jellyfish } from '../enemies/Jellyfish.js';
import { Octopus } from '../enemies/Octopus.js';
import { Shark } from '../enemies/Shark.js';
import { ExitPortal } from '../world/ExitPortal.js';

export function createLevel3() {
  const worldWidth = 3500;
  const worldHeight = 2200;

  const obstacles = [
    new CoralObstacle(0, 2120, 3500, 80, 'rock'),
    new CoralObstacle(600, 400, 180, 600, 'rock'),
    new CoralObstacle(1400, 800, 200, 700, 'rock'),
    new CoralObstacle(2200, 300, 180, 800, 'rock')
  ];

  const checkpoints = [
    new Checkpoint(200, 500, 3, 'cp_3_1'),
    new Checkpoint(1800, 600, 3, 'cp_3_2')
  ];

  const shells = [
    new KnowledgeShell(850, 450, 'matematicas', 'medio', 301),
    new KnowledgeShell(1650, 750, 'logica', 'medio', 302),
    new KnowledgeShell(2450, 450, 'matematicas', 'dificil', 303)
  ];

  const coins = [];
  for (let x = 350; x < 3100; x += 130) {
    coins.push(new Coin(x, 700 + Math.sin(x * 0.02) * 220, x % 260 === 0));
  }

  const pearls = [new Pearl(1100, 500), new Pearl(2100, 400)];
  const keys = [new Key(2700, 450, 'amistad')];

  const flowers = [
    new FlowerOfLife(1200, 450),
    new FlowerOfLife(2600, 600)
  ];

  // Criaturas Enemigas activas del Volcán Submarino
  const enemies = [
    // --- Sector Inicial del Volcán (x: 400 - 1100) ---
    new Jellyfish(480, 600, 160, 45),
    new Crab(700, 370, 140, 48),
    new Jellyfish(820, 720, 170, 50),
    new Shark(950, 650, 260, 85),
    new Jellyfish(1080, 550, 150, 45),

    // --- Cañón Central Magmático (x: 1200 - 2300) ---
    new Octopus(1250, 750, 80, 45),
    new Jellyfish(1320, 680, 160, 48),
    new Crab(1480, 770, 150, 50),
    new Jellyfish(1620, 520, 160, 48),
    new Shark(1750, 620, 280, 85),
    new Octopus(1880, 480, 85, 45),
    new Jellyfish(1950, 720, 170, 50),
    new Jellyfish(2120, 520, 150, 45),
    new Crab(2260, 270, 130, 48),

    // --- Caldeira Volcánica y Salida (x: 2350 - 3300) ---
    new Jellyfish(2400, 750, 170, 50),
    new Shark(2500, 680, 280, 90),
    new Jellyfish(2750, 550, 160, 48),
    new Octopus(2850, 720, 85, 48),
    new Shark(3050, 620, 260, 85),
    new Jellyfish(3180, 700, 150, 45),

    // --- Criatura del Fondo ---
    new Crab(1000, 2090, 200, 50)
  ];

  const exitPortal = new ExitPortal(3300, 750, 'Hacia las Ruinas Perdidas');

  return new Level({
    id: 3,
    name: 'Nivel 3: Volcán Submarino',
    worldWidth,
    worldHeight,
    playerStart: { x: 200, y: 500 },
    obstacles,
    checkpoints,
    shells,
    flowers,
    coins,
    pearls,
    keys,
    enemies,
    exitPortal
  });
}

// © jjedi90 — Todos los derechos reservados.

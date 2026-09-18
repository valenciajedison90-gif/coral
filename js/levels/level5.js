// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/levels/level5.js — Nivel 5: Castillo de Morgana (Rescate de Lumi)
// ==========================================================================

import { Level } from '../world/Level.js';
import { CoralObstacle } from '../world/TileMap.js';
import { Coin } from '../items/Coin.js';
import { Pearl } from '../items/Pearl.js';
import { FlowerOfLife } from '../items/FlowerOfLife.js';
import { Checkpoint } from '../world/Checkpoint.js';
import { KnowledgeShell } from '../world/KnowledgeShell.js';
import { Crab } from '../enemies/Crab.js';
import { Jellyfish } from '../enemies/Jellyfish.js';
import { Octopus } from '../enemies/Octopus.js';
import { Shark } from '../enemies/Shark.js';
import { Lumi } from '../world/Lumi.js';

export function createLevel5() {
  const worldWidth = 3800;
  const worldHeight = 2200;

  const obstacles = [
    new CoralObstacle(0, 2120, 3800, 80, 'pillar'),
    new CoralObstacle(700, 200, 160, 900, 'pillar'),
    new CoralObstacle(1400, 800, 180, 800, 'pillar'),
    new CoralObstacle(2100, 200, 160, 900, 'pillar'),
    new CoralObstacle(2800, 800, 180, 800, 'pillar')
  ];

  const checkpoints = [
    new Checkpoint(200, 600, 5, 'cp_5_1'),
    new Checkpoint(2000, 700, 5, 'cp_5_2'),
    new Checkpoint(3100, 800, 5, 'cp_5_3')
  ];

  const shells = [
    new KnowledgeShell(1050, 600, null, 'dificil', 501),
    new KnowledgeShell(1750, 700, null, 'dificil', 502),
    new KnowledgeShell(2450, 500, null, 'dificil', 503)
  ];

  const coins = [];
  for (let x = 300; x < 3500; x += 110) {
    coins.push(new Coin(x, 700 + Math.sin(x * 0.02) * 200, x % 220 === 0));
  }

  const pearls = [new Pearl(1200, 350), new Pearl(2600, 350)];

  const flowers = [
    new FlowerOfLife(1100, 480),
    new FlowerOfLife(2350, 480)
  ];

  // Criaturas Enemigas y Guardianes Reales del Castillo de Morgana
  const enemies = [
    // --- Patio Exterior del Castillo (x: 400 - 1300) ---
    new Jellyfish(480, 600, 150, 45),
    new Octopus(650, 520, 80, 45),
    new Shark(950, 650, 260, 90),
    new Jellyfish(1080, 550, 160, 48),
    new Octopus(1250, 720, 80, 45),

    // --- Gran Sala de las Mazmorras (x: 1350 - 2300) ---
    new Crab(1460, 770, 120, 50),
    new Jellyfish(1550, 520, 150, 45),
    new Shark(1750, 620, 280, 90),
    new Jellyfish(1920, 720, 170, 50),
    new Octopus(2150, 540, 85, 48),

    // --- Salón del Trono Oscuro (x: 2350 - 3100) ---
    new Jellyfish(2400, 720, 170, 50),
    new Shark(2550, 600, 280, 90),
    new Octopus(2750, 520, 85, 50),
    new Crab(2860, 770, 120, 50),
    new Jellyfish(3020, 680, 150, 48),

    // --- Santuario del Rescate / Guardianes Finales de Lumi (x: 3150 - 3400) ---
    new Jellyfish(3180, 550, 150, 50),
    new Shark(3320, 680, 240, 95)
  ];

  // Mascota Lumi esperando ser rescatada en el salón del castillo
  const lumi = new Lumi(3450, 750);

  const level = new Level({
    id: 5,
    name: 'Nivel 5: Castillo de Morgana',
    worldWidth,
    worldHeight,
    playerStart: { x: 200, y: 600 },
    obstacles,
    checkpoints,
    shells,
    flowers,
    coins,
    pearls,
    enemies
  });

  level.lumi = lumi;
  return level;
}

// © jjedi90 — Todos los derechos reservados.

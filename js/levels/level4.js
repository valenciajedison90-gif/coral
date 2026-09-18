// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/levels/level4.js — Nivel 4: Ruinas Perdidas
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
import { ExitPortal } from '../world/ExitPortal.js';

export function createLevel4() {
  const worldWidth = 3600;
  const worldHeight = 2200;

  const obstacles = [
    new CoralObstacle(0, 2120, 3600, 80, 'pillar'),
    new CoralObstacle(500, 300, 100, 700, 'pillar'),
    new CoralObstacle(1100, 900, 120, 650, 'pillar'),
    new CoralObstacle(1800, 250, 120, 800, 'pillar'),
    new CoralObstacle(2400, 1000, 140, 700, 'pillar')
  ];

  const checkpoints = [
    new Checkpoint(200, 600, 4, 'cp_4_1'),
    new Checkpoint(1900, 700, 4, 'cp_4_2')
  ];

  const shells = [
    new KnowledgeShell(800, 600, 'historia', 'dificil', 401),
    new KnowledgeShell(1500, 800, 'geografia', 'dificil', 402),
    new KnowledgeShell(2200, 500, 'cultura_general', 'dificil', 403)
  ];

  const coins = [];
  for (let x = 300; x < 3200; x += 120) {
    coins.push(new Coin(x, 650 + Math.cos(x * 0.015) * 250, x % 240 === 0));
  }

  const pearls = [new Pearl(900, 350), new Pearl(2100, 1200)];

  const flowers = [
    new FlowerOfLife(1000, 500),
    new FlowerOfLife(2250, 700)
  ];

  // Criaturas Enemigas guardianas de las Ruinas Perdidas
  const enemies = [
    // --- Entrada a las Ruinas (x: 400 - 1200) ---
    new Jellyfish(450, 600, 150, 45),
    new Octopus(720, 520, 80, 45),
    new Shark(950, 680, 260, 85),
    new Jellyfish(1050, 520, 160, 48),
    new Crab(1160, 870, 100, 45),

    // --- Gran Sala de Columnas Sumergidas (x: 1250 - 2300) ---
    new Jellyfish(1320, 680, 160, 48),
    new Octopus(1480, 500, 85, 45),
    new Shark(1650, 680, 280, 90),
    new Jellyfish(1820, 520, 160, 48),
    new Octopus(2020, 720, 85, 48),
    new Shark(2200, 600, 280, 90),

    // --- Santuario Exterior y Puerta al Castillo (x: 2350 - 3350) ---
    new Jellyfish(2380, 720, 170, 50),
    new Crab(2460, 970, 110, 45),
    new Octopus(2650, 540, 80, 45),
    new Shark(2850, 680, 280, 90),
    new Jellyfish(3020, 550, 160, 48),
    new Shark(3220, 680, 260, 85),

    // --- Criatura del Fondo ---
    new Crab(1600, 2090, 200, 50)
  ];

  const exitPortal = new ExitPortal(3400, 800, 'Hacia el Castillo de Morgana');

  return new Level({
    id: 4,
    name: 'Nivel 4: Ruinas Perdidas',
    worldWidth,
    worldHeight,
    playerStart: { x: 200, y: 600 },
    obstacles,
    checkpoints,
    shells,
    flowers,
    coins,
    pearls,
    enemies,
    exitPortal
  });
}

// © jjedi90 — Todos los derechos reservados.

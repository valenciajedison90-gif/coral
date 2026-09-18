// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/levels/level2.js — Nivel 2: Bosque de Algas
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
import { ExitPortal } from '../world/ExitPortal.js';

export function createLevel2() {
  const worldWidth = 3400;
  const worldHeight = 2200;

  const obstacles = [
    new CoralObstacle(0, 2120, 3400, 80, 'reef'),
    new CoralObstacle(400, 300, 140, 500, 'seaweed'),
    new CoralObstacle(800, 900, 160, 450, 'reef'),
    new CoralObstacle(1300, 250, 160, 600, 'seaweed'),
    new CoralObstacle(1800, 1000, 150, 500, 'rock'),
    new CoralObstacle(2400, 300, 160, 650, 'seaweed')
  ];

  const checkpoints = [
    new Checkpoint(180, 500, 2, 'cp_2_1'),
    new Checkpoint(1700, 700, 2, 'cp_2_2')
  ];

  const shells = [
    new KnowledgeShell(650, 500, 'ciencias', 'medio', 201),
    new KnowledgeShell(1550, 800, 'naturaleza', 'medio', 202),
    new KnowledgeShell(2150, 450, 'espanol', 'medio', 203)
  ];

  const coins = [];
  for (let x = 300; x < 3000; x += 120) {
    coins.push(new Coin(x, 600 + Math.sin(x * 0.01) * 200, x % 240 === 0));
  }

  const pearls = [
    new Pearl(1000, 400),
    new Pearl(2000, 1200)
  ];

  const keys = [
    new Key(2200, 380, 'valentia')
  ];

  const flowers = [
    new FlowerOfLife(850, 480),
    new FlowerOfLife(2050, 950)
  ];

  // Criaturas Enemigas activas por todo el Bosque de Algas
  const enemies = [
    // --- Sector Inicial de Algas (x: 400 - 1000) ---
    new Jellyfish(480, 600, 160, 45),
    new Crab(620, 870, 120, 45),
    new Octopus(750, 420, 75, 45),
    new Jellyfish(920, 680, 160, 50),

    // --- Arrecife Central y Bosque Profundo (x: 1050 - 1900) ---
    new Crab(1050, 880, 140, 50),
    new Jellyfish(1180, 550, 160, 45),
    new Jellyfish(1350, 720, 170, 48),
    new Octopus(1560, 480, 80, 45),
    new Crab(1620, 970, 140, 48),
    new Jellyfish(1750, 600, 160, 50),

    // --- Bosque Oriental y Cavernas (x: 1950 - 2800) ---
    new Octopus(2150, 650, 85, 48),
    new Crab(2250, 920, 150, 50),
    new Jellyfish(2350, 580, 160, 48),
    new Octopus(2550, 720, 80, 45),
    new Crab(2700, 920, 160, 50),
    new Jellyfish(2800, 550, 150, 45),

    // --- Sendero hacia el Portal (x: 2850 - 3150) ---
    new Jellyfish(2950, 720, 160, 50),
    new Octopus(3080, 580, 80, 45),

    // --- Habitantes del Fondo ---
    new Crab(600, 2090, 200, 50),
    new Crab(1900, 2090, 200, 50)
  ];

  const exitPortal = new ExitPortal(3200, 800, 'Hacia el Volcán Submarino');

  return new Level({
    id: 2,
    name: 'Nivel 2: Bosque de Algas',
    worldWidth,
    worldHeight,
    playerStart: { x: 180, y: 500 },
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

// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/levels/level1.js — Nivel 1: Arrecife de Coral (Mundo 3200 x 2000)
// ==========================================================================

import { Level } from '../world/Level.js';
import { CoralObstacle } from '../world/TileMap.js';
import { Coin } from '../items/Coin.js';
import { Pearl } from '../items/Pearl.js';
import { Key } from '../items/Key.js';
import { Checkpoint } from '../world/Checkpoint.js';
import { KnowledgeShell } from '../world/KnowledgeShell.js';
import { FlowerOfLife } from '../items/FlowerOfLife.js';
import { Crab } from '../enemies/Crab.js';
import { Jellyfish } from '../enemies/Jellyfish.js';
import { Octopus } from '../enemies/Octopus.js';
import { ExitPortal } from '../world/ExitPortal.js';

export function createLevel1() {
  const worldWidth = 3200;
  const worldHeight = 2000;

  // 1. Obstáculos y Arrecifes Sólidos
  const obstacles = [
    // Lecho marino inferior (Suelo de roca y coral)
    new CoralObstacle(0, 1920, 3200, 80, 'reef'),

    // Zona Inicial de Arrecifes
    new CoralObstacle(360, 480, 120, 260, 'reef'),
    new CoralObstacle(600, 800, 140, 200, 'reef'),
    new CoralObstacle(300, 1200, 160, 220, 'rock'),

    // Pasajes y Cañones del Arrecife Central
    new CoralObstacle(950, 300, 180, 280, 'reef'),
    new CoralObstacle(1150, 920, 160, 350, 'reef'),
    new CoralObstacle(1400, 400, 200, 240, 'reef'),
    new CoralObstacle(1480, 1100, 140, 260, 'rock'),

    // Pilares de Ruinas Antiguas Sumergidas
    new CoralObstacle(1850, 320, 90, 420, 'pillar'),
    new CoralObstacle(2050, 950, 90, 420, 'pillar'),
    new CoralObstacle(2300, 450, 120, 380, 'reef'),

    // Gran Muro del Arrecife Protector previo a la salida
    new CoralObstacle(2650, 200, 140, 450, 'reef'),
    new CoralObstacle(2650, 1050, 140, 450, 'reef')
  ];

  // 2. Puntos de Control (Islas de Coral)
  const checkpoints = [
    new Checkpoint(180, 680, 1, 'cp_1'),
    new Checkpoint(1650, 750, 1, 'cp_2'),
    new Checkpoint(2800, 820, 1, 'cp_3')
  ];

  // 3. Conchas del Saber (Eventos Educativos)
  const shells = [
    new KnowledgeShell(500, 420, 'ciencias', 'facil', 1),
    new KnowledgeShell(880, 950, 'naturaleza', 'facil', 2),
    new KnowledgeShell(1320, 520, 'matematicas', 'facil', 3),
    new KnowledgeShell(1750, 1150, 'espanol', 'medio', 4),
    new KnowledgeShell(2200, 600, 'geografia', 'medio', 5),
    new KnowledgeShell(2550, 950, 'logica', 'medio', 6)
  ];

  // 4. Monedas y Perlas
  const coins = [];
  const pearls = [];

  // Monedas en arcos y senderos
  const coinCoords = [
    [240, 550, false], [280, 530, false], [320, 550, false],
    [520, 680, true],  [560, 680, false], [600, 680, false],
    [760, 450, false], [800, 420, false], [840, 450, false],
    [1050, 650, true], [1100, 650, true],
    [1300, 820, false], [1340, 820, false], [1380, 820, false],
    [1580, 550, false], [1620, 520, false], [1660, 550, false],
    [1920, 880, true],  [1960, 880, false],
    [2150, 480, false], [2190, 460, false], [2230, 480, false],
    [2440, 720, true],  [2480, 720, true],
    [2900, 650, false], [2940, 630, false], [2980, 650, false]
  ];

  coinCoords.forEach(([cx, cy, isGold]) => {
    coins.push(new Coin(cx, cy, isGold));
  });

  // Perlas mágicas (+10) en rincones secretos
  pearls.push(new Pearl(420, 380));
  pearls.push(new Pearl(1020, 1280));
  pearls.push(new Pearl(1980, 360));
  pearls.push(new Pearl(2400, 1250));
  pearls.push(new Pearl(2750, 420));

  // Llave del Saber
  const keys = [
    new Key(1780, 340, 'saber')
  ];

  // Flores de la Vida (Desbloquean el poder sagrado de disparar balitas de burbuja)
  const flowers = [
    new FlowerOfLife(480, 680), // En la zona del arrecife inicial
    new FlowerOfLife(1950, 520)  // Cerca de los pilares de ruinas
  ];

  // 5. Criaturas Enemigas (distribuidas activamente en las rutas de nado)
  const enemies = [
    // --- Zona Inicial y Primer Encuentro (x: 400 - 900) ---
    new Jellyfish(550, 620, 160, 45),
    new Crab(660, 770, 90, 40),
    new Octopus(860, 520, 70, 42),
    new Jellyfish(780, 680, 160, 45),

    // --- Cañón y Arrecife Central (x: 950 - 1700) ---
    new Jellyfish(1050, 740, 170, 48),
    new Crab(1220, 890, 100, 45),
    new Jellyfish(1350, 780, 160, 45),
    new Octopus(1520, 820, 80, 45),
    new Jellyfish(1680, 620, 180, 46),

    // --- Pilares y Pasadizos Antiguos (x: 1750 - 2500) ---
    new Crab(1720, 880, 160, 50),
    new Jellyfish(1980, 840, 160, 45),
    new Octopus(2180, 540, 75, 45),
    new Jellyfish(2220, 720, 170, 48),
    new Octopus(2420, 620, 80, 45),
    new Jellyfish(2520, 680, 160, 46),

    // --- Arrecife Guardián y Salida al Portal (x: 2600 - 3050) ---
    new Jellyfish(2720, 840, 150, 45),
    new Crab(2850, 920, 140, 50),
    new Jellyfish(2960, 680, 140, 45),

    // --- Habitantes del Lecho Marino Profundo ---
    new Crab(450, 1890, 180, 45),
    new Crab(1250, 1890, 220, 55),
    new Crab(2100, 1890, 200, 50)
  ];

  // 6. Rastro luminoso de Lumi (pistas mágicas que guían el camino)
  const lumiClues = [
    { x: 380, y: 580 },
    { x: 720, y: 640 },
    { x: 1120, y: 720 },
    { x: 1540, y: 680 },
    { x: 2020, y: 780 },
    { x: 2500, y: 840 },
    { x: 2950, y: 800 }
  ];

  // 7. Portal de Salida hacia el Nivel 2
  const exitPortal = new ExitPortal(3080, 800, 'Hacia el Bosque de Algas');

  return new Level({
    id: 1,
    name: 'Nivel 1: Arrecife de Coral',
    worldWidth,
    worldHeight,
    playerStart: { x: 180, y: 600 },
    obstacles,
    checkpoints,
    shells,
    flowers,
    coins,
    pearls,
    keys,
    enemies,
    lumiClues,
    exitPortal
  });
}

// © jjedi90 — Todos los derechos reservados.

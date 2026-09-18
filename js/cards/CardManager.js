// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/cards/CardManager.js — Gestor y Baraja de Cartas Especiales
// ==========================================================================

import { Card } from './Card.js';

export const CARD_DEFINITIONS = [
  {
    id: 'corriente_marina',
    name: 'Corriente Marina',
    icon: '🌊',
    type: 'hazard',
    description: 'Una fuerte corriente submarina te empuja hacia atrás en el arrecife.',
    effect(game) {
      const mermaid = game.playerManager.getActiveMermaid();
      if (mermaid) {
        mermaid.vx = -mermaid.facing * 350;
      }
      return '¡Una corriente marina te arrastró unos metros!';
    }
  },
  {
    id: 'agua_helada',
    name: 'Agua Helada',
    icon: '❄️',
    type: 'hazard',
    description: 'El agua gélida entumece tus aletas temporalmente.',
    effect(game) {
      const mermaid = game.playerManager.getActiveMermaid();
      if (mermaid) {
        mermaid.speed *= 0.6;
        setTimeout(() => { mermaid.speed = mermaid.baseSpeed; }, 3000);
      }
      return '¡El agua gélida redujo tu velocidad por 3 segundos!';
    }
  },
  {
    id: 'ayuda_amiga',
    name: 'Ayuda de una Amiga',
    icon: '🐬',
    type: 'beneficial',
    description: 'Un delfín amigo te susurra una pista para la siguiente Concha del Saber.',
    effect(game) {
      game.inventory.pistas = (game.inventory.pistas || 0) + 1;
      return '¡Has recibido una pista sabia de tu amigo delfín!';
    }
  },
  {
    id: 'perla_magica',
    name: 'Perla Mágica',
    icon: '✨',
    type: 'beneficial',
    description: 'Encuentras una perla brillante oculta entre las anémonas (+10 monedas).',
    effect(game) {
      game.coins += 10;
      game.updateHUD();
      return '¡Has obtenido 10 monedas submarinas!';
    }
  },
  {
    id: 'atajo',
    name: 'Atajo Secreto',
    icon: '🌀',
    type: 'tactical',
    description: 'Un remolino mágico te transporta directamente hacia la siguiente zona segura.',
    effect(game) {
      const mermaid = game.playerManager.getActiveMermaid();
      if (mermaid) {
        mermaid.x += 240;
      }
      return '¡Un remolino te impulsó 240 metros hacia adelante!';
    }
  }
];

export class CardManager {
  constructor() {
    this.deck = CARD_DEFINITIONS.map(c => new Card(c));
  }

  drawRandomCard() {
    const idx = Math.floor(Math.random() * this.deck.length);
    return this.deck[idx];
  }
}

// © jjedi90 — Todos los derechos reservados.

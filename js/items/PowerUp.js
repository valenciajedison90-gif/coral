// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/items/PowerUp.js — Tienda y Utilidades para la Sirena
// ==========================================================================

export const POWERUPS = {
  pista: {
    id: 'pista',
    name: 'Pista Sabia',
    cost: 5,
    icon: '💡',
    desc: 'Descarta 1 opción incorrecta en la Concha del Saber.',
    apply(game) {
      if (game.coins >= this.cost) {
        game.coins -= this.cost;
        game.inventory.pistas = (game.inventory.pistas || 0) + 1;
        return true;
      }
      return false;
    }
  },
  segundaOportunidad: {
    id: 'segundaOportunidad',
    name: '2ª Oportunidad',
    cost: 8,
    icon: '🔄',
    desc: 'Permite reintentar una pregunta fallada sin penalización.',
    apply(game) {
      if (game.coins >= this.cost) {
        game.coins -= this.cost;
        game.inventory.segundaOportunidad = (game.inventory.segundaOportunidad || 0) + 1;
        return true;
      }
      return false;
    }
  },
  escudo: {
    id: 'escudo',
    name: 'Escudo de Burbuja',
    cost: 10,
    icon: '🛡️',
    desc: 'Evita perder un corazón ante el próximo impacto de un enemigo.',
    apply(game) {
      if (game.coins >= this.cost) {
        const mermaid = game.playerManager.getActiveMermaid();
        if (mermaid) {
          game.coins -= this.cost;
          mermaid.hasActiveShield = true;
          return true;
        }
      }
      return false;
    }
  },
  corazon: {
    id: 'corazon',
    name: 'Curación Marina',
    cost: 15,
    icon: '❤️',
    desc: 'Recupera un corazón de vida perdido (máx. 3 corazones).',
    apply(game) {
      if (game.coins >= this.cost && game.lives < 3) {
        game.coins -= this.cost;
        game.lives = Math.min(3, game.lives + 1);
        return true;
      }
      return false;
    }
  }
};

// © jjedi90 — Todos los derechos reservados.

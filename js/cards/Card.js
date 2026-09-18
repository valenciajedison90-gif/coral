// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/cards/Card.js — Modelo de Cartas Especiales Submarinas
// ==========================================================================

export class Card {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.description = data.description;
    this.type = data.type; // 'beneficial', 'hazard', 'tactical'
    this.effect = data.effect;
  }

  apply(game) {
    if (typeof this.effect === 'function') {
      return this.effect(game);
    }
    return false;
  }
}

// © jjedi90 — Todos los derechos reservados.

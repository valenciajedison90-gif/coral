// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/Collectible.js — Clase Base para Objetos Coleccionables
// ==========================================================================

export class Collectible {
  constructor(x, y, radius = 12) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.radius = radius;
    this.collected = false;
    this.animTimer = Math.random() * Math.PI * 2;
  }

  update(dt) {
    if (this.collected) return;
    this.animTimer += dt * 3.5;
    this.y = this.baseY + Math.sin(this.animTimer) * 4;
  }

  isCollidingWith(circleOrBox) {
    if (this.collected) return false;

    // Colisión de caja contra punto central
    const box = circleOrBox;
    const closestX = Math.max(box.x, Math.min(this.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(this.y, box.y + box.height));

    const dx = this.x - closestX;
    const dy = this.y - closestY;

    return (dx * dx + dy * dy) <= (this.radius * this.radius);
  }
}

// © jjedi90 — Todos los derechos reservados.

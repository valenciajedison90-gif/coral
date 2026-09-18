// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/core/Collision.js — Utilidades de Detección de Colisiones
// ==========================================================================

export class Collision {
  static rectIntersect(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static circleIntersect(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distanceSq = dx * dx + dy * dy;
    const radiusSum = c1.radius + c2.radius;
    return distanceSq <= radiusSum * radiusSum;
  }

  static circleRectIntersect(circle, rect) {
    // Encuentra el punto más cercano del rectángulo al centro del círculo
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const dx = circle.x - closestX;
    const dy = circle.y - closestY;

    return (dx * dx + dy * dy) <= (circle.radius * circle.radius);
  }

  static pointInRect(px, py, rect) {
    return (
      px >= rect.x &&
      px <= rect.x + rect.width &&
      py >= rect.y &&
      py <= rect.y + rect.height
    );
  }

  static clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }
}

// © jjedi90 — Todos los derechos reservados.

// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/core/Camera.js — Cámara 2D con Seguimiento Suave (Lerp)
// ==========================================================================

export class Camera {
  constructor(viewportWidth, viewportHeight, worldWidth, worldHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.smoothFactor = 0.08; // Factor de interpolación suave (Lerp)
  }

  setWorldSize(width, height) {
    this.worldWidth = width;
    this.worldHeight = height;
    this.clamp();
  }

  setViewportSize(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.clamp();
  }

  follow(targetX, targetY, immediate = false) {
    // Centrar la cámara en el objetivo
    this.targetX = targetX - this.viewportWidth / 2;
    this.targetY = targetY - this.viewportHeight / 2;

    if (immediate) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.clamp();
    }
  }

  update() {
    // Interpolación lineal hacia el objetivo
    this.x += (this.targetX - this.x) * this.smoothFactor;
    this.y += (this.targetY - this.y) * this.smoothFactor;
    this.clamp();
  }

  clamp() {
    const maxX = Math.max(0, this.worldWidth - this.viewportWidth);
    const maxY = Math.max(0, this.worldHeight - this.viewportHeight);

    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  // Comprueba si una caja delimitadora está dentro del campo de visión (para optimizar dibujo)
  isVisible(x, y, width, height, margin = 60) {
    return (
      x + width >= this.x - margin &&
      x <= this.x + this.viewportWidth + margin &&
      y + height >= this.y - margin &&
      y <= this.y + this.viewportHeight + margin
    );
  }

  worldToScreen(wx, wy) {
    return {
      x: wx - this.x,
      y: wy - this.y
    };
  }

  screenToWorld(sx, sy) {
    return {
      x: sx + this.x,
      y: sy + this.y
    };
  }
}

// © jjedi90 — Todos los derechos reservados.

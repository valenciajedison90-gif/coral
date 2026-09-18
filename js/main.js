// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Creador Original: jjedi90
// js/main.js — Punto de Entrada de la Aplicación
// ==========================================================================

import { Game } from './core/Game.js';

// Polyfill universal para ctx.roundRect (compatibilidad total con celulares antiguos)
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0;
    const r = typeof radii === 'number' ? Math.min(radii, w / 2, h / 2) : Math.min(radii[0] || 0, w / 2, h / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

// Firma de Autoría y Metadatos Globales
window.__CORAL_METADATA__ = {
  title: 'CORAL — La Gran Aventura Submarina',
  author: 'jjedi90',
  creator: 'jjedi90',
  version: '1.4.2',
  copyright: '© Todos los derechos reservados a jjedi90'
};
window.CORAL_AUTHOR = 'jjedi90';

window.addEventListener('DOMContentLoaded', () => {
  window.coralGame = new Game();
  console.log(
    '%c🧜‍♀️ CORAL — La Gran Aventura Submarina\n%cAutor y Creador: jjedi90\n%c© Todos los derechos reservados',
    'color: #2ad5c4; font-size: 16px; font-weight: bold;',
    'color: #ffd152; font-size: 13px; font-weight: bold;',
    'color: #38bdf8; font-size: 11px;'
  );
});

// © jjedi90 — Todos los derechos reservados.

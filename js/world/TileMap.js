// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/TileMap.js — Estructura de Arrecifes, Rocas y Obstáculos Sólidos
// Gráficos Detallados: Tubos de Esponja, Corales Cerebro y Relieves Vivos
// ==========================================================================

export class CoralObstacle {
  constructor(x, y, width, height, type = 'reef') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 'reef', 'rock', 'pillar', 'seaweed'
  }

  draw(ctx, camera) {
    if (!camera.isVisible(this.x, this.y, this.width, this.height)) return;

    const screenPos = camera.worldToScreen(this.x, this.y);
    const drawX = Math.round(screenPos.x);
    const drawY = Math.round(screenPos.y);

    ctx.save();

    if (this.type === 'reef') {
      // 1. Base rocosa marina con gradiente
      const reefGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
      reefGrad.addColorStop(0, '#104c64');
      reefGrad.addColorStop(0.5, '#0a3243');
      reefGrad.addColorStop(1, '#051821');

      ctx.fillStyle = reefGrad;
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, this.width, this.height, 14);
      ctx.fill();

      // Borde de roca marina profunda
      ctx.strokeStyle = 'rgba(42, 213, 196, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Corales cuerno de alce y formaciones de coral rosa
      ctx.fillStyle = '#ff6b8b';
      for (let ox = 10; ox < this.width - 14; ox += 26) {
        ctx.beginPath();
        ctx.arc(drawX + ox, drawY + 3, 9, Math.PI, 0);
        ctx.fill();
        // Detalle brillante en el coral
        ctx.fillStyle = '#fca5a5';
        ctx.fillRect(drawX + ox - 2, drawY - 4, 4, 3);
        ctx.fillStyle = '#ff6b8b';
      }

      // 3. Esponjas de tubo doradas y púrpuras
      for (let ox = 22; ox < this.width - 16; ox += 34) {
        ctx.fillStyle = '#ffd152';
        ctx.fillRect(drawX + ox, drawY - 8, 6, 12);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(drawX + ox + 3, drawY - 8, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Corales turquesa y esmeralda colgantes
      ctx.fillStyle = '#2ad5c4';
      for (let ox = 18; ox < this.width - 20; ox += 38) {
        ctx.beginPath();
        ctx.arc(drawX + ox, drawY + 6, 8, 0, Math.PI);
        ctx.fill();
      }

    } else if (this.type === 'rock') {
      // Roca marina sólida con textura y capas
      const rockGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
      rockGrad.addColorStop(0, '#334155');
      rockGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = rockGrad;
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, this.width, this.height, 10);
      ctx.fill();

      // Capa de musgo / biofiltro verdoso
      ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.fillRect(drawX + 4, drawY + 2, this.width - 8, 6);

      // Grietas decorativas
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(drawX + 10, drawY + 14);
      ctx.lineTo(drawX + 24, drawY + 22);
      ctx.lineTo(drawX + 38, drawY + 16);
      ctx.stroke();

    } else if (this.type === 'pillar') {
      // Columna de ruinas de templos sumergidos
      const pillarGrad = ctx.createLinearGradient(drawX, drawY, drawX + this.width, drawY);
      pillarGrad.addColorStop(0, '#1e293b');
      pillarGrad.addColorStop(0.5, '#475569');
      pillarGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = pillarGrad;
      ctx.fillRect(drawX, drawY, this.width, this.height);

      // Capitel y base tallados
      ctx.fillStyle = '#64748b';
      ctx.fillRect(drawX - 3, drawY, this.width + 6, 10);
      ctx.fillRect(drawX - 3, drawY + this.height - 10, this.width + 6, 10);

      // Líneas estriadas de la columna clásica
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      for (let ox = 8; ox < this.width - 6; ox += 10) {
        ctx.beginPath();
        ctx.moveTo(drawX + ox, drawY + 12);
        ctx.lineTo(drawX + ox, drawY + this.height - 12);
        ctx.stroke();
      }

      // Enredaderas de algas marinas adheridas a la piedra
      ctx.fillStyle = '#059669';
      ctx.fillRect(drawX + 3, drawY + 24, 7, 14);
      ctx.fillRect(drawX + this.width - 8, drawY + 54, 6, 18);
    }

    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

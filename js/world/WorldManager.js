// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/world/WorldManager.js — Efectos Ambientales, Cáusticas, Rayos de Sol y Partículas
// ==========================================================================

export class WorldManager {
  constructor() {
    this.bubbles = [];
    this.sparkles = [];
    this.petals = [];
    this.floatingTexts = [];
    this.distantFish = [];
    this.seaweeds = [];
    this.anemones = [];
    this.starfish = [];

    this.initDistantLife();
  }

  initDistantLife() {
    // 1. Peces lejanos en silueta
    for (let i = 0; i < 20; i++) {
      this.distantFish.push({
        x: Math.random() * 3400,
        y: 80 + Math.random() * 1600,
        speed: 25 + Math.random() * 45,
        size: 8 + Math.random() * 12,
        color: ['rgba(42, 213, 196, 0.45)', 'rgba(11, 60, 93, 0.7)', 'rgba(255, 209, 82, 0.4)'][i % 3]
      });
    }

    // 2. Bosques de algas marinas ondulantes
    for (let x = 40; x < 3400; x += 80) {
      this.seaweeds.push({
        x: x,
        y: 1920,
        height: 150 + Math.random() * 140,
        segments: 6,
        phase: Math.random() * Math.PI * 2,
        color: ['#065f46', '#047857', '#059669', '#10b981'][Math.floor(Math.random() * 4)]
      });
    }

    // 3. Anémonas marinas vivas y coloridas
    for (let x = 120; x < 3200; x += 190) {
      this.anemones.push({
        x: x + (Math.random() - 0.5) * 40,
        y: 1918,
        tentacleCount: 7,
        height: 22 + Math.random() * 12,
        color: ['#f472b6', '#a855f7', '#38bdf8', '#fb923c'][Math.floor(Math.random() * 4)],
        phase: Math.random() * Math.PI * 2
      });
    }

    // 4. Estrellas de mar decorativas descansando en el lecho
    for (let x = 160; x < 3200; x += 260) {
      this.starfish.push({
        x: x,
        y: 1915 + Math.random() * 6,
        size: 7 + Math.random() * 5,
        color: ['#ff8e53', '#ffd152', '#ec4899'][Math.floor(Math.random() * 3)],
        rot: Math.random() * Math.PI * 2
      });
    }
  }

  spawnBubbles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        radius: 2 + Math.random() * 5,
        vy: -(45 + Math.random() * 85),
        vx: (Math.random() - 0.5) * 18,
        life: 1.0 + Math.random() * 1.5,
        maxLife: 2.0
      });
    }
  }

  spawnSparkles(x, y, count = 12, color = '#ffd152') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 110;
      this.sparkles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4.5,
        color: color,
        life: 0.4 + Math.random() * 0.5,
        maxLife: 0.8
      });
    }
  }

  spawnPetals(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 90;
      this.petals.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 6,
        size: 5 + Math.random() * 4,
        color: ['#f472b6', '#fbcfe8', '#ffd152', '#ffffff'][i % 4],
        life: 0.8 + Math.random() * 0.8,
        maxLife: 1.6
      });
    }
  }

  addFloatingText(text, x, y, color = '#ffd152') {
    this.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -45,
      alpha: 1,
      life: 1.1,
      maxLife: 1.1,
      color: color
    });
  }

  update(dt, camera) {
    // 1. Burbujas
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.life -= dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.life <= 0) this.bubbles.splice(i, 1);
    }

    // Burbujas ambientales automáticas ocasionales cerca de la vista
    if (Math.random() < 0.35) {
      this.spawnBubbles(
        camera.x + Math.random() * camera.viewportWidth,
        camera.y + camera.viewportHeight + 20,
        1
      );
    }

    // 2. Destellos
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.life -= dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 20 * dt;
      if (s.life <= 0) this.sparkles.splice(i, 1);
    }

    // 3. Pétalos de la Flor de la Vida
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vRot * dt;
      p.vy += 12 * dt;
      if (p.life <= 0) this.petals.splice(i, 1);
    }

    // 4. Textos flotantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y += ft.vy * dt;
      ft.alpha = Math.max(0, ft.life / ft.maxLife);
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // 5. Peces lejanos
    for (const f of this.distantFish) {
      f.x += f.speed * dt;
      if (f.x > 3500) f.x = -100;
    }
  }

  drawBackground(ctx, camera, level) {
    const { viewportWidth, viewportHeight } = camera;
    const now = Date.now() / 1000;

    // 1. Gran gradiente de luz del océano
    const seaGrad = ctx.createLinearGradient(0, 0, 0, viewportHeight);
    const depthRatio = Math.min(1, camera.y / (level.worldHeight - viewportHeight || 1));

    if (depthRatio < 0.4) {
      seaGrad.addColorStop(0, '#1d6a8a');
      seaGrad.addColorStop(0.4, '#0b3c5d');
      seaGrad.addColorStop(1, '#051622');
    } else {
      seaGrad.addColorStop(0, '#0b3c5d');
      seaGrad.addColorStop(0.5, '#06253c');
      seaGrad.addColorStop(1, '#020b12');
    }

    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);

    // 2. Rayos de luz solar que se filtran desde la superficie
    ctx.save();
    ctx.globalAlpha = Math.max(0.08, 0.22 - depthRatio * 0.16);
    ctx.fillStyle = '#d0f7f3';
    for (let i = 0; i < 7; i++) {
      const rayX = (i * 220 - camera.x * 0.25) % (viewportWidth + 240) - 60;
      const sway = Math.sin(now * 0.8 + i) * 20;
      ctx.beginPath();
      ctx.moveTo(rayX + sway, 0);
      ctx.lineTo(rayX + 80 + sway, 0);
      ctx.lineTo(rayX + 170 + sway, viewportHeight);
      ctx.lineTo(rayX + 50 + sway, viewportHeight);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 3. Cáusticas de luz marina ondulante (Malla brillante de agua)
    ctx.save();
    ctx.globalAlpha = Math.max(0.04, 0.14 - depthRatio * 0.1);
    ctx.strokeStyle = '#a5f3fc';
    ctx.lineWidth = 2.5;
    for (let cy = 40; cy < viewportHeight; cy += 80) {
      ctx.beginPath();
      ctx.moveTo(0, cy);
      for (let cx = 0; cx <= viewportWidth + 60; cx += 40) {
        const worldX = cx + camera.x * 0.4;
        const wave = Math.sin(worldX * 0.02 + now * 1.5) * 12 + Math.cos((cy + now * 20) * 0.03) * 10;
        ctx.lineTo(cx, cy + wave);
      }
      ctx.stroke();
    }
    ctx.restore();

    // 4. Peces lejanos nadando en silueta y colores
    ctx.save();
    for (const f of this.distantFish) {
      const sp = camera.worldToScreen(f.x, f.y);
      if (sp.x >= -40 && sp.x <= viewportWidth + 40 && sp.y >= -40 && sp.y <= viewportHeight + 40) {
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.ellipse(sp.x, sp.y, f.size, f.size * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();

        // Colita del pez
        ctx.beginPath();
        ctx.moveTo(sp.x - f.size * 0.8, sp.y);
        ctx.lineTo(sp.x - f.size * 1.4, sp.y - f.size * 0.5);
        ctx.lineTo(sp.x - f.size * 1.4, sp.y + f.size * 0.5);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();

    // 5. Algas marinas ondulantes
    ctx.save();
    for (const sw of this.seaweeds) {
      if (camera.isVisible(sw.x - 30, sw.y - sw.height, 60, sw.height + 40)) {
        const sp = camera.worldToScreen(sw.x, sw.y);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);

        const segHeight = sw.height / sw.segments;
        for (let s = 1; s <= sw.segments; s++) {
          const sway = Math.sin(now * 1.6 + sw.phase + s * 0.4) * (s * 4);
          ctx.lineTo(sp.x + sway, sp.y - s * segHeight);
        }
        ctx.stroke();
      }
    }
    ctx.restore();

    // 6. Anémonas de colores vivos con tentáculos móviles
    ctx.save();
    for (const an of this.anemones) {
      if (camera.isVisible(an.x - 25, an.y - an.height, 50, an.height + 20)) {
        const sp = camera.worldToScreen(an.x, an.y);

        // Base de la anémona
        ctx.fillStyle = '#0f3a53';
        ctx.beginPath();
        ctx.ellipse(sp.x, sp.y, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tentáculos animados
        ctx.strokeStyle = an.color;
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';

        for (let t = -an.tentacleCount / 2; t <= an.tentacleCount / 2; t++) {
          const sway = Math.sin(now * 2 + an.phase + t * 0.5) * 6;
          ctx.beginPath();
          ctx.moveTo(sp.x + t * 3, sp.y);
          ctx.quadraticCurveTo(sp.x + t * 4 + sway, sp.y - an.height * 0.6, sp.x + t * 5 + sway * 1.5, sp.y - an.height);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // 7. Estrellas de mar decorativas
    ctx.save();
    for (const st of this.starfish) {
      if (camera.isVisible(st.x - 20, st.y - 20, 40, 40)) {
        const sp = camera.worldToScreen(st.x, st.y);
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.rotate(st.rot);
        ctx.fillStyle = st.color;

        ctx.beginPath();
        for (let p = 0; p < 5; p++) {
          const a = (p * Math.PI * 2) / 5;
          const rOuter = st.size;
          const rInner = st.size * 0.45;
          ctx.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
          const aMid = a + Math.PI / 5;
          ctx.lineTo(Math.cos(aMid) * rInner, Math.sin(aMid) * rInner);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }
    ctx.restore();
  }

  drawForeground(ctx, camera) {
    // 1. Burbujas con reflejo especular
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillStyle = 'rgba(42, 213, 196, 0.25)';
    ctx.lineWidth = 1.2;

    for (const b of this.bubbles) {
      const sp = camera.worldToScreen(b.x, b.y);
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sp.x - b.radius * 0.3, sp.y - b.radius * 0.3, b.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(42, 213, 196, 0.25)';
    }
    ctx.restore();

    // 2. Destellos de partículas
    ctx.save();
    for (const s of this.sparkles) {
      const sp = camera.worldToScreen(s.x, s.y);
      ctx.globalAlpha = s.life / s.maxLife;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Pétalos de la Flor de la Vida flotando
    ctx.save();
    for (const p of this.petals) {
      const sp = camera.worldToScreen(p.x, p.y);
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 4. Textos flotantes (+1, +5, +10, +30 XP)
    ctx.save();
    ctx.font = 'bold 18px "Fredoka One", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const ft of this.floatingTexts) {
      const sp = camera.worldToScreen(ft.x, ft.y);
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillText(ft.text, sp.x + 1.5, sp.y + 1.5);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, sp.x, sp.y);
    }
    ctx.restore();
  }
}

// © jjedi90 — Todos los derechos reservados.

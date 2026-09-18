// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/ui/QuestionModal.js — Interfaz Interactiva de la Concha del Saber
// ==========================================================================

export class QuestionModal {
  constructor(game) {
    this.game = game;
    this.overlay = document.getElementById('question-modal-overlay');
    this.categoryEl = document.getElementById('shell-category-badge');
    this.difficultyEl = document.getElementById('shell-difficulty-badge');
    this.questionTextEl = document.getElementById('shell-question-content');
    this.optionsContainer = document.getElementById('shell-options-list');
    this.feedbackBox = document.getElementById('shell-feedback-panel');
    this.feedbackTitle = document.getElementById('shell-feedback-heading');
    this.feedbackText = document.getElementById('shell-feedback-description');
    this.continueBtn = document.getElementById('shell-btn-continue');
    this.hintBtn = document.getElementById('shell-btn-hint');

    this.currentQuestion = null;
    this.currentShell = null;
    this.answered = false;

    this.bindEvents();
  }

  bindEvents() {
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        this.close();
      });
    }

    if (this.hintBtn) {
      this.hintBtn.addEventListener('click', () => {
        this.useHint();
      });
    }
  }

  show(question, shell) {
    this.currentQuestion = question;
    this.currentShell = shell;
    this.answered = false;

    const mermaid = this.game.playerManager.getActiveMermaid();

    // Actualizar badges
    const categoryLabels = {
      matematicas: '📐 Matemáticas',
      ciencias: '🔬 Ciencias',
      naturaleza: '🌿 Naturaleza',
      espanol: '📚 Español',
      historia: '🏺 Historia',
      geografia: '🌍 Geografía',
      cultura_general: '🎨 Cultura General',
      logica: '🧩 Lógica'
    };

    if (this.categoryEl) {
      this.categoryEl.textContent = categoryLabels[question.categoria] || question.categoria.toUpperCase();
    }
    if (this.difficultyEl) {
      this.difficultyEl.textContent = `Nivel ${question.dificultad.toUpperCase()}`;
    }
    if (this.questionTextEl) {
      this.questionTextEl.textContent = question.pregunta;
    }

    // Ocultar panel de feedback previo
    if (this.feedbackBox) this.feedbackBox.classList.add('hidden');
    if (this.continueBtn) this.continueBtn.classList.add('hidden');

    // Botón de Pista (Si es Aria, pista gratis de su habilidad)
    if (this.hintBtn) {
      this.hintBtn.classList.remove('hidden');
      if (mermaid && mermaid.hasFreeHint) {
        this.hintBtn.textContent = '💡 Pista de Aria (Gratis)';
        this.hintBtn.disabled = false;
      } else {
        const canAfford = (this.game.coins >= 5) || ((this.game.inventory.pistas || 0) > 0);
        this.hintBtn.textContent = '💡 Usar Pista (5 🪙)';
        this.hintBtn.disabled = !canAfford;
      }
    }

    // Renderizar las 4 opciones
    this.renderOptions(question);

    // Restablecer scroll al inicio del modal
    const modal = this.overlay.querySelector('.shell-modal');
    if (modal) modal.scrollTop = 0;

    // Mostrar overlay
    this.overlay.classList.remove('hidden');
  }

  renderOptions(question) {
    if (!this.optionsContainer) return;
    this.optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];

    question.opciones.forEach((opcion, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shell-option-btn';
      btn.innerHTML = `
        <span class="option-letter">${letters[index]}</span>
        <span class="option-text">${opcion}</span>
      `;

      btn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        if (!this.answered) {
          this.handleAnswer(index, btn);
        }
      });

      btn.addEventListener('pointerdown', (e) => {
        if (e) e.stopPropagation();
      });

      this.optionsContainer.appendChild(btn);
    });
  }

  useHint() {
    if (this.answered || !this.currentQuestion) return;

    const mermaid = this.game.playerManager.getActiveMermaid();
    let allowed = false;

    if (mermaid && mermaid.hasFreeHint) {
      mermaid.hasFreeHint = false;
      allowed = true;
      if (this.game.showToast) this.game.showToast("💡 ¡Habilidad de Aria activada!");
    } else if ((this.game.inventory.pistas || 0) > 0) {
      this.game.inventory.pistas -= 1;
      allowed = true;
    } else if (this.game.coins >= 5) {
      this.game.coins -= 5;
      this.game.updateHUD();
      allowed = true;
    }

    if (allowed) {
      if (this.game.audioManager) this.game.audioManager.playClick();
      if (this.hintBtn) this.hintBtn.disabled = true;

      // Buscar una opción incorrecta y descartarla
      const incorrectIndices = [];
      this.currentQuestion.opciones.forEach((_, idx) => {
        if (idx !== this.currentQuestion.respuestaCorrecta) {
          incorrectIndices.push(idx);
        }
      });

      const toDisable = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
      const btns = this.optionsContainer.querySelectorAll('.shell-option-btn');
      if (btns[toDisable]) {
        btns[toDisable].classList.add('disabled-hint');
      }
    }
  }

  handleAnswer(selectedIndex, clickedBtn) {
    this.answered = true;
    const isCorrect = this.currentQuestion.isCorrect(selectedIndex);
    this.game.questionManager.recordAnswer(isCorrect);

    // Deshabilitar todos los botones de opciones
    const allBtns = this.optionsContainer.querySelectorAll('.shell-option-btn');
    allBtns.forEach(b => { b.disabled = true; });

    if (this.hintBtn) this.hintBtn.classList.add('hidden');

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      if (this.game.audioManager) this.game.audioManager.playCorrect();

      const reward = this.currentQuestion.getReward();
      this.game.coins += reward.coins;
      this.game.xp += reward.xp;
      this.game.updateHUD();

      // Abrir la concha permanentemente en el nivel
      if (this.currentShell) this.currentShell.opened = true;

      this.showFeedback(
        '✨ ¡Muy bien! ¡Respuesta Correcta!',
        `${this.currentQuestion.explicacion}\n\n🎁 Recompensa: +${reward.coins} monedas y +${reward.xp} XP.`,
        '#10b981'
      );
    } else {
      clickedBtn.classList.add('incorrect');
      if (allBtns[this.currentQuestion.respuestaCorrecta]) {
        allBtns[this.currentQuestion.respuestaCorrecta].classList.add('correct');
      }

      if (this.game.audioManager) this.game.audioManager.playIncorrect();

      // Comprobar si tiene segunda oportunidad (habilidad de Coral o tienda)
      const mermaid = this.game.playerManager.getActiveMermaid();
      const hasRetry = (mermaid && mermaid.hasFreeRetry) || ((this.game.inventory.segundaOportunidad || 0) > 0);

      if (hasRetry) {
        if (mermaid && mermaid.hasFreeRetry) mermaid.hasFreeRetry = false;
        else this.game.inventory.segundaOportunidad -= 1;

        this.showFeedback(
          '🔄 ¡Segunda Oportunidad!',
          `💙 Casi lo logras. ¡Tu habilidad te permite intentar responder nuevamente!`,
          '#38bdf8'
        );

        setTimeout(() => {
          this.answered = false;
          allBtns.forEach(b => {
            if (!b.classList.contains('disabled-hint')) {
              b.disabled = false;
              b.classList.remove('incorrect', 'correct');
            }
          });
          if (this.feedbackBox) this.feedbackBox.classList.add('hidden');
          if (this.continueBtn) this.continueBtn.classList.add('hidden');
        }, 2200);
        return;
      }

      if (this.currentShell) this.currentShell.opened = true;

      this.showFeedback(
        '💙 Casi lo logras',
        `No te preocupes, lo importante es seguir aprendiendo.\n\n${this.currentQuestion.explicacion}`,
        '#f43f5e'
      );
    }

    if (this.continueBtn) this.continueBtn.classList.remove('hidden');
  }

  showFeedback(title, text, color) {
    if (!this.feedbackBox) return;
    this.feedbackTitle.textContent = title;
    this.feedbackTitle.style.color = color;
    this.feedbackText.textContent = text;
    this.feedbackBox.classList.remove('hidden');

    const modal = this.overlay.querySelector('.shell-modal');
    if (modal) {
      setTimeout(() => {
        modal.scrollTo({ top: modal.scrollHeight, behavior: 'smooth' });
      }, 50);
    }
  }

  close() {
    this.overlay.classList.add('hidden');
    this.game.resumeFromQuestion();
  }
}

// © jjedi90 — Todos los derechos reservados.

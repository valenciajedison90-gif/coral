// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/education/QuestionManager.js — Administrador del Sistema Educativo
// ==========================================================================

import { QUESTIONS_DATABASE } from './questions.js';
import { Question } from './Question.js';

export class QuestionManager {
  constructor() {
    this.allQuestions = QUESTIONS_DATABASE.map(q => new Question(q));
    this.usedQuestionIds = new Set();
    this.stats = {
      correct: 0,
      incorrect: 0,
      total: 0
    };
  }

  // Obtiene una pregunta aleatoria (opcionalmente filtrando por categoría o dificultad)
  getRandomQuestion(category = null, difficulty = null) {
    let available = this.allQuestions.filter(q => !this.usedQuestionIds.has(q.id));

    if (category) {
      const catFiltered = available.filter(q => q.categoria === category);
      if (catFiltered.length > 0) available = catFiltered;
    }

    if (difficulty) {
      const diffFiltered = available.filter(q => q.dificultad === difficulty);
      if (diffFiltered.length > 0) available = diffFiltered;
    }

    // Si se agotaron las preguntas disponibles, reiniciar el historial de usadas
    if (available.length === 0) {
      this.usedQuestionIds.clear();
      available = this.allQuestions;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available[randomIndex];
    this.usedQuestionIds.add(chosen.id);
    return chosen;
  }

  recordAnswer(isCorrect) {
    this.stats.total += 1;
    if (isCorrect) {
      this.stats.correct += 1;
    } else {
      this.stats.incorrect += 1;
    }
  }

  getStats() {
    return { ...this.stats };
  }

  resetStats() {
    this.stats = { correct: 0, incorrect: 0, total: 0 };
    this.usedQuestionIds.clear();
  }
}

// © jjedi90 — Todos los derechos reservados.

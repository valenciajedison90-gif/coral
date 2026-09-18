// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/education/Question.js — Modelo de Pregunta
// ==========================================================================

export class Question {
  constructor(data) {
    this.id = data.id;
    this.categoria = data.categoria;
    this.dificultad = data.dificultad || 'medio';
    this.pregunta = data.pregunta;
    this.opciones = [...data.opciones];
    this.respuestaCorrecta = data.respuestaCorrecta;
    this.explicacion = data.explicacion;
  }

  isCorrect(selectedIndex) {
    return selectedIndex === this.respuestaCorrecta;
  }

  getReward() {
    let coins = 2;
    let xp = 15;

    if (this.dificultad === 'facil') {
      coins = 2;
      xp = 10;
    } else if (this.dificultad === 'medio') {
      coins = 4;
      xp = 20;
    } else if (this.dificultad === 'dificil') {
      coins = 6;
      xp = 30;
    }

    return { coins, xp };
  }
}

// © jjedi90 — Todos los derechos reservados.

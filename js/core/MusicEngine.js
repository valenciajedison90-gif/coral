// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/core/MusicEngine.js — Motor de Música y Banda Sonora Submarina Procedural
// Sintetizador Polifónico Web Audio API con Programación por Adelantado (Lookahead)
// ==========================================================================

function midiToFreq(midi) {
  if (!midi || midi <= 0) return 0;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export class MusicEngine {
  constructor(audioContext, masterGain) {
    this.ctx = audioContext;
    this.masterGain = masterGain;

    this.musicGain = null;
    this.ambientGain = null;
    this.duckGain = null;

    this.isPlaying = false;
    this.isPaused = false;
    this.muted = false;

    this.currentTrackName = null;
    this.currentTrack = null;

    this.currentStep = 0;
    this.nextStepTime = 0;
    this.schedulerTimer = null;
    this.scheduleAheadTime = 0.18; // segundos hacia adelante
    this.lookaheadInterval = 35;   // ms entre comprobaciones

    this.ambientSource = null;
    this.ambientFilter = null;
    this.ambientLFO = null;

    this.initAudioNodes();
    this.initTracks();
  }

  initAudioNodes() {
    if (!this.ctx || !this.masterGain) return;

    // Nodo de ganancia principal de música
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(this.muted ? 0 : 0.28, this.ctx.currentTime);

    // Nodo de atenuación suave (ducking para cuando se abre una concha de preguntas)
    this.duckGain = this.ctx.createGain();
    this.duckGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    // Nodo de oleaje ambiente submarino
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.muted ? 0 : 0.08, this.ctx.currentTime);

    this.duckGain.connect(this.musicGain);
    this.musicGain.connect(this.masterGain);
    this.ambientGain.connect(this.masterGain);
  }

  setContext(ctx, masterGain) {
    this.ctx = ctx;
    this.masterGain = masterGain;
    this.initAudioNodes();
  }

  // ==========================================================================
  // COMPOSICIONES MUSICALES (NOTAS MIDI, ACORDES, BAJOS Y RITMOS)
  // ==========================================================================
  initTracks() {
    this.tracks = {
      // ----------------------------------------------------------------------
      // 1. TEMA DEL MENÚ PRINCIPAL: "Olas de Coral"
      // Dulce, cálido, acogedor, arpegios brillantes de arpa mágica
      // ----------------------------------------------------------------------
      menu: {
        tempo: 96,
        totalSteps: 64, // 4 compases de 16 semicorcheas
        padLead: 'bell',
        // [step, midiNote, durationInSteps, volume]
        melody: [
          [0, 65, 3, 0.45], [4, 69, 3, 0.45], [8, 72, 4, 0.5], [12, 76, 3, 0.45],
          [16, 77, 4, 0.55], [20, 76, 2, 0.45], [24, 72, 3, 0.45], [28, 69, 3, 0.4],
          [32, 70, 3, 0.45], [36, 74, 3, 0.45], [40, 77, 4, 0.55], [44, 81, 4, 0.5],
          [48, 79, 3, 0.5], [52, 76, 3, 0.45], [56, 72, 3, 0.4], [60, 67, 3, 0.4]
        ],
        // [step, [notes], durationInSteps, volume]
        chords: [
          [0, [53, 57, 60, 64], 16, 0.22],  // Fmaj7
          [16, [50, 53, 57, 60], 16, 0.22], // Dm7
          [32, [46, 50, 53, 57], 16, 0.22], // Bbmaj7
          [48, [48, 52, 55, 59], 16, 0.22]  // Cmaj7
        ],
        bass: [
          [0, 41, 4, 0.4], [6, 48, 4, 0.35], [10, 53, 4, 0.35],
          [16, 38, 4, 0.4], [22, 45, 4, 0.35], [26, 50, 4, 0.35],
          [32, 34, 4, 0.4], [38, 41, 4, 0.35], [42, 46, 4, 0.35],
          [48, 36, 4, 0.4], [54, 43, 4, 0.35], [58, 48, 4, 0.35]
        ],
        bubbles: [4, 12, 20, 28, 36, 44, 52, 60]
      },

      // ----------------------------------------------------------------------
      // 2. NIVEL 1: "Danza del Arrecife" (Arrecife de Coral)
      // Alegre, juguetón, optimista, con ritmo de nado saltarín
      // ----------------------------------------------------------------------
      level1: {
        tempo: 108,
        totalSteps: 64,
        padLead: 'chime',
        melody: [
          [0, 72, 2, 0.5], [3, 76, 2, 0.5], [6, 79, 3, 0.55], [10, 81, 2, 0.5],
          [13, 79, 2, 0.45], [16, 76, 3, 0.5], [20, 74, 2, 0.45], [24, 72, 4, 0.5],
          [32, 74, 2, 0.5], [35, 77, 2, 0.5], [38, 81, 3, 0.55], [42, 79, 2, 0.5],
          [46, 76, 2, 0.45], [48, 77, 3, 0.5], [52, 74, 2, 0.45], [56, 72, 4, 0.55]
        ],
        chords: [
          [0, [48, 52, 55, 60], 16, 0.22],  // C
          [16, [45, 48, 52, 55], 16, 0.22], // Am7
          [32, [41, 45, 48, 52], 16, 0.22], // Fmaj7
          [48, [43, 47, 50, 55], 16, 0.22]  // G7
        ],
        bass: [
          [0, 48, 3, 0.45], [4, 55, 3, 0.35], [8, 48, 3, 0.4], [12, 55, 3, 0.35],
          [16, 45, 3, 0.45], [20, 52, 3, 0.35], [24, 45, 3, 0.4], [28, 52, 3, 0.35],
          [32, 41, 3, 0.45], [36, 48, 3, 0.35], [40, 41, 3, 0.4], [44, 48, 3, 0.35],
          [48, 43, 3, 0.45], [52, 50, 3, 0.35], [56, 43, 3, 0.4], [60, 50, 3, 0.35]
        ],
        bubbles: [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62]
      },

      // ----------------------------------------------------------------------
      // 3. NIVEL 2: "Secretos de la Selva Marina" (Bosque de Algas)
      // Misterioso, envolvente, flauta submarina y kalimba flotante
      // ----------------------------------------------------------------------
      level2: {
        tempo: 100,
        totalSteps: 64,
        padLead: 'flute',
        melody: [
          [0, 62, 4, 0.45], [5, 65, 3, 0.45], [9, 69, 4, 0.5], [14, 72, 3, 0.45],
          [18, 74, 4, 0.55], [23, 72, 2, 0.45], [26, 69, 3, 0.45], [30, 65, 3, 0.4],
          [32, 67, 4, 0.45], [37, 70, 3, 0.45], [41, 74, 4, 0.5], [46, 76, 3, 0.55],
          [50, 74, 3, 0.5], [54, 69, 3, 0.45], [58, 67, 3, 0.45], [61, 62, 3, 0.4]
        ],
        chords: [
          [0, [50, 53, 57, 60], 16, 0.2],  // Dm7
          [16, [45, 48, 52, 55], 16, 0.2], // Am7
          [32, [46, 50, 53, 57], 16, 0.2], // Bbmaj7
          [48, [43, 47, 50, 53], 16, 0.2]  // G7
        ],
        bass: [
          [0, 38, 5, 0.45], [8, 45, 4, 0.35], [12, 50, 3, 0.35],
          [16, 33, 5, 0.45], [24, 40, 4, 0.35], [28, 45, 3, 0.35],
          [32, 34, 5, 0.45], [40, 41, 4, 0.35], [44, 46, 3, 0.35],
          [48, 31, 5, 0.45], [56, 38, 4, 0.35], [60, 43, 3, 0.35]
        ],
        bubbles: [0, 8, 16, 24, 32, 40, 48, 56]
      },

      // ----------------------------------------------------------------------
      // 4. NIVEL 3: "El Fuego del Abismo" (Volcán Submarino)
      // Enérgico, aventurero, pulso subterráneo magmático
      // ----------------------------------------------------------------------
      level3: {
        tempo: 120,
        totalSteps: 64,
        padLead: 'chime',
        melody: [
          [0, 64, 2, 0.55], [3, 67, 2, 0.55], [6, 71, 3, 0.6], [10, 74, 2, 0.55],
          [14, 76, 4, 0.65], [20, 74, 2, 0.5], [24, 71, 3, 0.55], [28, 67, 2, 0.45],
          [32, 69, 2, 0.55], [35, 72, 2, 0.55], [38, 76, 3, 0.6], [42, 79, 3, 0.65],
          [48, 76, 3, 0.55], [52, 74, 2, 0.5], [56, 71, 3, 0.5], [60, 64, 3, 0.5]
        ],
        chords: [
          [0, [40, 47, 52, 55], 16, 0.24],  // Em
          [16, [36, 43, 48, 52], 16, 0.24], // C
          [32, [38, 45, 50, 54], 16, 0.24], // D
          [48, [35, 42, 47, 50], 16, 0.24]  // Bm
        ],
        bass: [
          [0, 40, 2, 0.5], [2, 40, 2, 0.4], [4, 47, 2, 0.45], [6, 40, 2, 0.4],
          [8, 52, 2, 0.45], [10, 40, 2, 0.4], [12, 47, 2, 0.45], [14, 40, 2, 0.4],
          [16, 36, 2, 0.5], [18, 36, 2, 0.4], [20, 43, 2, 0.45], [22, 36, 2, 0.4],
          [24, 48, 2, 0.45], [26, 36, 2, 0.4], [28, 43, 2, 0.45], [30, 36, 2, 0.4],
          [32, 38, 2, 0.5], [34, 38, 2, 0.4], [36, 45, 2, 0.45], [38, 38, 2, 0.4],
          [40, 50, 2, 0.45], [42, 38, 2, 0.4], [44, 45, 2, 0.45], [46, 38, 2, 0.4],
          [48, 35, 2, 0.5], [50, 35, 2, 0.4], [52, 42, 2, 0.45], [54, 35, 2, 0.4],
          [56, 47, 2, 0.45], [58, 35, 2, 0.4], [60, 42, 2, 0.45], [62, 35, 2, 0.4]
        ],
        bubbles: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60]
      },

      // ----------------------------------------------------------------------
      // 5. NIVEL 4: "Ecos del Templo Sumergido" (Ruinas Perdidas)
      // Místico, majestuoso, campanas cristalinas y melodía de sirena
      // ----------------------------------------------------------------------
      level4: {
        tempo: 98,
        totalSteps: 64,
        padLead: 'bell',
        melody: [
          [0, 62, 5, 0.5], [6, 65, 3, 0.45], [10, 69, 4, 0.55], [15, 74, 5, 0.6],
          [22, 72, 3, 0.5], [26, 69, 4, 0.5], [30, 65, 3, 0.45],
          [32, 70, 5, 0.5], [38, 74, 3, 0.5], [42, 77, 4, 0.55], [47, 81, 5, 0.6],
          [53, 79, 3, 0.5], [56, 76, 3, 0.45], [60, 69, 3, 0.45]
        ],
        chords: [
          [0, [50, 53, 57, 62], 16, 0.22],  // Dm9
          [16, [46, 50, 53, 58], 16, 0.22], // Bbmaj7
          [32, [43, 46, 50, 55], 16, 0.22], // Gm7
          [48, [45, 49, 52, 57], 16, 0.22]  // A7
        ],
        bass: [
          [0, 38, 6, 0.45], [8, 45, 4, 0.35], [12, 50, 3, 0.35],
          [16, 34, 6, 0.45], [24, 41, 4, 0.35], [28, 46, 3, 0.35],
          [32, 31, 6, 0.45], [40, 38, 4, 0.35], [44, 43, 3, 0.35],
          [48, 33, 6, 0.45], [56, 40, 4, 0.35], [60, 45, 3, 0.35]
        ],
        bubbles: [4, 12, 20, 28, 36, 44, 52, 60]
      },

      // ----------------------------------------------------------------------
      // 6. NIVEL 5: "El Rescate de Lumi" (Castillo de Morgana)
      // Épico, valiente, tensión y esperanza heroica
      // ----------------------------------------------------------------------
      level5: {
        tempo: 114,
        totalSteps: 64,
        padLead: 'flute',
        melody: [
          [0, 67, 3, 0.55], [4, 70, 2, 0.5], [7, 74, 3, 0.6], [11, 75, 2, 0.55],
          [14, 74, 4, 0.65], [19, 70, 2, 0.5], [22, 67, 3, 0.5], [26, 65, 3, 0.45],
          [30, 67, 3, 0.55], [34, 70, 2, 0.5], [37, 74, 3, 0.6], [42, 77, 3, 0.65],
          [46, 75, 3, 0.55], [50, 74, 2, 0.5], [54, 70, 3, 0.5], [58, 67, 4, 0.6]
        ],
        chords: [
          [0, [43, 46, 50, 55], 16, 0.24],  // Gm
          [16, [39, 43, 46, 51], 16, 0.24], // Eb
          [32, [41, 45, 48, 53], 16, 0.24], // F
          [48, [38, 42, 45, 50], 16, 0.24]  // D7
        ],
        bass: [
          [0, 31, 3, 0.5], [4, 38, 3, 0.4], [8, 43, 3, 0.4], [12, 50, 2, 0.4],
          [16, 27, 3, 0.5], [20, 34, 3, 0.4], [24, 39, 3, 0.4], [28, 46, 2, 0.4],
          [32, 29, 3, 0.5], [36, 36, 3, 0.4], [40, 41, 3, 0.4], [44, 48, 2, 0.4],
          [48, 26, 3, 0.5], [52, 33, 3, 0.4], [56, 38, 3, 0.4], [60, 45, 2, 0.4]
        ],
        bubbles: [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62]
      },

      // ----------------------------------------------------------------------
      // 7. VICTORIA / RESULTADOS: "El Canto de la Libertad"
      // Fanfarria triunfal, destellos dorados y celebración
      // ----------------------------------------------------------------------
      victory: {
        tempo: 116,
        totalSteps: 64,
        padLead: 'bell',
        melody: [
          [0, 72, 3, 0.6], [4, 76, 2, 0.6], [7, 79, 3, 0.65], [11, 84, 4, 0.7],
          [16, 81, 2, 0.6], [19, 84, 2, 0.65], [22, 86, 3, 0.7], [26, 84, 4, 0.65],
          [32, 77, 3, 0.6], [36, 81, 2, 0.6], [39, 84, 3, 0.65], [43, 89, 4, 0.7],
          [48, 88, 3, 0.65], [52, 84, 3, 0.6], [56, 79, 3, 0.6], [60, 72, 4, 0.7]
        ],
        chords: [
          [0, [48, 52, 55, 60], 16, 0.25],  // C
          [16, [45, 48, 52, 57], 16, 0.25], // Am
          [32, [41, 45, 48, 53], 16, 0.25], // F
          [48, [43, 47, 50, 55], 16, 0.25]  // G
        ],
        bass: [
          [0, 48, 4, 0.5], [6, 55, 3, 0.4], [10, 60, 4, 0.45],
          [16, 45, 4, 0.5], [22, 52, 3, 0.4], [26, 57, 4, 0.45],
          [32, 41, 4, 0.5], [38, 48, 3, 0.4], [42, 53, 4, 0.45],
          [48, 43, 4, 0.5], [54, 50, 3, 0.4], [58, 55, 4, 0.45]
        ],
        bubbles: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60]
      }
    };
  }

  // ==========================================================================
  // REPRODUCCIÓN Y CONTROL DE PISTAS
  // ==========================================================================
  playTrack(trackName) {
    if (this.currentTrackName === trackName && this.isPlaying) return;

    const track = this.tracks[trackName];
    if (!track) return;

    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // Iniciar oleaje ambiente si no está activo
    this.startAmbientWash();

    // Transición suave (crossfade)
    if (this.isPlaying) {
      this.fadeOutAndSwitch(trackName, track);
    } else {
      this.startTrack(trackName, track);
    }
  }

  startTrack(trackName, track) {
    this.currentTrackName = trackName;
    this.currentTrack = track;
    this.currentStep = 0;
    this.isPlaying = true;
    this.isPaused = false;

    // Fade in suave
    if (this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(0, now);
      this.musicGain.gain.linearRampToValueAtTime(this.muted ? 0 : 0.28, now + 0.6);
    }

    this.nextStepTime = this.ctx.currentTime + 0.05;

    if (this.schedulerTimer) clearInterval(this.schedulerTimer);
    this.schedulerTimer = setInterval(() => this.scheduler(), this.lookaheadInterval);
  }

  fadeOutAndSwitch(newTrackName, newTrack) {
    if (!this.musicGain) {
      this.startTrack(newTrackName, newTrack);
      return;
    }

    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(0.001, now + 0.4);

    setTimeout(() => {
      this.startTrack(newTrackName, newTrack);
    }, 420);
  }

  stop(fadeTime = 0.4) {
    this.isPlaying = false;
    this.currentTrackName = null;
    this.currentTrack = null;

    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0, now + fadeTime);
    }

    this.stopAmbientWash();
  }

  pause() {
    this.isPaused = true;
    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0, now + 0.2);
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(0, now);
      this.musicGain.gain.linearRampToValueAtTime(this.muted ? 0 : 0.28, now + 0.3);
    }
  }

  duck(targetVolume = 0.15, duration = 0.3) {
    if (!this.duckGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.duckGain.gain.cancelScheduledValues(now);
    this.duckGain.gain.setValueAtTime(this.duckGain.gain.value, now);
    this.duckGain.gain.linearRampToValueAtTime(targetVolume, now + duration);
  }

  unduck(duration = 0.4) {
    if (!this.duckGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.duckGain.gain.cancelScheduledValues(now);
    this.duckGain.gain.setValueAtTime(this.duckGain.gain.value, now);
    this.duckGain.gain.linearRampToValueAtTime(1.0, now + duration);
  }

  setMuted(isMuted) {
    this.muted = isMuted;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.muted ? 0 : 0.28, now);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.muted ? 0 : 0.08, now);
    }
  }

  // ==========================================================================
  // PROGRAMADOR WEB AUDIO (LOOKAHEAD SCHEDULER)
  // ==========================================================================
  scheduler() {
    if (!this.isPlaying || this.isPaused || !this.ctx || !this.currentTrack) return;

    const secondsPerStep = (60 / this.currentTrack.tempo) / 4; // Duración de 1 semicorchea

    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime, secondsPerStep);
      this.nextStepTime += secondsPerStep;
      this.currentStep = (this.currentStep + 1) % this.currentTrack.totalSteps;
    }
  }

  scheduleStep(step, time, stepDuration) {
    const track = this.currentTrack;
    if (!track) return;

    // 1. Melodía solista (Arpa, Campana o Flauta marina)
    if (track.melody) {
      for (const note of track.melody) {
        if (note[0] === step) {
          const midi = note[1];
          const durSteps = note[2];
          const vol = note[3] || 0.5;
          this.playMelodyVoice(midi, time, durSteps * stepDuration, vol, track.padLead);
        }
      }
    }

    // 2. Colchón armónico / Acordes
    if (track.chords) {
      for (const chord of track.chords) {
        if (chord[0] === step) {
          const notes = chord[1];
          const durSteps = chord[2];
          const vol = chord[3] || 0.22;
          this.playChordPad(notes, time, durSteps * stepDuration, vol);
        }
      }
    }

    // 3. Bajo submarino cálido
    if (track.bass) {
      for (const b of track.bass) {
        if (b[0] === step) {
          const midi = b[1];
          const durSteps = b[2];
          const vol = b[3] || 0.45;
          this.playBassVoice(midi, time, durSteps * stepDuration, vol);
        }
      }
    }

    // 4. Burbujas rítmicas suaves (Plop de percusión)
    if (track.bubbles && track.bubbles.includes(step)) {
      this.playBubbleRhythm(time);
    }
  }

  // ==========================================================================
  // SÍNTESIS DE INSTRUMENTOS MUSICALES
  // ==========================================================================

  // Voz Solista (Campana mágica o flauta submarina)
  playMelodyVoice(midi, time, duration, volume, voiceType = 'bell') {
    const freq = midiToFreq(midi);
    if (!freq || this.muted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, time);
      filter.Q.setValueAtTime(1.8, time);

      if (voiceType === 'flute') {
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume * 0.4, time + 0.04);
        gain.gain.setValueAtTime(volume * 0.35, time + duration * 0.7);
        gain.gain.linearRampToValueAtTime(0.001, time + duration);
      } else {
        // Bell / Harpa de cristal
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume * 0.45, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      }

      osc.frequency.setValueAtTime(freq, time);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.duckGain);

      osc.start(time);
      osc.stop(time + duration + 0.02);
    } catch (e) {
      // Audio node scheduling safe catch
    }
  }

  // Colchón de Acordes (Almohadilla armónica envolvente)
  playChordPad(midiNotes, time, duration, volume) {
    if (this.muted) return;

    try {
      midiNotes.forEach((midi, i) => {
        const freq = midiToFreq(midi);
        if (!freq) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, time);

        // Ataque y caída muy suaves
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume * 0.25, time + 0.2);
        gain.gain.setValueAtTime(volume * 0.2, time + duration - 0.25);
        gain.gain.linearRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.duckGain);

        osc.start(time);
        osc.stop(time + duration + 0.05);
      });
    } catch (e) {}
  }

  // Bajo Submarino Profundo
  playBassVoice(midi, time, duration, volume) {
    const freq = midiToFreq(midi);
    if (!freq || this.muted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume * 0.45, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.005, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.duckGain);

      osc.start(time);
      osc.stop(time + duration + 0.02);
    } catch (e) {}
  }

  // Burbuja Percusiva (Plop rítmico suave)
  playBubbleRhythm(time) {
    if (this.muted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, time);
      osc.frequency.exponentialRampToValueAtTime(260, time + 0.04);

      gain.gain.setValueAtTime(0.06, time);
      gain.gain.linearRampToValueAtTime(0.001, time + 0.045);

      osc.connect(gain);
      gain.connect(this.duckGain);

      osc.start(time);
      osc.stop(time + 0.05);
    } catch (e) {}
  }

  // ==========================================================================
  // OLEAJE AMBIENTE SUBMARINO (RUIDO ROSA FILTRADO CONTINUO)
  // ==========================================================================
  startAmbientWash() {
    if (this.ambientSource || !this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 3; // 3 segundos de buffer en bucle
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generar ruido rosa suave
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      this.ambientSource = this.ctx.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;

      // Filtro paso bajo con frecuencia oscilante (LFO)
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(260, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      this.ambientLFO = this.ctx.createOscillator();
      this.ambientLFO.frequency.setValueAtTime(0.18, this.ctx.currentTime); // 1 ciclo cada ~5.5s
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

      this.ambientLFO.connect(lfoGain);
      lfoGain.connect(this.ambientFilter.frequency);

      this.ambientSource.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);

      this.ambientSource.start();
      this.ambientLFO.start();
    } catch (e) {
      // Ignorar si el navegador restringe la creación anticipada
    }
  }

  stopAmbientWash() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
        if (this.ambientLFO) {
          this.ambientLFO.stop();
          this.ambientLFO.disconnect();
        }
      } catch (e) {}
      this.ambientSource = null;
      this.ambientLFO = null;
      this.ambientFilter = null;
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

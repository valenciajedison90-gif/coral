// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/player/MermaidAbilities.js — Habilidades de las 4 Sirenas Protagonistas
// ==========================================================================

export const MERMAID_PROFILES = {
  aria: {
    id: 'aria',
    name: 'Aria',
    title: 'Sirena Curiosa',
    colorTail: '#ec4899', // Rosa / Magenta
    colorFin: '#f472b6',
    colorHair: '#8b5cf6', // Violeta brillante
    colorTop: '#a855f7',
    description: 'Siempre atenta a los secretos del mar. Su curiosidad le permite descubrir pistas ocultas.',
    abilityName: 'Pista Brillante',
    abilityDesc: 'Descarta automáticamente una opción incorrecta en una pregunta por nivel.',
    abilityIcon: '💡',
    cooldown: 0 // Se gestiona por evento en preguntas
  },
  marina: {
    id: 'marina',
    name: 'Marina',
    title: 'Sirena Exploradora',
    colorTail: '#10b981', // Verde esmeralda marino
    colorFin: '#34d399',
    colorHair: '#fbbf24', // Rubio dorado marino
    colorTop: '#059669',
    description: 'La más veloz del arrecife. Nada con agilidad surcando corrientes submarinas.',
    abilityName: 'Impulso de Corriente',
    abilityDesc: 'Aumenta su velocidad de nado un 40% durante 3 segundos.',
    abilityIcon: '⚡',
    cooldown: 8 // segundos de recarga
  },
  coral: {
    id: 'coral',
    name: 'Coral',
    title: 'Sirena Inteligente',
    colorTail: '#f97316', // Naranja coral
    colorFin: '#fb923c',
    colorHair: '#92400e', // Castaño cálido
    colorTop: '#ea580c',
    description: 'Sabia y reflexiva. Su memoria le permite tener una segunda oportunidad si se equivoca.',
    abilityName: 'Segunda Oportunidad',
    abilityDesc: 'Permite reintentar una pregunta fallada sin perder el turno ni recibir penalización.',
    abilityIcon: '🔄',
    cooldown: 0 // Se gestiona en preguntas
  },
  naya: {
    id: 'naya',
    name: 'Naya',
    title: 'Sirena Aventurera',
    colorTail: '#3b82f6', // Azul zafiro / Añil
    colorFin: '#60a5fa',
    colorHair: '#1e293b', // Azul oscuro medianoche
    colorTop: '#2563eb',
    description: 'Valiente y protectora. Crea una barrera de concha que la protege de los peligros.',
    abilityName: 'Escudo de Concha',
    abilityDesc: 'Activa un escudo de burbujas que absorbe el siguiente impacto de un enemigo.',
    abilityIcon: '🛡️',
    cooldown: 15 // segundos de recarga
  }
};

// © jjedi90 — Todos los derechos reservados.

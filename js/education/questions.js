// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/education/questions.js — Base de Datos Educativa (80 Preguntas Iniciales)
// 8 Categorías x 10 Preguntas (Fácil, Medio, Difícil) para niños de 8 a 12 años
// ==========================================================================

export const QUESTIONS_DATABASE = [
  // ==========================================
  // 1. MATEMÁTICAS (10 PREGUNTAS)
  // ==========================================
  {
    id: 1,
    categoria: "matematicas",
    dificultad: "facil",
    pregunta: "¿Cuánto es 8 x 7?",
    opciones: ["54", "56", "62", "48"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! 8 multiplicado por 7 es igual a 56."
  },
  {
    id: 2,
    categoria: "matematicas",
    dificultad: "facil",
    pregunta: "Si una sirena tiene 15 perlas y encuentra 12 más, ¿cuántas perlas tiene en total?",
    opciones: ["25", "27", "28", "30"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! 15 + 12 = 27 perlas."
  },
  {
    id: 3,
    categoria: "matematicas",
    dificultad: "facil",
    pregunta: "¿Cómo se llama un polígono que tiene 5 lados?",
    opciones: ["Hexágono", "Pentágono", "Heptágono", "Cuadrilátero"],
    respuestaCorrecta: 1,
    explicacion: "¡Exacto! El prefijo 'penta' significa cinco, por lo que un pentágono tiene 5 lados."
  },
  {
    id: 4,
    categoria: "matematicas",
    dificultad: "medio",
    pregunta: "¿Cuál es el resultado de dividir 72 entre 8?",
    opciones: ["7", "8", "9", "6"],
    respuestaCorrecta: 2,
    explicacion: "¡Excelente! 72 dividido entre 8 es 9, porque 9 x 8 = 72."
  },
  {
    id: 5,
    categoria: "matematicas",
    dificultad: "medio",
    pregunta: "¿Qué número falta en esta serie: 3, 6, 12, 24, __?",
    opciones: ["36", "48", "30", "42"],
    respuestaCorrecta: 1,
    explicacion: "¡Genial! Cada número es el doble del anterior: 24 x 2 = 48."
  },
  {
    id: 6,
    categoria: "matematicas",
    dificultad: "medio",
    pregunta: "¿Cuál es el perímetro de un cuadrado que mide 6 metros por lado?",
    opciones: ["36 metros", "24 metros", "18 metros", "12 metros"],
    respuestaCorrecta: 1,
    explicacion: "¡Perfecto! El perímetro se calcula sumando sus 4 lados: 6 + 6 + 6 + 6 = 24 metros."
  },
  {
    id: 7,
    categoria: "matematicas",
    dificultad: "medio",
    pregunta: "¿Qué fracción representa la mitad de una pizza marina?",
    opciones: ["1/4", "2/3", "1/2", "3/4"],
    respuestaCorrecta: 2,
    explicacion: "¡Muy bien! La mitad equivale exactamente a la fracción 1/2."
  },
  {
    id: 8,
    categoria: "matematicas",
    dificultad: "dificil",
    pregunta: "¿Cuál es el resultado de (5 + 3) x (10 - 6)?",
    opciones: ["32", "28", "40", "24"],
    respuestaCorrecta: 0,
    explicacion: "¡Increíble! Primero resolvemos los paréntesis: 5 + 3 = 8 y 10 - 6 = 4. Luego multiplicamos: 8 x 4 = 32."
  },
  {
    id: 9,
    categoria: "matematicas",
    dificultad: "dificil",
    pregunta: "¿Cuál de los siguientes números es un número primo?",
    opciones: ["9", "15", "17", "21"],
    respuestaCorrecta: 2,
    explicacion: "¡Gran razonamiento! El 17 es primo porque solo se puede dividir de forma exacta entre 1 y sí mismo."
  },
  {
    id: 10,
    categoria: "matematicas",
    dificultad: "dificil",
    pregunta: "¿Cuántos minutos hay en 3 horas y media?",
    opciones: ["180 minutos", "200 minutos", "210 minutos", "220 minutos"],
    respuestaCorrecta: 2,
    explicacion: "¡Brillante! 3 horas son 180 minutos (3 x 60) más 30 minutos de la media hora = 210 minutos."
  },

  // ==========================================
  // 2. CIENCIAS (10 PREGUNTAS)
  // ==========================================
  {
    id: 11,
    categoria: "ciencias",
    dificultad: "facil",
    pregunta: "¿Cuál es el planeta más grande de nuestro Sistema Solar?",
    opciones: ["Marte", "Venus", "Júpiter", "Saturno"],
    respuestaCorrecta: 2,
    explicacion: "¡Correcto! Júpiter es el planeta más grande de nuestro Sistema Solar, ¡es un gigante gaseoso!"
  },
  {
    id: 12,
    categoria: "ciencias",
    dificultad: "facil",
    pregunta: "¿En qué estado se encuentra el agua cuando se congela y se convierte en hielo?",
    opciones: ["Líquido", "Gaseoso", "Sólido", "Plasma"],
    respuestaCorrecta: 2,
    explicacion: "¡Muy bien! Cuando el agua baja de 0°C se congela y pasa al estado sólido."
  },
  {
    id: 13,
    categoria: "ciencias",
    dificultad: "facil",
    pregunta: "¿Qué órgano bombea la sangre a todo el cuerpo humano?",
    opciones: ["Los pulmones", "El estómago", "El corazón", "El cerebro"],
    respuestaCorrecta: 2,
    explicacion: "¡Exacto! El corazón late constantemente como una bomba que distribuye sangre con oxígeno."
  },
  {
    id: 14,
    categoria: "ciencias",
    dificultad: "medio",
    pregunta: "¿Cómo se llama el proceso por el cual las plantas fabrican su propio alimento con luz solar?",
    opciones: ["Fotosíntesis", "Respiración celular", "Germinación", "Polinización"],
    respuestaCorrecta: 0,
    explicacion: "¡Excelente! La fotosíntesis usa agua, dióxido de carbono y luz solar para crear energía y oxígeno."
  },
  {
    id: 15,
    categoria: "ciencias",
    dificultad: "medio",
    pregunta: "¿Cuál es el gas que los seres humanos inhalamos y necesitamos para respirar?",
    opciones: ["Dióxido de carbono", "Oxígeno", "Helio", "Nitrógeno"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! El oxígeno es vital para nuestras células y para casi todos los animales vivos."
  },
  {
    id: 16,
    categoria: "ciencias",
    dificultad: "medio",
    pregunta: "¿Qué fuerza invisible hace que los objetos caigan hacia el suelo?",
    opciones: ["Magnetismo", "Gravedad", "Fricción", "Inercia"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! La gravedad atrae los cuerpos hacia el centro de la Tierra."
  },
  {
    id: 17,
    categoria: "ciencias",
    dificultad: "medio",
    pregunta: "¿Cuál de estos animales es un mamífero marino?",
    opciones: ["El tiburón", "El delfín", "El pez payaso", "El pulpo"],
    respuestaCorrecta: 1,
    explicacion: "¡Exacto! El delfín respira aire por su espiráculo, da a luz crías vivas y las amamanta."
  },
  {
    id: 18,
    categoria: "ciencias",
    dificultad: "dificil",
    pregunta: "¿A qué velocidad aproximada viaja la luz en el vacío?",
    opciones: ["300 km/s", "30.000 km/s", "300.000 km/s", "3.000.000 km/s"],
    respuestaCorrecta: 2,
    explicacion: "¡Fascinante! La luz viaja a casi 300.000 kilómetros por segundo, ¡es la velocidad límite del universo!"
  },
  {
    id: 19,
    categoria: "ciencias",
    dificultad: "dificil",
    pregunta: "¿Qué parte de la célula contiene la información genética (ADN)?",
    opciones: ["La membrana", "El núcleo", "El citoplasma", "El ribosoma"],
    respuestaCorrecta: 1,
    explicacion: "¡Impresionante! El núcleo celular alberga los cromosomas con las instrucciones del ADN."
  },
  {
    id: 20,
    categoria: "ciencias",
    dificultad: "dificil",
    pregunta: "¿Qué tipo de energía produce el movimiento del viento?",
    opciones: ["Solar", "Eólica", "Geotérmica", "Hidroeléctrica"],
    respuestaCorrecta: 1,
    explicacion: "¡Gran conocimiento! La energía eólica se obtiene mediante aerogeneradores movidos por el viento."
  },

  // ==========================================
  // 3. NATURALEZA (10 PREGUNTAS)
  // ==========================================
  {
    id: 21,
    categoria: "naturaleza",
    dificultad: "facil",
    pregunta: "¿Qué animal es considerado el animal más grande del planeta Tierra?",
    opciones: ["El elefante africano", "La ballena azul", "El tiburón blanco", "El calamar gigante"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! La ballena azul puede medir más de 30 metros de largo y pesar hasta 180 toneladas."
  },
  {
    id: 22,
    categoria: "naturaleza",
    dificultad: "facil",
    pregunta: "¿Cuántas patas tiene una araña común?",
    opciones: ["6 patas", "8 patas", "10 patas", "12 patas"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! Las arañas son arácnidos y tienen 8 patas, a diferencia de los insectos que tienen 6."
  },
  {
    id: 23,
    categoria: "naturaleza",
    dificultad: "facil",
    pregunta: "¿Cómo se llama la metamorfosis que hace una oruga para transformarse?",
    opciones: ["Mariposa", "Libélula", "Abeja", "Escarabajo"],
    respuestaCorrecta: 0,
    explicacion: "¡Genial! Dentro de su crisálida, la oruga se convierte en una hermosa mariposa."
  },
  {
    id: 24,
    categoria: "naturaleza",
    dificultad: "medio",
    pregunta: "¿Qué estructura marina gigante está formada por millones de diminutos pólipos vivos?",
    opciones: ["Fosas marinas", "Arrecifes de coral", "Icebergs", "Islas flotantes"],
    respuestaCorrecta: 1,
    explicacion: "¡Exacto! Los corales son colonias de diminutos animales marinos que construyen coloridos arrecifes."
  },
  {
    id: 25,
    categoria: "naturaleza",
    dificultad: "medio",
    pregunta: "¿Qué tipo de respiración utilizan los peces bajo el agua?",
    opciones: ["Pulmonar", "Cutánea", "Branquial", "Traqueal"],
    respuestaCorrecta: 2,
    explicacion: "¡Muy bien! Los peces tienen branquias que filtran el oxígeno disuelto en el agua."
  },
  {
    id: 26,
    categoria: "naturaleza",
    dificultad: "medio",
    pregunta: "¿Qué fenómeno natural submarino se produce cuando placas tectónicas chocan en el fondo del mar?",
    opciones: ["Tsunami", "Tornado", "Granizada", "Monzón"],
    respuestaCorrecta: 0,
    explicacion: "¡Correcto! Los terremotos submarinos o deslizamientos pueden generar olas gigantescas llamadas tsunamis."
  },
  {
    id: 27,
    categoria: "naturaleza",
    dificultad: "medio",
    pregunta: "¿Cómo se orientan los murciélagos y algunos delfines en la oscuridad?",
    opciones: ["Visión nocturna", "Ecolocalización", "Sentido del gusto", "Olfato extremo"],
    respuestaCorrecta: 1,
    explicacion: "¡Excelente! Emiten chasquidos de sonido y escuchan el eco que rebota en los obstáculos."
  },
  {
    id: 28,
    categoria: "naturaleza",
    dificultad: "dificil",
    pregunta: "¿Qué adaptación permite a los pulpos cambiar de color para camuflarse en segundos?",
    opciones: ["Escamas reflectantes", "Células cromatóforas", "Pelaje luminoso", "Plumas marinas"],
    respuestaCorrecta: 1,
    explicacion: "¡Asombroso! Los pulpos tienen células especiales en su piel llamadas cromatóforos con diferentes pigmentos."
  },
  {
    id: 29,
    categoria: "naturaleza",
    dificultad: "dificil",
    pregunta: "¿Cuál de estos animales marinos produce luz propia mediante bioluminiscencia?",
    opciones: ["El pez linterna", "El pez payaso", "La tortuga laúd", "La estrella de mar común"],
    respuestaCorrecta: 0,
    explicacion: "¡Perfecto! En las profundidades oscuras, el pez linterna usa bacterias bioluminiscentes para iluminar su señuelo."
  },
  {
    id: 30,
    categoria: "naturaleza",
    dificultad: "dificil",
    pregunta: "¿Qué gas producen principalmente los bosques marinos de algas y el fitoplancton en los océanos?",
    opciones: ["Metano", "Oxígeno", "Argón", "Monóxido de carbono"],
    respuestaCorrecta: 1,
    explicacion: "¡Increíble! Más del 50% del oxígeno de todo el planeta es producido por el fitoplancton marino."
  },

  // ==========================================
  // 4. ESPAÑOL / LENGUAJE (10 PREGUNTAS)
  // ==========================================
  {
    id: 31,
    categoria: "espanol",
    dificultad: "facil",
    pregunta: "¿Cuál es el antónimo (lo opuesto) de la palabra 'profundo'?",
    opciones: ["Hondo", "Superficial", "Oscuro", "Ancho"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! Si algo no es profundo, es superficial o poco hondo."
  },
  {
    id: 32,
    categoria: "espanol",
    dificultad: "facil",
    pregunta: "¿Cuál de las siguientes palabras es un sustantivo?",
    opciones: ["Nadar", "Rápidamente", "Océano", "Azul"],
    respuestaCorrecta: 2,
    explicacion: "¡Exacto! 'Océano' es un sustantivo común que nombra un lugar."
  },
  {
    id: 33,
    categoria: "espanol",
    dificultad: "facil",
    pregunta: "¿Qué tipo de palabra es 'brillante' en la frase 'la perla brillante'?",
    opciones: ["Verbo", "Adjetivo", "Pronombre", "Adverbio"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! 'Brillante' describe cómo es la perla, por eso es un adjetivo calificativo."
  },
  {
    id: 34,
    categoria: "espanol",
    dificultad: "medio",
    pregunta: "¿Cuál de estas palabras está correctamente acentuada (lleva tilde)?",
    opciones: ["Tiburón", "Tiburónn", "Tiburon", "Tíburon"],
    respuestaCorrecta: 0,
    explicacion: "¡Muy bien! 'Tiburón' es una palabra aguda terminada en 'n', por lo que lleva tilde en la última sílaba."
  },
  {
    id: 35,
    categoria: "espanol",
    dificultad: "medio",
    pregunta: "¿Cuál es el plural correcto de la palabra 'pez'?",
    opciones: ["Pezes", "Peces", "Pezs", "Pecis"],
    respuestaCorrecta: 1,
    explicacion: "¡Excelente regla! Las palabras terminadas en 'z' cambian a 'ces' en su forma plural."
  },
  {
    id: 36,
    categoria: "espanol",
    dificultad: "medio",
    pregunta: "¿Qué figura literaria se usa en: 'Las olas del mar bailaban de alegría'?",
    opciones: ["Metáfora", "Personificación", "Hipérbole", "Rima consonante"],
    respuestaCorrecta: 1,
    explicacion: "¡Genial! La personificación atribuye cualidades humanas (como bailar alegres) a cosas u objetos de la naturaleza."
  },
  {
    id: 37,
    categoria: "espanol",
    dificultad: "medio",
    pregunta: "¿En qué tiempo verbal está conjugada la palabra 'nadaremos'?",
    opciones: ["Pasado", "Presente", "Futuro", "Condicional"],
    respuestaCorrecta: 2,
    explicacion: "¡Correcto! 'Nadaremos' indica una acción que ocurrirá en el futuro."
  },
  {
    id: 38,
    categoria: "espanol",
    dificultad: "dificil",
    pregunta: "¿Qué tipo de palabra según su acento es 'música'?",
    opciones: ["Aguda", "Grave o llana", "Esdrújula", "Sobresdrújula"],
    respuestaCorrecta: 2,
    explicacion: "¡Perfecto! 'Mú-si-ca' tiene su acento en la antepenúltima sílaba, por lo tanto es esdrújula."
  },
  {
    id: 39,
    categoria: "espanol",
    dificultad: "dificil",
    pregunta: "¿Cuál es el significado del prefijo 'sub-' en palabras como 'submarino' o 'subterráneo'?",
    opciones: ["Sobre", "Debajo de", "Alrededor", "Lejos de"],
    respuestaCorrecta: 1,
    explicacion: "¡Brillante! El prefijo latino 'sub-' significa 'debajo de' (debajo del mar)."
  },
  {
    id: 40,
    categoria: "espanol",
    dificultad: "dificil",
    pregunta: "¿Cuál de estas oraciones contiene un adverbio de modo?",
    opciones: ["Aria nada rápidamente.", "Aria nada ayer.", "Aria nada aquí.", "Aria nada mucho."],
    respuestaCorrecta: 0,
    explicacion: "¡Extraordinario! 'Rápidamente' explica cómo o de qué modo nada Aria."
  },

  // ==========================================
  // 5. HISTORIA (10 PREGUNTAS)
  // ==========================================
  {
    id: 41,
    categoria: "historia",
    dificultad: "facil",
    pregunta: "¿En qué antiguo país se construyeron las famosas Grandes Pirámides de Guiza?",
    opciones: ["Grecia", "Egipto", "Roma", "China"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! Los antiguos faraones de Egipto construyeron las pirámides como monumentos funerarios."
  },
  {
    id: 42,
    categoria: "historia",
    dificultad: "facil",
    pregunta: "¿En qué año llegó Cristóbal Colón a tierras de América por primera vez?",
    opciones: ["1492", "1500", "1450", "1521"],
    respuestaCorrecta: 0,
    explicacion: "¡Correcto! En octubre de 1492, la expedición de Colón llegó a las costas de Guanahani (San Salvador)."
  },
  {
    id: 43,
    categoria: "historia",
    dificultad: "facil",
    pregunta: "¿Quiénes eran los guerreros marítimos del norte de Europa que navegaban en barcos drakkar?",
    opciones: ["Los romanos", "Los vikingos", "Los egipcios", "Los persas"],
    respuestaCorrecta: 1,
    explicacion: "¡Exacto! Los vikingos eran navegantes y exploradores de Escandinavia con barcos de dragón."
  },
  {
    id: 44,
    categoria: "historia",
    dificultad: "medio",
    pregunta: "¿Cuál fue una de las grandes civilizaciones precolombinas que habitó la cordillera de los Andes?",
    opciones: ["Los mayas", "Los aztecas", "Los incas", "Los fenicios"],
    respuestaCorrecta: 2,
    explicacion: "¡Excelente! El Imperio Inca construyó maravillas como Machu Picchu en los Andes sudamericanos."
  },
  {
    id: 45,
    categoria: "historia",
    dificultad: "medio",
    pregunta: "¿Qué invento revolucionario perfeccionó Johannes Gutenberg en el siglo XV?",
    opciones: ["La brújula", "La imprenta", "El telescopio", "El reloj de arena"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! La imprenta de tipos móviles permitió imprimir libros rápidamente y difundir el saber."
  },
  {
    id: 46,
    categoria: "historia",
    dificultad: "medio",
    pregunta: "¿Qué célebre civilización antigua inventó los Juegos Olímpicos originales en Olimpia?",
    opciones: ["Los griegos", "Los romanos", "Los mesopotámicos", "Los mongoles"],
    respuestaCorrecta: 0,
    explicacion: "¡Correcto! En la antigua Grecia los atletas competían en honor a los dioses cada cuatro años."
  },
  {
    id: 47,
    categoria: "historia",
    dificultad: "medio",
    pregunta: "¿Cómo llamaban los romanos a su majestuoso estadio donde luchaban gladiadores?",
    opciones: ["Partenón", "Coliseo", "Acrópolis", "Panteón"],
    respuestaCorrecta: 1,
    explicacion: "¡Genial! El Coliseo de Roma podía albergar a más de 50.000 espectadores."
  },
  {
    id: 48,
    categoria: "historia",
    dificultad: "dificil",
    pregunta: "¿Qué civilización antigua construyó una Gran Muralla de más de 20.000 kilómetros para defender sus fronteras?",
    opciones: ["Japón", "India", "China", "Persia"],
    respuestaCorrecta: 2,
    explicacion: "¡Perfecto! La Gran Muralla China se fue construyendo a lo largo de varias dinastías imperiales."
  },
  {
    id: 49,
    categoria: "historia",
    dificultad: "dificil",
    pregunta: "¿Quién pintó la famosa obra de arte de la 'Mona Lisa' durante el Renacimiento?",
    opciones: ["Miguel Ángel", "Leonardo da Vinci", "Rafael", "Donatello"],
    respuestaCorrecta: 1,
    explicacion: "¡Brillante! Leonardo da Vinci fue un polímata italiano: pintor, científico, inventor y anatomista."
  },
  {
    id: 50,
    categoria: "historia",
    dificultad: "dificil",
    pregunta: "¿Qué famosa ciudad antigua desapareció sepultada por la erupción del volcán Vesubio en el año 79 d.C.?",
    opciones: ["Atenas", "Pompeya", "Cartago", "Esparta"],
    respuestaCorrecta: 1,
    explicacion: "¡Increíble! Pompeya quedó conservada bajo toneladas de ceniza volcánica durante siglos."
  },

  // ==========================================
  // 6. GEOGRAFÍA (10 PREGUNTAS)
  // ==========================================
  {
    id: 51,
    categoria: "geografia",
    dificultad: "facil",
    pregunta: "¿Cuál es el océano más grande y profundo de nuestro planeta?",
    opciones: ["Atlántico", "Índico", "Pacífico", "Ártico"],
    respuestaCorrecta: 2,
    explicacion: "¡Muy bien! El Océano Pacífico cubre más de una tercera parte de toda la superficie de la Tierra."
  },
  {
    id: 52,
    categoria: "geografia",
    dificultad: "facil",
    pregunta: "¿Cuál es la montaña más alta del mundo sobre el nivel del mar?",
    opciones: ["Monte Kilimanjaro", "Monte Everest", "Aconcagua", "Mont Blanc"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! El Monte Everest se eleva a 8.848 metros en la cordillera del Himalaya."
  },
  {
    id: 53,
    categoria: "geografia",
    dificultad: "facil",
    pregunta: "¿Cuántos continentes existen habitualmente en la división geográfica tradicional?",
    opciones: ["4", "5", "6", "8"],
    respuestaCorrecta: 2,
    explicacion: "¡Exacto! América, Europa, África, Asia, Oceanía y la Antártida suman los 6 continentes."
  },
  {
    id: 54,
    categoria: "geografia",
    dificultad: "medio",
    pregunta: "¿Cuál es el río más caudaloso y largo del mundo?",
    opciones: ["El río Nilo", "El río Amazonas", "El río Misisipi", "El río Danubio"],
    respuestaCorrecta: 1,
    explicacion: "¡Excelente! El río Amazonas en Sudamérica contiene más agua que los siguientes 7 ríos juntos."
  },
  {
    id: 55,
    categoria: "geografia",
    dificultad: "medio",
    pregunta: "¿En qué país se encuentra la famosa selva tropical del Amazonas mayoritariamente?",
    opciones: ["Colombia", "Brasil", "Perú", "Venezuela"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! Aunque abarca varios países, alrededor del 60% de la Amazonía se encuentra en Brasil."
  },
  {
    id: 56,
    categoria: "geografia",
    dificultad: "medio",
    pregunta: "¿Qué línea imaginaria divide a la Tierra exactamente en hemisferio Norte y hemisferio Sur?",
    opciones: ["Meridiano de Greenwich", "Trópico de Cáncer", "Línea del Ecuador", "Círculo Polar"],
    respuestaCorrecta: 2,
    explicacion: "¡Genial! La línea del Ecuador o paralelo cero rodea el centro del globo terráqueo."
  },
  {
    id: 57,
    categoria: "geografia",
    dificultad: "medio",
    pregunta: "¿Cuál es el desierto cálido más extenso del mundo?",
    opciones: ["Desierto de Atacama", "Desierto del Sahara", "Desierto de Gobi", "Desierto de Sonora"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! El desierto del Sahara cubre casi todo el norte del continente africano."
  },
  {
    id: 58,
    categoria: "geografia",
    dificultad: "dificil",
    pregunta: "¿Cómo se llama la fosa oceánica más profunda conocida en la Tierra?",
    opciones: ["Fosa de Puerto Rico", "Fosa de las Marianas", "Fosa de Java", "Fosa de Tonga"],
    respuestaCorrecta: 1,
    explicacion: "¡Extraordinario! La Fosa de las Marianas en el Pacífico alcanza casi 11.000 metros de profundidad."
  },
  {
    id: 59,
    categoria: "geografia",
    dificultad: "dificil",
    pregunta: "¿Qué dos continentes están separados físicamente por los montes Urales?",
    opciones: ["África y Asia", "Europa y Asia", "América y Europa", "Asia y Oceanía"],
    respuestaCorrecta: 1,
    explicacion: "¡Perfecto! Los montes Urales en Rusia marcan el límite geográfico tradicional entre Europa y Asia."
  },
  {
    id: 60,
    categoria: "geografia",
    dificultad: "dificil",
    pregunta: "¿Cuál es el país más grande del mundo por superficie territorial?",
    opciones: ["Canadá", "China", "Estados Unidos", "Rusia"],
    respuestaCorrecta: 3,
    explicacion: "¡Brillante! Rusia cuenta con más de 17 millones de kilómetros cuadrados de extensión."
  },

  // ==========================================
  // 7. CULTURA GENERAL (10 PREGUNTAS)
  // ==========================================
  {
    id: 61,
    categoria: "cultura_general",
    dificultad: "facil",
    pregunta: "¿Cuántos días tiene un año bisiesto?",
    opciones: ["364", "365", "366", "367"],
    respuestaCorrecta: 2,
    explicacion: "¡Correcto! Los años bisiestos tienen un día adicional en febrero (el 29 de febrero), sumando 366 días."
  },
  {
    id: 62,
    categoria: "cultura_general",
    dificultad: "facil",
    pregunta: "¿Qué instrumento musical tiene teclas blancas y negras y cuerdas percutidas en su interior?",
    opciones: ["La guitarra", "El piano", "La flauta", "El violín"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! El piano acústico acciona martillos que golpean cuerdas tensadas al tocar sus teclas."
  },
  {
    id: 63,
    categoria: "cultura_general",
    dificultad: "facil",
    pregunta: "¿Qué colores primarios debes mezclar para obtener el color verde?",
    opciones: ["Azul y Amarillo", "Rojo y Azul", "Rojo y Amarillo", "Blanco y Negro"],
    respuestaCorrecta: 0,
    explicacion: "¡Exacto! Al mezclar la pintura azul con la pintura amarilla surge el color verde."
  },
  {
    id: 64,
    categoria: "cultura_general",
    dificultad: "medio",
    pregunta: "¿Quién escribió el clásico cuento infantil de 'El Principito'?",
    opciones: ["Hans Christian Andersen", "Antoine de Saint-Exupéry", "Hermanos Grimm", "Julio Verne"],
    respuestaCorrecta: 1,
    explicacion: "¡Excelente! El aviador y escritor francés Antoine de Saint-Exupéry creó esta tierna obra en 1943."
  },
  {
    id: 65,
    categoria: "cultura_general",
    dificultad: "medio",
    pregunta: "¿Cuántos colores componen visiblemente el arcoíris tradicional?",
    opciones: ["5 colores", "6 colores", "7 colores", "8 colores"],
    respuestaCorrecta: 2,
    explicacion: "¡Genial! Los 7 colores clásicos son: rojo, naranja, amarillo, verde, cian/azul, añil y violeta."
  },
  {
    id: 66,
    categoria: "cultura_general",
    dificultad: "medio",
    pregunta: "¿Qué deporte mundial se juega sobre césped con 11 jugadores por equipo intentando meter un balón en la portería?",
    opciones: ["Baloncesto", "Fútbol", "Voleibol", "Béisbol"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! El fútbol es el deporte más popular del mundo y se juega en dos tiempos de 45 minutos."
  },
  {
    id: 67,
    categoria: "cultura_general",
    dificultad: "medio",
    pregunta: "¿Qué célebre científico formuló la teoría de la relatividad con la ecuación E=mc²?",
    opciones: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! Albert Einstein revolucionó la física con sus estudios sobre el espacio, el tiempo y la luz."
  },
  {
    id: 68,
    categoria: "cultura_general",
    dificultad: "dificil",
    pregunta: "¿En qué museo de París se exhibe la escultura de la 'Venus de Milo' y la 'Mona Lisa'?",
    opciones: ["Museo del Prado", "Museo Británico", "Museo del Louvre", "Museo Hermitage"],
    respuestaCorrecta: 2,
    explicacion: "¡Perfecto! El Louvre es el museo de arte más visitado del mundo y se ubica en el centro de París."
  },
  {
    id: 69,
    categoria: "cultura_general",
    dificultad: "dificil",
    pregunta: "¿Qué significa la sigla 'ONU' en las relaciones internacionales?",
    opciones: [
      "Organización de Naciones Unidas",
      "Orden Nacional Universal",
      "Organismo Náutico Unificado",
      "Oficina de Negocios Unidos"
    ],
    respuestaCorrecta: 0,
    explicacion: "¡Brillante! La Organización de las Naciones Unidas promueve la paz y la cooperación global."
  },
  {
    id: 70,
    categoria: "cultura_general",
    dificultad: "dificil",
    pregunta: "¿Cuál es la moneda oficial utilizada en la mayor parte de los países de la Unión Europea?",
    opciones: ["El Dólar", "La Libra esterlina", "El Euro", "El Yen"],
    respuestaCorrecta: 2,
    explicacion: "¡Increíble! El Euro (€) comenzó a circular físicamente en 2002 en los países de la eurozona."
  },

  // ==========================================
  // 8. LÓGICA Y ACERTIJOS (10 PREGUNTAS)
  // ==========================================
  {
    id: 71,
    categoria: "logica",
    dificultad: "facil",
    pregunta: "¿Qué cosa se moja más y más a medida que seca?",
    opciones: ["El agua", "Una toalla", "El sol", "El viento"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! Una toalla absorbe la humedad de lo que está secando, por lo que ella se moja."
  },
  {
    id: 72,
    categoria: "logica",
    dificultad: "facil",
    pregunta: "Si estás en una carrera marina y adelantas a la persona que va en segundo lugar, ¿en qué puesto quedas?",
    opciones: ["En primer lugar", "En segundo lugar", "En tercer lugar", "En último lugar"],
    respuestaCorrecta: 1,
    explicacion: "¡Gran lógica! Al pasar al que iba segundo, tú ocupas ahora su lugar: ¡el segundo puesto!"
  },
  {
    id: 73,
    categoria: "logica",
    dificultad: "facil",
    pregunta: "Tengo agujas pero no coso, tengo números pero no sé leer. ¿Quién soy?",
    opciones: ["Un erizo de mar", "Un reloj", "Un libro", "Una brújula rota"],
    respuestaCorrecta: 1,
    explicacion: "¡Muy bien! El reloj tiene manecillas (agujas) y números que marcan las horas."
  },
  {
    id: 74,
    categoria: "logica",
    dificultad: "medio",
    pregunta: "La madre de María tiene cuatro hijos: Abril, Mayo, Junio y... ¿Cómo se llama el cuarto hijo?",
    opciones: ["Julio", "Agosto", "María", "Coral"],
    respuestaCorrecta: 2,
    explicacion: "¡Excelente atención al detalle! El acertijo comienza diciendo: 'La madre de María tiene cuatro hijos...' ¡Por lo tanto el cuarto es María!"
  },
  {
    id: 75,
    categoria: "logica",
    dificultad: "medio",
    pregunta: "¿Qué pesa más: un kilogramo de conchas de hierro o un kilogramo de plumas de gaviota?",
    opciones: ["El hierro", "Las plumas", "Pesan exactamente lo mismo", "Depende del agua"],
    respuestaCorrecta: 2,
    explicacion: "¡Muy bien! Ambos pesan exactamente un kilogramo."
  },
  {
    id: 76,
    categoria: "logica",
    dificultad: "medio",
    pregunta: "Si en un acuario hay 10 peces y 3 de ellos se hunden al fondo a dormir, ¿cuántos peces quedan dentro del acuario?",
    opciones: ["7 peces", "10 peces", "3 peces", "0 peces"],
    respuestaCorrecta: 1,
    explicacion: "¡Exacto! Aunque 3 estén descansando en el fondo, los 10 peces siguen estando dentro del acuario."
  },
  {
    id: 77,
    categoria: "logica",
    dificultad: "medio",
    pregunta: "¿Qué palabra continúa lógicamente este patrón: Lunes, Martes, Miércoles, Jueves...?",
    opciones: ["Sábado", "Viernes", "Domingo", "Semana"],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! Son los días sucesivos de la semana: después del jueves sigue el viernes."
  },
  {
    id: 78,
    categoria: "logica",
    dificultad: "dificil",
    pregunta: "Un granjero tiene 17 ovejas marinas. Todas menos 9 escapan nadando hacia el arrecife. ¿Cuántas ovejas le quedan al granjero?",
    opciones: ["8 ovejas", "9 ovejas", "0 ovejas", "17 ovejas"],
    respuestaCorrecta: 1,
    explicacion: "¡Brillante agudeza! El enunciado dice 'todas MENOS 9 escapan', lo que significa que le quedan justamente esas 9."
  },
  {
    id: 79,
    categoria: "logica",
    dificultad: "dificil",
    pregunta: "Siempre sube y nunca baja. ¿Qué es?",
    opciones: ["El agua", "La edad", "La marea", "El humo"],
    respuestaCorrecta: 1,
    explicacion: "¡Maravilloso! Con cada año que pasa, tu edad siempre aumenta y nunca disminuye."
  },
  {
    id: 80,
    categoria: "logica",
    dificultad: "dificil",
    pregunta: "Si 5 sirenas recolectan 5 perlas en 5 minutos, ¿cuántos minutos tardarán 100 sirenas en recolectar 100 perlas trabajando al mismo ritmo?",
    opciones: ["100 minutos", "50 minutos", "5 minutos", "1 minuto"],
    respuestaCorrecta: 2,
    explicacion: "¡Genio de la lógica! Cada sirena tarda 5 minutos en encontrar 1 perla. Si hay 100 sirenas buscando a la vez, todas terminan sus perlas en los mismos 5 minutos."
  }
];

// © jjedi90 — Todos los derechos reservados.

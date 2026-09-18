# 🧜‍♀️ CORAL — La Gran Aventura Submarina

Videojuego educativo submarino en **HTML5 Canvas 2D, CSS3 y JavaScript ES6+**, diseñado para niños y niñas de **8 a 12 años**.

**Autor y Desarrollador:** **jjedi90**  
*© Todos los derechos reservados.*

---

## 🌊 Concepto del Juego

En el reino submarino de **Coral**, cuatro jóvenes sirenas (**Aria**, **Marina**, **Coral** y **Naya**) deben adentrarse en las profundidades del océano para rescatar a su mascota mágica **Lumi**, quien ha sido capturada por la bruja marina **Morgana**.

A lo largo de su aventura, deberán:
* Nadar libremente en 4 direcciones esquivando peligros marinos.
* Recolectar monedas y perlas mágicas.
* Abrir las místicas **Conchas del Saber** y resolver desafíos educativos en 8 categorías.
* Activar las **Islas de Coral** (puntos de control con guardado automático en `LocalStorage`).
* Obtener las tres llaves legendarias (Saber, Valentía y Amistad).
* Llegar al castillo submarino, superar las pruebas y liberar a Lumi.

---

## 🛠️ Tecnologías Empleadas

* **HTML5**: Semántica moderna, Canvas 2D nativo de alto rendimiento.
* **CSS3**: Variables CSS, Glassmorphism, animaciones de fluidos y diseño adaptable responsive.
* **JavaScript ES6+**: Arquitectura modular con `import` / `export` sin frameworks externos ni dependencias de compilación.
* **Web Audio API**: Sintetizador procedural de efectos de sonido submarinos (sin requerir descargas de archivos de audio externos).
* **LocalStorage**: Guardado persistente de partida, monedas, experiencia, vidas, nivel desbloqueado y logros.

---

## 🚀 Cómo Ejecutar el Juego

Debido a que el juego utiliza módulos estándar nativos de JavaScript (`<script type="module">`), se recomienda ejecutarlo a través de un servidor HTTP local ligero.

### Opción 1: Con Python 3 (Recomendado)
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
python -m http.server 8080
```

Luego abre tu navegador en:
[http://localhost:8080](http://localhost:8080)

### Opción 2: Con Node.js (`npx serve`)
```bash
npx serve .
```

### Opción 3: En tu Celular o Tablet (Misma red Wi-Fi)
1. Ejecuta `python -m http.server 8080`.
2. Averigua tu dirección IP local (ejemplo: `192.168.40.7`).
3. Abre en el navegador de tu celular: `http://192.168.40.7:8080`.
4. El juego detectará la pantalla táctil y desplegará automáticamente la cruceta D-Pad y el botón de habilidad.

---

## 🎮 Controles de Juego

### En Computadora / Teclado
* **Nadar Arriba**: `W` o `Flecha Arriba`
* **Nadar Abajo**: `S` o `Flecha Abajo`
* **Nadar a la Izquierda**: `A` o `Flecha Izquierda`
* **Nadar a la Derecha**: `D` o `Flecha Derecha`
* **Habilidad Especial**: `Barra Espaciadora` o `Shift`
* **Pausa / Tienda**: Botón en el HUD o tecla `Escape`

### En Dispositivos Táctiles (Celular o Tablet)
* **Cruceta D-Pad virtual** en la esquina inferior izquierda:
  ```text
       ▲
   ◀   ●   ▶
       ▼
  ```
* **Botón de Habilidad Especial (⚡)** en la esquina inferior derecha.

---

## 📁 Estructura del Proyecto

```text
coral/
├── index.html                  # Punto de montaje HTML, HUD y modales
├── README.md                   # Documentación técnica completa
│
├── css/
│   ├── main.css                # Paleta submarina, reset y animaciones base
│   ├── menu.css                # Menú principal, selector de sirenas y modales
│   ├── game.css                # HUD, modal Concha del Saber y tienda rápida
│   └── responsive.css          # D-Pad táctil y adaptabilidad móvil
│
├── js/
│   ├── main.js                 # Inicializador de la aplicación
│   │
│   ├── core/
│   │   ├── Game.js             # Bucle principal (requestAnimationFrame) y ciclo de vida
│   │   ├── GameState.js        # Gestor de estados de juego (MENU, PLAYING, etc.)
│   │   ├── InputManager.js     # Gestor de teclado y toques multitáctiles
│   │   ├── Camera.js           # Cámara 2D con seguimiento suave (Lerp)
│   │   ├── Collision.js        # Detección de colisiones AABB y circulares
│   │   ├── AudioManager.js     # Sintetizador procedural con Web Audio API
│   │   └── SaveManager.js      # Persistencia en LocalStorage
│   │
│   ├── player/
│   │   ├── Mermaid.js          # Físicas de nado, inercia y dibujo procedural
│   │   ├── MermaidAbilities.js # Perfiles de Aria, Marina, Coral y Naya
│   │   └── PlayerManager.js    # Control de turno y datos de jugadora
│   │
│   ├── enemies/
│   │   ├── Enemy.js            # Clase base de criaturas
│   │   ├── Crab.js             # Cangrejo travieso con patrulla de fondo
│   │   ├── Jellyfish.js        # Medusa con movimiento sinusoidal vertical
│   │   ├── Octopus.js          # Pulpo oscuro de patrulla zonal
│   │   └── Shark.js            # Tiburón guardián de patrulla rápida
│   │
│   ├── world/
│   │   ├── Level.js            # Clase base de nivel
│   │   ├── TileMap.js          # Arrecifes, rocas y pilares sólidos
│   │   ├── Checkpoint.js       # Islas de Coral (puntos de guardado y respawn)
│   │   ├── Collectible.js      # Clase base de objetos interactivos
│   │   ├── KnowledgeShell.js   # Conchas del Saber
│   │   ├── ExitPortal.js       # Portal marino hacia la siguiente zona
│   │   ├── Lumi.js             # Mascota mágica Lumi
│   │   └── WorldManager.js     # Burbujas, partículas y rayos de sol
│   │
│   ├── education/
│   │   ├── Question.js         # Modelo de datos de preguntas
│   │   ├── QuestionManager.js  # Selector aleatorio, control de dificultad y estadísticas
│   │   └── questions.js        # Base de datos con 80 preguntas educativas
│   │
│   ├── items/
│   │   ├── Coin.js             # Monedas normales (1) y doradas (5)
│   │   ├── Pearl.js            # Perlas mágicas (10)
│   │   ├── Key.js              # Llaves del Saber, Valentía y Amistad
│   │   └── PowerUp.js          # Catálogo de utilidades de la tienda
│   │
│   ├── cards/
│   │   ├── Card.js             # Modelo de cartas especiales
│   │   └── CardManager.js      # Baraja de eventos submarinos
│   │
│   ├── ui/
│   │   ├── HUD.js              # Interfaz de vidas, monedas, XP y llaves
│   │   ├── QuestionModal.js    # Modal interactivo "Concha del Saber"
│   │   ├── PauseMenu.js        # Menú de pausa y tienda de utilidades
│   │   ├── MainMenu.js         # Menú principal y selector de personajes
│   │   └── ResultsScreen.js    # Pantalla final de misión cumplida
│   │
│   └── levels/
│       ├── level1.js           # Nivel 1: Arrecife de Coral (Mundo 3200 x 2000)
│       ├── level2.js           # Nivel 2: Bosque de Algas
│       ├── level3.js           # Nivel 3: Volcán Submarino
│       ├── level4.js           # Nivel 4: Ruinas Perdidas
│       └── level5.js           # Nivel 5: Castillo de Morgana
│
└── assets/                     # Directorio preparado para assets de arte externos
    ├── images/
    ├── sprites/
    ├── backgrounds/
    └── audio/
```

---

## 📚 Guía de Extensión y Personalización

### 1. ¿Cómo agregar nuevas preguntas educativas?
Edita el archivo `js/education/questions.js` y añade un nuevo objeto con este formato:

```javascript
{
  id: 81,
  categoria: "ciencias", // opciones: matematicas, ciencias, naturaleza, espanol, historia, geografia, cultura_general, logica
  dificultad: "facil",   // opciones: facil, medio, dificil
  pregunta: "¿Cuál es el mamífero más grande del mundo?",
  opciones: [
    "El elefante",
    "La ballena azul",
    "El rinoceronte",
    "La jirafa"
  ],
  respuestaCorrecta: 1, // índice basado en 0 (la segunda opción)
  explicacion: "¡Correcto! La ballena azul es el animal más grande del planeta."
}
```

### 2. ¿Cómo crear o modificar niveles?
Cada nivel en `js/levels/` exporta una función (ejemplo: `createLevel1()`) que retorna una instancia de `Level` configurada con:
* `worldWidth` y `worldHeight`: Dimensiones del mundo submarino.
* `playerStart`: Coordenadas `{ x, y }` iniciales de la sirena.
* `obstacles`: Arrecifes y rocas colisionables (`CoralObstacle`).
* `coins` y `pearls`: Monedas y perlas coleccionables.
* `shells`: Conchas del Saber (`KnowledgeShell`).
* `enemies`: Cangrejos, medusas, pulpos o tiburones.
* `checkpoints`: Puntos de guardado (`Checkpoint`).
* `exitPortal`: Portal hacia la siguiente zona.

### 3. ¿Cómo reemplazar los gráficos procedurales por sprites externos?
Cada entidad (como `Mermaid.js`, `Crab.js`, etc.) contiene un método `draw(ctx, camera)`.
Para usar imágenes PNG o spritesheets:
1. Carga la imagen mediante `const img = new Image(); img.src = 'assets/sprites/mermaid.png';`.
2. En `draw()`, reemplaza las llamadas a primitivas (`fillRect`, `arc`, etc.) por `ctx.drawImage(img, sx, sy, sWidth, sHeight, drawX, drawY, dWidth, dHeight)`.

---

## 🧪 Pruebas y Validación

* **Sintaxis ES6**: Validada con el compilador de Node.js (`node -c`) en todos los archivos del motor.
* **Integridad de Preguntas**: Las 80 preguntas han sido verificadas en formato, opciones y respuestas correctas.
* **Física y Resistencia del Agua**: Probada la aceleración con normalización de vectores diagonales y desaceleración suave.
* **Persistencia**: Comprobada la reactivación tras perder vidas en el último Punto de Coral y la persistencia en `LocalStorage`.

---

## 🌐 Publicación en GitHub Pages (En Línea)

El proyecto está 100% preparado para ser publicado en **GitHub Pages** con despliegue continuo automático mediante GitHub Actions.

### Pasos Rápidos para Publicar:
1. Crea un repositorio público en [github.com/new](https://github.com/new) con el nombre `coral`.
2. Haz doble clic en el archivo `publicar_en_github.bat` (o ejecuta desde la terminal):
   ```bash
   git remote add origin https://github.com/jjedi90/coral.git
   git push -u origin main
   ```
3. En tu repositorio de GitHub, ve a **Settings** > **Pages**:
   * En **Build and deployment > Source**, selecciona **GitHub Actions** (o **Deploy from a branch** -> `main` / `root`).
4. ¡Tu juego quedará publicado y jugable en todo el mundo en:
   👉 **https://jjedi90.github.io/coral/**

---

## 👑 Autor y Créditos

* **Autor, Creador y Desarrollador Original**: **jjedi90**
* **Todos los derechos reservados © jjedi90**

// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// sw.js — Service Worker para Juego sin Conexión y Rendimiento PWA
// ==========================================================================

const CACHE_NAME = 'coral-submarina-v1.3.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/menu.css',
  './css/game.css',
  './css/responsive.css',
  './js/peerjs.min.js',
  './js/main.js',
  './js/core/Game.js',
  './js/core/GameState.js',
  './js/core/InputManager.js',
  './js/core/Camera.js',
  './js/core/Collision.js',
  './js/core/AudioManager.js',
  './js/core/MusicEngine.js',
  './js/core/SaveManager.js',
  './js/player/Mermaid.js',
  './js/player/MermaidAbilities.js',
  './js/player/PlayerManager.js',
  './js/player/RemoteMermaid.js',
  './js/enemies/Enemy.js',
  './js/enemies/Crab.js',
  './js/enemies/Jellyfish.js',
  './js/enemies/Octopus.js',
  './js/enemies/Shark.js',
  './js/items/Coin.js',
  './js/items/Pearl.js',
  './js/items/Key.js',
  './js/items/FlowerOfLife.js',
  './js/items/Projectile.js',
  './js/items/PowerUp.js',
  './js/world/Level.js',
  './js/world/TileMap.js',
  './js/world/Checkpoint.js',
  './js/world/Collectible.js',
  './js/world/KnowledgeShell.js',
  './js/world/ExitPortal.js',
  './js/world/Lumi.js',
  './js/world/WorldManager.js',
  './js/education/Question.js',
  './js/education/QuestionManager.js',
  './js/education/questions.js',
  './js/cards/Card.js',
  './js/cards/CardManager.js',
  './js/network/NetworkManager.js',
  './js/pwa/InstallPromptManager.js',
  './js/ui/HUD.js',
  './js/ui/QuestionModal.js',
  './js/ui/PauseMenu.js',
  './js/ui/MainMenu.js',
  './js/ui/ResultsScreen.js',
  './js/ui/MultiplayerLobbyModal.js',
  './js/levels/level1.js',
  './js/levels/level2.js',
  './js/levels/level3.js',
  './js/levels/level4.js',
  './js/levels/level5.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable.png',
  './assets/icons/icon.svg'
];

// Instalación: Precarga de recursos clave
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de búsqueda: Cache Primero con respaldo de Red
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// © jjedi90 — Todos los derechos reservados.

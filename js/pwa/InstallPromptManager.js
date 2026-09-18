// ==========================================================================
// CORAL — La Gran Aventura Submarina
// Autor y Desarrollador: jjedi90
// js/pwa/InstallPromptManager.js — Gestor de Instalación PWA en Celular
// ==========================================================================

export class InstallPromptManager {
  constructor(game) {
    this.game = game;
    this.deferredPrompt = null;
    this.isStandalone = this.checkStandaloneMode();
    this.isIOS = this.checkIOS();

    this.modalEl = document.getElementById('pwa-install-modal');
    this.btnInstallNow = document.getElementById('btn-pwa-install-now');
    this.btnDismiss = document.getElementById('btn-pwa-dismiss');
    this.iosGuideEl = document.getElementById('pwa-ios-instructions');
    this.btnSettingsInstall = document.getElementById('btn-settings-install-pwa');

    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.bindEvents();

    // Si ya está instalado en el celular, no mostrar avisos
    if (this.isStandalone) {
      if (this.btnSettingsInstall) {
        this.btnSettingsInstall.style.display = 'none';
      }
      return;
    }

    // Comprobar si es primera visita o si aún no se ha instalado
    setTimeout(() => {
      this.checkAutoShowPrompt();
    }, 1800);
  }

  checkStandaloneMode() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  checkIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream
    );
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./sw.js')
          .then((reg) => {
            console.log('Service Worker registrado con éxito:', reg.scope);
          })
          .catch((err) => {
            console.warn('Error al registrar Service Worker:', err);
          });
      });
    }
  }

  bindEvents() {
    // 1. Evento nativo del navegador para instalación (Android / Chrome / Edge)
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir el banner mini por defecto del navegador
      e.preventDefault();
      this.deferredPrompt = e;

      // Habilitar botón de instalación en Configuración
      if (this.btnSettingsInstall) {
        this.btnSettingsInstall.classList.remove('hidden');
      }

      // Si no fue descartado previamente, mostrar modal
      this.checkAutoShowPrompt();
    });

    // 2. Evento cuando la app se instala con éxito
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      localStorage.setItem('coral_pwa_installed', 'true');
      this.hideModal();
      if (this.game && this.game.showToast) {
        this.game.showToast('🎉 ¡CORAL se instaló con éxito en tu celular!');
      }
    });

    // 3. Botón "Instalar Ahora" del modal
    if (this.btnInstallNow) {
      this.btnInstallNow.addEventListener('click', () => {
        this.triggerInstall();
      });
    }

    // 4. Botón "Ahora no" del modal
    if (this.btnDismiss) {
      this.btnDismiss.addEventListener('click', () => {
        localStorage.setItem('coral_pwa_install_dismissed', Date.now().toString());
        this.hideModal();
      });
    }

    // 5. Botón de Instalación en el Menú de Configuración
    if (this.btnSettingsInstall) {
      this.btnSettingsInstall.addEventListener('click', () => {
        this.showModal();
      });
    }
  }

  checkAutoShowPrompt() {
    if (this.isStandalone) return;

    // Verificar si ya fue instalada o descartada recientemente (hace menos de 2 días)
    const wasInstalled = localStorage.getItem('coral_pwa_installed');
    if (wasInstalled) return;

    const dismissedTime = localStorage.getItem('coral_pwa_install_dismissed');
    if (dismissedTime) {
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime, 10) < twoDaysMs) {
        return;
      }
    }

    // Mostrar modal en primera visita
    this.showModal();
  }

  showModal() {
    if (!this.modalEl) return;

    if (this.isIOS) {
      // En iOS Safari no existe beforeinstallprompt, mostramos la guía visual
      if (this.iosGuideEl) this.iosGuideEl.classList.remove('hidden');
      if (this.btnInstallNow) this.btnInstallNow.style.display = 'none';
    } else {
      if (this.iosGuideEl) this.iosGuideEl.classList.add('hidden');
      if (this.btnInstallNow) this.btnInstallNow.style.display = 'inline-flex';
    }

    this.modalEl.classList.remove('hidden');
  }

  hideModal() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  triggerInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('La usuaria aceptó instalar CORAL');
          localStorage.setItem('coral_pwa_installed', 'true');
        } else {
          console.log('La usuaria pospuso la instalación');
        }
        this.deferredPrompt = null;
        this.hideModal();
      });
    } else if (this.isIOS) {
      // Guía para Safari
      alert("En iPhone/iPad: pulsa el botón Compartir (el ícono del cuadrado con la flecha arriba ⎋) y elige 'Agregar a pantalla de inicio'.");
    } else {
      // Fallback amigable
      alert("Para instalar el juego en tu pantalla de inicio, abre el menú de tu navegador (los 3 puntos ⋮ arriba) y selecciona 'Instalar aplicación' o 'Agregar a pantalla principal'.");
      this.hideModal();
    }
  }
}

// © jjedi90 — Todos los derechos reservados.

var app = (function () {
  'use strict';

  // --- 1. FUNÇÃO DO RELÓGIO E DATA (Alínea f) ---
  function updateClock() {
    var now = new Date();

    // Formatar data (AAAA-MM-DD)
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    var dateString = year + '-' + month + '-' + day;

    // Formatar hora (HH:MM:SS)
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    var timeString = hours + ':' + minutes + ':' + seconds;

    // Atualizar no HTML
    var dateElement = document.getElementById('clock-date');
    var timeElement = document.getElementById('clock-time');

    if (dateElement) dateElement.textContent = dateString;
    if (timeElement) timeElement.textContent = timeString;
  }

  // --- 2. FUNÇÃO DA TEMPERATURA ALEATÓRIA (Alínea e) ---
  function updateTemperatures() {
    // Gerar valor aleatório entre 10 e 30 ºC
    var kitchenTemp = (Math.random() * (30 - 10) + 10).toFixed(1);
    var livingTemp = (Math.random() * (30 - 10) + 10).toFixed(1);

    var kitchenElement = document.getElementById('kitchen-temp');
    var livingElement = document.getElementById('living-temp');

    if (kitchenElement) kitchenElement.textContent = kitchenTemp + ' °C';
    if (livingElement) livingElement.textContent = livingTemp + ' °C';
  }

  // --- 3. ALTERNAR LUZES E MÚSICA (Alíneas a, b, c, d) ---
  function setupToggle(switchId, iconId, isMusic) {
    var toggle = document.getElementById(switchId);
    var icon = document.getElementById(iconId);

    if (!toggle || !icon) return;

    function updateIcon() {
      if (toggle.checked) {
        icon.className = isMusic
          ? 'fa-solid fa-music text-primary'
          : 'fa-solid fa-lightbulb text-warning';
      } else {
        icon.className = isMusic
          ? 'fa-solid fa-volume-xmark text-danger'
          : 'fa-regular fa-lightbulb text-secondary';
      }
    }

    toggle.addEventListener('change', updateIcon);
    updateIcon(); // garante que o ícone corresponde ao estado inicial
  }

  // --- INICIALIZAÇÃO ---
  // Atualizar o relógio imediatamente e depois a cada 1 segundo (1000 ms)
  updateClock();
  setInterval(updateClock, 1000);

  // Atualizar temperaturas a cada 5 segundos (5000 ms)
  setInterval(updateTemperatures, 5000);

  // Configurar interruptores de luzes/música quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', function () {
    setupToggle('btn-kitchen-lights', 'icon-kitchen-lights', false);
    setupToggle('btn-living-lights', 'icon-living-lights', false);
    setupToggle('btn-ambient-lights', 'icon-ambient-lights', false);
    setupToggle('btn-ambient-music', 'icon-ambient-music', true);
  });

})();
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
  function setupToggle(buttonId, statusId, iconId, isMusic) {
    var button = document.getElementById(buttonId);
    var status = document.getElementById(statusId);
    var icon = document.getElementById(iconId);

    if (!button || !status || !icon) return;

    button.addEventListener('click', function () {
      var isOn = status.textContent.trim().toLowerCase() === 'on';

      if (isOn) {
        // Mudar para OFF
        status.textContent = 'Off';
        status.className = 'text-danger';

        if (isMusic) {
          icon.className = 'fa-solid fa-music text-secondary';
        } else {
          icon.className = 'fa-regular fa-lightbulb text-secondary';
        }
      } else {
        // Mudar para ON
        status.textContent = 'On';
        status.className = 'text-success';

        if (isMusic) {
          icon.className = 'fa-solid fa-music text-primary';
        } else {
          icon.className = 'fa-solid fa-lightbulb text-warning';
        }
      }
    });
  }

  // --- INICIALIZAÇÃO ---
  // Atualizar o relógio imediatamente e depois a cada 1 segundo (1000 ms)
  updateClock();
  setInterval(updateClock, 1000);

  // Atualizar temperaturas a cada 5 segundos (5000 ms)
  setInterval(updateTemperatures, 5000);

  // Configurar botões de luzes/música quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', function () {
    // Exemplo de ligação dos botões aos seus respetivos IDs
    setupToggle('btn-kitchen-lights', 'status-kitchen-lights', 'icon-kitchen-lights', false);
    setupToggle('btn-living-lights', 'status-living-lights', 'icon-living-lights', false);
    setupToggle('btn-ambient-music', 'status-ambient-music', 'icon-ambient-music', true);
  });

})();
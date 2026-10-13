var app = (function ($) {
  'use strict';
 
  // Tipo de armazenamento:
  //   sessionStorage -> alíneas b) e c) (apaga ao fechar o navegador)
  //   localStorage   -> alínea d) (persiste depois de fechar o navegador)
  var storage = localStorage;
 
  // --- 1. FUNÇÃO DO RELÓGIO E DATA ---
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
    $('#clock-date').text(dateString);
    $('#clock-time').text(timeString);
  }
 
  // --- 2. FUNÇÃO DA TEMPERATURA ALEATÓRIA ---
  function updateTemperatures() {
    // Gerar valor aleatório entre 10 e 30 ºC
    var kitchenTemp = (Math.random() * (30 - 10) + 10).toFixed(1);
    var livingTemp = (Math.random() * (30 - 10) + 10).toFixed(1);
 
    $('#kitchen-temp').text(kitchenTemp + ' °C');
    $('#living-temp').text(livingTemp + ' °C');
  }
 
  // --- 3. INFORMAÇÃO METEOROLÓGICA ---
  var weatherApiKey = '64d6f96b1c3a005a4377f9a5e9376851';
  var weatherFetchedAt = null;
 
  function formatWeatherTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
 
  function formatElapsedTime() {
    if (!weatherFetchedAt) return 'Weather information not fetched yet';
 
    var elapsedSeconds = Math.floor((Date.now() - weatherFetchedAt) / 1000);
 
    if (elapsedSeconds < 60) {
      return elapsedSeconds + (elapsedSeconds === 1 ? ' second ago' : ' seconds ago');
    }
 
    var elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (elapsedMinutes < 60) {
      return elapsedMinutes + (elapsedMinutes === 1 ? ' minute ago' : ' minutes ago');
    }
 
    var elapsedHours = Math.floor(elapsedMinutes / 60);
    return elapsedHours + (elapsedHours === 1 ? ' hour ago' : ' hours ago');
  }
 
  function updateWeatherFetchedTime() {
    $('#weather-fetched').text(formatElapsedTime());
  }
 
  function fetchWeather(cityName) {
    var city = (cityName || $('#weather-city').val() || 'Leiria').trim();
    if (!city) {
      city = 'Leiria';
    }
 
    $('#weather-city').val(city);
 
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=' + encodeURIComponent(city) + '&appid=' + weatherApiKey;
 
    $.getJSON(weatherUrl)
      .done(function (weather) {
        $('#weather-current-temp').text(weather.main.temp.toFixed(1) + ' °C');
        $('#weather-max-temp').text(weather.main.temp_max.toFixed(1) + ' °C');
        $('#weather-min-temp').text(weather.main.temp_min.toFixed(1) + ' °C');
        $('#weather-humidity').text(weather.main.humidity + ' %');
        $('#weather-sunrise').text(formatWeatherTime(weather.sys.sunrise));
        $('#weather-sunset').text(formatWeatherTime(weather.sys.sunset));
 
        weatherFetchedAt = Date.now();
        updateWeatherFetchedTime();
      })
      .fail(function () {
        $('#weather-fetched').text('Unable to fetch weather information');
      });
  }
 
  // --- 4. ALTERNAR LUZES E MÚSICA (com armazenamento do estado e da hora) ---
  function setupToggle(switchId, iconId, isMusic) {
    var toggle = $('#' + switchId);
    var icon = $('#' + iconId);
 
    if (!toggle.length || !icon.length) return;
 
    // O <small> com a hora está no mesmo bloco do interruptor
    var timeLabel = toggle.closest('.card-body > div').find('small').first();
 
    function updateIcon() {
      if (toggle.prop('checked')) {
        icon.attr('class', isMusic
          ? 'fa-solid fa-music text-primary'
          : 'fa-solid fa-lightbulb text-warning');
      } else {
        icon.attr('class', isMusic
          ? 'fa-solid fa-volume-xmark text-danger'
          : 'fa-regular fa-lightbulb text-secondary');
      }
    }
 
    // Repor o estado guardado (se existir)
    var saved = storage.getItem(switchId);
    if (saved) {
      try {
        var state = JSON.parse(saved);
        toggle.prop('checked', state.status);
        timeLabel.text(state.time);
      } catch (e) {
        storage.removeItem(switchId);
      }
    }
    updateIcon(); // garante que o ícone corresponde ao estado
 
    // Guardar sempre que o utilizador altera
    toggle.on('change', function () {
      var newState = {
        status: toggle.prop('checked'),
        time: new Date().toISOString()
      };
      storage.setItem(switchId, JSON.stringify(newState));
      timeLabel.text(newState.time);
      updateIcon();
    });
  }
 
  $(function () {
    // Atualizar o relógio imediatamente e depois a cada 1 segundo (1000 ms)
    updateClock();
    setInterval(updateClock, 1000);
 
    // Atualizar temperaturas a cada 5 segundos (5000 ms)
    setInterval(updateTemperatures, 5000);
 
    fetchWeather('Leiria');
    updateWeatherFetchedTime();
    setInterval(updateWeatherFetchedTime, 1000);
 
    $('#weather-get').on('click', function () {
      fetchWeather();
    });
 
    setupToggle('btn-kitchen-lights', 'icon-kitchen-lights', false);
    setupToggle('btn-living-lights', 'icon-living-lights', false);
    setupToggle('btn-ambient-lights', 'icon-ambient-lights', false);
    setupToggle('btn-ambient-music', 'icon-ambient-music', true);
  });
 
})(jQuery);
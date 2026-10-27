import { database } from "./firebase.js";
import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

function formatTime(timestamp) {
  if (!timestamp) return '--:--';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- Sensores ---
onValue(ref(database, 'greenhouse/sensors'), (snapshot) => {
  const s = snapshot.val();
  if (!s) return;

  const time = 'Reading at ' + formatTime(s.timestamp);

  document.getElementById('temp-value').textContent = s.temperature.toFixed(1);
  document.getElementById('hum-value').textContent = s.humidity.toFixed(1);
  document.getElementById('lum-value').textContent = s.luminosity.toLocaleString('en-US');

  document.getElementById('temp-time').textContent = time;
  document.getElementById('hum-time').textContent = time;
  document.getElementById('lum-time').textContent = time;
}, (error) => console.error('Erro ao ler sensores:', error));

// --- Atuadores (mostrar estado) ---
const actuatorStates = { fan: false, irrigation: false };

function renderActuator(name, data) {
  const isOn = data && data.state === true;
  actuatorStates[name] = isOn;

  const badge = document.getElementById(name + '-badge');
  badge.textContent = isOn ? 'ON' : 'OFF';
  badge.className = 'badge ' + (isOn ? 'text-bg-success' : 'text-bg-secondary');

  document.getElementById(name + '-btn').textContent = isOn ? 'Turn off' : 'Turn on';
  document.getElementById(name + '-time').textContent = 'State at ' + formatTime(data && data.timestamp);
}

['fan', 'irrigation'].forEach((name) => {
  const actuatorRef = ref(database, 'greenhouse/actuators/' + name);

  // Atualiza a página sempre que o estado muda na Firebase
  onValue(actuatorRef, (snapshot) => renderActuator(name, snapshot.val()),
    (error) => console.error('Erro ao ler ' + name + ':', error));

  // Passo do Challenge C: clique no botão inverte o estado
  document.getElementById(name + '-btn').addEventListener('click', () => {
    set(actuatorRef, { state: !actuatorStates[name], timestamp: Date.now() })
      .catch((err) => console.error('Erro ao escrever ' + name + ':', err));
  });
});
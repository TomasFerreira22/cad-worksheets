const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require('./serviceAccountKey.json');

// TROCA PELO URL EXATO DA TUA BASE DE DADOS DO PROJETO DA FICHA 7
const DATABASE_URL = 'https://smartgreenhouse-2023125859-default-rtdb.europe-west1.firebasedatabase.app';

if (DATABASE_URL.includes('O-TEU-PROJETO')) {
  console.error('Falta definir o DATABASE_URL no app.js (ainda tem o texto de exemplo).');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: DATABASE_URL
});

const db = getDatabase();
const sensorsRef = db.ref('greenhouse/sensors');
const actuatorsRef = db.ref('greenhouse/actuators');

// ---------------------------------------------------------------
// Limites dos sensores (Challenge A)
// ---------------------------------------------------------------
const limits = {
  temperature: { min: 10, max: 45 },      // °C
  humidity: { min: 20, max: 95 },         // %
  luminosity: { min: 0, max: 50000 }      // lx
};

// Valores iniciais
const sensors = { temperature: 24, humidity: 60, luminosity: 15000 };

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Variação aleatória entre -step e +step
function randomStep(step) {
  return (Math.random() * 2 - 1) * step;
}

// ---------------------------------------------------------------
// Atuadores (Challenge C)
// ---------------------------------------------------------------
const actuators = { fan: false, irrigation: false };

// Ao arrancar, põe os dois atuadores desligados na Firebase
actuatorsRef.set({
  fan: { state: false, timestamp: Date.now() },
  irrigation: { state: false, timestamp: Date.now() }
}).catch((err) => console.error('Erro ao inicializar atuadores:', err));

// Escutar alterações feitas pela página web
['fan', 'irrigation'].forEach((name) => {
  db.ref('greenhouse/actuators/' + name).on(
    'value',
    (snapshot) => {
      const data = snapshot.val();
      actuators[name] = !!(data && data.state);
      console.log('Atuador ' + name + ':', actuators[name] ? 'ON' : 'OFF');
    },
    (err) => console.error('Erro ao ler atuador ' + name + ':', err)
  );
});

// ---------------------------------------------------------------
// Simulação dos sensores (a cada 5 segundos)
// ---------------------------------------------------------------
function updateSensors() {
  // Ventoinha ON: temperatura desce. OFF: sobe muito ligeiramente.
  const fanEffect = actuators.fan ? -0.8 : 0.1;
  // Rega ON: humidade sobe. OFF: desce ligeiramente.
  const irrigationEffect = actuators.irrigation ? 1.5 : -0.2;

  sensors.temperature = clamp(
    sensors.temperature + randomStep(0.5) + fanEffect,
    limits.temperature.min,
    limits.temperature.max
  );
  sensors.humidity = clamp(
    sensors.humidity + randomStep(1) + irrigationEffect,
    limits.humidity.min,
    limits.humidity.max
  );
  sensors.luminosity = clamp(
    sensors.luminosity + randomStep(2000),
    limits.luminosity.min,
    limits.luminosity.max
  );

  const reading = {
    temperature: Number(sensors.temperature.toFixed(1)),
    humidity: Number(sensors.humidity.toFixed(1)),
    luminosity: Math.round(sensors.luminosity),
    timestamp: Date.now()
  };

  sensorsRef.set(reading)
    .then(() => console.log('Sensores:', reading))
    .catch((err) => console.error('Erro ao escrever sensores:', err));
}

updateSensors();
setInterval(updateSensors, 5000);
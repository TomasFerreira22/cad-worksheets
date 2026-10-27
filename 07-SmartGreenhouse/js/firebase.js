import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4WWK4XigkKM7-jYUBHQGQkyg2189CjEg",
  authDomain: "smartgreenhouse-2023125859.firebaseapp.com",
  databaseURL: "https://smartgreenhouse-2023125859-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "smartgreenhouse-2023125859",
  storageBucket: "smartgreenhouse-2023125859.firebasestorage.app",
  messagingSenderId: "892870992296",
  appId: "1:892870992296:web:7b7a8932cdbd4c46f17d9d"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
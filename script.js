import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBf_IFIXbBnzdgUGxXY8a3Ly27S1VxYPQ8",
  authDomain: "encuesta-cetis.firebaseapp.com",
  projectId: "encuesta-cetis",
  storageBucket: "encuesta-cetis.firebasestorage.app",
  messagingSenderId: "873636354302",
  appId: "1:873636354302:web:ab1a4bca9de8358f27edaf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let chart;

// 🔥 GUARDAR RESPUESTAS
window.guardar = async function () {
    let nueva = {
        nombre: document.getElementById("nombre").value,
        grupo: document.getElementById("grupo").value
    };

    for (let i = 1; i <= 15; i++) {
        let elemento = document.getElementById("p" + i);
        if (elemento) nueva["p" + i] = elemento.value;
    }

    await addDoc(collection(db, "encuestas"), nueva);
    alert("Respuesta enviada");

    generarReporte();
};

// 📊 REPORTE + GRÁFICA
async function generarReporte() {
    const querySnapshot = await getDocs(collection(db, "encuestas"));

    let total = querySnapshot.size;

    let bueno = 0;
    let regular = 0;
    let malo = 0;

    querySnapshot.forEach(doc => {
        let d = doc.data();
        if (d.p1 === "Bueno") bueno++;
        if (d.p1 === "Regular") regular++;
        if (d.p1 === "Malo") malo++;
    });

    // 🧾 REPORTE TEXTO
    document.getElementById("reporte").innerHTML = `
        Total respuestas: ${total}<br>
        Bueno: ${bueno}<br>
        Regular: ${regular}<br>
        Malo: ${malo}
    `;

    // 📊 GRÁFICA
    const ctx = document.getElementById("grafica").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Bueno", "Regular", "Malo"],
            datasets: [{
                data: [bueno, regular, malo]
            }]
        }
    });
}

// Cargar datos al iniciar
generarReporte();

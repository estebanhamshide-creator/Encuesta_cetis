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

    document.getElementById("reporte").innerHTML = `
        Total respuestas: ${total}
    `;

    const contenedor = document.getElementById("graficas");
    contenedor.innerHTML = "";

    // 🔥 recorrer preguntas cerradas (1 a 13)
    for (let i = 1; i <= 13; i++) {

        let conteo = {};

        querySnapshot.forEach(doc => {
            let d = doc.data();
            let respuesta = d["p" + i];

            if (respuesta) {
                conteo[respuesta] = (conteo[respuesta] || 0) + 1;
            }
        });

        // crear canvas dinámico
        let canvas = document.createElement("canvas");
        canvas.id = "grafica" + i;
        canvas.style.marginTop = "30px";

        contenedor.appendChild(canvas);

        // crear gráfica
        new Chart(canvas, {
            type: "bar",
            data: {
                labels: Object.keys(conteo),
                datasets: [{
                    label: "Pregunta " + i,
                    data: Object.values(conteo)
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
}
// Cargar datos al iniciar
generarReporte();

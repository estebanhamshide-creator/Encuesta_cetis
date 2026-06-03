// 🔥 IMPORTS (Firebase moderno)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// 🔑 TU CONFIG (la que ya tienes)
const firebaseConfig = {
  apiKey: "AIzaSyBf_IFIXbBnzdgUGxXY8a3Ly27S1VxYPQ8",
  authDomain: "encuesta-cetis.firebaseapp.com",
  projectId: "encuesta-cetis",
  storageBucket: "encuesta-cetis.firebasestorage.app",
  messagingSenderId: "873636354302",
  appId: "1:873636354302:web:ab1a4bca9de8358f27edaf"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 HACER FUNCIONES GLOBALES
window.guardar = async function () {
    let nueva = {
        nombre: document.getElementById("nombre").value,
        grupo: document.getElementById("grupo").value
    };

    for (let i = 1; i <= 15; i++) {
        let elemento = document.getElementById("p" + i);
        if (elemento) {
            nueva["p" + i] = elemento.value;
        }
    }

    await addDoc(collection(db, "encuestas"), nueva);
    alert("Respuesta enviada");

    generarReporte();
};

async function generarReporte() {
    const querySnapshot = await getDocs(collection(db, "encuestas"));

    let total = querySnapshot.size;
    let malos = 0;

    querySnapshot.forEach(doc => {
        let d = doc.data();
        if (d.p1 === "Malo") malos++;
    });

    document.getElementById("reporte").innerHTML = `
        Total respuestas: ${total}<br>
        Calles en mal estado: ${porcentaje(malos, total)}%
    `;
}

function porcentaje(valor, total) {
    return total ? ((valor / total) * 100).toFixed(1) : 0;
}

// Ejecutar al cargar
generarReporte();

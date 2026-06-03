function guardar() {
    let datos = JSON.parse(localStorage.getItem("encuestas")) || [];

    let nueva = {
        calles: document.getElementById("calles").value,
        afecta: document.getElementById("afecta").value,
        desigualdad: document.getElementById("desigualdad").value,
        participacion: document.getElementById("participacion").value
    };

    datos.push(nueva);
    localStorage.setItem("encuestas", JSON.stringify(datos));

    generarReporte();
}

function generarReporte() {
    let datos = JSON.parse(localStorage.getItem("encuestas")) || [];

    let total = datos.length;

    let conteo = {
        bueno: 0,
        regular: 0,
        malo: 0
    };

    datos.forEach(d => {
        if (d.calles === "Bueno") conteo.bueno++;
        if (d.calles === "Regular") conteo.regular++;
        if (d.calles === "Malo") conteo.malo++;
    });

    let reporte = `
        Total respuestas: ${total}<br>
        Bueno: ${porcentaje(conteo.bueno, total)}%<br>
        Regular: ${porcentaje(conteo.regular, total)}%<br>
        Malo: ${porcentaje(conteo.malo, total)}%
    `;

    document.getElementById("reporte").innerHTML = reporte;
}

function porcentaje(valor, total) {
    return total ? ((valor / total) * 100).toFixed(1) : 0;
}

generarReporte();

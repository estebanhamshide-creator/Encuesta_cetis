function guardar() {
    let datos = JSON.parse(localStorage.getItem("encuestas")) || [];

    let nueva = {};

    for (let i = 1; i <= 15; i++) {
        let elemento = document.getElementById("p" + i);
        if (elemento) {
            nueva["p" + i] = elemento.value;
        }
    }

    datos.push(nueva);
    localStorage.setItem("encuestas", JSON.stringify(datos));

    generarReporte();
}

function generarReporte() {
    let datos = JSON.parse(localStorage.getItem("encuestas")) || [];

    let total = datos.length;

    let malos = datos.filter(d => d.p1 === "Malo").length;

    document.getElementById("reporte").innerHTML = `
        Total respuestas: ${total}<br>
        Calles en mal estado: ${porcentaje(malos, total)}%
    `;
}

function porcentaje(valor, total) {
    return total ? ((valor / total) * 100).toFixed(1) : 0;
}

generarReporte();

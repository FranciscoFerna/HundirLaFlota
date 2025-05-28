import { Barco } from "./model/Barco.js";
import { Tablero } from "./model/Tablero.js";

const tablero = new Tablero(10, 10);
let barcoSeleccionado = null;
let orientacion = "H";
let barcosColocados = 0;
let totalBarcos = 0;

crearTableroHTML("tablero-jugador", 10, 10);
asignarEventosCasillas();

fetch("../data/barcos.json")
    .then(res => res.json())
    .then(barcos => {
        totalBarcos = barcos.length;
        mostrarBarcos(barcos);
    });

function mostrarBarcos(barcos) {
    const contenedor = document.getElementById("barcos-disponibles");
    contenedor.innerHTML = "";

    barcos.forEach(datos => {
        const btn = document.createElement("button");
        btn.textContent = `${datos.nombre} (${datos.tamaño})`;
        btn.addEventListener("click", () => {
            barcoSeleccionado = {...datos, boton: btn };
        });
        contenedor.appendChild(btn);
    });
}

window.addEventListener("keydown", e => {
    if (["h", "v"].includes(e.key)) {
        orientacion = e.key.toUpperCase();
    }
});

function crearTableroHTML(id, filas, columnas) {
    const contenedor = document.getElementById(id);
    contenedor.innerHTML = "";
    for (let x = 0; x < filas; x++) {
        for (let y = 0; y < columnas; y++) {
            const celda = document.createElement("div");
            celda.className = "casilla";
            celda.dataset.x = x;
            celda.dataset.y = y;
            contenedor.appendChild(celda);
        }
    }
}

function asignarEventosCasillas() {
    document.querySelectorAll(".casilla").forEach(celda => {
        celda.addEventListener("click", () => {
            if (!barcoSeleccionado) return alert("Selecciona un barco primero");

            const { nombre, tamaño, boton } = barcoSeleccionado;
            const x = +celda.dataset.x,
                y = +celda.dataset.y;
            const barco = new Barco(nombre, tamaño);
            const colocado = tablero.colocarBarco(barco, x, y, orientacion);

            if (colocado) {
                barco.posiciones.forEach(c => {
                    document.querySelector(`.casilla[data-x='${c.x}'][data-y='${c.y}']`).classList.add("barco");
                });
                boton.disabled = true;
                barcoSeleccionado = null;
                barcosColocados++;
                if (barcosColocados === totalBarcos) bloquearTablero();
            } else {
                alert("No se puede colocar el barco ahi");
            }
        });
    });
}

function bloquearTablero() {
    document.querySelectorAll(".casilla").forEach(c => c.style.pointerEvents = "none");
    alert("Todos los barcos colocados");
}

document.getElementById("reset").addEventListener("click", () => {
    crearTableroHTML("tablero-jugador", 10, 10);
    asignarEventosCasillas();
    tablero.barcos = [];
    tablero.casillas = tablero._crearCasillas();
    barcoSeleccionado = null;
    barcosColocados = 0;
    document.querySelectorAll("#barcos-disponibles button").forEach(btn => btn.disabled = false);
    alert("Tablero reiniciado");
});
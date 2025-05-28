import { disparoJugador } from "../controllers/juego.js";
import { turnoIA } from "../controllers/IA.js";

import { Barco } from "./model/Barco.js";
import { Tablero } from "./model/Tablero.js";

const tablero = new Tablero(10, 10);
const tableroIA = new Tablero(10, 10);

let barcoSeleccionado = null;
let orientacion = "H";
let barcosColocados = 0;
let totalBarcos = 0;

crearTableroHTML("tablero-jugador", 10, 10);
crearTableroHTML("tablero-ia", 10, 10);
asignarEventosCasillas();
asignarEventosAtaqueIA();
bloquearAtaquesIA();

fetch("../data/barcos.json")
    .then(res => res.json())
    .then(barcos => {
        totalBarcos = barcos.length;
        mostrarBarcos(barcos);
        colocarBarcosIA(barcos);
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
    document.querySelectorAll("#tablero-jugador .casilla").forEach(celda => {
        celda.addEventListener("click", () => {
            if (!barcoSeleccionado) return console.log("Selecciona un barco primero");

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
                if (barcosColocados === totalBarcos) {
                    bloquearTablero();
                    activarAtaquesIA();
                    document.getElementById("jugar").disabled = false;
                }
            } else {
                console.log("No se puede colocar el barco ahi");
            }
        });
    });
}

function bloquearTablero() {
    document.querySelectorAll("#tablero-jugador .casilla").forEach(c => {
        c.style.pointerEvents = "none";
    });
}

function bloquearAtaquesIA() {
    document.querySelectorAll("#tablero-ia .casilla").forEach(c => {
        c.style.pointerEvents = "none";
    });
}

function activarAtaquesIA() {
    document.querySelectorAll("#tablero-ia .casilla").forEach(c => {
        c.style.pointerEvents = "auto";
    });
}

document.getElementById("reset").addEventListener("click", () => {
    crearTableroHTML("tablero-jugador", 10, 10);
    crearTableroHTML("tablero-ia", 10, 10);
    asignarEventosCasillas();
    asignarEventosAtaqueIA();
    tablero.barcos = [];
    tablero.casillas = tablero._crearCasillas();
    barcoSeleccionado = null;
    barcosColocados = 0;
    document.querySelectorAll("#barcos-disponibles button").forEach(btn => btn.disabled = false);
    bloquearAtaquesIA();
    document.getElementById("jugar").disabled = true;
    document.getElementById("form-disparo").style.display = "none";
});

function colocarBarcosIA(barcos) {
    barcos.forEach(datos => {
        const barco = new Barco(datos.nombre, datos.tamaño);
        let colocado = false;

        while (!colocado) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            const orientacion = Math.random() < 0.5 ? "H" : "V";
            colocado = tableroIA.colocarBarco(barco, x, y, orientacion);
        }
    });
}

function asignarEventosAtaqueIA() {
    document.querySelectorAll("#tablero-ia .casilla").forEach(celda => {
        celda.addEventListener("click", () => {
            const x = parseInt(celda.dataset.x);
            const y = parseInt(celda.dataset.y);
            const resultado = disparoJugador(x, y, tableroIA);
            if (resultado !== "repetida") {
                procesarResultadoDisparo(x, y, resultado);
            }
        });
    });
}

document.getElementById("jugar").addEventListener("click", () => {
    document.getElementById("form-disparo").style.display = "block";
});

document.getElementById("disparar").addEventListener("click", () => {
    const x = parseInt(document.getElementById("input-x").value);
    const y = parseInt(document.getElementById("input-y").value);
    if (isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
        console.log("Coordenadas no validas");
        return;
    }
    const resultado = disparoJugador(x, y, tableroIA);
    if (resultado !== "repetida") {
        procesarResultadoDisparo(x, y, resultado);
    }
});

function procesarResultadoDisparo(x, y, resultado) {
    const celda = document.querySelector(`#tablero-ia .casilla[data-x='${x}'][data-y='${y}']`);
    celda.classList.add("atacada");
    celda.style.pointerEvents = "none";

    if (resultado === "agua") {
        celda.classList.add("agua");
        console.log("Agua");

        const ia = turnoIA(tablero);
        const celdaIA = document.querySelector(`#tablero-jugador .casilla[data-x='${ia.x}'][data-y='${ia.y}']`);
        celdaIA.classList.add("atacada");
        celdaIA.style.pointerEvents = "none";

        if (ia.resultado === "agua") {
            celdaIA.classList.add("agua");
            console.log("IA: agua");
        } else if (ia.resultado === "tocado") {
            celdaIA.classList.add("tocado");
            console.log("IA: tocado");
        } else if (ia.resultado === "hundido") {
            celdaIA.classList.add("hundido");
            console.log("IA: hundido");
        }

        if (tablero.barcos.every(barco => barco.estaHundido())) {
            console.log("Has perdido");
            bloquearTablero();
            bloquearAtaquesIA();
        }

    } else {
        celda.classList.add(resultado === "hundido" ? "hundido" : "tocado");
        console.log(resultado === "hundido" ? "Barco hundido" : "Barco tocado");

        if (tableroIA.barcos.every(barco => barco.estaHundido())) {
            console.log("Has ganado");
            bloquearTablero();
            bloquearAtaquesIA();
            document.getElementById("form-disparo").style.display = "none";
        }
    }
}
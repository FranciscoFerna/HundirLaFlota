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
                if (barcosColocados === totalBarcos) {
                    bloquearTablero();
                    activarAtaquesIA();
                }
            } else {
                alert("No se puede colocar el barco ahí");
            }
        });
    });
}

function bloquearTablero() {
    document.querySelectorAll("#tablero-jugador .casilla").forEach(c => {
        c.style.pointerEvents = "none";
    });
    alert("Todos los barcos colocados. ¡Empieza el combate!");
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
    alert("Tablero reiniciado");
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
            const casilla = tableroIA.casillas[x][y];

            if (casilla.atacada) return;

            const resultado = casilla.recibirAtaque();
            casilla.atacada = true;

            celda.classList.add("atacada");
            celda.style.pointerEvents = "none";

            if (resultado === "agua") {
                celda.classList.add("agua");
                alert("💧 Agua");
            } else if (resultado === "tocado") {
                celda.classList.add("tocado");
                alert("🔥 Tocado");
            } else if (resultado === "hundido") {
                celda.classList.add("hundido");
                alert("💥 Hundido");
            }

            if (tableroIA.barcos.every(barco => barco.estaHundido())) {
                alert("🎉 ¡Has ganado!");
                bloquearTablero();
                bloquearAtaquesIA();
                return;
            }
            setTimeout(turnoIA, 500);
            console.log(celda.classList)
        });
    });
}

function turnoIA() {
    let x, y, casilla;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        casilla = tablero.casillas[x][y];
    } while (casilla.atacada);

    const resultado = casilla.recibirAtaque();
    const celdaDOM = document.querySelector(`#tablero-jugador .casilla[data-x='${x}'][data-y='${y}']`);
    celdaDOM.classList.add("atacada");
    celdaDOM.style.pointerEvents = "none";

    if (resultado === "agua") {
        celdaDOM.classList.add("agua");
        alert("La IA ha fallado, ha salido agua");
    } else if (resultado === "tocado") {
        celdaDOM.classList.add("tocado");
        alert("La IA ha tocado uno de tus barcos");
    } else if (resultado === "hundido") {
        celdaDOM.classList.add("hundido");
        alert("La IA ha hundido uno de tus barcos");
    }

    if (tablero.barcos.every(barco => barco.estaHundido())) {
        alert("Partida terminada. Has perdido");
        bloquearTablero();
        bloquearAtaquesIA();
    }
}
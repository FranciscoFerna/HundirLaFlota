import { crearTableroHTML } from "./utils/dom.js";
import { manejarEventosColocacion } from "./controllers/colocacion.js";
import { iniciarJuego } from "./controllers/iniciar.js";
import {
  disparoJugador,
  procesarResultadoDisparo,
  turnoIA,
  asignarEventosAtaqueIA,
} from "./controllers/juego.js";
import {
  guardarPartida,
  cargarPartida,
  recuperaTablerosApi,
} from "./controllers/api.js";

import { mostrarBarcos } from "./setup/jugador.js";
import { colocarBarcosIA } from "./setup/ia.js";
import { tablero, tableroIA } from "./controllers/estado.js";

window.tablero = tablero;
window.tableroIA = tableroIA;
window.orientacion = "H";
window.barcoSeleccionado = null;
window.barcosColocados = 0;
window.totalBarcos = 0;
window.juegoActivo = false;

window.disparoJugador = disparoJugador;
window.procesarResultadoDisparo = procesarResultadoDisparo;
window.turnoIA = turnoIA;

crearTableroHTML("tablero-jugador", 10, 10);
crearTableroHTML("tablero-ia", 10, 10);
manejarEventosColocacion();
asignarEventosAtaqueIA();

fetch("../data/barcos.json")
  .then((res) => res.json())
  .then((barcos) => {
    window.totalBarcos = barcos.length;
    mostrarBarcos(barcos);
    colocarBarcosIA(barcos, tableroIA);
  });

document.getElementById("jugar").addEventListener("click", () => {
  document.getElementById("form-disparo").style.display = "block";
  window.juegoActivo = true;
});

document.getElementById("reset").addEventListener("click", () => {
  crearTableroHTML("tablero-jugador", 10, 10);
  crearTableroHTML("tablero-ia", 10, 10);

  manejarEventosColocacion();
  asignarEventosAtaqueIA();

  window.barcoSeleccionado = null;
  window.barcosColocados = 0;
  window.juegoActivo = false;

  document.getElementById("form-disparo").style.display = "none";
  document.getElementById("jugar").disabled = true;

  document.querySelectorAll("#barcos-disponibles button").forEach((btn) => {
    btn.disabled = false;
  });

  window.tablero.casillas = window.tablero._crearCasillas();
  window.tablero.barcos = [];

  window.tableroIA.casillas = window.tableroIA._crearCasillas();
  window.tableroIA.barcos = [];

  fetch("../data/barcos.json")
    .then((res) => res.json())
    .then((barcos) => {
      window.totalBarcos = barcos.length;
      mostrarBarcos(barcos);
      colocarBarcosIA(barcos, window.tableroIA);
    });
});

document.getElementById("btnGuardar").addEventListener("click", () => {
  const nombreJugador = prompt("Introduce tu nombre:");
  guardarPartida(nombreJugador, window.tablero, window.tableroIA);
});

document.getElementById("btnCargar").addEventListener("click", async () => {
  const id = prompt("Introduce el ID de la partida:");
  const partida = await cargarPartida(id);
  if (partida) {
    recuperaTablerosApi(partida);
  }
});

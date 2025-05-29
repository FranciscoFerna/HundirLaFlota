import { Barco } from "../model/Barco.js";
import { disparoJugador } from "./juego.js";
import { turnoIA } from "./juego.js";
import { tableroIA } from "./estado.js";

export function iniciarJuego() {
  const form = document.getElementById("form-disparo");
  form.style.display = "block";

  document.getElementById("disparar").addEventListener("click", () => {
    if (!window.juegoActivo) return; // ⛔️ evita disparar antes de empezar

    const x = parseInt(document.getElementById("input-x").value);
    const y = parseInt(document.getElementById("input-y").value);
    if (isNaN(x) || isNaN(y)) return;

    const resultado = disparoJugador(x, y, tableroIA);
    if (resultado !== "repetida") {
      procesarDisparoJugador(x, y, resultado);
    }
  });
}

function procesarDisparoJugador(x, y, resultado) {
  const celda = document.querySelector(
    `#tablero-ia .casilla[data-x='${x}'][data-y='${y}']`
  );
  celda.classList.add("atacada");
  celda.classList.add(
    resultado === "agua"
      ? "agua"
      : resultado === "tocado"
      ? "tocado"
      : "hundido"
  );
  celda.style.pointerEvents = "none";

  const { tablero, tableroIA } = window;

  if (resultado === "agua") {
    const ia = turnoIA(tablero);
    const celdaIA = document.querySelector(
      `#tablero-jugador .casilla[data-x='${ia.x}'][data-y='${ia.y}']`
    );
    celdaIA.classList.add("atacada", ia.resultado);
    celdaIA.style.pointerEvents = "none";

    if (tablero.barcos.every((barco) => barco.estaHundido())) {
      console.log("Has perdido");
      window.juegoActivo = false;
    }
  }

  if (tableroIA.barcos.every((barco) => barco.estaHundido())) {
    console.log("Has ganado");
    document.getElementById("form-disparo").style.display = "none";
    window.juegoActivo = false;
  }
}

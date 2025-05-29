import { crearTableroHTML } from "../utils/dom.js";
import { manejarEventosColocacion } from "./colocacion.js";
import { asignarEventosAtaqueIA } from "./juego.js";
import { Tablero } from "../model/Tablero.js";
import { Barco } from "../model/Barco.js";

export async function guardarPartida(nombreJugador, tableroJugador, tableroIA) {
  const partida = {
    jugador: nombreJugador,
    tableroJugador: tableroJugador.toJSON(),
    tableroIA: tableroIA.toJSON()
  };

  try {
    const response = await fetch("http://localhost:3000/partidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partida)
    });

    if (!response.ok) throw new Error("Error al guardar la partida");

    const data = await response.json();
    console.log("Partida guardada con éxito:", data);
    return data.id;
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function cargarPartida(idPartida) {
  try {
    const response = await fetch(`http://localhost:3000/partidas/${idPartida}`);
    if (!response.ok) throw new Error("No se encontró la partida");

    const data = await response.json();
    console.log("Partida cargada:", data);
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

export function recuperaTablerosApi(partida) {
  window.tablero = Tablero.fromJSON(partida.tableroJugador);
  window.tableroIA = Tablero.fromJSON(partida.tableroIA);

  crearTableroHTML("tablero-jugador", 10, 10);
  crearTableroHTML("tablero-ia", 10, 10);

  manejarEventosColocacion();
  asignarEventosAtaqueIA();

  // Pintar barcos del jugador
  window.tablero.barcos.forEach(barco => {
    barco.posiciones.forEach(pos => {
      const celda = document.querySelector(
        `#tablero-jugador .casilla[data-x='${pos.x}'][data-y='${pos.y}']`
      );
      if (celda) {
        celda.classList.add("barco");
        celda.textContent = "🚢";
      }
    });
  });

  // Pintar ataques del jugador
  window.tablero.casillas.flat().forEach(c => {
    if (c.atacada) {
      const celda = document.querySelector(
        `#tablero-jugador .casilla[data-x='${c.x}'][data-y='${c.y}']`
      );
      if (celda) {
        celda.classList.add("atacada");
        celda.classList.add(c.barco ? (c.barco.estaHundido() ? "hundido" : "tocado") : "agua");
        celda.style.pointerEvents = "none";
      }
    }
  });

  // Pintar ataques sobre IA
  window.tableroIA.casillas.flat().forEach(c => {
    if (c.atacada) {
      const celda = document.querySelector(
        `#tablero-ia .casilla[data-x='${c.x}'][data-y='${c.y}']`
      );
      if (celda) {
        celda.classList.add("atacada");
        celda.classList.add(c.barco ? (c.barco.estaHundido() ? "hundido" : "tocado") : "agua");
        celda.style.pointerEvents = "none";
      }
    }
  });

  document.getElementById("jugar").disabled = false;
  document.getElementById("form-disparo").style.display = "block";
  window.juegoActivo = true;
}


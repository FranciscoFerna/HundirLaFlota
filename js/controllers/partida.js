import { tablero, tableroIA } from "./estado.js";

const API_URL = "http://127.0.0.1:5500/index.html";

export async function guardarPartida(nombreJugador = "Jugador") {
  const partida = {
    id: crypto.randomUUID(),
    jugador: nombreJugador,
    tableroJugador: tablero.toJSON(),
    tableroIA: tableroIA.toJSON()
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partida)
    });

    if (res.ok) {
      alert("Partida guardada");
    } else {
      alert("Error al guardar");
    }
  } catch (err) {
    console.error("Error al guardar la partida:", err);
  }
}

export async function cargarPartida() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("No se pudo cargar");

    const partidas = await res.json();
    const partida = partidas[0]; // puedes mejorar esto luego para elegir

    const Tablero = (await import("../model/Tablero.js")).Tablero;
    const Casilla = (await import("../model/Casilla.js")).Casilla;

    const t1 = Tablero.fromJSON(partida.tableroJugador);
    const t2 = Tablero.fromJSON(partida.tableroIA);

    Object.assign(window.tablero, t1);
    Object.assign(window.tableroIA, t2);

    alert("✅ Partida cargada (aún falta pintar en pantalla)");

    // Aquí tendrás que repintar los tableros y bloquear casillas
  } catch (err) {
    console.error("Error al cargar partida:", err);
  }
}

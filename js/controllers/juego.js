import { tablero, tableroIA } from "./estado.js";

export function disparoJugador(x, y, tableroObjetivo) {
  const casilla = tableroObjetivo.casillas[x][y];
  if (casilla.atacada) return "repetida";

  const resultado = casilla.recibirAtaque();
  casilla.atacada = true;
  return resultado;
}

export function asignarEventosAtaqueIA() {
  document.querySelectorAll("#tablero-ia .casilla").forEach((celda) => {
    celda.addEventListener("click", () => {
      if (!window.juegoActivo) return;
      const x = parseInt(celda.dataset.x);
      const y = parseInt(celda.dataset.y);

      const resultado = disparoJugador(x, y, tableroIA);

      if (resultado === "repetida") return;

      celda.classList.add("atacada", resultado);
      celda.style.pointerEvents = "none";

      if (resultado === "agua") {
        const ia = turnoIA(); // sin argumento
        const celdaIA = document.querySelector(
          `#tablero-jugador .casilla[data-x='${ia.x}'][data-y='${ia.y}']`
        );
        celdaIA.classList.add("atacada", ia.resultado);
        celdaIA.style.pointerEvents = "none";
      }

      if (tableroIA.barcos.every((b) => b.estaHundido())) {
        document.getElementById("form-disparo").style.display = "none";
        document.getElementById("jugar").disabled = true;
      }
    });
  });
}

export function procesarResultadoDisparo(x, y, resultado) {
  const celda = document.querySelector(
    `#tablero-ia .casilla[data-x='${x}'][data-y='${y}']`
  );
  celda.classList.add("atacada");
  celda.style.pointerEvents = "none";

  if (resultado === "agua") {
    celda.classList.add("agua");
    const ia = turnoIA(); // sin argumento
    const celdaIA = document.querySelector(
      `#tablero-jugador .casilla[data-x='${ia.x}'][data-y='${ia.y}']`
    );
    celdaIA.classList.add("atacada");
    celdaIA.style.pointerEvents = "none";

    if (ia.resultado === "agua") celdaIA.classList.add("agua");
    else if (ia.resultado === "tocado") celdaIA.classList.add("tocado");
    else if (ia.resultado === "hundido") celdaIA.classList.add("hundido");

    if (tablero.barcos.every((barco) => barco.estaHundido())) {
      console.log("Has perdido");
      window.juegoActivo = false;
    }
  } else {
    celda.classList.add(resultado === "hundido" ? "hundido" : "tocado");

    if (tableroIA.barcos.every((barco) => barco.estaHundido())) {
      console.log("Has ganado");
      window.juegoActivo = false;
    }
  }
}

export function turnoIA() {
  let x, y, casilla;
  do {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    casilla = tablero.casillas[x][y];
  } while (casilla.atacada);

  const resultado = casilla.recibirAtaque();
  casilla.atacada = true;
  return { x, y, resultado };
}

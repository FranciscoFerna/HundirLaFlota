export function crearTableroHTML(id, filas, columnas) {
  const contenedor = document.getElementById(id);
  contenedor.innerHTML = "";

  for (let x = 0; x < filas; x++) {
    for (let y = 0; y < columnas; y++) {
      const celda = document.createElement("div");
      celda.className = "casilla";
      celda.dataset.x = x;
      celda.dataset.y = y;
      celda.style.pointerEvents = "auto";

      celda.addEventListener("click", () => {
        // Solo si el juego ha comenzado y es el tablero enemigo
        if (!window.juegoActivo || id !== "tablero-ia") return;

        const resultado = window.disparoJugador(x, y, window.tableroIA);
        if (resultado !== "repetida") {
          window.procesarResultadoDisparo(x, y, resultado);
        }
      });

      contenedor.appendChild(celda);
    }
  }
}

export function mostrarMensajeError(texto) {
  const mensaje = document.getElementById("mensaje-error");
  mensaje.textContent = texto;
  setTimeout(() => (mensaje.textContent = ""), 2000);
}

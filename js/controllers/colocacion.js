import { Barco } from "../model/Barco.js";
import { tablero } from "./estado.js";
import { mostrarMensajeError } from "../utils/dom.js";

export function manejarEventosColocacion() {
  asignarEventosCasillas();

  window.orientacion = "H";
  window.barcoSeleccionado = null;
  window.barcosColocados = 0;

  window.addEventListener("keydown", (e) => {
    if (["h", "v"].includes(e.key)) {
      window.orientacion = e.key.toUpperCase();
    }
  });
}

function asignarEventosCasillas() {
  document.querySelectorAll("#tablero-jugador .casilla").forEach((celda) => {
    celda.addEventListener("click", () => {
      if (!window.barcoSeleccionado)
        return console.log("Selecciona un barco primero");
      colocarBarco(celda);
    });

    celda.addEventListener("mouseenter", () => {
      if (!window.barcoSeleccionado) return;
      pintarPreview(celda);
    });

    celda.addEventListener("mouseleave", () => {
      document.querySelectorAll(".casilla.preview").forEach((c) => {
        c.classList.remove("preview");
      });
    });

    // Drag & Drop
    celda.addEventListener("dragover", (e) => e.preventDefault());
    celda.addEventListener("drop", (e) => {
      e.preventDefault();

      const nombre = e.dataTransfer.getData("nombre");
      const tamaño = parseInt(e.dataTransfer.getData("tamaño"));
      if (!nombre || isNaN(tamaño)) return;

      const boton = Array.from(
        document.querySelectorAll("#barcos-disponibles button")
      ).find((b) => b.textContent.includes(nombre) && !b.disabled);

      if (!boton) return;

      window.barcoSeleccionado = { nombre, tamaño, boton };
      colocarBarco(celda);
    });
  });
}

function colocarBarco(celda) {
  const { nombre, tamaño, boton } = window.barcoSeleccionado;
  const x = +celda.dataset.x;
  const y = +celda.dataset.y;
  const barco = new Barco(nombre, tamaño);
  const orientacion = window.orientacion || "H";
  const colocado = tablero.colocarBarco(barco, x, y, orientacion);

  if (colocado) {
    barco.posiciones.forEach((c) => {
      const casilla = document.querySelector(
        `.casilla[data-x='${c.x}'][data-y='${c.y}']`
      );
      casilla.classList.add("barco");
      casilla.textContent = "🚢";
    });
    if (boton) boton.disabled = true;
    window.barcoSeleccionado = null;
    window.barcosColocados++;

    if (window.barcosColocados === window.totalBarcos) {
      document.getElementById("jugar").disabled = false;
    }
  } else {
    mostrarMensajeError("No se puede colocar el barco ahi");
  }
}

function pintarPreview(celda) {
  const x = parseInt(celda.dataset.x);
  const y = parseInt(celda.dataset.y);
  const size = parseInt(window.barcoSeleccionado.tamaño);
  const orientacion = window.orientacion || "H";

  let casillas = [];

  for (let i = 0; i < size; i++) {
    const dx = orientacion === "H" ? x : x + i;
    const dy = orientacion === "H" ? y + i : y;
    if (dx >= 10 || dy >= 10) return;

    const casilla = document.querySelector(`.casilla[data-x='${dx}'][data-y='${dy}']`);
    if (!casilla) return;
    casillas.push(casilla);
  }

  casillas.forEach((c) => c.classList.add("preview"));
}

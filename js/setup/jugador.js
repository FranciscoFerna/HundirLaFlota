export function mostrarBarcos(barcos) {
  const contenedor = document.getElementById("barcos-disponibles");
  contenedor.innerHTML = "";

  barcos.forEach((datos) => {
    const btn = document.createElement("button");
    btn.textContent = `${datos.nombre} (${datos.tamaño})`;
    btn.draggable = true;
    btn.dataset.nombre = datos.nombre;
    btn.dataset.tamaño = datos.tamaño;

    btn.addEventListener("click", () => {
      window.barcoSeleccionado = { ...datos, boton: btn };
    });

    btn.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("nombre", datos.nombre);
      e.dataTransfer.setData("tamaño", datos.tamaño);
    });

    contenedor.appendChild(btn);
  });

  document.getElementById("jugar").addEventListener("click", () => {
    import("../controllers/iniciar.js").then((mod) => mod.iniciarJuego());
  });
}

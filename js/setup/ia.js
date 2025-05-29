import { Barco } from "../model/Barco.js";
import { tableroIA } from "../controllers/estado.js";

export function colocarBarcosIA(barcos) {
  barcos.forEach((datos) => {
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

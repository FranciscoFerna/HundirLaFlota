import { Barco } from "./model/Barco.js";
import { Tablero } from "./model/Tablero.js";

const tablero = new Tablero(10, 10); // 10x10

fetch("../data/barcos.json")
    .then(res => res.json())
    .then(barcosData => {
        barcosData.forEach(datos => {
            const barco = new Barco(datos.nombre, datos.tamaño);

            let colocado = false;
            let intentos = 0;

            while (!colocado && intentos < 100) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const orientacion = Math.random() < 0.5 ? "H" : "V";

                colocado = tablero.colocarBarco(barco, x, y, orientacion);
                intentos++;
            }

            if (!colocado) {
                console.warn(`No se pudo colocar el barco: ${barco.nombre}`);
            }
        });

        console.log("Barcos colocados correctamente");
        console.log(tablero);
    });
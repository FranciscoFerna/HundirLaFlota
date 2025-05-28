import { Casilla } from "./Casilla.js";

export class Tablero {
    constructor(filas, columnas) {
        this.filas = filas;
        this.columnas = columnas;
        this.casillas = this._crearCasillas();
        this.barcos = [];
    }

    _crearCasillas() {
        const casillas = [];
        for (let x = 0; x < this.filas; x++) {
            casillas[x] = [];
            for (let y = 0; y < this.columnas; y++) {
                casillas[x][y] = new Casilla(x, y);
            }
        }
        return casillas;
    }

    colocarBarco(barco, x, y, orientacion) {
        if (!this._esValido(barco, x, y, orientacion)) return false;

        for (let i = 0; i < barco.tamaño; i++) {
            let casilla;
            if (orientacion === "H") casilla = this.casillas[x][y + i];
            else casilla = this.casillas[x + i][y];

            casilla.ponerBarco(barco);
            barco.posiciones.push(casilla);
        }

        this.barcos.push(barco);
        return true;
    }

    _esValido(barco, x, y, orientacion) {
        for (let i = 0; i < barco.tamaño; i++) {
            let fila = orientacion === "H" ? x : x + i;
            let col = orientacion === "H" ? y + i : y;

            if (fila >= this.filas || col >= this.columnas) return false;
            if (this.casillas[fila][col].barco) return false;
        }
        return true;
    }
}
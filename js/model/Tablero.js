import { Casilla } from "./Casilla.js";
import { Barco } from "./Barco.js";

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
      const casilla =
        orientacion === "H" ? this.casillas[x][y + i] : this.casillas[x + i][y];
      casilla.ponerBarco(barco);
      barco.posiciones.push(casilla);
    }

    this.barcos.push(barco);
    return true;
  }

  _esValido(barco, x, y, orientacion) {
    for (let i = 0; i < barco.tamaño; i++) {
      const fila = orientacion === "H" ? x : x + i;
      const col = orientacion === "H" ? y + i : y;
      if (fila >= this.filas || col >= this.columnas) return false;
      if (this.casillas[fila][col].barco) return false;
    }
    return true;
  }

  toJSON() {
    return {
      filas: this.filas,
      columnas: this.columnas,
      casillas: this.casillas.map((fila) => fila.map((c) => c.toJSON())),
      barcos: this.barcos.map((b) => ({
        nombre: b.nombre,
        tamaño: b.tamaño,
        posiciones: b.posiciones.map((c) => ({ x: c.x, y: c.y })),
      })),
    };
  }

  static fromJSON(json) {
    const nuevo = new Tablero(json.filas, json.columnas);

    nuevo.casillas = json.casillas.map((fila) =>
      fila.map((c) => Casilla.fromJSON(c))
    );

    nuevo.barcos = json.barcos.map((b) => {
      const barco = new Barco(b.nombre, b.tamaño);
      barco.posiciones = b.posiciones.map((pos) => {
        const casilla = nuevo.casillas[pos.x][pos.y];
        casilla.ponerBarco(barco);
        return casilla;
      });
      return barco;
    });

    return nuevo;
  }
}

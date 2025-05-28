export class Barco {
    constructor(nombre, tamaño) {
        this.nombre = nombre;
        this.tamaño = tamaño;
        this.posiciones = [];
        this.tocado = 0
    }

    registrarImpacto() {
        this.tocado++;
    }

    estaHundido() {
        return this.tocado >= this.tamaño;
    }
}
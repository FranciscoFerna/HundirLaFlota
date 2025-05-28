export class Casilla {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.barco = null;
        this.atacada = false;
    }

    ponerBarco(barco) {
        this.barco = barco;
    }

    recibirAtaque() {
        this.atacada = true;
        if (this.barco) {
            this.barco.registrarImpacto();
            return this.barco.estaHundido() ? "Hundido" : "Tocado";
        }
        return "Agua";
    }
}
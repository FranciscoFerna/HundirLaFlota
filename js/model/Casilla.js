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
      return this.barco.estaHundido() ? "hundido" : "tocado";
    }
    return "agua";
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      atacada: this.atacada,
      tieneBarco: this.barco !== null,
    };
  }

  static fromJSON(obj) {
    const c = new Casilla(obj.x, obj.y);
    c.atacada = obj.atacada;
    return c;
  }
}

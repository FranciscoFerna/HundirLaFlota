export class Barco {
  constructor(nombre, tamaño) {
    this.nombre = nombre;
    this.tamaño = tamaño;
    this.posiciones = [];
    this.impactos = 0;
  }

  registrarImpacto() {
    this.impactos++;
  }

  estaHundido() {
    return this.impactos >= this.tamaño;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      tamaño: this.tamaño,
      impactos: this.impactos,
      posiciones: this.posiciones.map(c => ({ x: c.x, y: c.y }))
    };
  }

  static fromJSON(obj) {
    const barco = new Barco(obj.nombre, obj.tamaño);
    barco.impactos = obj.impactos || 0;
    barco.posiciones = obj.posiciones || [];
    return barco;
  }
}

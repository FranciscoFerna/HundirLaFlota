export function disparoJugador(x, y, tablero) {
    const casilla = tablero.casillas[x][y];
    if (casilla.atacada) return "repetida";

    const resultado = casilla.recibirAtaque();
    casilla.atacada = true;

    return resultado;
}
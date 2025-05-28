export function turnoIA(tableroJugador) {
    let x, y, casilla;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        casilla = tableroJugador.casillas[x][y];
    } while (casilla.atacada);

    const resultado = casilla.recibirAtaque();
    casilla.atacada = true;

    return { x, y, resultado };
}
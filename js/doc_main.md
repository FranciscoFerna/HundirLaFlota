## 1. Imports y variables iniciales

```js
import { Barco } from "./model/Barco.js";
import { Tablero } from "./model/Tablero.js";

const tablero = new Tablero(10, 10);
let barcoSeleccionado = null;
let orientacion = "H";
let barcosColocados = 0;
let totalBarcos = 0;
```

* Se importan las clases Barco y Tablero.
* Se crea el tablero de juego.
* Variables para guardar el estado actual del juego (orientación, barco seleccionado, contadores).

---

## 2. Crear tablero y asignar eventos

```js
crearTableroHTML("tablero-jugador", 10, 10);
asignarEventosCasillas();
```

* Se genera el HTML del tablero en pantalla (10x10).
* Se asignan eventos a cada casilla para que reaccionen a los clics.

---

## 3. Cargar barcos desde JSON

```js
fetch("../data/barcos.json")
  .then(res => res.json())
  .then(barcosData => {
    totalBarcos = barcosData.length;
    mostrarBarcosDisponibles(barcosData);
  });
```

* Se cargan los datos de los barcos desde un archivo JSON.
* Se guarda cuántos barcos hay en total.
* Se muestran los botones para elegir los barcos.

---

## 4. Mostrar botones de los barcos

```js
function mostrarBarcosDisponibles(barcosData) { ... }
```

* Por cada barco se crea un botón.
* Al hacer clic en un botón, se guarda el barco como `barcoSeleccionado`.
* También se guarda referencia al botón para poder desactivarlo luego.

---

## 5. Cambiar orientación con teclado

```js
window.addEventListener("keydown", (e) => { ... });
```

* Si se pulsa "h" o "v" se cambia la orientación a horizontal o vertical.

---

## 6. Generar HTML del tablero

```js
function crearTableroHTML(containerId, filas, columnas) { ... }
```

* Crea el tablero en el HTML como una cuadrícula de divs con coordenadas X e Y.

---

## 7. Asignar eventos de clic a las casillas

```js
function asignarEventosCasillas() { ... }
```

* Al hacer clic en una casilla, se intenta colocar el barco seleccionado.
* Si se coloca bien:

  * Se pinta el barco en gris.
  * Se desactiva el botón del barco.
  * Se suma al contador.
  * Si ya se han colocado todos, se bloquea el tablero.

---

## 8. Desactivar tablero al terminar

```js
function desactivarTablero() { ... }
```

* Quita los eventos de clic de todas las casillas poniendo `pointer-events: none`.

---

## 9. Botón RESET

```js
document.getElementById("reset").addEventListener("click", () => { ... });
```

* Borra el tablero y lo vuelve a crear.
* Vuelve a activar todos los botones de barcos.
* Reinicia las variables internas del juego.

---

## Resultado

Con este archivo:

* Se puede colocar un barco a la vez, manualmente.
* Cada barco solo una vez.
* Se puede elegir orientación.
* El tablero se bloquea al acabar.
* Se puede reiniciar todo con un botón.

El código está ordenado en funciones para que sea fácil de mantener y mejorar.

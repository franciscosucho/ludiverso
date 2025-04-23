const main = document.getElementById("juego_memoria");
const nivel = main.dataset.nivel;

document.addEventListener("DOMContentLoaded",()=>{
    mostrarTiempo.innerHTML = `Tiempo: ${timer_cont}`;
})
let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0
let aciertos = 0
let timer = false;
let timer_cont = 0
if (nivel == 1) {
    timer_cont = 50;
}
if (nivel == 2) {
    timer_cont = 40;
}
if (nivel == 3) {
    timer_cont = 30;
}
if (nivel == 4) {
    timer_cont = 25;
}
let timerInicial = timer_cont;
let tiempoRegresivoId = null;
const mostrarTiempo = document.getElementById("t-restante")
let mostrar_mov = document.getElementById("movimientos")
let aciertos_dom = document.getElementById("aciertos")



let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
numeros = numeros.sort(() => { return Math.random() - 0.5 })
console.log(numeros);


function destapar(id) {

    if (timer == false) {
        iniciarTiempo()
        timer = true;
    }


    tarjetasDestapadas++;
    if (tarjetasDestapadas == 1) {
        tarjeta1 = document.getElementById(id);
        primerResultado = numeros[id];
        tarjeta1.innerHTML = `<img src="./../Resources/Imagenes/juego_memoria/${primerResultado}.png" alt="">`;
        //deshabilitar primer boton quer toca el user.
        tarjeta1.disabled = true;
    }
    else if (tarjetasDestapadas == 2) {
        tarjeta2 = document.getElementById(id)
        segundoResultado = numeros[id];
        tarjeta2.innerHTML = `<img src="./../Resources/Imagenes/juego_memoria/${segundoResultado}.png" alt="">`;
        tarjeta2.disabled = true;

        movimientos++;
        mostrar_mov.innerHTML = `Movimientos: ${movimientos}`;
        if (primerResultado == segundoResultado) {
            tarjetasDestapadas = 0;
            aciertos++;
            aciertos_dom.innerHTML = `Aciertos: ${aciertos}`;

            if (aciertos == 8) {
                clearInterval(tiempoRegresivoId);
                mostrarTiempo = `Tardaste: ${timerInicial - timer_cont} segundos🎊`;
                mostrar_mov.innerHTML = `Movimientos: ${movimientos} 🎊`;
                aciertos_dom.innerHTML = `Aciertos: ${aciertos} 🎊`;
            }
        }
        else {
            setTimeout(() => {
                tarjeta1.innerHTML = ""
                tarjeta2.innerHTML = ""
                tarjeta1.disabled = false;
                tarjeta2.disabled = false;
                tarjetasDestapadas = 0;
            }, 600);
        }
    }

}

function iniciarTiempo() {
    tiempoRegresivoId = setInterval(() => {
        timer_cont--;
        mostrarTiempo.innerHTML = `Tiempo: ${timer_cont}`;
        if (timer_cont == 0) {
            //Detiene el temporizador
            clearInterval(tiempoRegresivoId)
            bloquearTarjetas()
        }
    }, 1000)
}
function bloquearTarjetas() {
    for (let i = 0; i <= 15; i++) {
        let tarjetaBloqueada = document.getElementById(i)
        tarjetaBloqueada.innerHTML = `<img src="./../Resources/Imagenes/juego_memoria/${numeros[i]}.png" alt="">`;

        tarjetaBloqueada.disabled = true;
    }
}
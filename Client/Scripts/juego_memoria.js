
const scriptEl = document.getElementById('data-resources');

let ID_area_JS = document.getElementById('id-area');
ID_area_JS = JSON.parse(ID_area_JS.textContent);

let ID_nivel_JS = document.getElementById('id-nivel');
ID_nivel_JS = JSON.parse(ID_nivel_JS.textContent);


let ID_juego_JS = document.getElementById('id-juego');
ID_juego_JS = JSON.parse(ID_juego_JS.textContent);



const cont_introduccion = document.getElementById("cont_introduccion");
const cont_primer_des = document.getElementById("cont_primer_des");
const section1 = document.querySelector(".section1");
const cont_preguntas = document.getElementById("cont_preguntas");
const intentos_dom = document.getElementById("intentos");
var point_sound = new Audio('./../Resources/Sounds/point.mp3');
var error_sound = new Audio('./../Resources/Sounds/error.mp3');
var intentos_intro = 0;
var errores_intro = 0;
var tiempo_intro = 0; 

let resources = [];




if (scriptEl) {
    const raw = scriptEl.textContent.trim();
    if (raw) {
        try {
            resources = JSON.parse(raw);
        } catch (err) {
            console.error('Error al parsear JSON:', err, raw);
        }
    } else {
        console.warn('El contenido de <script> está vacío');
    }
} else {
    console.warn('No se encontró el elemento con id="data-resources"');
}



document.getElementById("btn_iniciar_juego").addEventListener("click", () => {

    var intervalo = setInterval(() => {
        tiempo_intro++;
        document.getElementById("tiempo").textContent = `${tiempo_intro} Segundos`;
    }, 1000);


    cont_introduccion.classList.toggle("desac");
    cont_primer_des.classList.toggle("desac");

    for (let i = 0; i < resources.length; i++) {
        let div_main_ask = document.createElement("div")
        div_main_ask.classList.add("div_main_ask")
        div_main_ask.id = `div_main_ask_${i}`
        if (i != 0) {
            div_main_ask.classList.add("desac")
        }
        cont_preguntas.appendChild(div_main_ask).innerHTML += `<img src="./../Resources/Imagenes/juego_memoria/${resources[i].url_img}" alt="" data-nombre="${resources[i].titulo_img}" id="img_id_${i}">`;

        let div_nombres = document.createElement("div");
        div_nombres.classList.add("div_nombres");

        // Agregar nombres al array y mezclarlos
        let nombre_aletorios = [];
        nombre_aletorios.push(resources[i].titulo_img);

        for (let j = 0; j < 3; j++) {
            let nombre_ale = numeroAleatorio();

            while (nombre_aletorios.includes(resources[nombre_ale].titulo_img)) {
                nombre_ale = numeroAleatorio();
            }

            nombre_aletorios.push(resources[nombre_ale].titulo_img);
        }

        // Mezclar los nombres
        nombre_aletorios = nombre_aletorios.sort(() => 0.5 - Math.random());

        // Crear los botones de nombres mezclados
        for (let k = 0; k < nombre_aletorios.length; k++) {
            div_nombres.innerHTML += `<span class="nombre_img" data-id="${i}">${nombre_aletorios[k]}</span>`;
        }

        div_main_ask.appendChild(div_nombres);
        cont_preguntas.appendChild(div_main_ask);

        let contador_preg = document.createElement('div')
        contador_preg.classList.add("contador_preg")

        for (let l = 0; l < resources.length; l++) {
            let nivel = document.createElement('span')
            nivel.classList.add("nivel_span")
            if (l == 0) {
                nivel.classList.add("active")
            }
            contador_preg.appendChild(nivel);
        }
        div_main_ask.appendChild(contador_preg);
    }


    let bloqueado = false; // bandera de bloqueo

    document.addEventListener("click", (e) => {
        if (bloqueado) return; // si está bloqueado, ignorar clics

        if (e.target.classList.contains("nombre_img")) {
            bloqueado = true; // bloquear al hacer clic

            let texto = e.target.textContent;
            let id = e.target.dataset.id;
            let id_prox = parseInt(id) + 1;
            let text_img = document.getElementById(`img_id_${id}`).dataset.nombre;
            intentos_intro = intentos_intro + 1;

            if (intentos_intro == 11) {
                clearInterval(intervalo);
                setTimeout(() => {
                    let fondo_oscuro = document.getElementById("fondo_oscuro");
                    let cont_perder = document.getElementById("cont_perder_intentos")
                    fondo_oscuro.classList.remove("desac")
                    cont_perder.classList.remove("desac")
                }, 2000);

            } else {

                intentos_dom.textContent = `${intentos_intro} Intentos`;
                if (texto == text_img) {
                    e.target.classList.add("acierto");
                    point_sound.play();

                    setTimeout(() => {
                        point_sound.pause();
                        point_sound.currentTime = 0;
                    }, 1000);

                    setTimeout(() => {
                        e.target.classList.remove("acierto");
                        bloqueado = false; // desbloquear después del timeout
                        if (id_prox == 8) {
                            cont_primer_des.classList.add("desac")
                            section1.classList.remove("desac")
                            clearInterval(intervalo);
                        }
                        else {
                            document.getElementById(`div_main_ask_${id}`).classList.add("desac")
                            document.getElementById(`div_main_ask_${id_prox}`).classList.remove("desac")
                        }

                    }, 700);
                } else {
                    e.target.classList.add("error");
                    error_sound.play();
                    setTimeout(() => {
                        error_sound.pause();
                        error_sound.currentTime = 0;
                    }, 1000);

                    setTimeout(() => {
                        e.target.classList.remove("error");
                        bloqueado = false; // desbloquear después del timeout
                    }, 700);
                }
            }

        }
    });

});



//--------------------------------------------------------------------------


let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0
let aciertos = 0
let timer = false;
let timer_cont = 50

let timerInicial = timer_cont;
let tiempoRegresivoId = null;
const mostrarTiempo = document.getElementById("t-restante")
let mostrar_mov = document.getElementById("movimientos")
let aciertos_dom = document.getElementById("aciertos")


document.addEventListener("DOMContentLoaded", () => {
    mostrarTiempo.innerHTML = `Tiempo: ${timer_cont}`;
})


let numeros = []
for (let i = 0; i < resources.length; i++) {
    numeros.push(resources[i].url_img)
    numeros.push(resources[i].url_img)

}

// let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
numeros = numeros.sort(() => { return Math.random() - 0.5 })


function destapar(id) {

    if (timer == false) {
        iniciarTiempo()
        timer = true;
    }


    tarjetasDestapadas++;
    if (tarjetasDestapadas == 1) {
        tarjeta1 = document.getElementById(id);
        primerResultado = numeros[id];
        tarjeta1.innerHTML = `<img src="./../Resources/Imagenes/juego_memoria/${primerResultado}" alt="">`;
        //deshabilitar primer boton quer toca el user.
        tarjeta1.disabled = true;
    }
    else if (tarjetasDestapadas == 2) {
        tarjeta2 = document.getElementById(id)
        segundoResultado = numeros[id];
        tarjeta2.innerHTML = `<img src="./../Resources/Imagenes/juego_memoria/${segundoResultado}" alt="">`;
        tarjeta2.disabled = true;

        movimientos++;
        mostrar_mov.innerHTML = `Movimientos: ${movimientos}`;
        if (primerResultado == segundoResultado) {

            point_sound.play();

            tarjetasDestapadas = 0;
            aciertos++;
            aciertos_dom.innerHTML = `Aciertos: ${aciertos}`;

            if (aciertos == 8) {
                clearInterval(tiempoRegresivoId);
                setTimeout(() => {

                    window.location.href = `puntaje_us?intentos_res=${movimientos}&aciertos_res=${aciertos}&tiempo_res=${timerInicial - timer_cont}&intentos_intro=${intentos_intro}&tiempo_intro=${tiempo_intro}&id_nivel=${ID_nivel_JS}&id_area=${ID_area_JS}&id_juego=${ID_juego_JS} `;
                }, 5000);
            }
        }
        else {

            error_sound.play();
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
            clearInterval(tiempoRegresivoId);
            bloquearTarjetas();
            setTimeout(() => {
                let fondo_oscuro = document.getElementById("fondo_oscuro");
                let cont_perder = document.getElementById("cont_perder")
                fondo_oscuro.classList.remove("desac")
                cont_perder.classList.remove("desac")
            }, 2000);
        }
    }, 1000)
}
function bloquearTarjetas() {
    for (let i = 0; i <= 15; i++) {
        let tarjetaBloqueada = document.getElementById(i)
        tarjetaBloqueada.innerHTML = `<img src="./../Resources/Imagenes/juego_memoria/${numeros[i]}" alt="">`;

        tarjetaBloqueada.disabled = true;
    }
}

function numeroAleatorio() {
    return Math.floor(Math.random() * 8); // genera un número entre 0 y 7
}

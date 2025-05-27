// si se van a agregar mas opciones se deben poner en orden como esta aca, no pueden estar desornadas, ya que eso rompe el codigo. osea el boton debe tener el mismo indice que su contenedor.
var array_ver = ["ver_lista", "ver_agre", "ver_editar", "ver_eliminar"]
var array_dom = ["admin-novedades", "form_agregar_nov", "form_editar_nov", "form_eliminar_nov"]
var indice_contador = 0
var indice_max = -1
const circulos = document.querySelectorAll(".circulos");
const cont_novedades_main = document.querySelectorAll(".cont_novedades_main")
const arrow_right = document.getElementById("arrow-right");
const arrow_left = document.getElementById("arrow-left");

agregar_class(array_ver, array_dom)

document.addEventListener("DOMContentLoaded", () => {

    circulos.forEach(circulo => {
        if (circulo.id === `circulo_${indice_contador}`) {
            circulo.classList.add("actual")

        }

    });
    cont_novedades_main.forEach(cont => {
        
        indice_max +=1;
        if (cont.id === `cont_novedades${indice_contador}`) {
            cont.classList.remove("desac_nov")

        }
      
    });


});


document.querySelectorAll('.btn-borrar').forEach(btn => {
    btn.addEventListener('click', e => {
        const novedadId = btn.dataset.novId;
        const form = document.getElementById(`form_borrar_novedad_${novedadId}`);
        const input = document.getElementById(`input_borrar_nov_${novedadId}`);

        // opcional: verificar antes de enviar
        if (confirm("¿Estás seguro que querés eliminar esta novedad?")) {
            form.submit();
        }
    });
});

document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', e => {
        const novedadId = btn.dataset.novId;
        const form = document.getElementById(`form_editar_novedad_${novedadId}`);
        const input = document.getElementById(`input_editar${novedadId}`);

        // opcional: verificar antes de enviar
        if (confirm("¿Estás seguro que querés editar esta novedad?")) {
            form.submit();
        }
    });
});



function agregar_class(array_ver, array_dom) {
    for (let i = 0; i < array_ver.length; i++) {
        document.getElementById(array_ver[i]).addEventListener("click", () => {
            for (let j = 0; j < array_ver.length; j++) {
                if (array_ver[j] == array_ver[i]) {
              
                    document.getElementById(array_dom[j]).classList.remove("desac")
                } else {
                    document.getElementById(array_dom[j]).classList.add("desac")
                }
            }


        })
    }
}


arrow_left.addEventListener("click", () => {
    if (indice_contador == 0) {
        alert("Llegaste al inicio")
    } else {

        document.getElementById(`circulo_${indice_contador}`).classList.toggle('actual')
        document.getElementById(`cont_novedades${indice_contador}`).classList.toggle('desac_nov')
        indice_contador = indice_contador - 1;

        document.getElementById(`circulo_${indice_contador}`).classList.toggle('actual')
        document.getElementById(`cont_novedades${indice_contador}`).classList.toggle('desac_nov')

    }
})
arrow_right.addEventListener("click", () => {

    if (indice_contador == indice_max) {
        alert("Llegaste al final")
    } else {
      
        document.getElementById(`circulo_${indice_contador}`).classList.toggle('actual')
        document.getElementById(`cont_novedades${indice_contador}`).classList.toggle('desac_nov')
        indice_contador = indice_contador + 1;
     
        document.getElementById(`circulo_${indice_contador}`).classList.toggle('actual')
        document.getElementById(`cont_novedades${indice_contador}`).classList.toggle('desac_nov')

    }
})


document.getElementById("pre_visualizar").addEventListener("click", (e) => {
    e.preventDefault();
    const inputFile = document.getElementById("url_nov");
    const titulo = document.getElementById("titulo_nov").value.trim();
    const subtitulo = document.getElementById("subtitulo_nov").value.trim();
    const cuerpo = document.getElementById("cuerpo_nov").value.trim();

    // titulo = "Torneo de actividades Ludicas"
    // subtitulo = "Se realizara un torneo sobre actividades ludicas en la Escuela de Educación Secundaria Técnica Nro 1 Eduardo Ader"
    // cuerpo = `El  dia lunes 20 del mes de octubre los estudiantes de la institucion Técnica Nro 1 "Eduardo Ader, podran competir entre ellos el los distintos juegos en los que se cuenta en la aplicacion. El evento se hara en la franja horaria de 10hs hasta las 11.55hs, para poder participar se deberan inscribir con anterioridad`
    
    // Validación mínima
    if (!inputFile.files[0]) {
        alert("Seleccioná una imagen para previsualizar.");
        return;
    }

    const file = inputFile.files[0];
    const imgUrl = URL.createObjectURL(file);

    const fecha = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    });

    const previewHTML = `
      <div class="cont_novedades">
        <div class="cont_text_novedad">
          <b class="fecha_novedad">${fecha}</b>
          <h3 class="titulo_novedad">${titulo}</h3>
          <h4 class="sub_titulo_novedades">${subtitulo}</h4>
          <p class="cuepo_novedad">${cuerpo}</p>
        </div>
        <img src="${imgUrl}" alt="Imagen sobre novedades." class="img_novedad">
      </div>
    `;

    const contenedor = document.getElementById("preview_container");
    contenedor.innerHTML = previewHTML;
});
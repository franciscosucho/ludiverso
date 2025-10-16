let scrolledPast = false;
const header = document.querySelector("header")
const icons_links = document.querySelectorAll(".icons_links")
const text_links = document.querySelectorAll(".text_links")
function handleScroll() {
    if (window.scrollY > 200 && !scrolledPast) {
        header.classList.toggle("reducir")
        scrolledPast = true;
        icons_links.forEach(icon => {
            icon.classList.toggle("desac")
        });
        text_links.forEach(text => {
            text.classList.toggle("desac")
        });
    } else if (window.scrollY <= 100 && scrolledPast) {
        header.classList.toggle("reducir")
        scrolledPast = false;
        icons_links.forEach(icon => {
            icon.classList.toggle("desac")
        });
        text_links.forEach(text => {
            text.classList.toggle("desac")
        });
    }
}

window.addEventListener('scroll', handleScroll);
//------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.links');
    
    // Detectar si estamos en el index o en otra página
    const isIndexPage = window.location.pathname === '/index' || window.location.pathname === '/';

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Solo interceptar enlaces que comienzan con #
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                
                if (isIndexPage) {
                    // Si estamos en el index, hacer scroll a la sección
                    const target = document.getElementById(targetId);
                    if (target) {
                        scrollToElement(target, 200);
                    }
                } else {
                    // Si estamos en otra página, redirigir al index con el anchor
                    window.location.href = '/index' + href;
                }
            }
            // Los enlaces sin # (como /profile) se comportarán normalmente
        });
    });

    function scrollToElement(element, duration) {
        const targetPosition = element.getBoundingClientRect().top + window.scrollY;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
});



function setModo(modo) {
    document.documentElement.setAttribute("data-tema", modo);
    document.cookie = "modo=" + modo + "; path=/; max-age=31536000";

    const icono = document.getElementById("icon_tema_tema");
    if (icono) {
        if (modo === "oscuro") {
            icono.classList.remove("fa-sun");
            icono.classList.add("fa-moon");
        } else {
            icono.classList.remove("fa-moon");
            icono.classList.add("fa-sun");
        }
    }
}

function leerModoDeCookie() {
    const cookies = document.cookie.split("; ");
    const modo = cookies.find(row => row.startsWith("modo="));
    return modo ? modo.split("=")[1] : null;
}

// Asegurar que el elemento exista antes de registrar el listener (el script carga en <head>)
const iconTemaEarly = document.getElementById("icon_tema");
if (iconTemaEarly) {
    iconTemaEarly.addEventListener("click", () => {
        const actual = document.documentElement.getAttribute("data-tema") || "claro";
        const nuevo = actual === "oscuro" ? "claro" : "oscuro";
        setModo(nuevo);
    });
}

function setDaltonismo(tipo) {
    if (tipo === 'no_daltonico' || tipo === '') {
        document.documentElement.removeAttribute("data-daltonismo");
    } else {
        document.documentElement.setAttribute("data-daltonismo", tipo);
    }
    document.cookie = "daltonismo=" + tipo + "; path=/; max-age=31536000";
}

function leerDaltonismoDeCookie() {
    const cookies = document.cookie.split("; ");
    const daltonismo = cookies.find(row => row.startsWith("daltonismo="));
    return daltonismo ? daltonismo.split("=")[1] : null;
}

// Función para aplicar daltonismo inmediatamente
function aplicarDaltonismo() {
    const daltonismoGuardado = leerDaltonismoDeCookie();
    if (daltonismoGuardado) {
        setDaltonismo(daltonismoGuardado);
    } else {
        setDaltonismo("no_daltonico");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const modoGuardado = leerModoDeCookie() || "claro";
    setModo(modoGuardado);

    // Aplicar daltonismo inmediatamente
    aplicarDaltonismo();

    // Registrar listener del toggle de tema cuando el DOM está listo
    const iconTema = document.getElementById("icon_tema");
    if (iconTema) {
        iconTema.addEventListener("click", () => {
            const actual = document.documentElement.getAttribute("data-tema") || "claro";
            const nuevo = actual === "oscuro" ? "claro" : "oscuro";
            setModo(nuevo);
        });
    }

    const daltonismoSelect = document.getElementById('tipo_daltonismo');
    const daltonismoGuardado = leerDaltonismoDeCookie();

    if (daltonismoSelect) {
        daltonismoSelect.value = daltonismoGuardado || "no_daltonico";

        // En el perfil NO aplicar inmediatamente; solo en otras páginas
        const isProfile = window.location && window.location.pathname && window.location.pathname.startsWith('/profile');
        if (!isProfile) {
            daltonismoSelect.addEventListener('change', () => {
                setDaltonismo(daltonismoSelect.value);
            });
        }
    }
});

// Aplicar daltonismo también cuando se carga la página (por si acaso)
window.addEventListener("load", aplicarDaltonismo);
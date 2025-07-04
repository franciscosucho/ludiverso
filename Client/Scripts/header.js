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

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Solo interceptar enlaces que comienzan con #
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    scrollToElement(target, 200);
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

document.getElementById("icon_tema").addEventListener("click", () => {
    const actual = document.documentElement.getAttribute("data-tema") || "claro";
    const nuevo = actual === "oscuro" ? "claro" : "oscuro";
    console.log(actual);
    console.log(nuevo);
    setModo(nuevo);
});

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

window.addEventListener("DOMContentLoaded", () => {
    const modoGuardado = leerModoDeCookie() || "claro";
    setModo(modoGuardado);

    const daltonismoSelect = document.getElementById('tipo_daltonismo');
    const daltonismoGuardado = leerDaltonismoDeCookie();

    if (daltonismoGuardado) {
        setDaltonismo(daltonismoGuardado);
        if (daltonismoSelect) {
            daltonismoSelect.value = daltonismoGuardado;
        }
    } else {
        if (daltonismoSelect) {
            daltonismoSelect.value = "no_daltonico";
        }
        setDaltonismo("no_daltonico");
    }

    if (daltonismoSelect) {
        daltonismoSelect.addEventListener('change', () => {
            setDaltonismo(daltonismoSelect.value);
        });
    }
});
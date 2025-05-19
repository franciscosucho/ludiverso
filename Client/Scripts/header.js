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
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1); // saca el #
            const target = document.getElementById(targetId);       // busca el ID

            if (target) {
                scrollToElement(target, 200); 
            }
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
    document.documentElement.setAttribute("data-tema", modo); // aplicar tema
    document.cookie = "modo=" + modo + "; path=/; max-age=31536000"; // dura 1 año
}

function leerModoDeCookie() {
    const cookies = document.cookie.split("; ");
    const modo = cookies.find(row => row.startsWith("modo="));
    return modo ? modo.split("=")[1] : null;
}

// Al cargar la página, aplicamos el modo guardado
window.addEventListener("DOMContentLoaded", () => {
    const modo = leerModoDeCookie();
    if (modo) {
        setModo(modo);
    }
}); 

// Ejemplo: al hacer clic en un botón, cambia el modo
document.getElementById("btn_tema").addEventListener("click", () => {
    const actual = document.documentElement.getAttribute("data-tema") || "claro";
    const nuevo = actual === "oscuro" ? "claro" : "oscuro";
    setModo(nuevo);
});

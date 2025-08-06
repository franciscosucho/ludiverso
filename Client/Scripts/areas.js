// === Tutorial Interactivo para Áreas ===
console.log('Tutorial de áreas: Script cargado');
(function() {
    // Pasos del tutorial específicos para la página de áreas
    const tutorialSteps = [
        {
            selector: '#main-header',
            text: 'Este es el encabezado principal. Aquí puedes navegar entre las diferentes secciones y acceder a tu perfil.'
        },
        {
            selector: '#cont_main_areas h2',
            text: 'Aquí puedes ver el título de la área que estás visitando. Cada área tiene su propio contenido y juegos específicos.'
        },
        {
            selector: '.cont_text img',
            text: 'Esta imagen representa visualmente el área que estás explorando. Cada área tiene su propia imagen distintiva.'
        },
        {
            selector: '.cont_text_sub:first-child',
            text: 'Aquí se muestra información sobre el jefe del área, quien es responsable de coordinar las actividades educativas.'
        },
        {
            selector: '.cont_text_sub:last-child',
            text: 'En esta sección encontrarás la descripción detallada del área, explicando qué aprenderás y qué objetivos tiene.'
        },
        {
            selector: '#tit_juegos',
            text: 'Esta sección muestra todos los juegos disponibles específicamente para esta área educativa.'
        },
        {
            selector: '.cont_juego_desc:first-child',
            text: 'Cada juego se presenta con su imagen, título, valoración y descripción. Haz clic en "Jugar" para comenzar.'
        },
        {
            selector: '.cont_estrellas',
            text: 'La valoración con estrellas te indica qué tan bien calificado está el juego por otros usuarios.'
        },
        {
            selector: '.btn_jugar',
            text: 'Haz clic en este botón para comenzar a jugar. Cada juego te llevará a una experiencia educativa diferente.'
        }
    ];

    // Crea el overlay y los elementos del tutorial
    function createTutorialElements() {
        // Overlay oscuro
        let overlay = document.createElement('div');
        overlay.id = 'tutorial-overlay-areas';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);

        // Cuadro de resaltado
        let highlight = document.createElement('div');
        highlight.id = 'tutorial-highlight-areas';
        highlight.style.position = 'absolute';
        highlight.style.border = '3px solid var(--Encabezados_botones_y_primarios)';
        highlight.style.borderRadius = '12px';
        highlight.style.boxShadow = '0 0 25px 8px rgba(62, 134, 211, 0.6)';
        highlight.style.zIndex = '9999';
        highlight.style.pointerEvents = 'none';
        highlight.style.transition = 'all 0.3s ease';
        highlight.style.backgroundColor = 'var(--back_card)';
        highlight.style.backdropFilter = 'blur(5px)';
        document.body.appendChild(highlight);

        // Caja de texto
        let tooltip = document.createElement('div');
        tooltip.id = 'tutorial-tooltip-areas';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'var(--Fondo_principal)';
        tooltip.style.color = 'var(--Texto_principal)';
        tooltip.style.padding = '20px 24px 52px 24px'; // espacio extra abajo para el botón
        tooltip.style.borderRadius = '12px';
        tooltip.style.boxShadow = '0 8px 32px var(--box_shadow)';
        tooltip.style.zIndex = '10000';
        tooltip.style.maxWidth = '350px';
        tooltip.style.fontSize = '1.1em';
        tooltip.style.display = 'none';
        tooltip.style.boxSizing = 'border-box';
        tooltip.style.backdropFilter = 'blur(15px)';
        tooltip.style.border = '2px solid var(--Encabezados_botones_y_primarios)';
        tooltip.style.transition = 'all 0.3s ease';
        tooltip.style.opacity = '0.95';
        document.body.appendChild(tooltip);

        // Botón siguiente
        let nextBtn = document.createElement('button');
        nextBtn.id = 'tutorial-next-areas';
        nextBtn.textContent = 'Siguiente';
        nextBtn.style.position = 'absolute';
        nextBtn.style.left = '24px';
        nextBtn.style.bottom = '18px';
        nextBtn.style.padding = '10px 20px';
        nextBtn.style.background = 'var(--Encabezados_botones_y_primarios)';
        nextBtn.style.color = '#fff';
        nextBtn.style.border = 'none';
        nextBtn.style.borderRadius = '8px';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.fontWeight = 'bold';
        nextBtn.style.zIndex = '10001';
        nextBtn.style.display = 'none';
        nextBtn.style.transition = 'all 0.3s ease';
        nextBtn.style.boxShadow = '0 4px 15px rgba(62, 134, 211, 0.3)';
        nextBtn.style.fontSize = '1em';
        document.body.appendChild(nextBtn);

        // Botón omitir
        let skipBtn = document.createElement('button');
        skipBtn.id = 'tutorial-skip-areas';
        skipBtn.textContent = 'Omitir';
        skipBtn.style.position = 'absolute';
        skipBtn.style.right = '24px';
        skipBtn.style.bottom = '18px';
        skipBtn.style.padding = '10px 16px';
        skipBtn.style.background = 'var(--Fondo_principal)';
        skipBtn.style.color = 'var(--Texto_secundario)';
        skipBtn.style.border = '1px solid var(--box_shadow)';
        skipBtn.style.borderRadius = '8px';
        skipBtn.style.cursor = 'pointer';
        skipBtn.style.fontWeight = 'bold';
        skipBtn.style.zIndex = '10001';
        skipBtn.style.display = 'none';
        skipBtn.style.transition = 'all 0.3s ease';
        skipBtn.style.fontSize = '1em';
        skipBtn.style.opacity = '0.9';
        document.body.appendChild(skipBtn);

        // Botón flotante para reiniciar (círculo con ?)
        let restartBtn = document.createElement('button');
        restartBtn.id = 'tutorial-restart-areas';
        restartBtn.innerHTML = '<span class="icono-ayuda">?</span><span class="texto-ayuda">¿Necesitas ayuda?</span>';
        restartBtn.style.position = 'fixed';
        restartBtn.style.bottom = '24px';
        restartBtn.style.right = '24px';
        restartBtn.style.background = 'var(--Encabezados_botones_y_primarios)';
        restartBtn.style.color = '#fff';
        restartBtn.style.border = 'none';
        restartBtn.style.borderRadius = '50%';
        restartBtn.style.width = '56px';
        restartBtn.style.height = '56px';
        restartBtn.style.boxShadow = '0 6px 20px rgba(62, 134, 211, 0.4)';
        restartBtn.style.cursor = 'pointer';
        restartBtn.style.zIndex = '10002';
        restartBtn.style.fontWeight = 'bold';
        restartBtn.style.display = 'none';
        restartBtn.style.transition = 'all 0.3s ease';
        restartBtn.style.overflow = 'hidden';
        restartBtn.style.padding = '0';
        restartBtn.querySelector('.texto-ayuda').style.display = 'none';
        document.body.appendChild(restartBtn);

        // Estilos para el icono y texto del botón flotante
        const style = document.createElement('style');
        style.innerHTML = `
        #tutorial-restart-areas .icono-ayuda {
            font-size: 2em;
            display: inline-block;
            vertical-align: middle;
            transition: all 0.3s ease;
        }
        #tutorial-restart-areas .texto-ayuda {
            display: inline-block;
            margin-left: 10px;
            font-size: 1em;
            opacity: 0;
            transition: all 0.3s ease;
            white-space: nowrap;
            font-weight: 500;
        }
        #tutorial-restart-areas.expandido {
            width: 200px !important;
            border-radius: 28px !important;
            background: var(--Encabezados_botones_y_primarios) !important;
            box-shadow: 0 8px 25px rgba(62, 134, 211, 0.5) !important;
            transform: scale(1.05);
        }
        #tutorial-restart-areas.expandido .texto-ayuda {
            opacity: 1;
        }
        #tutorial-next-areas:hover {
            background: var(--Botones_secundarios_o_hover_azul) !important;
            
            box-shadow: 0 6px 20px rgba(62, 134, 211, 0.4) !important;
        }
        #tutorial-restart-areas:hover {
            background: var(--Botones_secundarios_o_hover_azul) !important;
            transform: scale(1.1);
            box-shadow: 0 8px 25px rgba(62, 134, 211, 0.5) !important;
        }
        #tutorial-skip-areas:hover {
            background: var(--Fondo_principal) !important;
            color: var(--Texto_principal) !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--box_shadow) !important;
            border-color: var(--Encabezados_botones_y_primarios) !important;
            opacity: 1 !important;
        }
        
        /* Estilos para el elemento resaltado durante el tutorial */
        .tutorial-highlighted-areas {
            position: relative !important;
            z-index: 10000 !important;
            opacity: 1 !important;
            filter: none !important;
            transform: scale(1.02) !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 0 30px rgba(62, 134, 211, 0.3) !important;
        }
        
        /* Asegurar que el elemento resaltado mantenga su apariencia original */
        .tutorial-highlighted-areas * {
            opacity: 1 !important;
            filter: none !important;
        }
        `;
        document.head.appendChild(style);

        // Hover para mostrar texto
        restartBtn.addEventListener('mouseenter', function() {
            restartBtn.classList.add('expandido');
            restartBtn.querySelector('.texto-ayuda').style.display = 'inline-block';
        });
        restartBtn.addEventListener('mouseleave', function() {
            restartBtn.classList.remove('expandido');
            restartBtn.querySelector('.texto-ayuda').style.display = 'none';
        });
        // En móvil, mostrar texto al tocar
        restartBtn.addEventListener('touchstart', function() {
            restartBtn.classList.add('expandido');
            restartBtn.querySelector('.texto-ayuda').style.display = 'inline-block';
        });
        restartBtn.addEventListener('touchend', function() {
            setTimeout(()=>{
                restartBtn.classList.remove('expandido');
                restartBtn.querySelector('.texto-ayuda').style.display = 'none';
            }, 1200);
        });
    }

    // Muestra el paso actual del tutorial
    function showStep(stepIndex) {
        const step = tutorialSteps[stepIndex];
        const target = document.querySelector(step.selector);
        const overlay = document.getElementById('tutorial-overlay-areas');
        const highlight = document.getElementById('tutorial-highlight-areas');
        const tooltip = document.getElementById('tutorial-tooltip-areas');
        const nextBtn = document.getElementById('tutorial-next-areas');
        const skipBtn = document.getElementById('tutorial-skip-areas');

        // Remover la clase de highlight del paso anterior
        const previousHighlighted = document.querySelector('.tutorial-highlighted-areas');
        if (previousHighlighted) {
            previousHighlighted.classList.remove('tutorial-highlighted-areas');
        }

        if (!target) {
            // Si el elemento no existe, pasa al siguiente
            nextStep();
            return;
        }

        // Aplicar la clase de highlight al elemento actual
        target.classList.add('tutorial-highlighted-areas');

        // Scroll solo si el elemento está completamente fuera de la vista
        const rect = target.getBoundingClientRect();
        const isCompletelyAbove = rect.bottom < 0;
        const isCompletelyBelow = rect.top > window.innerHeight;
        let didScroll = false;
        if (isCompletelyAbove || isCompletelyBelow) {
            // Centra el elemento pero solo un poco (más rápido)
            const scrollY = window.scrollY + rect.top - (window.innerHeight/4) + (rect.height/4);
            window.scrollTo({ top: scrollY, behavior: 'smooth' });
            didScroll = true;
        }

        // Mostrar el tooltip y highlight después de un único scroll (o inmediatamente si no hizo scroll)
        setTimeout(() => {
            const rect2 = target.getBoundingClientRect();
            highlight.style.top = (window.scrollY + rect2.top - 8) + 'px';
            highlight.style.left = (window.scrollX + rect2.left - 8) + 'px';
            highlight.style.width = (rect2.width + 16) + 'px';
            highlight.style.height = (rect2.height + 16) + 'px';
            highlight.style.display = 'block';

            // Tooltip: calcula espacio arriba y abajo
            let tooltipTop = window.scrollY + rect2.bottom + 16;
            tooltip.style.display = 'block'; // Necesario para medir offsetHeight
            if (rect2.bottom + tooltip.offsetHeight + 40 > window.innerHeight) {
                // No hay espacio abajo, intenta arriba
                tooltipTop = window.scrollY + rect2.top - tooltip.offsetHeight - 24;
            }
            // Si tampoco hay espacio arriba, lo pega arriba del viewport
            if (tooltipTop < window.scrollY) {
                tooltipTop = window.scrollY + 16;
            }
            tooltip.style.top = tooltipTop + 'px';
            // Ajusta a la izquierda si se sale por la derecha
            let tooltipLeft = window.scrollX + rect2.left;
            if (tooltipLeft + tooltip.offsetWidth > window.scrollX + window.innerWidth) {
                tooltipLeft = window.scrollX + window.innerWidth - tooltip.offsetWidth - 16;
            }
            tooltip.style.left = tooltipLeft + 'px';
            tooltip.innerHTML = `<div style='margin-bottom:18px;'>${step.text}</div>`;
            tooltip.style.paddingBottom = '64px'; // espacio para el botón

            // Botón siguiente: dentro del tooltip, abajo a la izquierda
            nextBtn.style.position = 'absolute';
            nextBtn.style.left = '24px';
            nextBtn.style.bottom = '18px';
            nextBtn.style.width = 'calc(50% - 32px)';
            nextBtn.style.margin = '0';
            nextBtn.style.display = 'block';
            nextBtn.style.zIndex = '10001';
            tooltip.appendChild(nextBtn);

            // Botón omitir: dentro del tooltip, abajo a la derecha
            skipBtn.style.position = 'absolute';
            skipBtn.style.right = '24px';
            skipBtn.style.bottom = '18px';
            skipBtn.style.width = 'calc(50% - 32px)';
            skipBtn.style.margin = '0';
            skipBtn.style.display = 'block';
            skipBtn.style.zIndex = '10001';
            tooltip.appendChild(skipBtn);

            overlay.style.display = 'block';
        }, didScroll ? 250 : 0); // Espera 250ms si hubo scroll, 0 si no
    }

    // Oculta todos los elementos del tutorial
    function hideTutorial() {
        document.getElementById('tutorial-overlay-areas').style.display = 'none';
        document.getElementById('tutorial-highlight-areas').style.display = 'none';
        document.getElementById('tutorial-tooltip-areas').style.display = 'none';
        document.getElementById('tutorial-next-areas').style.display = 'none';
        document.getElementById('tutorial-skip-areas').style.display = 'none';
        
        // Remover la clase de highlight del elemento actual
        const highlightedElement = document.querySelector('.tutorial-highlighted-areas');
        if (highlightedElement) {
            highlightedElement.classList.remove('tutorial-highlighted-areas');
        }
    }

    // Muestra el botón flotante para reiniciar
    function showRestartBtn() {
        document.getElementById('tutorial-restart-areas').style.display = 'block';
    }

    // Oculta el botón flotante
    function hideRestartBtn() {
        document.getElementById('tutorial-restart-areas').style.display = 'none';
    }

    // Lógica de pasos
    let currentStep = 0;
    function nextStep() {
        currentStep++;
        if (currentStep >= tutorialSteps.length) {
            endTutorial();
        } else {
            showStep(currentStep);
        }
    }
    function startTutorial() {
        currentStep = 0;
        hideRestartBtn();
        showStep(currentStep);
    }
    function endTutorial() {
        hideTutorial();
        showRestartBtn();
        localStorage.setItem('tutorialAreasSeen', 'true');
    }

    // Inicializa el tutorial al cargar la página
    window.addEventListener('DOMContentLoaded', function() {
        console.log('Tutorial de áreas: DOM cargado');
        createTutorialElements();
        console.log('Tutorial de áreas: Elementos creados');
        // Listeners
        document.getElementById('tutorial-next-areas').onclick = nextStep;
        document.getElementById('tutorial-restart-areas').onclick = startTutorial;
        document.getElementById('tutorial-skip-areas').onclick = endTutorial;
        console.log('Tutorial de áreas: Listeners configurados');
        // Si es la primera vez, inicia el tutorial
        if (!localStorage.getItem('tutorialAreasSeen')) {
            console.log('Tutorial de áreas: Primera visita, iniciando tutorial');
            setTimeout(startTutorial, 600); // Pequeño delay para que cargue la página
        } else {
            console.log('Tutorial de áreas: Visita posterior, mostrando botón de ayuda');
            showRestartBtn();
        }
    });

    // Opcional: Recalcula la posición del highlight al redimensionar o hacer scroll
    window.addEventListener('resize', function() {
        if (document.getElementById('tutorial-highlight-areas').style.display === 'block') {
            showStep(currentStep);
        }
    });
    window.addEventListener('scroll', function() {
        if (document.getElementById('tutorial-highlight-areas').style.display === 'block') {
            showStep(currentStep);
        }
    });
})(); 
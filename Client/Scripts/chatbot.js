// ===== CHATBOT LUDIVERSO =====
// Sistema de chatbot inteligente para ayudar a los usuarios de Ludiverso

class LudiversoChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentContext = 'general';
        this.userName = this.getUserName();
        
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    getUserName() {
        // Intentar obtener el nombre del usuario desde la sesión
        const sessionData = document.querySelector('meta[name="session-data"]');
        if (sessionData) {
            try {
                const data = JSON.parse(sessionData.getAttribute('content'));
                return data.nombre_us || 'Usuario';
            } catch (e) {
                return 'Usuario';
            }
        }
        return 'Usuario';
    }

    createChatbotHTML() {
        // Crear el HTML del chatbot
        const chatbotHTML = `
            <div class="chatbot-toggle" id="chatbotToggle">
                <i class="fas fa-robot"></i>
            </div>
            
            <div class="chatbot-container" id="chatbotContainer">
                <div class="chatbot-header">
                    <h3><i class="fas fa-robot"></i> Asistente Ludiverso</h3>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Los mensajes se insertarán aquí dinámicamente -->
                </div>
                
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Escribe tu pregunta aquí..." maxlength="500">
                    <button class="chatbot-send" id="chatbotSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        // Insertar el HTML al final del body
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const input = document.getElementById('chatbotInput');
        const send = document.getElementById('chatbotSend');
        const container = document.getElementById('chatbotContainer');

        // Toggle del chatbot
        toggle.addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Cerrar chatbot
        close.addEventListener('click', () => {
            this.closeChatbot();
        });

        // Enviar mensaje con Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enviar mensaje con botón
        send.addEventListener('click', () => {
            this.sendMessage();
        });

        // Cerrar al hacer clic fuera del chatbot
        document.addEventListener('click', (e) => {
            if (this.isOpen && !container.contains(e.target) && !toggle.contains(e.target)) {
                this.closeChatbot();
            }
        });

        // Habilitar/deshabilitar botón de envío
        input.addEventListener('input', () => {
            send.disabled = input.value.trim().length === 0;
        });
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');
        
        container.classList.add('active');
        toggle.classList.add('active');
        this.isOpen = true;
        
        // Enfocar el input
        setTimeout(() => {
            document.getElementById('chatbotInput').focus();
        }, 300);
    }

    closeChatbot() {
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');
        
        container.classList.remove('active');
        toggle.classList.remove('active');
        this.isOpen = false;
    }

    showWelcomeMessage() {
        const welcomeMessage = `
            <div class="message-welcome">
                <h4>¡Hola ${this.userName}! 👋</h4>
                <p>Soy tu asistente virtual de Ludiverso. Estoy aquí para ayudarte con cualquier duda sobre la plataforma.</p>
                <div class="suggestions">
                    <button class="suggestion-btn" data-question="¿Qué es Ludiverso?">¿Qué es Ludiverso?</button>
                    <button class="suggestion-btn" data-question="¿Cómo jugar?">¿Cómo jugar?</button>
                    <button class="suggestion-btn" data-question="¿Qué áreas hay?">¿Qué áreas hay?</button>
                    <button class="suggestion-btn" data-question="¿Cómo registrarse?">¿Cómo registrarse?</button>
                </div>
            </div>
        `;

        this.addMessage('bot', welcomeMessage, true);
        this.bindSuggestionButtons();
    }

    bindSuggestionButtons() {
        const suggestionButtons = document.querySelectorAll('.suggestion-btn');
        suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.getAttribute('data-question');
                document.getElementById('chatbotInput').value = question;
                this.sendMessage();
            });
        });
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Agregar mensaje del usuario
        this.addMessage('user', message);
        
        // Limpiar input
        input.value = '';
        document.getElementById('chatbotSend').disabled = true;

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        // Procesar respuesta
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.processMessage(message);
            this.addMessage('bot', response);
        }, 1000 + Math.random() * 1000); // Simular tiempo de respuesta
    }

    addMessage(sender, content, isHTML = false) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        let messageHTML;
        if (sender === 'user') {
            messageHTML = `
                <div class="message-user">
                    <div class="content">${this.escapeHtml(content)}</div>
                </div>
            `;
        } else {
            const avatar = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
            messageHTML = `
                <div class="message-bot">
                    <div class="avatar">${avatar}</div>
                    <div class="content">${isHTML ? content : this.escapeHtml(content)}</div>
                </div>
            `;
        }

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Guardar mensaje en el historial
        this.messages.push({ sender, content, timestamp: new Date() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingHTML = `
            <div class="typing-indicator" id="typingIndicator">
                <div class="avatar"><i class="fas fa-robot"></i></div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Detectar intención y contexto
        if (this.containsAny(lowerMessage, ['hola', 'hi', 'buenos días', 'buenas tardes', 'buenas noches'])) {
            return this.getGreetingResponse();
        }
        
        if (this.containsAny(lowerMessage, ['qué es ludiverso', 'que es ludiverso', 'ludiverso', 'plataforma'])) {
            return this.getLudiversoInfo();
        }
        
        if (this.containsAny(lowerMessage, ['cómo jugar', 'como jugar', 'jugar', 'iniciar', 'empezar'])) {
            return this.getHowToPlayInfo();
        }
        
        if (this.containsAny(lowerMessage, ['áreas', 'areas', 'materias', 'asignaturas', 'materia'])) {
            return this.getAreasInfo();
        }
        
        if (this.containsAny(lowerMessage, ['registrarse', 'registro', 'crear cuenta', 'nueva cuenta'])) {
            return this.getRegistrationInfo();
        }
        
        if (this.containsAny(lowerMessage, ['login', 'iniciar sesión', 'iniciar sesion', 'loguearse'])) {
            return this.getLoginInfo();
        }
        
        if (this.containsAny(lowerMessage, ['juegos', 'game', 'memoria', 'wordle', 'ahorcado', 'rompecabezas'])) {
            return this.getGamesInfo();
        }
        
        if (this.containsAny(lowerMessage, ['puntaje', 'puntuación', 'puntuacion', 'puntos', 'ranking', 'estadísticas'])) {
            return this.getScoreInfo();
        }
        
        if (this.containsAny(lowerMessage, ['ayuda', 'help', 'soporte', 'problema', 'error'])) {
            return this.getHelpInfo();
        }
        
        if (this.containsAny(lowerMessage, ['contacto', 'contact', 'email', 'correo'])) {
            return this.getContactInfo();
        }
        
        if (this.containsAny(lowerMessage, ['novedades', 'noticias', 'actualizaciones', 'news'])) {
            return this.getNewsInfo();
        }
        
        if (this.containsAny(lowerMessage, ['sobre nosotros', 'sobre nosotras', 'equipo', 'desarrolladores'])) {
            return this.getAboutUsInfo();
        }
        
        // Respuesta por defecto
        return this.getDefaultResponse();
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getGreetingResponse() {
        const responses = [
            `¡Hola ${this.userName}! 😊 ¿En qué puedo ayudarte hoy?`,
            `¡Hola! 👋 Me alegra verte por aquí. ¿Tienes alguna pregunta sobre Ludiverso?`,
            `¡Saludos ${this.userName}! 🤖 Estoy aquí para ayudarte con cualquier duda.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getLudiversoInfo() {
        return `🎮 <strong>Ludiverso</strong> es una plataforma educativa desarrollada por estudiantes de 7° año de programación.

Nuestro objetivo es fomentar la educación de manera divertida y amigable para los nuevos alumnos. 

En Ludiverso encontrarás:
• 🧠 Juegos educativos interactivos
• 📚 Contenido de diferentes áreas académicas
• 🏆 Sistema de puntuación y ranking
• 📱 Interfaz moderna y fácil de usar

Las áreas que cubrimos son:
• Comunicaciones
• Ciencias Exactas y Naturales
• Ciencias Sociales
• Educación Física
• Taller

¿Te gustaría saber más sobre alguna área específica o cómo empezar a jugar?`;
    }

    getHowToPlayInfo() {
        return `🎯 <strong>¿Cómo empezar a jugar en Ludiverso?</strong>

1️⃣ <strong>Regístrate o inicia sesión</strong>
   • Si eres nuevo, crea una cuenta en el botón "Registrarse"
   • Si ya tienes cuenta, usa "Iniciar sesión"

2️⃣ <strong>Explora las áreas</strong>
   • En la página principal verás diferentes áreas educativas
   • Haz clic en cualquier área para ver los juegos disponibles

3️⃣ <strong>Selecciona un juego</strong>
   • Cada área tiene diferentes tipos de juegos
   • Haz clic en "Jugar" para comenzar

4️⃣ <strong>Tipos de juegos disponibles:</strong>
   • 🧩 <strong>Memoria:</strong> Encuentra las parejas correctas
   • 🔤 <strong>Wordle:</strong> Adivina la palabra oculta
   • 🎯 <strong>Ahorcado:</strong> Adivina la palabra letra por letra
   • 🧩 <strong>Rompecabezas:</strong> Arma la imagen correctamente

5️⃣ <strong>Gana puntos</strong>
   • Cada juego te dará puntos según tu rendimiento
   • Compite en los rankings con otros estudiantes

¿Necesitas ayuda con algún juego específico?`;
    }

    getAreasInfo() {
        return `📚 <strong>Áreas educativas en Ludiverso:</strong>

🔤 <strong>Comunicaciones</strong>
   • Juegos de lenguaje, literatura y comunicación
   • Mejora tu vocabulario y comprensión lectora

🔬 <strong>Ciencias Exactas y Naturales</strong>
   • Matemáticas, física, química y biología
   • Ejercicios prácticos y problemas interactivos

🌍 <strong>Ciencias Sociales</strong>
   • Historia, geografía y ciencias sociales
   • Aprende sobre el mundo de forma divertida

🏃 <strong>Educación Física</strong>
   • Conocimientos sobre deportes y salud
   • Anatomía y fisiología del ejercicio

🔧 <strong>Taller</strong>
   • Tecnología, informática y habilidades técnicas
   • Programación y desarrollo de software

Cada área tiene múltiples niveles de dificultad y diferentes tipos de juegos. ¡Explora todas las áreas para obtener una educación completa!`;
    }

    getRegistrationInfo() {
        return `📝 <strong>¿Cómo registrarse en Ludiverso?</strong>

1️⃣ Ve a la página de inicio
2️⃣ Haz clic en el botón <strong>"Registrarse"</strong>
3️⃣ Completa el formulario con:
   • Nombre y apellido
   • Nombre de usuario (único)
   • Email válido
   • Contraseña segura

4️⃣ Haz clic en <strong>"Crear cuenta"</strong>

✅ <strong>¡Listo!</strong> Ya puedes empezar a jugar y aprender.

<strong>Consejos:</strong>
• Elige un nombre de usuario fácil de recordar
• Usa una contraseña segura con letras, números y símbolos
• Verifica que tu email sea correcto

¿Necesitas ayuda con algún paso específico del registro?`;
    }

    getLoginInfo() {
        return `🔐 <strong>¿Cómo iniciar sesión?</strong>

1️⃣ Ve a la página de inicio
2️⃣ Haz clic en <strong>"Iniciar sesión"</strong>
3️⃣ Ingresa tus credenciales:
   • Nombre de usuario
   • Contraseña

4️⃣ Haz clic en <strong>"Entrar"</strong>

❌ <strong>Si olvidaste tu contraseña:</strong>
• Haz clic en "¿Olvidaste tu contraseña?"
• Sigue las instrucciones para recuperarla

✅ <strong>Una vez dentro podrás:</strong>
• Acceder a todos los juegos
• Ver tu progreso y estadísticas
• Competir en rankings
• Personalizar tu perfil

¿Tienes problemas para iniciar sesión?`;
    }

    getGamesInfo() {
        return `🎮 <strong>Juegos disponibles en Ludiverso:</strong>

🧩 <strong>Juego de Memoria</strong>
   • Encuentra las parejas correctas
   • Mejora tu concentración y memoria
   • Diferentes niveles de dificultad

🔤 <strong>Wordle</strong>
   • Adivina la palabra oculta en 6 intentos
   • Cada intento te da pistas sobre las letras
   • Perfecto para mejorar vocabulario

🎯 <strong>Ahorcado</strong>
   • Adivina la palabra letra por letra
   • Cada error te acerca al final
   • Ideal para aprender nuevas palabras

🧩 <strong>Rompecabezas</strong>
   • Arma la imagen correctamente
   • Desarrolla habilidades espaciales
   • Diferentes tamaños y complejidades

<strong>Características de todos los juegos:</strong>
• ⏱️ Cronómetro para medir tu velocidad
• 🏆 Sistema de puntuación
• 📊 Estadísticas detalladas
• 🥇 Rankings para competir

¿Te gustaría saber más sobre algún juego específico?`;
    }

    getScoreInfo() {
        return `🏆 <strong>Sistema de puntuación en Ludiverso:</strong>

📊 <strong>Cómo se calculan los puntos:</strong>
• Aciertos correctos: +100 puntos
• Velocidad: Menos tiempo = más puntos
• Intentos: Menos intentos = mejor puntuación
• Precisión: Mayor precisión = bonus extra

🥇 <strong>Rankings disponibles:</strong>
• Ranking general por juego
• Ranking por área educativa
• Ranking por nivel de dificultad
• Tu posición personal

📈 <strong>Estadísticas que puedes ver:</strong>
• Puntuación total
• Tiempo promedio por juego
• Número de juegos completados
• Progreso por área
• Mejores puntuaciones

🎯 <strong>Consejos para mejorar tu puntuación:</strong>
• Practica regularmente
• Lee las instrucciones cuidadosamente
• Mantén la calma bajo presión
• Revisa tus errores para aprender

¿Quieres saber cómo acceder a tus estadísticas o rankings?`;
    }

    getHelpInfo() {
        return `🆘 <strong>Centro de ayuda de Ludiverso</strong>

❓ <strong>Problemas comunes y soluciones:</strong>

🔧 <strong>El juego no carga:</strong>
• Verifica tu conexión a internet
• Actualiza la página (F5)
• Limpia la caché del navegador

🔐 <strong>No puedo iniciar sesión:</strong>
• Verifica tu nombre de usuario y contraseña
• Usa la opción "¿Olvidaste tu contraseña?"
• Contacta al administrador si persiste

🎮 <strong>El juego se traba:</strong>
• Refresca la página
• Cierra otras pestañas del navegador
• Verifica que JavaScript esté habilitado

📱 <strong>Problemas en móvil:</strong>
• Usa un navegador actualizado
• Asegúrate de tener buena señal
• Rota la pantalla si es necesario

🆘 <strong>Si necesitas más ayuda:</strong>
• Contacta al equipo de soporte
• Reporta bugs o problemas
• Sugiere mejoras

¿Hay algún problema específico que te gustaría resolver?`;
    }

    getContactInfo() {
        return `📞 <strong>Información de contacto:</strong>

👥 <strong>Equipo de desarrollo:</strong>
• Estudiantes de 7° año de programación
• Especialidad en desarrollo de software

📧 <strong>Para soporte técnico:</strong>
• Contacta a través del sistema de reportes
• Incluye detalles del problema
• Adjunta capturas de pantalla si es posible

💡 <strong>Para sugerencias:</strong>
• Usa el formulario de feedback
• Describe tu idea claramente
• Explica cómo mejoraría la experiencia

🐛 <strong>Para reportar bugs:</strong>
• Describe el problema paso a paso
• Menciona qué navegador usas
• Incluye el mensaje de error si aparece

📱 <strong>Redes sociales:</strong>
• Síguenos para actualizaciones
• Participa en la comunidad
• Comparte tus logros

¿Necesitas ayuda con algún problema específico?`;
    }

    getNewsInfo() {
        return `📰 <strong>Novedades en Ludiverso:</strong>

🆕 <strong>Últimas actualizaciones:</strong>
• Nuevos juegos agregados regularmente
• Mejoras en la interfaz de usuario
• Optimizaciones de rendimiento
• Nuevas áreas educativas

🏆 <strong>Eventos especiales:</strong>
• Torneos mensuales
• Competencias por área
• Desafíos especiales
• Premios para los mejores jugadores

📊 <strong>Estadísticas de la plataforma:</strong>
• Miles de estudiantes activos
• Cientos de juegos completados diariamente
• Alta satisfacción de usuarios
• Crecimiento constante

🔮 <strong>Próximamente:</strong>
• Nuevos tipos de juegos
• Sistema de logros
• Modo multijugador
• Aplicación móvil

📢 <strong>Mantente informado:</strong>
• Revisa la sección de novedades regularmente
• Sigue nuestras redes sociales
• Participa en la comunidad

¿Te interesa alguna novedad específica?`;
    }

    getAboutUsInfo() {
        return `👥 <strong>Sobre el equipo de Ludiverso:</strong>

🎓 <strong>¿Quiénes somos?</strong>
Somos estudiantes de 7° año de la especialidad de programación, apasionados por la educación y la tecnología.

🎯 <strong>Nuestra misión:</strong>
Crear una plataforma educativa que haga el aprendizaje divertido y accesible para todos los estudiantes.

💡 <strong>Nuestra visión:</strong>
Ser la plataforma educativa líder en gamificación del aprendizaje, combinando tecnología y pedagogía.

🛠️ <strong>Tecnologías que usamos:</strong>
• Node.js y Express para el backend
• EJS para las plantillas
• MySQL para la base de datos
• CSS3 y JavaScript moderno
• Diseño responsive

🌟 <strong>Nuestros valores:</strong>
• Educación accesible para todos
• Innovación constante
• Calidad en el desarrollo
• Experiencia de usuario excepcional

🤝 <strong>Únete a nuestra comunidad:</strong>
• Participa en el desarrollo
• Sugiere nuevas funcionalidades
• Reporta problemas
• Comparte tu experiencia

¿Te gustaría conocer más sobre nuestro proceso de desarrollo?`;
    }

    getDefaultResponse() {
        const responses = [
            `🤔 No estoy seguro de entender tu pregunta. ¿Podrías ser más específico?`,
            `😅 No tengo información sobre eso. ¿Te gustaría preguntarme sobre los juegos, áreas educativas o cómo usar Ludiverso?`,
            `🤖 No puedo ayudarte con eso específicamente. ¿Hay algo sobre Ludiverso en lo que pueda asistirte?`,
            `💭 Interesante pregunta. ¿Podrías reformularla? Puedo ayudarte con información sobre juegos, registro, áreas educativas, etc.`,
            `❓ No estoy seguro de cómo responder eso. ¿Te gustaría que te explique cómo funciona Ludiverso o alguna de sus características?`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return `${randomResponse}

💡 <strong>Puedo ayudarte con:</strong>
• Información sobre Ludiverso
• Cómo registrarse e iniciar sesión
• Explicación de los juegos disponibles
• Información sobre las áreas educativas
• Sistema de puntuación y rankings
• Resolución de problemas técnicos

¿Hay algo específico sobre Ludiverso que te gustaría saber?`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar el chatbot cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si no existe ya
    if (!window.ludiversoChatbot) {
        window.ludiversoChatbot = new LudiversoChatbot();
    }
});

// Exportar para uso global
window.LudiversoChatbot = LudiversoChatbot;

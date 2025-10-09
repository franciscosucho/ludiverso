# 🤖 Chatbot Ludiverso - Documentación

## Descripción
El Chatbot Ludiverso es un asistente virtual inteligente diseñado para ayudar a los usuarios de la plataforma educativa Ludiverso. Proporciona respuestas automáticas a preguntas frecuentes sobre el uso de la plataforma, juegos, áreas educativas y más.

## Características Principales

### 🎯 Funcionalidades
- **Respuestas inteligentes** sobre Ludiverso y sus características
- **Interfaz moderna** que se integra perfectamente con el diseño de la plataforma
- **Soporte para múltiples temas**: juegos, áreas educativas, registro, puntuación, etc.
- **Diseño responsive** que funciona en dispositivos móviles y desktop
- **Personalización** con el nombre del usuario logueado

### 🎨 Diseño
- **Botón flotante** con icono de robot en la esquina inferior derecha
- **Ventana de chat** que se desliza hacia arriba al abrirse
- **Mensajes con avatares** diferenciados para usuario y bot
- **Indicador de escritura** que simula que el bot está escribiendo
- **Botones de sugerencias** para preguntas rápidas

## Archivos Implementados

### 1. Estilos (`Client/Estilo/chatbot.css`)
- Estilos completos para el chatbot
- Compatible con el tema claro y oscuro de Ludiverso
- Animaciones suaves y transiciones
- Diseño responsive para móviles

### 2. JavaScript (`Client/Scripts/chatbot.js`)
- Clase `LudiversoChatbot` con toda la lógica
- Sistema de procesamiento de mensajes inteligente
- Base de conocimiento sobre Ludiverso
- Integración con datos de sesión del usuario

### 3. Componente EJS (`Server/Views/chatbot.ejs`)
- Inclusión simple del script del chatbot
- Se puede agregar a cualquier página

## Integración en Páginas

El chatbot se ha integrado en las siguientes páginas principales:
- ✅ Página principal (`index.ejs`)
- ✅ Página de áreas (`areas.ejs`)
- ✅ Login (`login.ejs`)
- ✅ Registro (`register.ejs`)
- ✅ Perfil de usuario (`profile.ejs`)
- ✅ Introducción a juegos (`juego_intro.ejs`)
- ✅ Juego de memoria (`juego_memoria.ejs`)
- ✅ Wordle (`wordle.ejs`)
- ✅ Sobre nosotros (`sobre_nosotros.ejs`)

## Temas que Puede Responder

### 🎮 Juegos
- Cómo jugar cada tipo de juego
- Explicación de reglas y mecánicas
- Consejos para mejorar el rendimiento

### 📚 Áreas Educativas
- Información sobre cada área (Comunicaciones, Exactas, Sociales, etc.)
- Qué aprender en cada materia
- Niveles de dificultad disponibles

### 🔐 Cuenta y Usuario
- Cómo registrarse
- Cómo iniciar sesión
- Recuperación de contraseña
- Gestión del perfil

### 🏆 Sistema de Puntuación
- Cómo se calculan los puntos
- Rankings y competencias
- Estadísticas personales

### 🆘 Soporte Técnico
- Resolución de problemas comunes
- Información de contacto
- Reporte de bugs

### 📰 Novedades
- Últimas actualizaciones
- Eventos especiales
- Nuevas funcionalidades

## Personalización

### Datos del Usuario
El chatbot detecta automáticamente:
- Nombre del usuario logueado
- Información de la sesión
- Personaliza las respuestas de saludo

### Respuestas Inteligentes
- **Detección de intención**: Analiza las palabras clave del mensaje
- **Contexto**: Mantiene el contexto de la conversación
- **Respuestas variadas**: Múltiples respuestas para evitar repetición
- **Fallback**: Respuesta por defecto cuando no entiende la pregunta

## Uso del Chatbot

### Para Usuarios
1. **Abrir**: Haz clic en el botón flotante del robot
2. **Preguntar**: Escribe tu pregunta en el campo de texto
3. **Sugerencias**: Usa los botones de sugerencias para preguntas rápidas
4. **Cerrar**: Haz clic en la X o fuera del chat

### Para Desarrolladores
```javascript
// El chatbot se inicializa automáticamente
// Para acceder a la instancia:
const chatbot = window.ludiversoChatbot;

// Métodos disponibles:
chatbot.openChatbot();    // Abrir el chat
chatbot.closeChatbot();   // Cerrar el chat
chatbot.toggleChatbot();  // Alternar estado
```

## Extensibilidad

### Agregar Nuevas Respuestas
Para agregar nuevas respuestas, modifica el método `processMessage()` en `chatbot.js`:

```javascript
if (this.containsAny(lowerMessage, ['nueva palabra clave'])) {
    return this.getNuevaRespuesta();
}

// Y agregar el método correspondiente:
getNuevaRespuesta() {
    return `Tu nueva respuesta aquí...`;
}
```

### Agregar a Nuevas Páginas
Simplemente incluye el componente en cualquier página EJS:
```html
<%- include('chatbot.ejs') %>
```

## Compatibilidad

- ✅ **Navegadores**: Chrome, Firefox, Safari, Edge
- ✅ **Dispositivos**: Desktop, tablet, móvil
- ✅ **Temas**: Modo claro y oscuro
- ✅ **Accesibilidad**: Compatible con lectores de pantalla

## Mantenimiento

### Actualizar Respuestas
- Modifica los métodos de respuesta en `chatbot.js`
- Agrega nuevas palabras clave para detección
- Actualiza la información sobre Ludiverso

### Mejorar la UI
- Modifica los estilos en `chatbot.css`
- Agrega nuevas animaciones
- Mejora la responsividad

## Beneficios para Ludiverso

1. **Reducción de consultas de soporte**: Los usuarios pueden resolver dudas inmediatamente
2. **Mejor experiencia de usuario**: Acceso 24/7 a ayuda contextual
3. **Onboarding mejorado**: Los nuevos usuarios pueden aprender a usar la plataforma fácilmente
4. **Escalabilidad**: Un solo chatbot puede atender múltiples usuarios simultáneamente
5. **Integración perfecta**: Se integra sin afectar el código existente

---

**Desarrollado para Ludiverso** 🎮📚
*Transformando la distracción en aprendizaje*

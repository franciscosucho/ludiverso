# 📚 Tutorial del Perfil - Ludiverso

## Descripción
Se ha implementado un tutorial interactivo para la página de perfil de usuario, similar al que existe en la página de inicio. El tutorial guía a los usuarios a través de todas las funcionalidades disponibles en su perfil.

## Características del Tutorial

### 🎯 Funcionalidades
- **Tutorial automático**: Se inicia automáticamente en la primera visita
- **Navegación intuitiva**: Botón "Siguiente" integrado en el tooltip
- **Highlight visual**: Resalta cada elemento explicado con efecto de escala
- **Tooltips informativos**: Explicaciones claras y concisas con fondo translúcido
- **Botón de ayuda flotante**: Círculo con "?" que se expande al hacer hover
- **Scroll automático**: Se desplaza suavemente hacia elementos fuera de vista
- **Persistencia**: Recuerda si el usuario ya vio el tutorial
- **Diseño idéntico**: Mismo estilo y comportamiento que el tutorial del inicio

### 📋 Pasos del Tutorial
1. **Header principal** - Navegación general
2. **Título del perfil** - Introducción a la página
3. **Información básica** - Avatar, nombre y rol
4. **Avatar del usuario** - Explicación del ícono
5. **Formulario de edición** - Sección de datos personales
6. **Campo Nombre** - Edición del nombre
7. **Campo Apellido** - Edición del apellido
8. **Nombre de usuario** - Campo no editable
9. **Email** - Actualización de correo
10. **Contraseña** - Cambio de contraseña
11. **Botón guardar** - Confirmación de cambios
12. **Estadísticas generales** - Resumen de progreso
13. **Total de partidas** - Contador de juegos
14. **Puntos totales** - Puntuación acumulada
15. **Posición global** - Ranking de usuarios
16. **Estadísticas por juego** - Detalles específicos
17. **Memory Card** - Estadísticas del juego
18. **Wordle** - Estadísticas del juego
19. **Ahorcado** - Estadísticas del juego
20. **Rompecabezas** - Estadísticas del juego

## 🛠️ Archivos Implementados

### Nuevos Archivos
- `Client/Scripts/profile.js` - Script principal del tutorial
- `Test/test_profile_tutorial.html` - Página de prueba
- `Test/reset_tutorial.js` - Script para resetear el tutorial
- `Test/README_TUTORIAL.md` - Este archivo de documentación

### Archivos Modificados
- `Server/Views/profile.ejs` - Agregada referencia al script del tutorial
- `Client/Estilo/profile.css` - Agregados estilos para el tutorial

## 🧪 Cómo Probar el Tutorial

### Opción 1: Página de Prueba
1. Abre `Test/test_profile_tutorial.html` en tu navegador
2. El tutorial se iniciará automáticamente
3. Sigue las instrucciones en pantalla

### Opción 2: Página Real del Perfil
1. Inicia el servidor: `cd Server && node main.js`
2. Accede a la página de perfil (requiere login)
3. El tutorial se mostrará automáticamente en la primera visita

### Opción 3: Resetear Tutorial
Para ver el tutorial nuevamente:
1. Abre la consola del navegador (F12)
2. Ejecuta el contenido de `Test/reset_tutorial.js`
3. Recarga la página

## 🎨 Características Visuales

### Estilos del Tutorial
- **Overlay oscuro** con efecto blur
- **Highlight pulsante** alrededor de elementos con efecto de escala
- **Tooltips translúcidos** con fondo blanco semi-transparente
- **Botón flotante** que se expande al hacer hover
- **Scroll automático** suave hacia elementos fuera de vista
- **Responsive design** para móviles
- **Diseño idéntico** al tutorial del inicio

### Colores Utilizados
- **Azul principal**: `#3e86d3`
- **Azul secundario**: `#5a9de8`
- **Gris**: `#6c757d`
- **Rojo**: `#dc3545`

## 🔧 Personalización

### Modificar Pasos del Tutorial
Edita el array `tutorialSteps` en `Client/Scripts/profile.js`:

```javascript
const tutorialSteps = [
    {
        selector: '#mi-elemento',
        text: 'Mi explicación personalizada'
    },
    // ... más pasos
];
```

### Cambiar Estilos
Modifica los estilos en `Client/Estilo/profile.css`:

```css
#tutorial-highlight-profile {
    border-color: #tu-color;
    box-shadow: 0 0 20px rgba(tu-color, 0.5);
}
```

## 🐛 Solución de Problemas

### El tutorial no aparece
1. Verifica que el archivo `profile.js` esté cargado
2. Revisa la consola del navegador para errores
3. Asegúrate de que los selectores CSS sean correctos

### Elementos no se resaltan
1. Verifica que los selectores CSS coincidan con la estructura HTML
2. Asegúrate de que los elementos existan en el DOM

### Problemas de posicionamiento
1. El tutorial se ajusta automáticamente al tamaño de pantalla
2. Los tooltips se reposicionan si se salen de la ventana

## 📱 Compatibilidad
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Móviles (responsive)

## 🚀 Próximas Mejoras
- [ ] Tutorial para otras páginas (juegos individuales)
- [ ] Animaciones más avanzadas
- [ ] Opción de saltar tutorial
- [ ] Tutorial en múltiples idiomas
- [ ] Estadísticas de uso del tutorial 
// Script para resetear el tutorial del perfil
// Ejecuta esto en la consola del navegador para poder ver el tutorial nuevamente

console.log('🧹 Reseteando tutorial del perfil...');

// Limpiar todas las variables del tutorial
localStorage.removeItem('tutorialProfileSeen');
localStorage.removeItem('tutorialIndexSeen');
localStorage.removeItem('tutorialAreasSeen');

console.log('✅ Tutorial reseteado. Recarga la página para ver el tutorial nuevamente.');

// Opcional: recargar automáticamente
// window.location.reload(); 
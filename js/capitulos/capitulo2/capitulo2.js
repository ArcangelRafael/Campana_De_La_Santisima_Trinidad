/* === CAPITULO2.JS - EL SEGUNDO ACTO === */

function inicioCapitulo2() {
    cambiarMusica('bgm-capitulo2'); 
    storyArea.innerHTML = ""; 
    limpiarBotones();

    agregarTexto(`<h3 style='color: #ffaa00;'>Capítulo II: La Senda del Peregrino</h3>`);
    agregarTexto("El humo se disipa sobre el puente y tus hombres recuperan el aliento. Habiendo dejado atrás el desfiladero, la cruzada se adentra en territorios desconocidos, donde no solo la espada, sino el alma, será puesta a prueba.");
    
    // AQUÍ INVOCAMOS TU NUEVA MECÁNICA
    agregarTexto("<i>[El ejército marcha bajo el sol abrasador...]</i>", "mensaje-sistema");

    // Hacemos una pequeña pausa para que el jugador lea, y ¡BAM! salta el evento aleatorio
    setTimeout(() => {
        dispararTribulacionAleatoria(() => {
            
            // ESTO SE EJECUTA DESPUÉS DE QUE EL JUGADOR CIERRA LA VENTANA DEL EVENTO
            agregarTexto("<div class='separador'>***</div>");
            agregarTexto("Tras dejar atrás el incidente, tu hueste continúa su marcha. A lo lejos, se divisan las torres derruidas de lo que parece ser una antigua abadía...");
            
            crearBoton("Acercarse a investigar", () => {
                agregarTexto("<i>[Desarrollo del Capítulo 2 próximamente...]</i>", "mensaje-sistema");
            });

        });
    }, 2000); // Tarda 2 segundos en saltar la tribulación
}

// Sobrescribimos la referencia del botón del interludio del Cap 1 para que llame a este nuevo archivo
function escena2() {
    inicioCapitulo2();
}
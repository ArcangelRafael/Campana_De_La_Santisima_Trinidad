/* === INTRODUCCION.JS - PRÓLOGO Y RECLUTAMIENTO INICIAL === */

function iniciarJuego() {
    document.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    reiniciarJugadorBase(); jugador.nombre = "Recluta Anónimo"; storyArea.innerHTML = ""; 
    limpiarBotones();
    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>Campañas Cruzadas</h2>");
    agregarTexto("Bienvenido seas a las aventuras cruzadas, selecciona tu campaña y que El Señor te bendiga. (esto habilitará el sonido del juego).", "mensaje-sistema");
    agregarTexto("Desarrollo by: Sir Archangel Raphael & Luis IX", "mensaje-sistema");
    
    crearBoton("Campaña de la Santísima Trinidad", () => {
        limpiarBotones();
        if (typeof cambiarMusica === 'function') cambiarMusica('bgm-menu'); 
        jugador.orden = "Santísima Trinidad";
        let iconoOrden = document.getElementById("icono-orden");
        if (iconoOrden) { iconoOrden.src = "assets/img/ui/cruz_trinidad.webp"; iconoOrden.style.display = "inline-block"; }
        document.querySelectorAll('.estandarte').forEach(el => el.style.display = 'block');
        let emblemaIzq = document.getElementById("emblema-izq"); let emblemaDer = document.getElementById("emblema-der");
        if (emblemaIzq && emblemaDer) { emblemaIzq.src = "assets/img/ui/cruz_trinidad.webp"; emblemaDer.src = "assets/img/ui/cruz_trinidad.webp"; }
        pantallaNombre();
    });
}

function pantallaNombre() {
    storyArea.innerHTML = ""; 
    limpiarBotones();

    if (typeof SistemaDialogos !== 'undefined') {
        SistemaDialogos.iniciarEscena({
            personajeImg: "assets/img/personajes/aliados/cabaini.webp", 
            nombrePersonaje: "CABALLERO TRINITARIO",
            texto: "Bienvenido, aspirante a la Cruz Bicolor. Antes de tomar los votos, dinos... ¿Cuál es tu nombre secular?",
            requiereInput: true,
            placeholderInput: "¿Por qué nombre te conocerá Dios?...",
            textoErrorVacio: "¡Un hombre no puede marchar a la Guerra Santa sin un nombre! Dinos quién eres para inscribirlo en las crónicas.",
            callback: function(nombreIngresado) {
                jugador.nombre = nombreIngresado; 
                actualizarHUD(); 
                pantallaJuramento(); 
            }
        });
    } else {
        agregarTexto("<b>Bienvenido, aspirante a la Cruz Bicolor.</b>", "mensaje-sistema");
        agregarTexto("Antes de tomar los votos, dinos...");
        agregarTexto("¿Cuál es tu nombre secular?");
        storyArea.innerHTML += `<input type="text" id="input-nombre" placeholder="¿Por qué nombre te conocerá Dios en el campo de batalla?..." autocomplete="off">`;
        storyArea.innerHTML += `<p id="error-nombre" class="txt-hereje" style="font-style:italic; display:none; margin-top:15px; text-align:center;">¡Un hombre no puede marchar a la Guerra Santa sin un nombre! Dinos quién eres para inscribirlo en las crónicas.</p>`;
        
        crearBoton("Aceptar", () => {
            let inputElement = document.getElementById("input-nombre"); let errorElement = document.getElementById("error-nombre");
            let nombreIngresado = inputElement.value.trim();
            if (nombreIngresado === "") { inputElement.style.borderColor = "#ff4c4c"; errorElement.style.display = "block"; return; }
            jugador.nombre = nombreIngresado; actualizarHUD(); pantallaJuramento(); 
        });
    }
}

async function pantallaJuramento() {
    storyArea.innerHTML = ""; limpiarBotones(); let n = jugador.nombre;
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/cabaini.webp", nombrePersonaje: "Caballero Trinitario", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"${n}, ponte de rodillas ante el Altar del Altísimo y bajo la mirada de la Corte Celestial, pon tu mano sobre el Evangelio y escucha el peso de tu corona de espinas. Jura, por la Sangre del Cordero y el Misterio de la Unidad Divina, que desde este instante dejas de pertenecerte a ti mismo para ser instrumento de la Gracia. ¿Juras defender la Fe de Pedro con el acero y el espíritu, sin que el miedo oxide tu hoja ni la soberbia nuble tu juicio?"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/cabaini.webp", nombrePersonaje: "Caballero Trinitario", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¿Juras observar el Voto del Tercio, consagrando la tercera parte de toda ganancia, honor y botín a la libertad de los hermanos que gimen bajo el yugo del infiel? ¿Juras, por la Cruz Roja de la Pasión y la Cruz Azul de la Esperanza que ahora marcas en tu pecho, que si el oro no bastara para romper las cadenas del cautivo, ofrecerás tu propia carne, tus propios años y tu propia libertad, entregándote a la esclavitud para que otro pueda volver a ver la luz de la cristiandad?"`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/cabaini.webp", nombrePersonaje: "Caballero Trinitario", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"No busques gloria para tu nombre, pues tu nombre muere hoy para renacer en la Orden. No busques tesoros en la tierra, pues tu tesoro es el alma que rescatas del abismo. Levántate, Caballero de la Trinidad. Que el Padre te sostenga, el Hijo te guíe y el Espíritu Santo sea tu escudo en la batalla.<br><br>Gloria Tibi Trinitas, et Captivis Libertas."`, claseTexto: "txt-lugarteniente"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${n}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"Acepto humildemente, con el favor de Dios y la Santísima Virgen María. Que mi sangre sea semilla de libertad."`, claseTexto: "txt-comandante"
    });

    pantallaIntroduccion();
}

function pantallaIntroduccion() {
    storyArea.innerHTML = ""; limpiarBotones();
    agregarTexto("<h3 class='txt-sagrado'>El Eco de las Cadenas: El Surgimiento de la Trinidad</h3>");
    agregarTexto("Año del Señor de 1198. El mundo conocido está fracturado. Mientras los reyes se disputan tierras y coronas, miles de almas olvidadas gimen bajo el peso de los grilletes. En las costas del Mediterráneo y las arenas del norte de África, el viento no solo trae sal, sino el lamento de los cautivos. Para el mundo, son solo moneda de cambio; para el olvido, son sombras.");
    agregarTexto("Pero no para los hijos de la Cruz Bicolor.");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b class='txt-sagrado'>El Pacto de los Maestros</b>");
    agregarTexto("En los bosques de Cerfroid, lejos del estruendo de las batallas, dos hombres forjaron un destino diferente. San Juan de Mata, un teólogo de visión inquebrantable, y San Félix de Valois, un ermitaño que halló a Dios en el silencio, recibieron un llamado que los reyes no pudieron escuchar: <i class='txt-accion'>“No busquen la gloria del acero, sino la libertad de los oprimidos”</i>.");
    agregarTexto("Bajo la bendición del Papa Inocencio III, fundaron la Orden de la Santísima Trinidad y de la Redención de Cautivos. No nacieron para conquistar reinos, sino para vaciar prisiones.");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b class='txt-sagrado'>El Voto de Sangre y Oro</b>");
    agregarTexto("Como caballero de esta orden, no solo portas una espada, sino una responsabilidad que pesaría sobre el alma de cualquier hombre común. Te riges por leyes inquebrantables que definen tu existencia:");
    agregarTexto("<ul><li><b>El Tercio de los Bienes:</b> Cada moneda de oro que encuentres, cada tesoro recuperado de las ruinas y cada diezmo recibido no te pertenece. Un tercio exacto debe ser consagrado exclusivamente al rescate. El lujo es tu enemigo; la libertad ajena, tu único botín.</li><li><b>El Cambio de Almas:</b> Esta es la prueba máxima de tu fe. Si el oro falla, si el captor es implacable y el cautivo desfallece, tienes el permiso —y el sagrado deber— de ofrecer tu propia libertad a cambio de la del prisionero. Serás esclavo para que otro sea libre. Serás sombra para que otro vea la luz.</li></ul>");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b class='txt-sagrado'>Tu Identidad: La Cruz Bicolor</b>");
    agregarTexto("Vistes el hábito de lana blanca, símbolo de pureza y sacrificio. Pero sobre tu pecho late el verdadero corazón de la orden: la Cruz Trinitaria.");
    agregarTexto("<ul><li>La barra vertical de color rojo, representando la pasión y la sangre derramada por la humanidad.</li><li>La barra horizontal de color azul, representando la serenidad celestial y la protección divina.</li></ul>");
    agregarTexto("Esta cruz es tu escudo y tu estandarte. En las tierras donde el nombre de tu Dios es susurrado con miedo, esta insignia es un faro de esperanza... o un recordatorio para los tiranos de que el rescate ha llegado.");
    
    const btnTut = document.createElement("button"); btnTut.innerText = "MANUALE MILITIS"; btnTut.className = "btn-tutorial"; btnTut.onclick = pantallaManual; actionArea.appendChild(btnTut);
    storyArea.scrollTop = 0;
}

async function pantallaManual() {
    storyArea.innerHTML = ""; limpiarBotones();
    inventarioDesbloqueado = true; tiendaDesbloqueada = true; 
    let flecha = document.getElementById("flecha-inventario"); if(flecha) flecha.style.display = "inline";

    jugador.liderazgo = 15; jugador.liderazgoBase = jugador.liderazgo; 
    jugador.denarios = Math.floor(Math.random() * 10) + 22; 
    
    jugador.vidas = 3; 
    if (jugador.liderazgo <= 9) { jugador.ataqueReal = 2; jugador.defensaReal = 2; } else if (jugador.liderazgo <= 15) { jugador.ataqueReal = 3; jugador.defensaReal = 2; } else { jugador.ataqueReal = 3; jugador.defensaReal = 3; }
    jugador.ataqueBase = jugador.ataqueReal; jugador.defensaBase = jugador.defensaReal;

    let cantCab = Math.floor(Math.random() * 3) + 3; 
    let cantBall = Math.floor(Math.random() * 3) + 5; 
    let cantPiq = Math.floor(Math.random() * 4) + 5; 
    
    agregarTropa("caballero_noble", cantCab); agregarTropa("ballestero_noble", cantBall); agregarTropa("piquero_noble", cantPiq);
    agregarTropa("sacerdote_unico", 1); agregarTropa("explorador_unico", 1); actualizarHUD();

    let scout = jugador.tropas.find(t => t.idTipo === "explorador_unico"); let nombreScout = scout ? scout.nombre : "El monje explorador";

    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>AUDIENCIA PAPAL</h2>");
    agregarTexto(`Comendador ${jugador.nombre}, os encontráis ante Su Santidad, el Papa Inocencio III, bajo las inmensas bóvedas de la Basílica de San Juan de Letrán. El Vicario de Cristo os observa con ojos que han visto caer imperios y levantarse mártires.`);
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Hijo mío, he designado a <b>Fray Bartolomé</b> y a <b>${nombreScout}</b> para que marchen a vuestro lado. Su labor será guiar el alma de vuestros hombres y los pasos de vuestra hueste."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Además, para proteger la fe, os entrego el mando de los pilares de nuestra cristiandad: <br><br><b>Sir Alexandro</b>, con ${cantCab} Caballeros Nobles.<br><b>Barón Andrew</b>, liderando a ${cantBall} Ballesteros Leales.<br><b>Conde JuanA</b>, al frente de ${cantPiq} Piqueros Inquebrantables."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Estos hombres son la verdadera élite de Europa. No buscan oro, sino limpiar sus pecados con la sangre del infiel."`, claseTexto: "txt-sagrado"
    });

    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/papInoIII.webp", nombrePersonaje: "Papa Inocencio III", alineacion: "izq", bordeClase: "borde-papa", nombreClase: "nombre-papa", retratoClase: "retrato-papa",
        texto: `"Sin embargo, la guerra es voraz y vuestro número, pequeño. Tomad también esta bolsa con <b>${jugador.denarios} denarios de plata</b>, fruto de las limosnas. Vos, Comendador ${jugador.nombre}, sois el encargado de terminar de forjar vuestra hueste. Afuera aguardan mercenarios dispuestos a vender su espada. Usad el oro con sabiduría."`, claseTexto: "txt-sagrado"
    });

    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>LA SENDA DE LA CRUZADA (Nuevas Reglas Tácticas):</b>");
    agregarTexto("A lo largo de vuestro peregrinaje, enfrentaréis emboscadas y pruebas del espíritu. Cada decisión moldeará el alma de vuestros hombres y el destino de la campaña.");
    agregarTexto("<div class='separador'>***</div>");
    agregarTexto("<b>INSTRUCCIONES DE CAMPAÑA (Manuale Militis Táctico):</b>");
    agregarTexto(`<b>1. Tu Ejército:</b> Tu hueste ahora se compone de unidades individuales (Revísalos haciendo click en "MI CAMPAÑA").`);
    agregarTexto(`<b>2. Nobles vs Mercenarios:</b> Los <b class="txt-sagrado">Nobles (Borde Dorado)</b> tienen mejores estadísticas iniciales y honor. Los <b class="txt-multitud">Mercenarios (Borde Gris)</b> lucharán a tu lado, pero sus atributos son menores y obedecen al tintineo de las monedas.`);
    agregarTexto(`<b>3. Sistema de Heridas (Permadeath):</b> Cada hombre tiene <b>2 Vidas (❤️)</b>. Cuando tu ejército pierda un enfrentamiento, uno de tus soldados sufrirá daño y perderá 1 Vida, quedando HERIDO. Un soldado herido lucha peor (-1 Ataque y Defensa). Si pierde su última vida, morirá permanentemente.`);
    agregarTexto(`<b>4. Los Denarios (💰):</b> Úsalos sabiamente en las plazas mercenarias o en la tienda para expandir tu ejército. Si te quedas sin tropas, la Cruzada fracasará.`);
    agregarTexto(`<b>5. La Fe/Liderazgo (🕊️):</b> Sigue siendo el núcleo moral. Tu devoción o caída en pecado afectará el desempeño de TODO tu ejército:
    <ul>
        <li class="txt-sagrado"><b>126 o más (Estado de Gracia):</b> Anuláis por completo el dado de furia del oponente.</li>
        <li class="mensaje-sistema"><b>101 a 125 (Fervor Celestial):</b> +2 a vuestro cálculo de Ataque y Defensa general.</li>
        <li class="mensaje-sistema"><b>76 a 100 (Bendición Divina):</b> +1 a vuestro cálculo de Ataque y Defensa general.</li>
        <li><b>0 a 75 (Fe Firme):</b> Combate normal. Sin bonos ni penas.</li>
        <li class="txt-hereje"><b>-1 a -10 (Incertidumbre):</b> -1 a vuestro cálculo de Ataque y Defensa general.</li>
        <li class="txt-hereje"><b>-11 a -20 (Fatiga del Espíritu):</b> -2 a vuestro cálculo de Ataque y Defensa general.</li>
        <li class="txt-hereje"><b>-50 o menos (Noche Oscura del Alma):</b> Perdéis el derecho a lanzar vuestro Dado de Gracia.</li>
    </ul>`);
    
    if (typeof iniciarReclutamiento === 'function') {
        crearBoton("SALIR A LA PLAZA (RECLUTAR)", iniciarReclutamiento);
    } else {
        crearBoton("INICIAR MARCHA", escena1);
    }
    storyArea.scrollTop = 0;
}

iniciarJuego();
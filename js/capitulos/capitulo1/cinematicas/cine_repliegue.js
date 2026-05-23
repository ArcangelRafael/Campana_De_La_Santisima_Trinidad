/* === CINE_REPLIEGUE.JS - CINEMÁTICA DE LA RETIRADA DE PICAS === */

function playCinematicaRepliegue(callbackFinal) {
    console.log("INICIANDO OPERACIÓN DE REPLIEGUE TÁCTICO...");
    
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) {
        console.error("CRÍTICO: No se encontró el contenedor animacion-escena1 en el DOM.");
        if (callbackFinal) callbackFinal();
        return;
    }

    animCaja.style.display = "block";
    
    // Mantenemos el fondo del nuevo escenario con zoom
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    
    // Título movido hacia arriba hacia la zona oscura
    animCaja.innerHTML = `<h3 class="txt-sagrado" style="text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">EL REPLIEGUE TÁCTICO</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    let elementosAnimar = [];

    // 1. DIBUJAR BALLESTEROS (Formación compacta en tierra firme)
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        
        let hpStars = "❤️".repeat(Math.max(0, ballestero.hp)) + "🖤".repeat(2 - Math.max(0, ballestero.hp));
        let etiqueta = ballestero.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${ballestero.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${ballestero.nombre} <br>${etiqueta}</div>`;

        let row = index % 3; 
        let col = Math.floor(index / 3); 
        
        // FIX TÁCTICO: Reducimos el multiplicador de columna a 8.5 para compactar la formación (caben más de 4 columnas)
        let leftPos = 34 - (col * 8.5); 
        let topPos = 23 + (row * 16);  

        card.style.top = `${topPos}%`;
        card.style.left = `${leftPos}%`;
        card.style.opacity = "0"; 
        card.style.transition = "opacity 2s ease";
        
        animCaja.appendChild(card);
        
        setTimeout(() => { card.style.opacity = "1"; }, 500);
    });

    // 2. DIBUJAR PIQUEROS (Retrocediendo a los flancos con Fila Profunda)
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        let hpStars = "❤️".repeat(Math.max(0, pica.hp)) + "🖤".repeat(2 - Math.max(0, pica.hp));
        let etiqueta = pica.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${pica.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${pica.nombre} <br>${etiqueta}</div>`;

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        
        // FIX 1: Lógica de Fila Profunda ajustada a 5 columnas por línea
        let col = posIndex % 5; // Horizontal: 0, 1, 2, 3, 4
        let depth = Math.floor(posIndex / 5); // Profundidad: 0 (frente), 1 (atrás), 2...
        
        // Ajustamos a 8% el espaciado para que quepan los 5 alineados sin chocar
        let finalLeft = 48 - (col * 8) - (depth * 3); 
        let finalTop = isTop ? 8 - (depth * 3) : 74 + (depth * 3); 

        // Para el efecto 3D, las tropas de atrás deben tener un z-index menor
        card.style.zIndex = 200 - depth;

        let startLeft = 55 + (Math.random() * 5); 
        let startTop = 40 + (Math.random() * 20); 

        card.style.top = `${startTop}%`;
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1";
        
        // Retirada pesada
        card.style.transition = `left 7s ease-out, top 7s ease-out`;
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `${finalLeft}%`;
            card.style.top = `${finalTop}%`;
        }, 800); 
    });

    // 3. DIBUJAR ENEMIGOS (La Horda)
    setTimeout(() => {
        let rowsTopEnemigos = ["28%", "46%", "64%"]; 
        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                let cardE = document.createElement("div");
                let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                
                let startLeftE = 110 + (c * 10); 
                let endLeftE = 62 + (c * 10); // Se detienen justo en la piedra

                cardE.style.top = rowsTopEnemigos[r];
                cardE.style.left = `${startLeftE}%`;
                cardE.style.filter = "sepia(50%) brightness(0.6)"; 
                cardE.style.transition = `left 8s linear, filter 8s linear`; 
                
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
                animCaja.appendChild(cardE);
                cardE.getBoundingClientRect(); 

                setTimeout(() => {
                    cardE.style.left = `${endLeftE}%`;
                    cardE.style.filter = "sepia(0%) brightness(0.9)"; 
                }, 50);
            }
        }
    }, 1500); 

    // 4. BOTÓN FINAL (DEUS LO VULT)
    setTimeout(() => {
        console.log("RENDERIZANDO BOTÓN FINAL DE CINEMÁTICA...");
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        
        // Botón empujado hacia abajo en la zona oscura
        impactBtn.style.bottom = "5px";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            
            // Restauramos los valores originales del puente para no afectar futuros asedios
            animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
            animCaja.style.backgroundSize = "cover";
            animCaja.style.backgroundPosition = "center bottom";
            
            if(callbackFinal) callbackFinal(); 
        };
        
        animCaja.appendChild(impactBtn);
    }, 8500); 
}
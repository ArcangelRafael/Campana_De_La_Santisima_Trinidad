/* === CINE_BOSQUE.JS - CINEMÁTICAS EXCLUSIVAS DEL BUCLE EN EL BOSQUE === */

function playCinematicaFormarMuroBosque(resultadoFormacion, callbackFinal) {
    console.log("ANIMANDO: PICAS AL FRENTE (BOSQUE)...");
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.innerHTML = `<h3 class="txt-sagrado" style="text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">¡A LA LÍNEA!</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    // 1. BALLESTEROS ESTÁTICOS EN RETAGUARDIA
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        
        let hpStars = "❤️".repeat(Math.max(0, ballestero.hp)) + "🖤".repeat(2 - Math.max(0, ballestero.hp));
        let etiqueta = ballestero.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${ballestero.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${ballestero.nombre} <br>${etiqueta}</div>`;

        let row = index % 3; let col = Math.floor(index / 3); 
        card.style.top = `${23 + (row * 16)}%`;
        card.style.left = `${34 - (col * 8.5)}%`;
        animCaja.appendChild(card);
    });

    // 2. PIQUEROS (Desde los costados hacia el frente)
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let mitadPiqueros = Math.ceil(piquerosVivos.length / 2);
    let c_arriba = 0; let c_abajo = 0;
    
    // Extraemos los IDs de los piqueros seleccionados para el muro
    let picasEnMuro = [];
    if(resultadoFormacion && resultadoFormacion.slots) {
        picasEnMuro = Object.values(resultadoFormacion.slots).filter(id => id !== null);
    }

    piquerosVivos.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        
        let hpStars = "❤️".repeat(Math.max(0, pica.hp)) + "🖤".repeat(2 - Math.max(0, pica.hp));
        let etiqueta = pica.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${pica.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${pica.nombre} <br>${etiqueta}</div>`;

        let isTop = index < mitadPiqueros;
        let posIndex = isTop ? c_arriba++ : c_abajo++;
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        // POSICIÓN INICIAL: Escondidos en los flancos laterales
        let sideLeft = 48 - (col * 8) - (depth * 3); 
        let sideTop = isTop ? 8 - (depth * 3) : 74 + (depth * 3); 

        card.style.left = `${sideLeft}%`;
        card.style.top = `${sideTop}%`;
        card.style.zIndex = 200 - depth;
        animCaja.appendChild(card);

        // MOVIMIENTO AL CENTRO: Si el jugador los eligió para la formación
        if (picasEnMuro.includes(pica.idUnico)) {
            let slotName = Object.keys(resultadoFormacion.slots).find(k => resultadoFormacion.slots[k] === pica.idUnico);
            let numSlot = parseInt(slotName.split("-")[1]); 
            
            let centerLeft = 52; // Al frente de los ballesteros
            let centerTop = 15 + (numSlot * 14); // Apilados verticalmente

            setTimeout(() => {
                card.style.transition = `left 3s cubic-bezier(0.25, 1, 0.5, 1), top 3s cubic-bezier(0.25, 1, 0.5, 1)`;
                card.style.left = `${centerLeft}%`;
                card.style.top = `${centerTop}%`;
                card.style.zIndex = 250 + numSlot; 
            }, 500);
        }
    });

    // 3. ENEMIGOS ESTÁTICOS A LA DERECHA
    let rowsTopEnemigos = ["28%", "46%", "64%"]; 
    for(let r=0; r < 3; r++) {
        for(let c=0; c < 3; c++) {
            let cardE = document.createElement("div");
            let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
            cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
            cardE.style.zIndex = "100"; 
            cardE.style.top = rowsTopEnemigos[r];
            cardE.style.left = `${62 + (c * 10)}%`;
            cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
            animCaja.appendChild(cardE);
        }
    }

    // BOTÓN DE CONTINUAR
    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        impactBtn.style.bottom = "5px";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
            animCaja.style.backgroundSize = "cover";
            animCaja.style.backgroundPosition = "center bottom";
            if(callbackFinal) callbackFinal(); 
        };
        animCaja.appendChild(impactBtn);
    }, 4000); // 4 segundos es suficiente para esta marcha hacia el frente
}

function playCinematicaRepliegueBosque(callbackFinal) {
    console.log("ANIMANDO: REPLIEGUE A LOS FLANCOS (BOSQUE)...");
    const animCaja = document.getElementById("animacion-escena1");
    if (!animCaja) { if(callbackFinal) callbackFinal(); return; }

    animCaja.style.display = "block";
    animCaja.style.backgroundImage = "url('assets/img/fondos/puentepiso.webp')";
    animCaja.style.backgroundSize = "160%"; 
    animCaja.style.backgroundPosition = "left center";
    animCaja.innerHTML = `<h3 class="txt-sagrado" style="text-shadow:0 0 10px #000; margin-top:5px; margin-bottom:0; text-align:center; letter-spacing:3px; position:relative; z-index:300;">ABRIR CAMPO DE TIRO</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    // 1. BALLESTEROS
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0);
    ballesterosVivos.forEach((ballestero, index) => {
        let card = document.createElement("div");
        let claseBorde = ballestero.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        let hpStars = "❤️".repeat(Math.max(0, ballestero.hp)) + "🖤".repeat(2 - Math.max(0, ballestero.hp));
        let etiqueta = ballestero.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${ballestero.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${ballestero.nombre} <br>${etiqueta}</div>`;
        let row = index % 3; let col = Math.floor(index / 3); 
        card.style.top = `${23 + (row * 16)}%`;
        card.style.left = `${34 - (col * 8.5)}%`;
        animCaja.appendChild(card);
    });

    // 2. PIQUEROS (Desde el centro hacia las posiciones seguras laterales)
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
        let col = posIndex % 5; let depth = Math.floor(posIndex / 5); 
        
        // Destino Final: Laterales Seguros
        let finalLeft = 48 - (col * 8) - (depth * 3); 
        let finalTop = isTop ? 8 - (depth * 3) : 74 + (depth * 3); 
        
        // Punto de Inicio: Esparcidos en el centro (simulando el choque recién terminado)
        let startLeft = 52 + (Math.random()*4);
        let startTop = 25 + (Math.random()*40);

        card.style.zIndex = 200 - depth;
        card.style.left = `${startLeft}%`;
        card.style.top = `${startTop}%`;
        animCaja.appendChild(card);

        setTimeout(() => {
            card.style.transition = `left 5s ease-out, top 5s ease-out`;
            card.style.left = `${finalLeft}%`;
            card.style.top = `${finalTop}%`;
        }, 500);
    });

    // 3. ENEMIGOS ESTÁTICOS
    let rowsTopEnemigos = ["28%", "46%", "64%"]; 
    for(let r=0; r < 3; r++) {
        for(let c=0; c < 3; c++) {
            let cardE = document.createElement("div");
            let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
            cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
            cardE.style.zIndex = "100"; 
            cardE.style.top = rowsTopEnemigos[r];
            cardE.style.left = `${62 + (c * 10)}%`;
            cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="transform:scaleX(-1);">`;
            animCaja.appendChild(cardE);
        }
    }

    // BOTÓN DE CONTINUAR
    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        impactBtn.style.bottom = "5px";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
            animCaja.style.backgroundSize = "cover";
            animCaja.style.backgroundPosition = "center bottom";
            if(callbackFinal) callbackFinal(); 
        };
        animCaja.appendChild(impactBtn);
    }, 6000); 
}
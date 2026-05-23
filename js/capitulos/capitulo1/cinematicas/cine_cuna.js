/* === CINE_CUNA.JS - CINEMÁTICA DE LA CARGA EN CUÑA === */

function playCinematicaCargaCuna(formacionInfo, callbackFinal) {
    const animCaja = document.getElementById("animacion-escena1");
    animCaja.style.display = "block";
    
    // FIX VISUAL: Título "LA CARGA DIVINA" eliminado por completo
    animCaja.innerHTML = "";

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    let elementosAnimar = [];
    let slots = formacionInfo.slots;
    let duracionCarga = 7000; 
    let cssTransition = `top ${duracionCarga}ms linear, left ${duracionCarga}ms linear, opacity 1s ease`;

    let hordaCompletaArr = [];
    let finalLeftColsEnemigos = ["70%", "80%", "90%"];
    let finalTopRowsEnemigos = ["10%", "28%", "46%", "64%", "82%"];

    for(let r=0; r < finalTopRowsEnemigos.length; r++) {
        for(let c=0; c < finalLeftColsEnemigos.length; c++) {
            let esPiqueroEnemigo = (r + c) % 2 === 0;
            hordaCompletaArr.push({
                top: finalTopRowsEnemigos[r],
                left: finalLeftColsEnemigos[c],
                img: esPiqueroEnemigo ? "enemigo_piquero.webp" : "enemigo.webp",
                id: `enemigo-cine-${r}-${c}`
            });
        }
    }
    
    hordaCompletaArr.forEach(e => {
        let card = document.createElement("div");
        card.className = "tropa-cinematica cinematica-enemigo"; 
        card.id = e.id;
        card.style.top = e.top;
        card.style.left = "88%"; 
        card.style.filter = "sepia(50%) brightness(0.5)"; 
        card.style.zIndex = "100";
        card.style.opacity = "0"; 

        card.innerHTML = `<img src="assets/img/personajes/enemigos/${e.img}">`;
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 
        elementosAnimar.push({ el: card, top: e.top, left: e.left, opacity: "1" });
    });

    let startPos = {
        "punta": { top: "80%", left: "-30%" },
        "media-arriba": { top: "10%", left: "-40%" },
        "media-abajo": { top: "60%", left: "-25%" },
        "trasera-arriba": { top: "30%", left: "-45%" },
        "trasera-abajo": { top: "90%", left: "-35%" }
    };

    let destPos = {
        "punta": { top: "43%", left: "55%" }, 
        "media-arriba": { top: "25%", left: "40%" },
        "media-abajo": { top: "61%", left: "40%" },
        "trasera-arriba": { top: "12%", left: "25%" }, 
        "trasera-abajo": { top: "74%", left: "25%" }  
    };

    for(let pos in slots) {
        let idTropa = slots[pos];
        if(idTropa) {
            let cab = jugador.tropas.find(t => t.idUnico === idTropa);
            if(cab) {
                let card = document.createElement("div");
                let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
                card.className = `tropa-cinematica ${claseBorde}`;
                card.style.zIndex = "250";
                
                let hpStars = "❤️".repeat(Math.max(0, cab.hp)) + "🖤".repeat(2 - Math.max(0, cab.hp));
                let etiqueta = cab.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
                card.innerHTML = `<img src="${cab.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${cab.nombre} <br>${etiqueta}</div>`;

                let inicial = startPos[pos] || { top: "50%", left: "-20%" };
                card.style.top = inicial.top; 
                card.style.left = inicial.left;
                card.style.opacity = "1"; 
                animCaja.appendChild(card);
                card.getBoundingClientRect(); 

                let destino = destPos[pos] || { top: "50%", left: "50%" };
                elementosAnimar.push({ el: card, top: destino.top, left: destino.left });
            }
        }
    }

    let reservas = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0 && !Object.values(slots).includes(t.idUnico));
    
    // FIX TÁCTICO: Lógica de 2 columnas exactas para evitar desbordes en Reservas
    let numMostrados = 0;
    reservas.forEach((cab, index) => {
        if (numMostrados >= 8) return; // Máximo 2 columnas de 4 (8 unidades visibles). El resto espera oculto.

        let col = Math.floor(numMostrados / 4);
        let row = numMostrados % 4;

        let card = document.createElement("div");
        let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150";
        
        let hpStars = "❤️".repeat(Math.max(0, cab.hp)) + "🖤".repeat(2 - Math.max(0, cab.hp));
        let etiqueta = cab.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${cab.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${cab.nombre} <br>${etiqueta}</div>`;

        let verticalPos = 20 + (row * 18);
        let startLeft = -35 + (col * 12);
        let endLeft = 5 + (col * 12);

        card.style.top = `${verticalPos}%`; 
        card.style.left = `${startLeft}%`; 
        card.style.opacity = "1"; 
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 
        elementosAnimar.push({ el: card, top: `${verticalPos}%`, left: `${endLeft}%` });
        numMostrados++;
    });

    setTimeout(() => {
        elementosAnimar.forEach(anim => {
            anim.el.style.transition = cssTransition; 
            anim.el.style.top = anim.top;
            anim.el.style.left = anim.left;
            if(anim.opacity) anim.el.style.opacity = anim.opacity;
        });
    }, 50);

    setTimeout(() => {
        document.querySelectorAll('.cinematica-enemigo').forEach(e => {
            e.style.animation = "clashFlash 0.3s infinite alternate";
            e.style.filter = "sepia(0%) brightness(1)";
        });
    }, duracionCarga - 400);

    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn";
        impactBtn.innerText = "DEUS LO VULT !";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            
            document.getElementById("formacion-overlay").style.display = "none"; 
            
            if(callbackFinal) callbackFinal(); 
        };
        
        animCaja.appendChild(impactBtn);

    }, duracionCarga);
}
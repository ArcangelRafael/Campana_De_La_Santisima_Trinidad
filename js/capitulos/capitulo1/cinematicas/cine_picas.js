/* === CINE_PICAS.JS - CINEMÁTICA DEL RELEVO DE PICAS === */

const GEOMETRIA_ANIM = {
    BRIDGE_TOP_LIMIT: 15, 
    BRIDGE_BOTTOM_LIMIT: 85, 
    BRIDGE_CENTER: 50, 
    LEFT_EXIT_LINE: -20, 
    RIGHT_ENTRY_LINE: 110, 
    LEFT_ENTRY_LINE: -10, 
    RIGHT_EXIT_LINE: 115, 
    DURACION_MARCHA_PASO: 9000, 
    CSS_MARCHA_PASO: '9s linear' 
};

function playCinematicaRelevoPicas(callbackFinal) {
    const animCaja = document.getElementById("animacion-escena1");
    animCaja.style.display = "block";
    
    animCaja.innerHTML = `<h3 style="color:#ffaa00; text-shadow:0 0 10px #000; margin-top:30px; text-align:center; letter-spacing:3px; position:relative; z-index:300;">EL RELEVO TÁCTICO</h3>`;

    let niebla = document.createElement("div");
    niebla.className = "efecto-neblina";
    animCaja.appendChild(niebla);

    if (window.marcadoresBatalla) {
        window.marcadoresBatalla.forEach(m => {
            let mk = document.createElement("div");
            mk.innerHTML = m.tipo === 'skull' ? '☠️' : '✝';
            mk.style.position = "absolute";
            mk.style.fontSize = "35px";
            mk.style.color = m.tipo === 'cross' ? "#c0c0c0" : "#fff";
            mk.style.textShadow = m.tipo === 'cross' ? "0 0 10px #fff" : "none";
            mk.style.opacity = "0.6"; 
            mk.style.zIndex = "5"; 
            
            let tops = [15, 32, 50, 68, 85];
            mk.style.top = `${tops[m.row]}%`;
            
            let cols = { "-3": 24, "-2": 36, "-1": 48, "0": 60, "1": 72, "2": 84 };
            mk.style.left = `${cols[m.col]}%`;
            
            animCaja.appendChild(mk);
        });
    }

    let caballerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0).slice(0, 5);
    
    let c_arriba = 0; 
    let c_abajo = 0;  
    let delayBaseCaballero = 100; 

    caballerosVivos.forEach((cab, index) => {
        let card = document.createElement("div");
        let claseBorde = cab.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "150"; 
        
        let hpStars = "❤️".repeat(Math.max(0, cab.hp)) + "🖤".repeat(2 - Math.max(0, cab.hp));
        let etiqueta = cab.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${cab.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${cab.nombre} <br>${etiqueta}</div>`;

        let isTop = index < 2; 
        let topPos = isTop ? 10 : 75; 
        
        let offsetX = isTop ? (c_arriba * 16) : (c_abajo * 16);
        if (isTop) c_arriba++; else c_abajo++;

        let startLeft = 110 + offsetX; 
        let endLeft = -60 + offsetX;   

        card.style.top = `${topPos}%`;
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1";
        card.style.filter = "grayscale(80%) sepia(20%)"; 
        
        card.style.transition = `left 8.5s linear, filter 8.5s linear`;
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `${endLeft}%`;
            card.style.filter = "grayscale(100%) brightness(0.7)";
        }, delayBaseCaballero);
    });

    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0);
    let picasActivas = piquerosVivos.filter(p => Object.values(slotsFormacionPicas).includes(p.idUnico));
    let picasReserva = piquerosVivos.filter(p => !Object.values(slotsFormacionPicas).includes(p.idUnico));

    let posicionesFinalesPicas = {
        "pica-1": { top: "35%", left: "30%" }, 
        "pica-2": { top: "65%", left: "30%" }, 
        "pica-3": { top: "20%", left: "45%" }, 
        "pica-4": { top: "50%", left: "45%" }  
    };

    let elementosPicas = [];

    picasActivas.forEach((pica, index) => {
        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "250"; 
        
        let hpStars = "❤️".repeat(Math.max(0, pica.hp)) + "🖤".repeat(2 - Math.max(0, pica.hp));
        let etiqueta = pica.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${pica.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${pica.nombre} <br>${etiqueta}</div>`;

        let startLeft = -10 - (index * 14); 
        card.style.top = "42%"; 
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1"; 
        card.style.filter = "sepia(80%)";
        card.style.transition = `left 4s linear, top 4s linear`; 
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        let finalPos = { top: "42%", left: `${5 - (index * 10)}%` }; 
        let slotName = Object.keys(slotsFormacionPicas).find(key => slotsFormacionPicas[key] === pica.idUnico);
        if (slotName && posicionesFinalesPicas[slotName]) {
            finalPos = posicionesFinalesPicas[slotName]; 
        }
        
        elementosPicas.push({ 
            el: card, 
            phase1Left: `${25 - (index * 14)}%`, 
            phase1Top: "42%", 
            phase2Left: finalPos.left,
            phase2Top: finalPos.top
        });
    });

    // FIX TÁCTICO: Lógica de 2 columnas exactas para evitar desbordes en Reservas de Picas
    let numMostrados = 0;
    picasReserva.forEach((pica, index) => {
        if (numMostrados >= 8) return; 

        let col = Math.floor(numMostrados / 4);
        let row = numMostrados % 4;

        let card = document.createElement("div");
        let claseBorde = pica.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        card.className = `tropa-cinematica ${claseBorde}`;
        card.style.zIndex = "200"; 
        
        let hpStars = "❤️".repeat(Math.max(0, pica.hp)) + "🖤".repeat(2 - Math.max(0, pica.hp));
        let etiqueta = pica.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
        card.innerHTML = `<img src="${pica.img}"><div class="unidad-hp-combate">${hpStars}</div><div class="unidad-nombre-aleatorio">${pica.nombre} <br>${etiqueta}</div>`;

        let startLeft = -40 - (col * 12); 
        let endLeft = 5 + (col * 12);
        let finalTop = 20 + (row * 18);

        card.style.top = `${finalTop}%`; 
        card.style.left = `${startLeft}%`;
        card.style.opacity = "1"; 
        card.style.filter = "sepia(80%)";
        card.style.transition = `left 5s ease-out`; 
        
        animCaja.appendChild(card);
        card.getBoundingClientRect(); 

        setTimeout(() => {
            card.style.left = `${endLeft}%`; 
            card.style.filter = "sepia(0%)";
        }, 50);

        numMostrados++;
    });

    setTimeout(() => {
        elementosPicas.forEach(anim => {
            anim.el.style.left = anim.phase1Left;
            anim.el.style.top = anim.phase1Top;
        });
    }, 50);

    setTimeout(() => {
        elementosPicas.forEach(anim => {
            anim.el.style.transition = `left 5s ease-out, top 5s ease-out, filter 5s linear`; 
            anim.el.style.left = anim.phase2Left;
            anim.el.style.top = anim.phase2Top;
            anim.el.style.filter = "sepia(0%)";
        });
    }, 4050); 

    setTimeout(() => {
        let rowsTopEnemigos = ["28%", "46%", "64%"]; 
        let c_cine_enemigo = 0;

        for(let r=0; r < 3; r++) {
            for(let c=0; c < 3; c++) {
                let cardE = document.createElement("div");
                let imgE = "enemigo.webp";
                
                cardE.className = "tropa-cinematica cinematica-enemigo-relevo"; 
                cardE.style.zIndex = "100"; 
                
                let startLeftE = 110 + (c * 14); 
                let endLeftE = 65 + (c * 14);   

                cardE.style.top = rowsTopEnemigos[r];
                cardE.style.left = `${startLeftE}%`;
                cardE.style.filter = "sepia(50%) brightness(0.6)"; 
                cardE.style.transition = `left 8s linear, filter 8s linear`; 
                
                cardE.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}">`;
                animCaja.appendChild(cardE);
                cardE.getBoundingClientRect(); 

                setTimeout(() => {
                    cardE.style.left = `${endLeftE}%`;
                    cardE.style.filter = "sepia(0%) brightness(0.9)"; 
                }, 50);
                c_cine_enemigo++;
            }
        }
    }, 600); 

    setTimeout(() => {
        let impactBtn = document.createElement('button');
        impactBtn.className = "impacto-divino-btn"; 
        impactBtn.innerText = "DEUS LO VULT !";
        
        impactBtn.onclick = function() {
            impactBtn.style.display = "none"; 
            animCaja.style.display = "none";
            animCaja.innerHTML = "";
            if(callbackFinal) callbackFinal(); 
        };
        
        animCaja.appendChild(impactBtn);
    }, 9000); 
}
/* === HACKTESTER.JS - HERRAMIENTAS DE DESARROLLADOR === */

function ht_checkInit() {
    if(!jugador.nombre || jugador.nombre === "Recluta Anónimo") {
        jugador.nombre = "Lord Tester";
        jugador.orden = "Santísima Trinidad";
        
        jugador.liderazgo = 0; 
        jugador.liderazgoBase = 0; 
        jugador.denarios = 0; 
        jugador.ataqueReal = 0;
        jugador.defensaReal = 0;
        jugador.ataqueBase = 0;
        jugador.defensaBase = 0;
        
        if(!jugador.tropas.find(t => t.idTipo === "explorador_unico")){
            agregarTropa("explorador_unico", 1);
        }
        
        if(jugador.tropas.filter(t => t.tipoGeneral === "caballeros").length === 0) {
            agregarTropa("caballero_noble", 5);
        }
        if(jugador.tropas.filter(t => t.tipoGeneral === "piqueros").length === 0) {
            agregarTropa("piquero_noble", 6);
        }
        if(jugador.tropas.filter(t => t.tipoGeneral === "ballesteros").length === 0) {
            agregarTropa("ballestero_noble", 9);
        }
    }
}

function ht_addTropa(tipo) {
    agregarTropa(tipo, 1);
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Añadido 1 " + tipo);
}

function ht_removeTropa(tipo) {
    if(jugador && jugador.tropas) {
        let indicesCompatibles = [];
        jugador.tropas.forEach((t, index) => {
            if(t.idTipo === tipo) indicesCompatibles.push(index);
        });

        if(indicesCompatibles.length > 0) {
            let randomIndex = indicesCompatibles[Math.floor(Math.random() * indicesCompatibles.length)];
            let removida = jugador.tropas.splice(randomIndex, 1)[0];
            
            if(typeof actualizarHUD === "function") actualizarHUD();
            console.log("HackTester: Eliminada 1 unidad de tipo " + tipo + " (" + removida.nombre + ")");
        } else {
            console.log("HackTester: No hay tropas de tipo " + tipo + " en la campaña para eliminar.");
        }
    }
}

function ht_addDenarios(cant) {
    jugador.denarios += cant;
    if (jugador.denarios < 0) jugador.denarios = 0; 
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Tesorería actualizada. Total: " + jugador.denarios);
}

function ht_modFe(cant) {
    jugador.liderazgo += cant;
    jugador.liderazgoBase += cant;
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Moral (Fe) actualizada. Total: " + jugador.liderazgo);
}

function ht_modVidasGeneral(cantidad) {
    if(jugador && jugador.tropas) {
        jugador.tropas.forEach(t => {
            t.hp += cantidad;
            if(t.hp > 2) t.hp = 2; 
            if(t.hp < 0) t.hp = 0; 
        });
        if(typeof actualizarHUD === "function") actualizarHUD();
        
        document.querySelectorAll('.tropa-draggable').forEach(el => {
            let id = el.id.replace('drag-', '');
            let tropa = jugador.tropas.find(tr => tr.idUnico === id);
            if (tropa) {
                let hpContainer = el.querySelector('.unidad-hp-combate');
                if (hpContainer) {
                    hpContainer.innerHTML = "❤️".repeat(Math.max(0, tropa.hp)) + "🖤".repeat(2 - Math.max(0, tropa.hp));
                }
            }
        });
        console.log("HackTester: Salud del ejército modificada en " + cantidad);
    }
}

function ht_jumpTo(destino) {
    ht_checkInit();
    
    document.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    if(typeof limpiarBotones === "function") limpiarBotones();
    let storyArea = document.getElementById("story-area");
    if(storyArea) storyArea.innerHTML = "";
    let formOverlay = document.getElementById("formacion-overlay");
    if(formOverlay) formOverlay.style.display = "none";
    
    let animCaja = document.getElementById("animacion-escena1");
    if(animCaja) {
         animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
         animCaja.style.backgroundSize = "cover";
         animCaja.style.backgroundPosition = "center bottom";
    }

    if(destino === 'opciones_cap1') {
        if(typeof mostrarOpcionesCapitulo1 === "function") mostrarOpcionesCapitulo1();
    } else if (destino === 'muro_picas') {
        if(typeof ruta_IA_Victoria_Cuna === "function") ruta_IA_Victoria_Cuna();
    } else if (destino === 'repliegue') {
        if(typeof nodo_IA_Victoria === "function") nodo_IA_Victoria();
    } else if (destino === 'bosque_victoria') {
        jugador.enemigosObjetivo = 50;
        jugador.enemigosAsesinados = 50;
        
        // FIX TÁCTICO: Se asegura de pasar el callback de la negociación y que este no falle
        if (typeof playCinematicaVictoria === 'function') {
            playCinematicaVictoria(iniciarParlamentoBosque);
        } else if (typeof iniciarParlamentoBosque === "function") {
            iniciarParlamentoBosque();
        }
    }
    
    let panel = document.getElementById('hacktester-panel');
    if(panel) panel.style.display='none';
}
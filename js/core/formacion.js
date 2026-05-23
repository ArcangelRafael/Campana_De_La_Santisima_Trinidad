/* === FORMACION.JS - SISTEMA DE DESPLIEGUE TÁCTICO === */

let tropaArrastrada = null;
let callbackPostFormacion = null;
let formacionModoActivo = "cuna"; 
let reposicionModo = false; 

let slotsFormacion = {
    "trasera-arriba": null, "trasera-abajo": null, "media-arriba": null, "media-abajo": null, "punta": null
};
let slotsFormacionPicas = {
    "pica-1": null, "pica-2": null, "pica-3": null, "pica-4": null
};

window.actualizarLabelTurnosPicas = function() {
    if (formacionModoActivo !== "picas") {
        let label = document.getElementById("label-turnos-picas");
        if(label) label.style.display = "none";
        return;
    }
    
    let picasCont = Object.values(slotsFormacionPicas).filter(id => id !== null).length;
    let puntos = {1:3, 2:6, 3:8, 4:12}[picasCont] || 0;
    
    // FIX TÁCTICO: Base de 48 PP (4 Turnos)
    let metaActual = (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.metaProgresoMuro) ? EstadoBatalla.metaProgresoMuro : 48;
    let progresoMuro = (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.progresoMuro) ? EstadoBatalla.progresoMuro : 0;
    
    let faltan = metaActual - progresoMuro;
    if (faltan < 0) faltan = 0; 
    
    let turnos = puntos > 0 ? Math.ceil(faltan / puntos) : "∞";

    let label = document.getElementById("label-turnos-picas");
    if (!label) {
        label = document.createElement("div");
        label.id = "label-turnos-picas";
        label.style.cssText = "position:absolute; top:20px; right:20px; background:rgba(0,0,0,0.8); border:1px solid #ffaa00; padding:10px; color:#ffaa00; font-weight:bold; font-size:16px; border-radius:5px; z-index:500; box-shadow:0 0 10px #000;";
        let tablero = document.getElementById("formacion-picas-tablero");
        if (tablero) tablero.appendChild(label);
    }
    label.style.display = "block";
    label.innerHTML = `🛡️ Turnos a aguantar: <span style='color:#fff;'>${turnos}</span>`;
};

function intentarAutoDespliegue() {
    let checkbox = document.getElementById("ht-auto-fill");
    if (!checkbox || !checkbox.checked) return;

    let slotsTarget = [];
    if (reposicionModo) {
        slotsTarget = Array.from(document.querySelectorAll(".slot-reposicion-activo"));
    } else {
        let idTablero = formacionModoActivo === "cuna" ? "formacion-tablero" : "formacion-picas-tablero";
        let tablero = document.getElementById(idTablero);
        slotsTarget = Array.from(tablero.querySelectorAll(".slot-formacion")).filter(s => s.style.pointerEvents !== "none");
    }

    let roster = document.getElementById("formacion-lista-tropas");
    let tropasDisponibles = Array.from(roster.querySelectorAll(".tropa-draggable"));

    tropasDisponibles.sort(() => Math.random() - 0.5);

    slotsTarget.forEach(slot => {
        if (slot.children.length === 0 && tropasDisponibles.length > 0) {
            let tropa = tropasDisponibles.pop(); 
            slot.appendChild(tropa);
            let idTropa = tropa.dataset.idTropa;

            if (!reposicionModo) {
                let targetSlots = formacionModoActivo === "cuna" ? slotsFormacion : slotsFormacionPicas;
                targetSlots[slot.dataset.pos] = idTropa;
            }
        }
    });

    actualizarLabelTurnosPicas();
}

function abrirFormacionReposicion(bajasArray, callback) {
    callbackPostFormacion = callback;
    reposicionModo = true;
    
    let tipoTropa = formacionModoActivo === "cuna" ? "caballeros" : "piqueros";
    let idTablero = formacionModoActivo === "cuna" ? "formacion-tablero" : "formacion-picas-tablero";
    
    document.getElementById("titulo-formacion").innerText = "REFORZAR LA LÍNEA";
    document.getElementById("titulo-roster").innerText = `🛡️ Reservas`;
    
    document.getElementById("formacion-roster").style.display = "block";
    document.getElementById("formacion-tablero").style.display = "none";
    document.getElementById("formacion-picas-tablero").style.display = "none";
    
    let tableroActivo = document.getElementById(idTablero);
    tableroActivo.style.display = "flex";
    tableroActivo.classList.remove("modo-combate");

    if (idTablero === "formacion-picas-tablero") {
        if (typeof EstadoBatalla !== 'undefined' && (EstadoBatalla.esBosque || EstadoBatalla.tipoCombate === "picas_bosque")) {
            tableroActivo.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('assets/img/fondos/puentepiso.webp')";
            tableroActivo.style.backgroundSize = "160%";
            tableroActivo.style.backgroundPosition = "left center";
        } else {
            tableroActivo.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('assets/img/fondos/puente_fondo.webp')";
            tableroActivo.style.backgroundSize = "cover";
            tableroActivo.style.backgroundPosition = "center bottom";
        }
    }

    document.getElementById("btn-iniciar-formacion").style.display = "inline-block";
    document.getElementById("btn-iniciar-formacion").innerText = "TERMINAR REEMPLAZO";
    document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
    document.getElementById("btn-ver-reporte").style.display = "none";

    document.querySelectorAll(`#${idTablero} .tropa-draggable`).forEach(el => el.remove());
    document.querySelectorAll(`#${idTablero} .skull-icon, #${idTablero} .cross-icon`).forEach(el => el.remove());

    initFormacionZonas();

    const slots = tableroActivo.querySelectorAll(".slot-formacion");
    slots.forEach(slot => {
        if (!slot.classList.contains('valid-start')) return; 
        
        let posName = slot.dataset.pos;
        let esBaja = bajasArray.find(b => b.slotPos === posName);
        let tropaViva = EstadoBatalla.tropasVivas.find(p => p.slotPos === posName && p.idUnico && p.hp > 0 && !p.ignorarMuerto);
        
        slot.innerHTML = ""; 
        slot.style.opacity = "1";
        
        if (esBaja) {
            if (formacionModoActivo === "cuna") {
                slotsFormacion[posName] = null;
            } else {
                slotsFormacionPicas[posName] = null;
            }

            slot.style.pointerEvents = "auto";
            slot.classList.add("slot-reposicion-activo");
            slot.style.border = "2px dashed #88ff88"; 
            slot.style.background = "rgba(136, 255, 136, 0.1)";
        } else if (tropaViva) {
            let tr = jugador.tropas.find(t => t.idUnico === tropaViva.idUnico);
            if (tr) {
                let claseBorde = tr.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
                let hpStars = "❤️".repeat(Math.max(0, tr.hp)) + "🖤".repeat(2 - Math.max(0, tr.hp));
                let etiqueta = tr.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
                
                let card = document.createElement("div");
                card.className = `soldier-frame tropa-draggable ${claseBorde}`;
                card.id = "drag-" + tr.idUnico; 
                card.dataset.idTropa = tr.idUnico;
                card.style.width = "100%"; card.style.height = "100%"; card.style.margin = "0"; card.style.cursor = "default";
                card.style.pointerEvents = "none"; 
                
                card.innerHTML = `
                    <img src="${tr.img}">
                    <div class="unidad-hp-combate" style="display:block !important;">${hpStars}</div>
                    <div class="unidad-nombre-aleatorio">${tr.nombre} <br>${etiqueta}</div>
                `;
                slot.appendChild(card);
            }
            slot.style.pointerEvents = "none";
            slot.classList.remove("slot-reposicion-activo");
            slot.style.border = "2px solid #555";
            slot.style.background = "rgba(0,0,0,0.8)";
        } else {
            slot.style.pointerEvents = "none";
            slot.style.opacity = "0.3";
            slot.style.border = "2px dashed rgba(255, 255, 255, 0.4)";
            slot.style.background = "rgba(0, 0, 0, 0.5)";
        }
    });

    generarRoster(tipoTropa); 
    if(formacionModoActivo === "picas") actualizarLabelTurnosPicas();
    document.getElementById("formacion-overlay").style.display = "flex";
    
    intentarAutoDespliegue();
}

function abrirFormacionCuna(callback) {
    callbackPostFormacion = callback;
    formacionModoActivo = "cuna";
    reposicionModo = false;
    slotsFormacion = { "trasera-arriba": null, "trasera-abajo": null, "media-arriba": null, "media-abajo": null, "punta": null };

    document.getElementById("titulo-formacion").innerText = "TÁCTICA: FORMACIÓN EN CUÑA";
    document.getElementById("titulo-roster").innerText = "🛡️ Caballeros";
    
    document.getElementById("formacion-roster").style.display = "block";
    document.getElementById("btn-ver-reporte").style.display = "none";
    
    if(typeof inyectarTableroCuna === 'function') inyectarTableroCuna();

    document.getElementById("formacion-tablero").style.display = "flex";
    document.getElementById("formacion-picas-tablero").style.display = "none";
    document.getElementById("btn-iniciar-formacion").style.display = "inline-block";
    document.getElementById("btn-iniciar-formacion").innerText = "SELLAR FORMACIÓN";
    document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
    
    let tableroCuna = document.getElementById("formacion-tablero");
    if(tableroCuna) tableroCuna.classList.remove("modo-combate");

    initFormacionZonas();

    document.querySelectorAll(".slot-formacion").forEach(s => { 
        s.style.opacity = "1"; 
        s.style.pointerEvents = "auto"; 
        s.style.border = ""; 
        s.style.background = ""; 
        s.classList.remove("slot-reposicion-activo"); 
    });

    limpiarTablero("zona-reservas", "#formacion-tablero .slot-formacion");
    generarRoster("caballeros");
    actualizarLabelTurnosPicas();
    document.getElementById("formacion-overlay").style.display = "flex";
    
    intentarAutoDespliegue();
}

function cerrarFormacionYCombatir() {
    document.getElementById("formacion-overlay").style.display = "none";
    document.getElementById("formacion-roster").style.display = "none"; 
    
    if (reposicionModo) {
        let reforzados = [];
        document.querySelectorAll(".slot-reposicion-activo").forEach(slot => {
            if (slot.children.length > 0) {
                let idNuevo = slot.children[0].id.replace("drag-", "");
                let tropaObj = jugador.tropas.find(t => t.idUnico === idNuevo);
                let posObj = EstadoBatalla.tropasVivas.find(p => p.slotPos === slot.dataset.pos);
                if (posObj && tropaObj) {
                    posObj.idUnico = idNuevo;
                    posObj.ignorarMuerto = false; 
                    reforzados.push(tropaObj);
                }
            }
        });
        reposicionModo = false;
        if(callbackPostFormacion) callbackPostFormacion(reforzados);
    } else {
        if (formacionModoActivo === "cuna") {
            let formacionInfo = { total: 0, puntaEsNoble: false, todaNobleza: true, nombreLider: null, vacios: 5, slots: { ...slotsFormacion } };
            for(let pos in slotsFormacion){
                if(slotsFormacion[pos] !== null) {
                    formacionInfo.total++; formacionInfo.vacios--; 
                    let tropaObj = jugador.tropas.find(t => t.idUnico === slotsFormacion[pos]);
                    if(tropaObj) {
                        if (tropaObj.clase !== "noble") formacionInfo.todaNobleza = false;
                        if(pos === "punta") {
                            formacionInfo.nombreLider = tropaObj.nombre;
                            if(tropaObj.clase === "noble") formacionInfo.puntaEsNoble = true;
                        }
                    }
                }
            }
            if (formacionInfo.total === 0) formacionInfo.todaNobleza = false;
            if(callbackPostFormacion) callbackPostFormacion(formacionInfo);
        }
    }
}

function abrirFormacionPicas(callback) {
    callbackPostFormacion = callback;
    formacionModoActivo = "picas";
    reposicionModo = false;
    slotsFormacionPicas = { "pica-1": null, "pica-2": null, "pica-3": null, "pica-4": null };

    document.getElementById("titulo-formacion").innerText = "TÁCTICA: MURO DE PICAS";
    document.getElementById("titulo-roster").innerText = "🛡️ Piqueros";

    document.getElementById("formacion-roster").style.display = "block";
    document.getElementById("btn-ver-reporte").style.display = "none";
    
    if(typeof inyectarTableroPicas === 'function') inyectarTableroPicas();

    document.getElementById("formacion-tablero").style.display = "none";
    document.getElementById("formacion-picas-tablero").style.display = "flex";
    document.getElementById("btn-iniciar-formacion").style.display = "none";
    document.getElementById("btn-iniciar-formacion-picas").style.display = "inline-block";
    
    let tableroPicas = document.getElementById("formacion-picas-tablero");
    if(tableroPicas) {
        tableroPicas.classList.remove("modo-combate");
        
        if (typeof EstadoBatalla !== 'undefined' && (EstadoBatalla.esBosque || EstadoBatalla.tipoCombate === "picas_bosque")) {
            tableroPicas.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('assets/img/fondos/puentepiso.webp')";
            tableroPicas.style.backgroundSize = "160%";
            tableroPicas.style.backgroundPosition = "left center";
        } else {
            tableroPicas.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('assets/img/fondos/puente_fondo.webp')";
            tableroPicas.style.backgroundSize = "cover";
            tableroPicas.style.backgroundPosition = "center bottom";
        }
    }

    initFormacionZonas();

    document.querySelectorAll(".slot-formacion").forEach(s => { 
        s.style.opacity = "1"; 
        s.style.pointerEvents = "auto"; 
        s.style.border = ""; 
        s.style.background = ""; 
        s.classList.remove("slot-reposicion-activo"); 
    });

    limpiarTablero("zona-reservas-picas", "#formacion-picas-tablero .slot-formacion");
    generarRoster("piqueros");
    actualizarLabelTurnosPicas();
    document.getElementById("formacion-overlay").style.display = "flex";
    
    intentarAutoDespliegue();
}

function cerrarFormacionPicas() {
    document.getElementById("formacion-roster").style.display = "none";
    document.getElementById("formacion-picas-tablero").style.display = "none";
    document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
    document.getElementById("formacion-overlay").style.display = "none";
    
    let formacionInfo = { total: 0, vacios: 4, todaNobleza: true, slots: { ...slotsFormacionPicas } };
    for(let pos in slotsFormacionPicas){
        if(slotsFormacionPicas[pos] !== null) { 
            formacionInfo.total++; formacionInfo.vacios--; 
            let tropaObj = jugador.tropas.find(t => t.idUnico === slotsFormacionPicas[pos]);
            if (tropaObj && tropaObj.clase !== "noble") formacionInfo.todaNobleza = false;
        }
    }
    if (formacionInfo.total === 0) formacionInfo.todaNobleza = false;
    
    if(callbackPostFormacion) callbackPostFormacion(formacionInfo);
}

function generarRoster(tipo) {
    const roster = document.getElementById("formacion-lista-tropas");
    roster.innerHTML = "";
    
    let tropas = jugador.tropas.filter(t => {
        let esCorrecto = t.tipoGeneral === tipo && t.hp > 0;
        let yaDesplegada = EstadoBatalla.tropasVivas.some(p => p.idUnico === t.idUnico && t.hp > 0 && !p.ignorarMuerto);
        return esCorrecto && (!reposicionModo || !yaDesplegada); 
    });

    if(tropas.length === 0) {
        roster.innerHTML = `<p style='color:#ff4c4c; font-style:italic;'>No tienes reservas de ${tipo} aptas.</p>`;
    }

    tropas.forEach(t => {
        let card = document.createElement("div");
        let claseBorde = t.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        
        card.className = `soldier-frame tropa-draggable ${claseBorde}`;
        card.draggable = true; 
        card.id = "drag-" + t.idUnico;
        card.dataset.idTropa = t.idUnico;
        
        let etiqueta = t.clase === 'noble' ? "<span style='color:#ffaa00; font-size:9px;'>(N)</span>" : "";
        let hpStars = "❤️".repeat(Math.max(0, t.hp)) + "🖤".repeat(2 - Math.max(0, t.hp));
        
        card.innerHTML = `
            <img src="${t.img}">
            <div class="unidad-hp-combate" style="display:block !important;">${hpStars}</div>
            <div class="unidad-nombre-aleatorio">${t.nombre} <br>${etiqueta}</div>
        `;

        card.addEventListener('dragstart', (e) => {
            tropaArrastrada = t;
            e.dataTransfer.setData('text/plain', t.idUnico);
            setTimeout(() => card.style.opacity = '0.5', 0);
        });
        card.addEventListener('dragend', (e) => {
            card.style.opacity = '1'; tropaArrastrada = null;
        });

        roster.appendChild(card);
    });
}

function limpiarTablero(idReservas, querySlots) {
    let zonaReservas = document.getElementById(idReservas);
    if (zonaReservas) { zonaReservas.innerHTML = ""; zonaReservas.style.display = "none"; }
    document.querySelectorAll(".invisible-slot").forEach(slot => { slot.innerHTML = ""; });
    document.querySelectorAll(querySlots).forEach(slot => { slot.innerHTML = ""; slot.classList.remove("over"); });
}

function initFormacionZonas() {
    const slots = document.querySelectorAll(".slot-formacion");
    const rosterZona = document.getElementById("formacion-roster");

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => { 
            if (slot.style.pointerEvents !== "none") { e.preventDefault(); slot.classList.add('over'); }
        });
        slot.addEventListener('dragleave', e => slot.classList.remove('over'));
        
        slot.addEventListener('drop', e => {
            if (slot.style.pointerEvents === "none") return;
            
            e.preventDefault();
            slot.classList.remove('over');
            const id = e.dataTransfer.getData('text/plain');
            const elemento = document.getElementById("drag-" + id);
            
            if (elemento) {
                if (slot.children.length > 0) { rosterZona.querySelector("#formacion-lista-tropas").appendChild(slot.children[0]); }
                slot.appendChild(elemento);

                let targetSlots = formacionModoActivo === "cuna" ? slotsFormacion : slotsFormacionPicas;
                for(let pos in targetSlots){ if(targetSlots[pos] === id) targetSlots[pos] = null; }
                targetSlots[slot.dataset.pos] = id;
                actualizarLabelTurnosPicas();
            }
        });
    });

    rosterZona.addEventListener('dragover', e => e.preventDefault());
    rosterZona.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const elemento = document.getElementById("drag-" + id);
        if(elemento){
            rosterZona.querySelector("#formacion-lista-tropas").appendChild(elemento);
            let targetSlots = formacionModoActivo === "cuna" ? slotsFormacion : slotsFormacionPicas;
            for(let pos in targetSlots){ if(targetSlots[pos] === id) targetSlots[pos] = null; }
            actualizarLabelTurnosPicas();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initFormacionZonas();
});
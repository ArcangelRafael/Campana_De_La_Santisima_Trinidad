/* === NODO_CUNA.JS - LÓGICA EXCLUSIVA DE CABALLERÍA PESADA === */

async function iniciarCombateCuna(formacion, callbackFinalizar) {
    EstadoBatalla.limpiar(); 
    EstadoBatalla.tipoCombate = "cuna";
    window.marcadoresBatalla = []; 

    EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "caballeros" && t.hp > 0 && !Object.values(formacion.slots).includes(t.idUnico));
    EstadoBatalla.maxTurnos = CONSTANTES_TACTICAS.CUNA_MAX_TURNOS;
    EstadoBatalla.callback = callbackFinalizar;
    
    EstadoBatalla.tropasVivas = [
        { row: 0, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS, posNombre: "el ala izquierda", slotPos: "trasera-arriba", idUnico: formacion.slots["trasera-arriba"] },
        { row: 1, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, posNombre: "el flanco izquierdo", slotPos: "media-arriba", idUnico: formacion.slots["media-arriba"] },
        { row: 2, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_PUNTA, posNombre: "la vanguardia", slotPos: "punta", idUnico: formacion.slots["punta"] },
        { row: 3, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_MEDIAS, posNombre: "el flanco derecho", slotPos: "media-abajo", idUnico: formacion.slots["media-abajo"] },
        { row: 4, col: CONSTANTES_TACTICAS.COLUMNA_INICIO_TRASERAS, posNombre: "el ala derecha", slotPos: "trasera-abajo", idUnico: formacion.slots["trasera-abajo"] }
    ];

    EstadoBatalla.enemigos = GeneradorHordas.generarMatrizCuna();

    storyArea.innerHTML = "";
    
    prepararBotonTurno(); 
    animarDialogoAvanceCuna();
}

async function animarDialogoAvanceCuna() {
    let divDialogo = document.createElement("div");
    storyArea.appendChild(divDialogo);

    // Muestra el recuadro VN, y cuando el jugador presiona SIGUIENTE, inicia la animación.
    await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
        personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", 
        nombrePersonaje: "Sir Alexandro", alineacion: "izq", 
        bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
        texto: `"¡El clamor de las trompetas nos llama a la gloria! ¡Turno ${EstadoBatalla.turnoActual}! ¡A LA CARGA!"`, 
        claseTexto: "txt-lugarteniente"
    });

    animarAvanceCuna();
}

function animarAvanceCuna() {
    document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');
    
    requestAnimationFrame(() => {
        document.getElementById("formacion-overlay").style.display = "flex"; 
        
        let tablero = document.getElementById("formacion-tablero");
        tablero.style.display = "flex"; 
        tablero.classList.add("modo-combate");

        document.getElementById("btn-iniciar-formacion").style.display = "none";
        document.getElementById("btn-ver-reporte").style.display = "none";
        document.getElementById("titulo-formacion").innerText = `⚔️ COMBATE: TURNO ${EstadoBatalla.turnoActual} ⚔️`;

        restaurarVisualesCombate();

        EstadoBatalla.logTurnoGlobal = [];
        EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlCabeceraTurno(EstadoBatalla.turnoActual));
        
        EstadoBatalla.accionesPendientes = [];
        let domUpdates = [];

        EstadoBatalla.tropasVivas.forEach(pos => {
            if(pos.idUnico) {
                let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
                if(tropa && tropa.hp > 0 && !pos.ignorarMuerto) {
                    let nextCol = pos.col + 1;
                    let accion = { tropa, pos, nextCol, tipo: "avance", enemigo: null };

                    if (nextCol >= 0 && nextCol <= 2) {
                        let enemigo = EstadoBatalla.enemigos[pos.row][nextCol];
                        if (enemigo && !enemigo.muerto) {
                            accion.tipo = "choque";
                            accion.enemigo = enemigo;
                        }
                    } else if (nextCol === 3) { accion.tipo = "ruptura"; } 
                    else if (nextCol > 3) { accion.tipo = "avance_libre"; }
                    
                    EstadoBatalla.accionesPendientes.push(accion);
                    domUpdates.push({ accion, idUnico: tropa.idUnico, row: pos.row, nextCol });
                }
            }
        });

        domUpdates.forEach(update => {
            let knightEl = document.getElementById("drag-" + update.idUnico);
            if (knightEl) {
                knightEl.classList.remove("caballero-ocupando");
                let visualCol = update.nextCol > 3 ? 3 : update.nextCol;
                let targetId = (visualCol < 0) ? `aliado-${update.row}-${visualCol}` : `enemigo-${update.row}-${visualCol}`;
                let targetSlot = document.getElementById(targetId);
                if(targetSlot) {
                    targetSlot.appendChild(knightEl);
                    knightEl.style.display = "block";
                    if (update.accion.tipo === "choque") {
                        knightEl.classList.add("caballero-atacando"); 
                        targetSlot.classList.add("en-combate"); 
                    } else {
                        knightEl.classList.add("caballero-ocupando");
                    }
                }
            }
        });
        
        document.getElementById("btn-tirar-dados").onclick = resolverDadosVisualesCuna;
        document.getElementById("btn-tirar-dados").style.display = "inline-block";
    });
}

function resolverDadosVisualesCuna() {
    document.getElementById("btn-tirar-dados").style.display = "none";
    let infoFe = obtenerEstadoFe();
    let huboCombates = false;
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.accionesPendientes.forEach(acc => {
        let { tropa, pos, nextCol, tipo, enemigo } = acc;
        let knightEl = document.getElementById("drag-" + tropa.idUnico);
        let visualCol = nextCol > 3 ? 3 : nextCol;
        let targetSlotId = `enemigo-${pos.row}-${visualCol}`;
        let targetSlot = document.getElementById(targetSlotId);

        if (tipo === "choque") {
            huboCombates = true;
            let combatSlot = document.getElementById(`aliado-${pos.row}-${pos.col}`);
            if(combatSlot) combatSlot.classList.remove("en-combate"); 
            
            let penalidad = (tropa.hp < 2) ? 1 : 0;
            let stringHerido = penalidad > 0 ? ` <span class="txt-hereje">-1 (Herido)</span>` : "";
            let dadoGracia = (jugador.liderazgo <= -50) ? 0 : tirarDado();
            let dadoFuria = (jugador.liderazgo >= 126) ? 0 : tirarDado();
            
            let pAtk = (tropa.atkMax - penalidad) + dadoGracia + infoFe.mod;
            let pDef = enemigo.def + dadoFuria;

            let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
            let classMod = (infoFe.mod >= 0) ? "mensaje-sistema" : "txt-hereje";
            if (infoFe.mod === 0) classMod = "txt-sagrado";

            let idBc = 'bc_' + Math.random().toString(36).substr(2,9);
            let idBcMelee = idBc + '_melee';
            let phase1Cons = "";
            let hasMelee = false;

            if (pAtk > pDef) {
                enemigo.muerto = true;
                EstadoBatalla.bajasEnemigas++;
                phase1Cons = `<span class="mensaje-sistema">¡IMPACTO LETAL! La carga abate al infiel.</span>`;
                pos.col = nextCol;
                window.marcadoresBatalla.push({tipo: 'skull', row: pos.row, col: pos.col});
            } else {
                hasMelee = true;
                phase1Cons = `<span class="txt-hereje">¡Resistencia enemiga! Duelo cuerpo a cuerpo inminente.</span>`;
            }

            let dataRender = {
                posNombre: pos.posNombre, tropaNombre: tropa.nombre, enemigoNombre: enemigo.nombre,
                atkBase: tropa.atkMax, stringHerido, dadoGracia, classMod, signoMod, infoFeNombre: infoFe.nombre, pAtk,
                defBase: enemigo.def, dadoFuria, pDef, phase1Cons, idBc, hasMelee, idBcMelee, autoCombat
            };

            let logStr = RenderCombate.htmlChoqueCuna(dataRender);

            if (hasMelee) {
                let dadoGracia2 = (jugador.liderazgo <= -50) ? 0 : tirarDado();
                let dadoFuria2 = (jugador.liderazgo >= 126) ? 0 : tirarDado();
                let pAtk2 = (tropa.atkMax - penalidad) + dadoGracia2 + infoFe.mod;
                let pAtkEnemigo = enemigo.atk + dadoFuria2;
                let phase2Cons = "";

                if (pAtk2 > pAtkEnemigo) {
                    enemigo.muerto = true;
                    EstadoBatalla.bajasEnemigas++;
                    phase2Cons = `<span class="mensaje-sistema">¡${tropa.nombre} se impone en la refriega!</span>`;
                    pos.col = nextCol;
                    window.marcadoresBatalla.push({tipo: 'skull', row: pos.row, col: pos.col});
                } else {
                    tropa.hp--;
                    phase2Cons = `<span class="txt-hereje">¡RECHAZADO! ${tropa.nombre} es herido.</span>`;
                    if(tropa.hp <= 0) {
                        phase2Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL CAMPO! ${tropa.nombre} ha muerto.</div>`;
                        window.marcadoresBatalla.push({tipo: 'cross', row: pos.row, col: pos.col});
                    }
                }

                let dataMelee = {
                    tropaNombre: tropa.nombre, atkBase: tropa.atkMax, stringHerido, dadoGracia2, classMod, signoMod, 
                    infoFeNombre: infoFe.nombre, pAtk2, enemigoNombre: enemigo.nombre, atkEnemigoBase: enemigo.atk, 
                    dadoFuria2, pAtkEnemigo, phase2Cons, idBcMelee, autoCombat
                };

                logStr += RenderCombate.htmlMeleeCuna(dataMelee);
            }
            EstadoBatalla.logTurnoGlobal.push(logStr);

        } else if (tipo === "avance") {
            pos.col = nextCol;
            EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlAvanceLibre(tropa.nombre));
        }
    });

    if(!huboCombates) EstadoBatalla.logTurnoGlobal.push("<p class='txt-multitud'>No hubo choques de acero. Las tropas se reposicionan.</p>");
    
    document.querySelectorAll(".en-combate").forEach(el => el.classList.remove("en-combate"));
    generarResumenFinTurnoLog(EstadoBatalla.turnoActual, EstadoBatalla.logTurnoGlobal);
    EstadoBatalla.turnoActual++;
    
    if(typeof cerrarMesaDeGuerra === 'function') cerrarMesaDeGuerra();
}
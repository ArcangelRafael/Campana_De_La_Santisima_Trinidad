/* === SISTEMA_DADOS.JS - ANIMACIONES Y RESOLUCIÓN VISUAL === */

let timeoutVideoGlobal = null;
window.isRollingDados = false; 
window.isRollingAll = false;

window.resolverDadosBloque = function(btn, idBloque, isAutoAll = false) {
    if (window.isRollingDados && !isAutoAll) return; 
    
    let bloque = document.getElementById(idBloque);
    if (!bloque) return;

    if (!isAutoAll) window.isRollingDados = true; 

    btn.style.display = "none";
    let zonaVideo = bloque.querySelector('.video-zona');
    
    let alDadoEl = bloque.querySelector('.dado-hide.al-dado');
    let enDadoEl = bloque.querySelector('.dado-hide.en-dado');
    
    let valAl = alDadoEl ? alDadoEl.dataset.val : null;
    let valEn = enDadoEl ? enDadoEl.dataset.val : null;

    // FIX TÁCTICO VISUAL: Construimos el HTML completo antes de inyectarlo para evitar 
    // que el navegador destruya y reinicie el primer video al intentar sumar el segundo.
    let videosHTML = "";
    
    if (valAl !== null && valAl !== "0") {
        videosHTML += `<video src="assets/video/${valAl}.webm" autoplay muted class="dado-video-ui"></video>`;
    }
    if (valEn !== null && valEn !== "0") {
        videosHTML += `<video src="assets/video/${valEn}.webm" autoplay muted class="dado-video-ui video-enemigo"></video>`;
    }

    zonaVideo.innerHTML = videosHTML;

    setTimeout(() => {
        bloque.querySelectorAll('.dado-hide').forEach(el => {
            el.innerText = el.dataset.val;
            el.classList.remove('dado-hide');
            el.classList.add('dado-reveal');
        });
        
        bloque.querySelectorAll('.total-hide').forEach(el => {
            el.innerText = el.dataset.val;
            el.classList.remove('total-hide');
            el.classList.add('total-reveal');
        });

        let cons = bloque.querySelector('.consecuencia-hide');
        if (cons) {
            cons.style.display = 'block';
            if(!cons.querySelector('.pendiente-dados')) {
                cons.classList.add('txt-animado-salto');
            }
        }

        bloque.classList.remove('pendiente-dados');
        bloque.classList.remove('rolling');
        bloque.style.borderLeft = "4px solid #88ff88"; 
        
        let nextBlockId = bloque.dataset.nextBlock;
        if (nextBlockId) {
            let nextBlock = document.getElementById(nextBlockId);
            if (nextBlock) {
                nextBlock.style.display = "block";
                nextBlock.classList.add('txt-animado-salto');
            }
        }

        if (document.querySelectorAll('.pendiente-dados').length === 0) {
            document.querySelectorAll('.resumen-oculto').forEach(el => {
                el.style.display = 'block';
                el.classList.add('txt-animado-salto');
            });

            document.querySelectorAll('.victoria-oculta').forEach(el => {
                el.style.display = 'flex';
                el.classList.remove('victoria-oculta');
                el.classList.add('txt-animado-salto');
            });

            let actionArea = document.getElementById('action-area');
            if (actionArea) {
                actionArea.style.display = ''; 
                actionArea.classList.add('txt-animado-salto');
            }
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 150);
        }
        
        if (!isAutoAll) window.isRollingDados = false; 
        
    }, 2200); 
};

window.tirarTodosLosDados = function(btnAll) {
    if (btnAll) btnAll.style.display = 'none';
    window.isRollingAll = true;

    let checkInterval = setInterval(() => {
        let pendings = document.querySelectorAll('.pendiente-dados');
        if (pendings.length === 0) {
            clearInterval(checkInterval);
            window.isRollingAll = false;
            return;
        }
        
        pendings.forEach(p => {
            let btn = p.querySelector('.btn-lanzar-dados');
            if (btn && !p.classList.contains('rolling')) {
                p.classList.add('rolling'); 
                resolverDadosBloque(btn, p.id, true);
            }
        });
    }, 500); 
};

window.resolverDadosBosque = function(btn, idBloque, isAutoAll = false) {
    if (window.isRollingDados && !isAutoAll) return; 
    
    let bloque = document.getElementById(idBloque);
    if (!bloque) return;

    if (!isAutoAll) window.isRollingDados = true; 

    let overlay = bloque.querySelector('.hover-lanzar-overlay');
    if (overlay) overlay.style.display = 'none';
    
    let zonaVideo = bloque.querySelector('.video-zona');
    
    let alDadoEl = bloque.querySelector('.dado-hide'); 
    let valAl = alDadoEl ? alDadoEl.dataset.val : null;

    zonaVideo.innerHTML = "";
    if (valAl !== null && valAl !== "0") {
        zonaVideo.innerHTML = `<video src="assets/video/${valAl}.webm" autoplay muted class="dado-video-ui" style="width:50px; height:50px; box-shadow: 0 0 10px #0ff;"></video>`;
    }

    setTimeout(() => {
        bloque.querySelectorAll('.dado-hide').forEach(el => {
            el.innerText = el.dataset.val;
            el.classList.remove('dado-hide');
            el.classList.add('dado-reveal');
        });
        
        let cons = bloque.querySelector('.consecuencia-hide');
        if (cons) {
            cons.style.display = 'inline-block';
            cons.classList.add('txt-animado-salto');
        }

        bloque.classList.remove('pendiente-dados');
        bloque.classList.remove('rolling');
        
        if (document.querySelectorAll('.pendiente-dados').length === 0) {
            document.querySelectorAll('.resumen-oculto').forEach(el => {
                el.style.display = 'block';
                el.classList.add('txt-animado-salto');
            });
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 150);
        }
        
        if (!isAutoAll) window.isRollingDados = false; 
        
    }, 2200);
};

window.tirarTodosLosDadosBosque = function(btnAll) {
    if (btnAll) btnAll.style.display = 'none';
    window.isRollingAll = true;

    let pendings = document.querySelectorAll('.pendiente-dados');
    pendings.forEach(p => {
        let btn = p.querySelector('.btn-lanzar-dados');
        if (btn && !p.classList.contains('rolling')) {
            p.classList.add('rolling'); 
            resolverDadosBosque(btn, p.id, true);
        }
    });
    
    let checkInterval = setInterval(() => {
        if (document.querySelectorAll('.pendiente-dados').length === 0) {
            clearInterval(checkInterval);
            window.isRollingAll = false;
        }
    }, 500);
};

window.verificarCombatesPendientes = function() {
    let autoCheck = document.getElementById("ht-auto-combat");
    if (autoCheck && autoCheck.checked) return true;

    let pendientes = document.querySelectorAll('.pendiente-dados');
    if (pendientes.length > 0) {
        pendientes.forEach(p => {
            p.style.boxShadow = "0 0 20px #ffaa00";
            setTimeout(() => p.style.boxShadow = "none", 800);
        });
        pendientes[0].scrollIntoView({behavior: "smooth", block: "center"});
        
        if (!document.getElementById('alerta-dados')) {
            let alertBox = document.createElement('div');
            alertBox.id = "alerta-dados";
            alertBox.className = "txt-hereje txt-animado-salto";
            alertBox.style.cssText = "text-align:center; font-weight:bold; font-size:18px; margin:10px 0;";
            alertBox.innerText = "¡Comandante, debes resolver los enfrentamientos primero!";
            pendientes[0].parentNode.insertBefore(alertBox, pendientes[0]);
            setTimeout(() => alertBox.remove(), 2500);
        }
        return false; 
    }
    return true; 
};
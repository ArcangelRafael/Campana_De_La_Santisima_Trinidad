/* === INVENTARIO.JS - GESTIÓN DEL MORRAL === */

function abrirInventario() {
    document.getElementById("dropdown-hud").style.display = "none";
    const overlay = document.getElementById("inventario-overlay");
    const contenedor = document.getElementById("inv-contenido");
    
    if (musicaActual && musicaActual.id !== "bgm-inventario") {
        musicaActual.pause();
        musicaPausadaInventario = musicaActual;
    }
    musicaActual = document.getElementById("bgm-inventario");
    if (musicaActual) {
        musicaActual.volume = 0.4;
        musicaActual.play();
    }

    contenedor.innerHTML = "";
    if (jugador.inventario.length === 0) {
        contenedor.innerHTML = "<p class='txt-multitud' style='margin-top: 50px;'>Tu morral está vacío.</p>";
    } else {
        let grid = document.createElement("div");
        grid.className = "grid-items";
        
        let conteoItems = {};
        jugador.inventario.forEach(idItem => {
            if (conteoItems[idItem]) {
                conteoItems[idItem]++;
            } else {
                conteoItems[idItem] = 1;
            }
        });

        for (let idItem in conteoItems) {
            let cantidad = conteoItems[idItem];
            let item = bdObjetos[idItem];
            
            if(item) {
                let card = document.createElement("div");
                card.className = "item-card";
                card.innerHTML = `
                    <img src="${item.img}" alt="${item.nombre}">
                    <div style="margin-top:10px;">${item.nombre}</div>
                    <div class="txt-comendador item-cantidad">x${cantidad}</div>
                `;
                card.onclick = () => abrirDetalleInventario(item, idItem);
                grid.appendChild(card);
            }
        }
        
        contenedor.appendChild(grid);
    }
    
    overlay.style.display = "flex";
}

function cerrarInventario() {
    document.getElementById("inventario-overlay").style.display = "none";
    
    if (musicaActual) {
        musicaActual.pause();
    }
    
    if (musicaPausadaInventario) {
        musicaActual = musicaPausadaInventario;
        musicaActual.play();
        musicaPausadaInventario = null;
    }
}

function abrirDetalleInventario(item, idItem) {
    const overlay = document.getElementById("detalle-inv-overlay");
    document.getElementById("det-inv-nombre").innerText = item.nombre;
    document.getElementById("det-inv-img").src = item.img;
    document.getElementById("det-inv-lore").innerText = `"${item.lore}"`;
    document.getElementById("det-inv-efecto").innerText = `Efecto: ${item.efectoTexto}`;
    
    const acciones = document.getElementById("det-inv-acciones");
    acciones.innerHTML = ""; 
    
    let btnUsar = document.createElement("button");
    btnUsar.innerText = "USAR OBJETO";
    btnUsar.style.borderColor = "#4c88ff";
    btnUsar.onclick = () => usarObjeto(item, idItem);
    
    let reembolso = Math.floor(item.precio * 0.40);
    let btnVender = document.createElement("button");
    btnVender.innerText = `VENDER (💰 ${reembolso})`;
    btnVender.style.borderColor = "#ff4c4c";
    btnVender.onclick = () => venderObjeto(item, idItem, reembolso);
    
    acciones.appendChild(btnUsar);
    acciones.appendChild(btnVender);
    
    overlay.style.display = "flex";
}

function cerrarDetalleInventario() {
    document.getElementById("detalle-inv-overlay").style.display = "none";
}

function usarObjeto(item, idItem) {
    if(item.efectos.ataqueReal) {
        jugador.ataqueReal += item.efectos.ataqueReal;
        jugador.ataqueBase += item.efectos.ataqueReal; 
    }
    if(item.efectos.liderazgoBase) {
        jugador.liderazgoBase += item.efectos.liderazgoBase;
        jugador.liderazgo += item.efectos.liderazgoBase;
    }
    
    let index = jugador.inventario.indexOf(idItem);
    if (index !== -1) {
        jugador.inventario.splice(index, 1);
    }
    
    actualizarHUD();
    cerrarDetalleInventario();
    abrirInventario(); 
    
    alert(`Has utilizado: ${item.nombre}. Tus estadísticas han mejorado permanentemente.`);
}

function venderObjeto(item, idItem, reembolso) {
    jugador.denarios += reembolso;
    
    let index = jugador.inventario.indexOf(idItem);
    if (index !== -1) {
        jugador.inventario.splice(index, 1);
    }
    
    actualizarHUD();
    cerrarDetalleInventario();
    abrirInventario(); 
}
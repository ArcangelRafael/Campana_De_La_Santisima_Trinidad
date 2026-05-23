/* === GENERADOR_HORDAS.JS - SISTEMA DINÁMICO DE ENEMIGOS === */

const GeneradorHordas = {
    obtenerEnemigo: function(tipo) {
        // Extrae un clon limpio de la base de datos
        return {...statsEnemigos[tipo]};
    },

    generarMatrizCuna: function(dificultad = 1) {
        let horda = [];
        // La cuña enfrenta 5 filas y 3 columnas
        for (let row = 0; row < 5; row++) {
            let filaEnemiga = [];
            for (let col = 0; col < 3; col++) {
                let tipo = "cuerpo";
                // Probabilidades tácticas
                if (col === 0) tipo = (Math.random() < 0.8) ? "piquero" : "cuerpo";
                else if (col === 1) tipo = (Math.random() < 0.5) ? "piquero" : "cuerpo";
                else tipo = "cuerpo";
                
                filaEnemiga.push(this.obtenerEnemigo(tipo));
            }
            horda.push(filaEnemiga);
        }
        return horda;
    },

    obtenerEnemigoPicas: function() {
        // Enemigo individual para el asedio a los muros
        return this.obtenerEnemigo("cuerpo");
    }
};
/* === TRIBULACIONES.JS - CANASTA DE EVENTOS ALEATORIOS === */

const canastaTribulaciones = [
    {
        titulo: "El Falso Inocente",
        texto: "Vuestra campaña marcha firme mientras la tropa entona solemne 'Media Vita in Morte Sumus'. De repente, a lo lejos, observáis a un niño desharrapado que llora y suplica vuestra ayuda para alcanzar un fruto de las ramas altas de un viejo roble. Sus ojos ruegan caridad.",
        opciones: [
            {
                texto: "Romper filas y ayudar al niño",
                costo: 0,
                resultado: () => {
                    jugador.defensaBase = Math.max(0, jugador.defensaBase - 1);
                    actualizarHUD();
                    return "<span class='txt-hereje'>[-1 Defensa Base]</span><br><br>¡Era una emboscada! Al acercaros, el niño huye con burla y de la espesura silba una lluvia de flechas paganas. Vuestros hombres alzan los escudos, mas la formación se ha roto temporalmente.<br><br><span class='txt-accion'>[Lección: La caridad es virtud divina, mas en tierras de herejes, la disciplina castrense es el escudo de tu hueste. No te fíes de las sombras.]</span>";
                }
            },
            {
                texto: "Mantener la marcha y la disciplina",
                costo: 0,
                resultado: () => {
                    return "<span class='mensaje-sistema'><b>[Disciplina Mantenida. Sin bajas]</b></span><br><br>Das la orden inquebrantable de ignorar el ruego y mantener la formación de escudos cerrada. El niño, viendo frustrado su engaño, saca una navaja herrumbrada y profiere maldiciones. Tus ballesteros, preparados, disparan un certero tiro de advertencia que lo hace huir despavorido.<br><br><span class='txt-accion'>[Lección: El buen juicio militar ha preservado la sangre de tus hermanos. Ya habrá un momento de paz para ejercer la caridad.]</span>";
                }
            }
        ]
    },
    {
        titulo: "El Mercader de Reliquias Falsas",
        texto: "Un buhonero andrajoso se acerca a tu columna de marcha. Con ojos brillantes, asegura tener una astilla de la 'Vera Cruz' y la ofrece a cambio de 10 denarios de plata. Tus soldados, agotados, miran el objeto con esperanza; un objeto sagrado podría renovar sus ánimos para la batalla. Sin embargo, sospechas que es madera común de un olivo cercano.",
        opciones: [
            {
                texto: "Comprar la reliquia (10 denarios)",
                costo: 10,
                resultado: () => {
                    jugador.denarios -= 10;
                    jugador.liderazgo += 9;
                    jugador.ataqueBase = Math.max(0, jugador.ataqueBase - 2);
                    actualizarHUD();
                    return "<span class='mensaje-sistema'><b>[+9 Fe/Liderazgo]</b></span> <br><span class='txt-hereje'><b>[-10 Denarios, -2 Ataque Base]</b></span><br><br>Buena idea darles ese consuelo; a veces el corazón necesita un símbolo, aunque sea incierto. Ahora tus hombres marchan cantando salmos, aunque tus arcas pesen menos. San Luis IX de Francia entendería tu deseo de honrar lo sagrado, aunque te advertiría sobre la astucia de los hombres.";
                }
            },
            {
                texto: "Reprender y exponer el fraude",
                costo: 0,
                resultado: () => {
                    jugador.ataqueBase += 3;
                    jugador.denarios += 100;
                    jugador.liderazgo -= 20;
                    actualizarHUD();
                    return "<span class='mensaje-sistema'><b>[+3 Ataque, +100 Denarios ahorrados/confiscados]</b></span> <br><span class='txt-hereje'><b>[-20 Fe/Liderazgo]</b></span><br><br>Has preferido la verdad sobre el consuelo fácil. Tus soldados ahora confían más en sus brazos que en amuletos. Santo Tomás de Aquino estaría orgulloso de tu uso de la razón, pues la fe no debe basarse en engaños, sino en la verdad firme.";
                }
            }
        ]
    },
    {
        titulo: "El Carro de la Viuda en el Paso",
        texto: "En un sendero estrecho, el carro de una viuda local ha perdido una rueda, bloqueando el paso de tus suministros. El tiempo apremia para llegar al campamento antes del anochecer. Tus sargentos sugieren simplemente empujar el carro al barranco para despejar el camino rápidamente y mantener la formación.",
        opciones: [
            {
                texto: "Ayudar a reparar el carro",
                costo: 0,
                resultado: () => {
                    jugador.defensaBase += 3;
                    jugador.ataqueBase = Math.max(0, jugador.ataqueBase - 3);
                    actualizarHUD();
                    return "<span class='mensaje-sistema'><b>[+3 Defensa Base]</b></span> <br><span class='txt-hereje'><b>[-3 Ataque Base]</b></span><br><br>Buena idea ayudar a la mujer; un caballero de la Trinidad debe ser primero un servidor. Ahora la viuda reza por tus hombres y la población local ve en ti a un libertador, no a un opresor. San Martín de Tours estaría orgulloso de tu compañía, pues él mismo dividió su capa para vestir al necesitado, priorizando la caridad sobre el rango.";
                }
            },
            {
                texto: "Despejar el camino a la fuerza",
                costo: 0,
                resultado: () => {
                    jugador.denarios += 10;
                    jugador.liderazgo -= 10;
                    actualizarHUD();
                    return "<span class='mensaje-sistema'><b>[+10 Denarios recuperados]</b></span> <br><span class='txt-hereje'><b>[-10 Fe/Liderazgo]</b></span><br><br>Has mantenido la eficiencia militar y el horario de marcha, pero a costa de la piedad. El camino está despejado, pero el corazón de tus hombres se ha vuelto un poco más de piedra.";
                }
            }
        ]
    },
    {
        titulo: "La Taberna del Blasfemo",
        texto: "Tus hombres descansan en una aldea fronteriza. De repente, escuchas gritos en la taberna: un ex-soldado amargado está insultando públicamente el nombre de Dios y la misión de las Cruzadas delante de tus reclutas más jóvenes. La situación podría escalar a una riña violenta o sembrar la duda en tus filas.",
        opciones: [
            {
                texto: "Intervenir con la palabra",
                costo: 0,
                resultado: () => {
                    jugador.liderazgo += 15;
                    jugador.defensaBase = Math.max(0, jugador.defensaBase - 2);
                    actualizarHUD();
                    return "<span class='mensaje-sistema'><b>[+15 Fe/Liderazgo]</b></span> <br><span class='txt-hereje'><b>[-2 Defensa Base]</b></span><br><br>Buena idea usar la retórica; la espada convence al cuerpo, pero la palabra convierte el alma. Ahora tus reclutas admiran tu convicción y el blasfemo ha quedado mudo de vergüenza. San Antonio de Padua estaría orgulloso, pues su lengua era tan poderosa que incluso los peces parecían escuchar sus sermones cuando los hombres le daban la espalda.";
                }
            },
            {
                texto: "Imponer castigo físico (20 denarios)",
                costo: 20,
                resultado: () => {
                    jugador.defensaBase += 3;
                    jugador.liderazgo -= 5;
                    jugador.denarios -= 20;
                    actualizarHUD();
                    return "<span class='mensaje-sistema'><b>[+3 Defensa Base]</b></span> <br><span class='txt-hereje'><b>[-5 Fe/Liderazgo, -20 Denarios]</b></span><br><br>Has cortado el problema de raíz mediante la fuerza, manteniendo el orden público. Sin embargo, has dejado una semilla de rencor en la aldea y miedo en tus hombres. Has ganado silencio, pero no respeto.";
                }
            }
        ]
    }
];
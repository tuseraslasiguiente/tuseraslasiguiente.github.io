
// Data objectiu: 23 d'octubre de 2028 a les 00:00, hora local.
const dataObjectiu = new Date(2028, 9, 23, 0, 0, 0);

// Inici fix per calcular el progres.
const dataInici = new Date(2026, 7, 1, 0, 0, 0);

var dataActualProva = null;
// Exemples de proves:
// dataActualProva = new Date(2026, 9, 1, 0, 0, 0);  // Inici: 0%
// dataActualProva = new Date(2027, 9, 1, 12, 30, 0); // Un any després
// dataActualProva = new Date(2028, 9, 22, 23, 59, 55); // 5 segons abans
// dataActualProva = new Date(2028, 9, 23, 0, 0, 0);   // Objectiu assolit
// dataActualProva = new Date(2028, 9, 24, 0, 0, 0);   // Després de l'objectiu

const comptadorPrincipal = document.querySelector('.temps-principal');
const comptadorHeader = document.querySelector('.comptador-header');
const barraProgres = document.querySelector('.barra-progres');
const valorBarra = document.querySelector('.barra-progres-valor');

const elementSegons = document.querySelector('#segons');
const elementMinuts = document.querySelector('#minuts');
const elementHores = document.querySelector('#hores');
const elementDies = document.querySelector('#dies');
const elementSetmanes = document.querySelector('#setmanes');

function formatarTemps(valor, singular, plural) {
    return `${valor} ${valor === 1 ? singular : plural}`;
}

function calcularTemps(dataActual, dataFinal) {
    let cursor = new Date(dataActual);
    let anys = 0;
    let mesos = 0;

    while (true) {
        const seguent = new Date(cursor);
        seguent.setFullYear(seguent.getFullYear() + 1);

        if (seguent > dataFinal) {
            break;
        }

        cursor = seguent;
        anys++;
    }

    while (true) {
        const seguent = new Date(cursor);
        seguent.setMonth(seguent.getMonth() + 1);

        if (seguent > dataFinal) {
            break;
        }

        cursor = seguent;
        mesos++;
    }

    let segonsRestants = Math.max(0, Math.floor((dataFinal - cursor) / 1000));

    const dies = Math.floor(segonsRestants / 86400);
    segonsRestants %= 86400;

    const hores = Math.floor(segonsRestants / 3600);
    segonsRestants %= 3600;

    const minuts = Math.floor(segonsRestants / 60);
    const segons = segonsRestants % 60;

    const parts = [];

    if (anys > 0) parts.push(formatarTemps(anys, 'año', 'años'));
    if (mesos > 0) parts.push(formatarTemps(mesos, 'mes', 'meses'));
    if (dies > 0) parts.push(formatarTemps(dies, 'día', 'días'));

    parts.push(formatarTemps(hores, 'hora', 'horas'));
    parts.push(formatarTemps(minuts, 'minuto', 'minutos'));
    parts.push(formatarTemps(segons, 'segundo', 'segundos'));

    return {
        text: parts.slice(0, -1).join(', ') + ' y ' + parts.at(-1),
        segonsTotals: Math.max(0, Math.floor((dataFinal - dataActual) / 1000))
    };
}

function actualitzarComptador() {
    const ara = dataActualProva ? new Date(dataActualProva) : new Date();
    const tempsRestant = calcularTemps(ara, dataObjectiu);

    comptadorPrincipal.textContent = tempsRestant.text;
    comptadorHeader.textContent = tempsRestant.text;

    elementSegons.textContent = tempsRestant.segonsTotals.toLocaleString('es-ES');
    elementMinuts.textContent = Math.floor(tempsRestant.segonsTotals / 60).toLocaleString('es-ES');
    elementHores.textContent = Math.floor(tempsRestant.segonsTotals / 3600).toLocaleString('es-ES');
    elementDies.textContent = Math.floor(tempsRestant.segonsTotals / 86400).toLocaleString('es-ES');
    elementSetmanes.textContent = Math.floor(tempsRestant.segonsTotals / 604800).toLocaleString('es-ES');

    const duradaTotal = dataObjectiu - dataInici;
    const tempsTranscorregut = ara - dataInici;

    let progres = Math.max(0, Math.min(100, tempsTranscorregut / duradaTotal * 100));
    if (progres > 99 && progres < 100) progres = 99;

    valorBarra.style.width = `${progres}%`;
    barraProgres.setAttribute('aria-valuenow', progres.toFixed(2));

    if (ara >= dataObjectiu) {
        comptadorPrincipal.textContent = '¡Ha llegado el día!';
        comptadorHeader.textContent = '¡Ha llegado el día!';
    }
}

// Mostrar el comptador a la capçalera en fer scroll.
function actualitzarCapcalera() {
    comptadorHeader.classList.toggle('mostrar-comptador', window.scrollY > 500);
}

window.addEventListener('scroll', actualitzarCapcalera, { passive: true });

actualitzarComptador();
actualitzarCapcalera();

setTimeout(() => {
    actualitzarComptador();
    setInterval(actualitzarComptador, 1000);
}, 1000 - (Date.now() % 1000));



// Afegir sticker Cyn //
document.getElementById('sticker-cyn').src = `/assets/stickers-cyn/${Math.floor(Math.random() * 41) + 1}.png`;


// Ver más (sorpresa) //
function verMas() {
    if (document.getElementById('blue-lobster')) return;

    const susto = document.createElement('div');
    susto.id = 'blue-lobster';
    susto.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: black;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const imagen = document.createElement('img');
    imagen.src = '/assets/preguntes/sorpresa/blue-lobster.jpg';
    imagen.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
    `;

    const audio = new Audio('/assets/preguntes/sorpresa/blue-lobster.mp3');
    audio.volume = 1;

    susto.appendChild(imagen);
    document.body.appendChild(susto);

    let eliminat = false;

    function netejar() {
        if (eliminat) return;
        eliminat = true;
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute('src');
        audio.load();
        susto.remove();

        // Mostrar text perdó //
        document.getElementById("perdo-volum-baix").style.display = "block";
    }

    audio.addEventListener('ended', netejar, { once: true });
    audio.addEventListener('error', netejar, { once: true });

    audio.play().catch(netejar);

    setTimeout(netejar, 4650);
}


function clickBotoVerMas(_this) {
    $(_this).parent().hide();
    $(_this).parent().parent().find('.resposta').last().show();
}


// Comprovar si s'ha reproduit la cançó //
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.querySelector('.lletra-canco audio');
    const aviso = document.querySelector('.no-ha-escoltat-canco');
    const pregunta = document.querySelector('.ha-escoltat-canco');

    if (!audio || !aviso || !pregunta) return;

    // Estat inicial
    aviso.style.display = '';
    pregunta.style.display = 'none';

    // Quan l'àudio arriba als 15 segons
    audio.addEventListener('timeupdate', () => {
        if (audio.currentTime >= 15) {
            aviso.style.display = 'none';
            pregunta.style.display = '';
        }
    });
});

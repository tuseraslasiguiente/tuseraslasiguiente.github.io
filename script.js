
// Data objectiu: 23 d'octubre de 2028 a les 00:00, hora local.
const dataObjectiu = new Date(2028, 9, 23, 0, 0, 0);

// Inici fix per calcular el progres.
const dataInici = new Date(2026, 9, 1, 0, 0, 0);

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
    comptadorHeader.classList.toggle('mostrar-comptador', window.scrollY > 300);
}

window.addEventListener('scroll', actualitzarCapcalera, { passive: true });

actualitzarComptador();
actualitzarCapcalera();
setInterval(actualitzarComptador, 1000);

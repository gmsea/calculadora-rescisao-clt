// ===== MENU =====
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', function () {
    menu.classList.toggle('active');
});

document.addEventListener('click', function (event) {
    if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
        menu.classList.remove('active');
    }
});


// ===== CAMPOS =====
const salarioInput = document.querySelector('#salario');
const dataContratacaoInput = document.querySelector('#dataContratacao');
const dataDispensaInput = document.querySelector('#dataDispensa');
const tipoDemissaoSelect = document.querySelector('#tipoDemissao');
const avisoPrevioSelect = document.querySelector('#avisoPrevio');
const feriasVencidasSelect = document.querySelector('#feriasVencidas');
const saldoFgtsInput = document.querySelector('#saldoFgts');
const diasTrabalhadosInput = document.querySelector('#diasTrabalhados');
const btnCalcular = document.querySelector('#btnCalcular');
const resultadoFinal = document.querySelector('#resultadoFinal');


// ===== FUNÇÃO FORMATAR MOEDA =====
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}


// ===== CALCULAR RESCISÃO =====
btnCalcular.addEventListener('click', function () {

    const salario = Number(salarioInput.value);
    const saldoFgts = Number(saldoFgtsInput.value) || 0;
    const diasTrabalhados = Number(diasTrabalhadosInput.value) || 0;
    const tipoDemissao = tipoDemissaoSelect.value;
    const avisoPrevio = avisoPrevioSelect.value;
    const feriasVencidas = feriasVencidasSelect.value;

    if (salario <= 0) {
        alert("Preencha o salário corretamente.");
        return;
    }

    if (!dataContratacaoInput.value || !dataDispensaInput.value) {
        alert("Preencha as datas corretamente.");
        return;
    }

    const dataContratacao = new Date(dataContratacaoInput.value);
    const dataDispensa = new Date(dataDispensaInput.value);

    if (dataDispensa <= dataContratacao) {
        alert("Data de dispensa deve ser maior que a de contratação.");
        return;
    }

    // ===== CÁLCULO DE MESES TRABALHADOS (PROFISSIONAL) =====
    let totalMesesTrabalhados =
        (dataDispensa.getFullYear() - dataContratacao.getFullYear()) * 12 +
        (dataDispensa.getMonth() - dataContratacao.getMonth());

    if (dataDispensa.getDate() >= 15) {
        totalMesesTrabalhados += 1;
    }

    if (totalMesesTrabalhados < 0) {
        totalMesesTrabalhados = 0;
    }

    // ===== SALDO DE SALÁRIO =====
    const saldoSalario = (salario / 30) * diasTrabalhados;

    // ===== AVISO PRÉVIO =====
    let valorAviso = 0;

    if (tipoDemissao === "Sem justa causa" && avisoPrevio === "Sim") {

        const anosCompletos = Math.floor(totalMesesTrabalhados / 12);
        let diasAviso = 30 + (anosCompletos * 3);

        if (diasAviso > 90) {
            diasAviso = 90;
        }

        valorAviso = (salario / 30) * diasAviso;
    }

    // ===== 13º PROPORCIONAL =====
    let meses13 = dataDispensa.getMonth() + 1;

    if (dataDispensa.getDate() < 15) {
        meses13 -= 1;
    }

    if (meses13 < 0) {
        meses13 = 0;
    }

    const decimoTerceiro = (salario / 12) * meses13;

    // ===== FÉRIAS PROPORCIONAIS =====
    const mesesUltimoPeriodo = totalMesesTrabalhados % 12;
    const feriasProporcionais = (salario / 12) * mesesUltimoPeriodo;
    const adicionalFerias = feriasProporcionais / 3;

    // ===== FÉRIAS VENCIDAS =====
    let valorFeriasVencidas = 0;
    if (feriasVencidas === "Sim") {
        valorFeriasVencidas = salario + (salario / 3);
    }

    // ===== MULTA FGTS =====
    let multaFgts = 0;
    if (tipoDemissao === "Sem justa causa") {
        multaFgts = saldoFgts * 0.4;
    }

    // ===== TOTAL =====
    const total =
        saldoSalario +
        valorAviso +
        decimoTerceiro +
        feriasProporcionais +
        adicionalFerias +
        valorFeriasVencidas +
        multaFgts;

    // ===== RESULTADO DETALHADO =====
    resultadoFinal.innerHTML = `
<h3>Resumo da Rescisão</h3>

<p>
<span>Saldo de salário</span>
<span>${saldoSalario.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
</p>

<p>
<span>Aviso prévio</span>
<span>${valorAviso.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
</p>

<p>
<span>13º proporcional</span>
<span>${decimoTerceiro.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
</p>

<p>
<span>Férias proporcionais</span>
<span>${feriasProporcionais.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
</p>

<p>
<span>1/3 de férias</span>
<span>${adicionalFerias.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
</p>

<p>
<span>Férias vencidas</span>
<span>${valorFeriasVencidas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
</p>

<p>
<span>Multa FGTS (40%)</span>
<span>${multaFgts.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
</p>

<h2>Total: ${total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</h2>
`;
});

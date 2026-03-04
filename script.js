const menuBtnc = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
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

menuBtnc.addEventListener('click', function() {
    menu.classList.toggle('active');
})

document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !menuBtnc.contains(event.target)) {
        menu.classList.remove('active');
    }
})

btnCalcular.addEventListener('click', function () {
    const salario = Number(salarioInput.value);
    const saldoFgts = Number(saldoFgtsInput.value);
    const diasTrabalhados = Number(diasTrabalhadosInput.value);
    const tipoDemissao = tipoDemissaoSelect.value;
    const avisoPrevio = avisoPrevioSelect.value;
    const feriasVencidas = feriasVencidasSelect.value;

    if (salario <= 0 ) {
        alert("Preencha o salário corretamente.");
        return;
    }

    const saldoSalario = (salario / 30) * diasTrabalhados;

    let valorAviso = 0;

    if (tipoDemissao === "Sem justa causa" && avisoPrevio === "Sim") {
        valorAviso = salario;
    }

    const dataDispensa = new Date(dataDispensaInput.value);
    const mesDispensa = dataDispensa.getMonth() + 1;
    const decimoTerceiro = (salario / 12) * mesDispensa;
    const feriasProporcionais = (salario / 12) * mesDispensa;
    const adicionalFerias = feriasProporcionais / 3;

    let valorFeriasVencidas = 0;
    if (feriasVencidas === "Sim") {
        valorFeriasVencidas = salario + (salario / 3);
    }

    let multaFgts = 0;
    if (tipoDemissao === "Sem justa causa") {
        multaFgts = saldoFgts * 0.4;
    }

    const total = saldoSalario + valorAviso + decimoTerceiro + feriasProporcionais + adicionalFerias + valorFeriasVencidas + multaFgts;

    resultadoFinal.innerHTML = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

})
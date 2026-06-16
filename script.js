/* ===== FUNÇÕES TEMPORAIS ===== */

/** Retorna saudação de acordo com o horário atual */
function getSaudacao() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12)  return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
}

/** Atualiza o relógio e saudação exibidos na navbar */
function atualizarRelogio() {
    const agora = new Date();
    const hora  = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const elSaudacao = document.getElementById('greeting');
    const elRelogio  = document.getElementById('live-clock');
    if (elSaudacao) elSaudacao.textContent = getSaudacao() + '!';
    if (elRelogio)  elRelogio.textContent  = hora;
}

/** Exibe data por extenso em um elemento da página de cadastro */
function exibirDataPorExtenso() {
    const el = document.getElementById('live-date-page');
    if (!el) return;
    const data = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    el.textContent = data.charAt(0).toUpperCase() + data.slice(1);
}

/** Verifica se a loja está aberta e exibe status no rodapé */
function verificarStatus() {
    const el = document.getElementById('store-status');
    if (!el) return;

    const agora = new Date();
    const dia   = agora.getDay();  // 0 = dom, 6 = sáb
    const hora  = agora.getHours();

    const aberto =
        (dia >= 1 && dia <= 5 && hora >= 8 && hora < 18) ||
        (dia === 6 && hora >= 8 && hora < 14);

    el.textContent  = aberto ? '● Aberto agora' : '● Fechado';
    el.className    = aberto ? 'loja-status aberto' : 'loja-status fechado';
}

/* ===== BOTÃO VOLTAR AO TOPO ===== */

function configurarVoltarAoTopo() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== MÁSCARAS DE CAMPO ===== */

/** Formata CPF enquanto o usuário digita: 000.000.000-00 */
function mascaraCPF(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    e.target.value = v;
}

/** Formata telefone enquanto o usuário digita: (00) 00000-0000 */
function mascaraTelefone(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10)     v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    e.target.value = v;
}

/* ===== CONTADOR DE CARACTERES ===== */

function configurarContadorObs() {
    const textarea = document.getElementById('observacoes');
    const contador = document.getElementById('obs-count');
    if (!textarea || !contador) return;

    textarea.addEventListener('input', () => {
        contador.textContent = textarea.value.length;
    });
}

/* ===== SELEÇÃO DE SERVIÇO (visual de card) ===== */

function configurarSelecaoServico() {
    const radios = document.querySelectorAll('input[name="servico"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.service-option').forEach(lbl => lbl.classList.remove('selected'));
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (label) label.classList.add('selected');
        });
    });
}

/* ===== PRÉ-SELEÇÃO VIA URL (ex: ?servico=com-telebusca) ===== */

function preencherServicoPorURL() {
    const params  = new URLSearchParams(window.location.search);
    const servico = params.get('servico');
    if (!servico) return;

    const mapa = {
        'sem-telebusca': 'servico-sem-telebusca',
        'com-telebusca': 'servico-com-telebusca'
    };
    const radioId = mapa[servico];
    if (!radioId) return;

    const radio = document.getElementById(radioId);
    if (!radio) return;
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));
}

/* ===== VALIDAÇÃO E ENVIO DO FORMULÁRIO ===== */

function configurarFormulario() {
    const form = document.getElementById('form-cadastro');
    if (!form) return;

    const inputData = document.getElementById('data-agendamento');
    if (inputData) {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        inputData.min = amanha.toISOString().split('T')[0];
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            const primeiro = form.querySelector(':invalid');
            if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        form.classList.add('was-validated');
        exibirConfirmacao();
    });
}

/** Exibe o modal de confirmação com resumo do agendamento */
function exibirConfirmacao() {
    const nome    = document.getElementById('nome')?.value || '';
    const petNome = document.getElementById('pet-nome')?.value || '';
    const data    = document.getElementById('data-agendamento')?.value || '';
    const hora    = document.getElementById('hora-agendamento')?.value || '';
    const servico = document.querySelector('input[name="servico"]:checked');

    const servicoLabel = servico?.value === 'com-telebusca'
        ? 'Banho e Tosa com Tele-busca'
        : 'Banho e Tosa sem Tele-busca';

    const dataFormatada = data
        ? new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
        : '';

    const resumo = document.getElementById('modal-resumo');
    if (resumo) {
        resumo.innerHTML =
            `Olá, <strong>${nome}</strong>! O agendamento de <strong>${servicoLabel}</strong>
             para <strong>${petNome}</strong> foi registrado para
             <strong>${dataFormatada}</strong> às <strong>${hora}</strong>.
             Entraremos em contato pelo telefone/WhatsApp cadastrado para confirmar.`;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalSucesso'));
    modal.show();

    document.getElementById('modalSucesso').addEventListener('hidden.bs.modal', () => {
        document.getElementById('form-cadastro').reset();
        document.getElementById('form-cadastro').classList.remove('was-validated');
        document.querySelectorAll('.service-option').forEach(lbl => lbl.classList.remove('selected'));
        if (document.getElementById('obs-count')) document.getElementById('obs-count').textContent = '0';
    }, { once: true });
}

/* ===== INICIALIZAÇÃO ===== */

document.addEventListener('DOMContentLoaded', () => {
    atualizarRelogio();
    exibirDataPorExtenso();
    verificarStatus();
    setInterval(atualizarRelogio, 1000);
    setInterval(verificarStatus, 60000);

    configurarVoltarAoTopo();

    configurarFormulario();
    configurarSelecaoServico();
    configurarContadorObs();
    preencherServicoPorURL();

    const inputCPF = document.getElementById('cpf');
    const inputTel = document.getElementById('telefone');
    if (inputCPF) inputCPF.addEventListener('input', mascaraCPF);
    if (inputTel) inputTel.addEventListener('input', mascaraTelefone);
});

// ===== Estado da aplicação =====
let itens = [];
let contadorId = 1;

// ===== Elementos do DOM =====
const form = document.getElementById('formItem');
const tabelaItens = document.getElementById('tabelaItens');
const subtotalEl = document.getElementById('subtotal');
const descontoInput = document.getElementById('desconto');
const valorDescontoEl = document.getElementById('valorDesconto');
const totalEl = document.getElementById('total');
const btnLimpar = document.getElementById('btnLimpar');
const btnImprimir = document.getElementById('btnImprimir');

// ===== Funções auxiliares =====

// Formata valor em moeda brasileira
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Adiciona novo item ao orçamento
function adicionarItem(e) {
    e.preventDefault();

    const descricao = document.getElementById('descricao').value.trim();
    const tipo = document.getElementById('tipo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const valor = parseFloat(document.getElementById('valor').value);

    if (!descricao || quantidade <= 0 || valor < 0) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    itens.push({
        id: contadorId++,
        descricao,
        tipo,
        quantidade,
        valor,
        subtotal: quantidade * valor
    });

    form.reset();
    document.getElementById('quantidade').value = 1;
    renderizarTabela();
    calcularTotais();
}

// Remove um item pelo ID
function removerItem(id) {
    itens = itens.filter(item => item.id !== id);
    renderizarTabela();
    calcularTotais();
}

// Renderiza a tabela dinamicamente
function renderizarTabela() {
    if (itens.length === 0) {
        tabelaItens.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">Nenhum item adicionado ainda</td>
            </tr>
        `;
        return;
    }

    tabelaItens.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.descricao}</td>
            <td>${item.tipo}</td>
            <td>${item.quantidade}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td><strong>${formatarMoeda(item.subtotal)}</strong></td>
            <td>
                <button class="btn btn-remove" onclick="removerItem(${item.id})">
                    Remover
                </button>
            </td>
        </tr>
    `).join('');
}

// Calcula subtotal, desconto e total geral
function calcularTotais() {
    const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
    const descontoPerc = parseFloat(descontoInput.value) || 0;
    const descontoValor = subtotal * (descontoPerc / 100);
    const total = subtotal - descontoValor;

    subtotalEl.textContent = formatarMoeda(subtotal);
    valorDescontoEl.textContent = `- ${formatarMoeda(descontoValor)}`;
    totalEl.textContent = formatarMoeda(total);
}

// Limpa todos os itens do orçamento
function limparTudo() {
    if (itens.length === 0) return;
    if (confirm('Deseja realmente limpar todos os itens?')) {
        itens = [];
        contadorId = 1;
        descontoInput.value = 0;
        renderizarTabela();
        calcularTotais();
    }
}

// Dispara a impressão do orçamento
function imprimir() {
    window.print();
}

// ===== Event Listeners =====
form.addEventListener('submit', adicionarItem);
descontoInput.addEventListener('input', calcularTotais);
btnLimpar.addEventListener('click', limparTudo);
btnImprimir.addEventListener('click', imprimir);

// ===== Inicialização =====
renderizarTabela();
calcularTotais();
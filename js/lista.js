const formItem = document.getElementById("form-item");
const campoNovoItem = document.getElementById("novo-item");
const avisoForm = document.getElementById("aviso-form");
const filtrosEl = document.getElementById("filtros");
const saidaLista = document.getElementById("resultado-lista");
const acoesLista = document.getElementById("acoes-lista");
const resumoTotal = document.getElementById("resumo-total");
const botaoLimparComprados = document.getElementById("btn-limpar-comprados");
const botaoLimparTudo = document.getElementById("btn-limpar");
const janelaLimpar = document.getElementById("confirmar-limpar");

// norm, esc, brl, CHAVE_LISTA, gravarJSON, lerLista, atualizarBadge e AREA_DO_PRODUTO vêm do comum.js

// Os três marcadores: azul, vermelho e verde (as cores ficam no lista.css)
const STATUS = {
    pendente:     { nome: "Falta comprar",      simbolo: "○", classe: "status-pendente" },
    indisponivel: { nome: "Não tem no mercado", simbolo: "✕", classe: "status-indisponivel" },
    comprado:     { nome: "Comprado",           simbolo: "✓", classe: "status-comprado" }
};

// Ordem na tela: o que falta comprar primeiro, comprados por último
const ORDEM_STATUS = { pendente: 0, indisponivel: 1, comprado: 2 };

// Cada entrada da lista é { item: "arroz", status: "pendente", qtd: 2 } (sem qtd = 1)
let lista = carregarLista();
let filtroAtual = "todos";

// A busca (buscarItem) fica no comum.js: é a mesma do mapa

// ---------- Guardar e recuperar a lista (localStorage) ----------

// Só aceita entradas com um status conhecido
function carregarLista() {
    return lerLista().filter(e => STATUS[e.status]);
}

// Quantidade de um item: de 1 a 99 (listas antigas não têm "qtd", então vale 1)
const QTD_MAX = 99;
const qtdDe = entrada => Math.min(QTD_MAX, Math.max(1, Number.isInteger(entrada.qtd) ? entrada.qtd : 1));

function salvarLista() {
    gravarJSON(CHAVE_LISTA, lista);
}

// ---------- Onde o item está no mercado ----------

const cacheLocal = new Map();

// Devolve null se o produto não existe no mapa
function localizar(item) {
    if (cacheLocal.has(item)) return cacheLocal.get(item);

    const r = buscarItem(item);
    let local = null;

    if (r && r.produtos.length) {
        // Agrupa os produtos por seção e escolhe a seção com mais opções
        const porSecao = new Map();
        r.produtos.forEach(p => {
            if (!porSecao.has(p.seção)) porSecao.set(p.seção, []);
            porSecao.get(p.seção).push(p);
        });

        let melhor = null;
        porSecao.forEach((produtosDaSecao, secao) => {
            if (!melhor || produtosDaSecao.length > melhor.lista.length) {
                melhor = { secao, lista: produtosDaSecao };
            }
        });

        // Preço: o do produto exato; se o item foi digitado à mão ("arroz"), o mais barato encontrado
        const exato = melhor.lista.find(p => norm(p.nome) === norm(item));

        // Área da planta: a do produto exato, ou a que mais aparece entre os encontrados
        const area = exato ? AREA_DO_PRODUTO.get(exato) : maisComum(melhor.lista.map(p => AREA_DO_PRODUTO.get(p)));
        const outrasAreas = [...new Set(r.produtos.map(p => AREA_DO_PRODUTO.get(p)))].filter(a => a && a !== area);

        local = {
            preco: exato ? exato.valor : Math.min(...melhor.lista.map(p => p.valor)),
            precoExato: Boolean(exato),
            area,
            outrasAreas,
            secao: melhor.secao,
            produtos: melhor.lista.slice(0, 3),
            total: melhor.lista.length,
            aproximado: r.aproximado
        };
    }

    cacheLocal.set(item, local);
    return local;
}

// ---------- Adicionar, marcar e remover ----------

let temporizadorAviso;

// Mostra um pop-up no canto de baixo que some sozinho depois de 3,5 segundos
function avisar(texto) {
    clearTimeout(temporizadorAviso);
    avisoForm.innerHTML = texto
        ? `<span>${esc(texto)}</span><button type="button" class="aviso-fechar" aria-label="Fechar aviso">×</button>`
        : "";
    if (texto) {
        temporizadorAviso = setTimeout(() => avisar(""), 3500);
    }
}

avisoForm.addEventListener("click", evento => {
    if (evento.target.closest(".aviso-fechar")) avisar("");
});

function adicionarItens(texto) {
    const novos = texto
        .split(/[\n,;]+/)
        .map(i => i.replace(/^[\s\-–•*]+/, "").trim())
        .filter(Boolean);

    const aumentados = [];
    let mudou = false;

    novos.forEach(item => {
        // Se o item já está na lista, aumenta a quantidade em vez de repetir
        const existente = lista.find(e => norm(e.item) === norm(item));
        if (existente) {
            existente.qtd = Math.min(QTD_MAX, qtdDe(existente) + 1);
            aumentados.push(`${existente.item} (${existente.qtd})`);
        } else {
            lista.push({ item, status: "pendente", qtd: 1 });
        }
        mudou = true;
    });

    if (mudou) {
        filtroAtual = "todos"; // para o item novo aparecer
        salvarLista();
        renderizar();
    }
    avisar(aumentados.length ? `Já estava na lista, aumentei a quantidade: ${aumentados.join(", ")}.` : "");
}

// ---------- Desenhar ----------

function desenharFiltros() {
    if (!lista.length) {
        filtrosEl.innerHTML = "";
        return;
    }

    const totais = { todos: lista.length, pendente: 0, indisponivel: 0, comprado: 0 };
    lista.forEach(e => totais[e.status]++);

    const filtros = [
        { chave: "todos", nome: "Todos", classe: "f-todos" },
        ...Object.entries(STATUS).map(([chave, s]) => ({ chave, nome: s.nome, classe: s.classe }))
    ];

    filtrosEl.innerHTML = filtros.map(f => {
        const ativo = filtroAtual === f.chave;
        return `<button type="button"
                    class="filtro ${f.classe}${ativo ? " ativo" : ""}"
                    data-filtro="${f.chave}" aria-pressed="${ativo}">${f.nome} ${totais[f.chave]}</button>`;
    }).join("");
}

function marcadoresHtml(entrada, posicao) {
    return `<div class="marcadores">${
        Object.entries(STATUS).map(([chave, s]) => {
            const ativo = entrada.status === chave;
            return `<button type="button"
                        class="marcador ${s.classe}${ativo ? " ativo" : ""}"
                        data-posicao="${posicao}" data-status="${chave}"
                        aria-pressed="${ativo}">${s.simbolo} ${s.nome}</button>`;
        }).join("")
    }</div>`;
}

function tarefaHtml(linha) {
    const { entrada, posicao, local } = linha;

    const etiqueta = local
        ? (AREAS_MAPA[local.area]?.nome || NOMES_SECOES[local.secao])
        : "Sem localização";

    const qtd = qtdDe(entrada);

    // Detalhe: quais produtos combinam. Para um produto exato ele só repetiria o nome, então some.
    let detalhe = "Procure um atendente.";
    if (local && local.precoExato) {
        detalhe = "";
    } else if (local) {
        const extras = local.total - local.produtos.length;
        detalhe = (local.aproximado ? "Busca aproximada, confira: " : "") +
            local.produtos.map(p => p.nome).join(", ") +
            (extras > 0 ? ` e mais ${extras}` : "") +
            (local.outrasAreas.length ? ` (também em: ${local.outrasAreas.map(a => AREAS_MAPA[a].nome).join(", ")})` : "");
    }

    return `
        <li class="tarefa ${STATUS[entrada.status].classe}">
            <div class="tarefa-info">
                <span class="tarefa-nome">${esc(entrada.item)}</span>
                ${local ? `<span class="tarefa-preco">${local.precoExato ? "" : "a partir de "}${brl(local.preco * qtd)}</span>` : ""}
                ${local
                    ? `<a class="tarefa-local" href="index.html?item=${encodeURIComponent(entrada.item)}" title="Ver no mapa">${esc(etiqueta)}</a>`
                    : `<span class="tarefa-local">${esc(etiqueta)}</span>`}
            </div>
            ${detalhe ? `<div class="tarefa-detalhe" title="${esc(detalhe)}">${esc(detalhe)}</div>` : ""}
            <div class="tarefa-qtd" role="group" aria-label="Quantidade de ${esc(entrada.item)}">
                <button type="button" class="qtd-menos" data-posicao="${posicao}" aria-label="Diminuir quantidade" ${qtd <= 1 ? "disabled" : ""}>−</button>
                <span class="qtd-valor" aria-live="polite">${qtd}</span>
                <button type="button" class="qtd-mais" data-posicao="${posicao}" aria-label="Aumentar quantidade" ${qtd >= QTD_MAX ? "disabled" : ""}>+</button>
            </div>
            ${marcadoresHtml(entrada, posicao)}
            <button type="button" class="remover" data-posicao="${posicao}"
                    aria-label="Remover ${esc(entrada.item)}" title="Remover">×</button>
        </li>`;
}

// ---------- Total estimado da compra ----------
// Soma o preço do que falta comprar e do que já está no carrinho ("Não tem no mercado" fica de fora)
// e conta quantos itens estão em cada um
function desenharTotal(linhas) {
    const contam = linhas.filter(l => l.entrada.status !== "indisponivel");
    if (!contam.length) {
        resumoTotal.hidden = true;
        return;
    }

    // Valor: soma dos preços; "No carrinho" e "Falta": quantidade de itens
    let total = 0, totalCarrinho = 0, semPreco = 0, aproximado = false;
    contam.forEach(({ entrada, local }) => {
        if (!local) { semPreco++; return; }
        if (!local.precoExato) aproximado = true;
        const valor = local.preco * qtdDe(entrada);
        total += valor;
        if (entrada.status === "comprado") totalCarrinho += valor;
    });
    const noCarrinho = contam.filter(l => l.entrada.status === "comprado").length;
    const faltam = contam.length - noCarrinho;
    const itens = n => `${n} ${n === 1 ? "item" : "itens"}`;

    const notas = [];
    if (aproximado) notas.push("Itens digitados à mão usam o menor preço encontrado.");
    if (semPreco) notas.push(`${semPreco} ${semPreco === 1 ? "item ficou" : "itens ficaram"} sem preço.`);

    resumoTotal.hidden = false;
    resumoTotal.innerHTML = `
        <div class="resumo-linha">
            <span class="resumo-rotulo">Total ${aproximado ? "estimado" : ""}</span>
            <div class="resumo-valores">
                <strong class="resumo-valor">${brl(total)}</strong>
                <span class="resumo-valor-carrinho">Total: <b>${brl(totalCarrinho)}</b></span>
            </div>
        </div>
        <div class="resumo-partes">
            <span class="resumo-carrinho">No carrinho: <b>${itens(noCarrinho)}</b></span>
            <span class="resumo-falta">Falta: <b>${itens(faltam)}</b></span>
        </div>
        ${notas.length ? `<p class="resumo-nota">${notas.join(" ")}</p>` : ""}`;
}

function renderizar() {
    const linhas = lista.map((entrada, posicao) => ({
        entrada,
        posicao,
        local: localizar(entrada.item)
    }));

    atualizarBadge();
    desenharTotal(linhas);
    desenharFiltros();
    acoesLista.hidden = lista.length === 0;

    const visiveis = linhas
        .filter(l => filtroAtual === "todos" || l.entrada.status === filtroAtual)
        // Falta comprar primeiro, comprados por último; dentro de cada grupo, ordem alfabética
        .sort((a, b) =>
            ORDEM_STATUS[a.entrada.status] - ORDEM_STATUS[b.entrada.status] ||
            a.entrada.item.localeCompare(b.entrada.item, "pt-BR", { sensitivity: "base" })
        );

    if (!lista.length) {
        saidaLista.innerHTML = `<li class="vazio">Sua lista está vazia. Adicione o primeiro item acima.</li>`;
    } else if (!visiveis.length) {
        saidaLista.innerHTML = `<li class="vazio">Nenhum item com este marcador.</li>`;
    } else {
        saidaLista.innerHTML = visiveis.map(tarefaHtml).join("");
    }
}

// ---------- Eventos ----------

formItem.addEventListener("submit", evento => {
    evento.preventDefault();
    if (!campoNovoItem.value.trim()) return;
    adicionarItens(campoNovoItem.value);
    campoNovoItem.value = "";
    campoNovoItem.focus();
});

// Um único "ouvinte" cuida dos cliques nos marcadores e no botão de remover
saidaLista.addEventListener("click", evento => {
    const botaoMarcador = evento.target.closest(".marcador");
    if (botaoMarcador) {
        const entrada = lista[Number(botaoMarcador.dataset.posicao)];
        if (!entrada) return;

        const novo = botaoMarcador.dataset.status;
        // Clicar de novo no marcador ativo (vermelho ou verde) volta para "falta comprar"
        entrada.status = entrada.status === novo ? "pendente" : novo;

        salvarLista();
        renderizar();
        return;
    }

    const botaoQtd = evento.target.closest(".qtd-menos, .qtd-mais");
    if (botaoQtd) {
        const entrada = lista[Number(botaoQtd.dataset.posicao)];
        if (!entrada) return;
        entrada.qtd = Math.min(QTD_MAX, Math.max(1, qtdDe(entrada) + (botaoQtd.classList.contains("qtd-mais") ? 1 : -1)));
        salvarLista();
        renderizar();
        return;
    }

    const botaoRemover = evento.target.closest(".remover");
    if (botaoRemover) {
        lista.splice(Number(botaoRemover.dataset.posicao), 1);
        salvarLista();
        renderizar();
    }
});

filtrosEl.addEventListener("click", evento => {
    const botao = evento.target.closest(".filtro");
    if (!botao) return;
    filtroAtual = botao.dataset.filtro;
    renderizar();
});

botaoLimparComprados.addEventListener("click", () => {
    lista = lista.filter(e => e.status !== "comprado");
    salvarLista();
    renderizar();
});

function apagarTudo() {
    lista = [];
    filtroAtual = "todos";
    salvarLista();
    renderizar();
}

// "Limpar tudo" abre a janela de confirmação do site
botaoLimparTudo.addEventListener("click", () => {
    if (!lista.length) return;

    // Navegador muito antigo sem <dialog>: usa a confirmação padrão
    if (typeof janelaLimpar.showModal !== "function") {
        if (confirm("Apagar todos os itens da lista?")) apagarTudo();
        return;
    }

    const n = lista.length;
    document.getElementById("modal-texto").textContent =
        `${n === 1 ? "O item vai" : `Os ${n} itens vão`} sumir. Não dá para desfazer.`;
    janelaLimpar.returnValue = "";
    janelaLimpar.showModal();
});

// Os botões da janela fecham ela com o valor "cancelar" ou "apagar"
janelaLimpar.addEventListener("close", () => {
    if (janelaLimpar.returnValue === "apagar") apagarTudo();
});

// Tocar fora da janela (no fundo escuro) também cancela
janelaLimpar.addEventListener("click", evento => {
    if (evento.target === janelaLimpar) janelaLimpar.close("cancelar");
});

// Ao abrir a página, mostra a lista que já estava salva
atualizarBadge();
renderizar();
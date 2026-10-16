const formItem = document.getElementById("form-item");
const campoNovoItem = document.getElementById("novo-item");
const avisoForm = document.getElementById("aviso-form");
const filtrosEl = document.getElementById("filtros");
const saidaLista = document.getElementById("resultado-lista");
const acoesLista = document.getElementById("acoes-lista");
const botaoLimparComprados = document.getElementById("btn-limpar-comprados");
const botaoLimparTudo = document.getElementById("btn-limpar");

const SECOES_POR_CORREDOR = 16;
const IGNORAR = new Set(["de", "da", "do", "das", "dos", "e", "com", "para", "em", "a", "o", "um", "uma"]);

// Chaves usadas para guardar dados no navegador
const CHAVE_LISTA = "listaCompras";
const CHAVE_SECOES = "secoesLista";

// Os três marcadores: azul, vermelho e verde (as cores ficam no lista.css)
const STATUS = {
    pendente:     { nome: "Falta comprar",      simbolo: "○", classe: "status-pendente" },
    indisponivel: { nome: "Não tem no mercado", simbolo: "✕", classe: "status-indisponivel" },
    comprado:     { nome: "Comprado",           simbolo: "✓", classe: "status-comprado" }
};

// Ordem na tela: o que falta comprar primeiro, comprados por último
const ORDEM_STATUS = { pendente: 0, indisponivel: 1, comprado: 2 };

/* ===== Badge (duplicado de index.js) ===== */
function atualizarBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  let n = 0;
  try { n = (JSON.parse(localStorage.getItem("listaCompras")) || []).filter(e => e.status === "pendente").length; } catch { }
  badge.textContent = n;
  badge.hidden = !n;
}

// Cada entrada da lista é { item: "arroz", status: "pendente" }
let lista = carregarLista();
let filtroAtual = "todos";

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Reduz plural: feijões -> feijao, pães -> pao, ovos -> ovo
function radical(p) {
    if (p.length > 3) {
        if (p.endsWith("oes") || p.endsWith("aes")) return p.slice(0, -3) + "ao";
        if (p.endsWith("s")) return p.slice(0, -1);
    }
    return p;
}

function palavrasProduto(texto) {
    return normalizarTexto(texto).split(/[^a-z0-9]+/).filter(Boolean).map(radical);
}

// Ignora "de", "com"... e quantidades como "1kg", "2"
function palavrasBusca(item) {
    return normalizarTexto(item)
        .split(/[^a-z0-9]+/)
        .filter(p => p.length > 1 && !IGNORAR.has(p) && !/^\d+(kg|g|l|ml|un|und)?$/.test(p))
        .map(radical);
}

function distancia(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            d[i][j] = Math.min(
                d[i - 1][j] + 1,
                d[i][j - 1] + 1,
                d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return d[a.length][b.length];
}

function casa(q, w, tolerante) {
    if (q === w) return true;
    if (q.length >= 4 && w.startsWith(q)) return true; // "choco" -> "chocolate"
    return tolerante && q.length >= 5 && Math.abs(q.length - w.length) <= 1 && distancia(q, w) <= 1;
}

const indice = produtos.map(produto => ({ produto, palavras: palavrasProduto(produto.nome) }));

function buscarItem(item) {
    const q = palavrasBusca(item);
    if (!q.length) return null;

    // 1ª tentativa exata; 2ª tolerando erro de digitação
    for (const tolerante of [false, true]) {
        const achados = indice
            .filter(e => q.every(t => e.palavras.some(w => casa(t, w, tolerante))))
            .map(e => ({
                produto: e.produto,
                rank: e.palavras.findIndex(w => casa(q[0], w, tolerante))
            }))
            .sort((a, b) => a.rank - b.rank);

        if (achados.length) {
            return { produtos: achados.map(a => a.produto), aproximado: tolerante };
        }
    }
    return { produtos: [], aproximado: false };
}

function esc(texto) {
    return String(texto).replace(/[&<>"']/g, c => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
}

// ---------- Guardar e recuperar a lista (localStorage) ----------

function carregarLista() {
    try {
        const salva = JSON.parse(localStorage.getItem(CHAVE_LISTA));
        if (!Array.isArray(salva)) return [];
        return salva.filter(e => e && typeof e.item === "string" && STATUS[e.status]);
    } catch {
        return [];
    }
}

function salvarLista() {
    try {
        localStorage.setItem(CHAVE_LISTA, JSON.stringify(lista));
    } catch { /* sem armazenamento disponível: a lista só vale nesta visita */ }
}

// O mapa (index.html) lê estas seções para destacar só o que ainda falta comprar
function salvarSecoesPendentes(linhas) {
    const secoes = [...new Set(
        linhas
            .filter(l => l.local && l.entrada.status === "pendente")
            .map(l => l.local.secao)
    )];
    try {
        localStorage.setItem(CHAVE_SECOES, JSON.stringify(secoes));
    } catch { /* ignora */ }
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

        local = {
            secao: melhor.secao,
            produtos: melhor.lista.slice(0, 3),
            total: melhor.lista.length,
            outras: [...porSecao.keys()].filter(s => s !== melhor.secao).sort((a, b) => a - b),
            aproximado: r.aproximado
        };
    }

    cacheLocal.set(item, local);
    return local;
}

// ---------- Adicionar, marcar e remover ----------

let temporizadorAviso;

function avisar(texto) {
    avisoForm.textContent = texto;
    clearTimeout(temporizadorAviso);
    if (texto) {
        temporizadorAviso = setTimeout(() => { avisoForm.textContent = ""; }, 3500);
    }
}

function adicionarItens(texto) {
    const novos = texto
        .split(/[\n,;]+/)
        .map(i => i.replace(/^[\s\-–•*]+/, "").trim())
        .filter(Boolean);

    const existentes = new Set(lista.map(e => normalizarTexto(e.item)));
    const repetidos = [];
    let adicionou = false;

    novos.forEach(item => {
        const chave = normalizarTexto(item);
        if (existentes.has(chave)) {
            repetidos.push(item);
            return;
        }
        existentes.add(chave);
        lista.push({ item, status: "pendente" });
        adicionou = true;
    });

    if (adicionou) {
        filtroAtual = "todos"; // para o item novo aparecer
        salvarLista();
        renderizar();
    }
    avisar(repetidos.length ? `Já estava na lista: ${repetidos.join(", ")}.` : "");
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
        ? `Corredor ${Math.ceil(local.secao / SECOES_POR_CORREDOR)} · Seção ${local.secao}`
        : "Sem localização";

    let detalhe = "Procure um atendente.";
    if (local) {
        const extras = local.total - local.produtos.length;
        detalhe = (local.aproximado ? "Busca aproximada, confira: " : "") +
            local.produtos.map(p => p.nome).join(", ") +
            (extras > 0 ? ` e mais ${extras}` : "") +
            (local.outras.length ? ` (também em: seção ${local.outras.join(", ")})` : "");
    }

    return `
        <li class="tarefa ${STATUS[entrada.status].classe}">
            <div class="tarefa-info">
                <span class="tarefa-nome">${esc(entrada.item)}</span>
                <span class="tarefa-local">${esc(etiqueta)}</span>
            </div>
            <div class="tarefa-detalhe" title="${esc(detalhe)}">${esc(detalhe)}</div>
            ${marcadoresHtml(entrada, posicao)}
            <button type="button" class="remover" data-posicao="${posicao}"
                    aria-label="Remover ${esc(entrada.item)}" title="Remover">×</button>
        </li>`;
}

function renderizar() {
    const linhas = lista.map((entrada, posicao) => ({
        entrada,
        posicao,
        local: localizar(entrada.item)
    }));

    salvarSecoesPendentes(linhas);
    atualizarBadge();
    desenharFiltros();
    acoesLista.hidden = lista.length === 0;

    const visiveis = linhas
        .filter(l => filtroAtual === "todos" || l.entrada.status === filtroAtual)
        .sort((a, b) =>
            ORDEM_STATUS[a.entrada.status] - ORDEM_STATUS[b.entrada.status] ||
            (a.local ? 0 : 1) - (b.local ? 0 : 1) ||
            (a.local && b.local ? a.local.secao - b.local.secao : 0) ||
            a.posicao - b.posicao
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

botaoLimparTudo.addEventListener("click", () => {
    if (!lista.length) return;
    if (!confirm("Apagar todos os itens da lista?")) return;
    lista = [];
    filtroAtual = "todos";
    salvarLista();
    renderizar();
});

// Ao abrir a página, mostra a lista que já estava salva
atualizarBadge();
renderizar();
/* ===== Grupos de cor (8 famílias, saturação baixa) ===== */
const GRUPOS = {
  hortifruti: { nome: "Hortifrúti", h: 145, s: 38, secoes: [1, 2] },
  carnes: { nome: "Carnes e Peixes", h: 8, s: 42, secoes: [7, 9, 33, 47] },
  frios: { nome: "Laticínios e Gelados", h: 205, s: 40, secoes: [3, 6, 11, 13, 32] },
  mercearia: { nome: "Padaria e Mercearia", h: 36, s: 48, secoes: [4, 8, 15, 16, 17, 18, 19, 34, 44] },
  doces: { nome: "Doces", h: 335, s: 38, secoes: [10, 14] },
  bebidas: { nome: "Bebidas", h: 185, s: 40, secoes: [5, 12, 25, 26, 27, 28] },
  higiene: { nome: "Limpeza e Higiene", h: 262, s: 35, secoes: [20, 21, 22, 24, 29, 31, 43] },
  casa: { nome: "Casa e Utilidades", h: 215, s: 12, secoes: [23, 30, 35, 36, 37, 38, 39, 40, 41, 42, 45, 46, 48] }
};

const GRUPO_POR_SECAO = {};
Object.values(GRUPOS).forEach(g => g.secoes.forEach(n => (GRUPO_POR_SECAO[n] = g)));
const grupoDe = s => GRUPO_POR_SECAO[s] ?? GRUPOS.casa;
/* ===== Busca (lógica pura) ===== */
const SECOES_POR_CORREDOR = 16;

const norm = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const corredorDe = s => Math.ceil(s / SECOES_POR_CORREDOR);
const ladoDe = s => ((s - 1) % SECOES_POR_CORREDOR) < 8 ? "esquerdo" : "direito";

function buscarProdutos(texto, secaoFixa = null) {
  const q = norm(texto).split(/\s+/).filter(Boolean);
  if (!q.length) return [];

  return produtos
    .map(p => {
      if (secaoFixa !== null) return p.seção === secaoFixa ? { p, rank: 0 } : null;
      const nome = norm(p.nome);
      const alvo = nome + " " + norm(NOMES_SECOES[p.seção] || "");
      if (!q.every(t => alvo.includes(t))) return null;
      const pos = nome.indexOf(q[0]);
      return { p, rank: pos < 0 ? 999 : pos };
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank || a.p.nome.localeCompare(b.p.nome))
    .map(a => a.p);
}

function agruparPorSecao(prods) {
  const grupos = new Map();
  prods.forEach(p => {
    if (!grupos.has(p.seção)) grupos.set(p.seção, []);
    grupos.get(p.seção).push(p);
  });
  return [...grupos].sort((a, b) => a[0] - b[0]);
}

/* ===== Armazenamento (duplicado em lista.js — veja a nota no topo) ===== */
const CHAVE_LISTA = "listaCompras";
const CHAVE_SECOES = "secoesLista";

function lerJSON(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; } catch { return padrao; }
}
function gravarJSON(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { }
}
function lerLista() {
  const l = lerJSON(CHAVE_LISTA, []);
  return Array.isArray(l) ? l : [];
}
const secoesDaLista = () => lerJSON(CHAVE_SECOES, []);
const naLista = nome => lerLista().some(e => norm(e.item) === norm(nome));

// Descobre a seção de um item da lista, mesmo quando foi digitado à mão na lista.html
// ("arroz", por exemplo). Igual ao lista.js: escolhe a seção com mais produtos encontrados.
function secaoDoItem(texto) {
  const exato = produtos.find(x => norm(x.nome) === norm(texto));
  if (exato) return exato.seção;

  const contagem = new Map();
  buscarProdutos(texto).forEach(x => contagem.set(x.seção, (contagem.get(x.seção) || 0) + 1));

  let melhor = null, maior = 0;
  contagem.forEach((qtd, s) => { if (qtd > maior) { melhor = s; maior = qtd; } });
  return melhor;
}

// Recalcula do zero as seções que ainda têm algo pendente (sem depender do que estava salvo)
function recalcularSecoes(lista) {
  const secoes = new Set();
  lista.forEach(e => {
    if (e.status !== "pendente") return;
    const s = secaoDoItem(e.item);
    if (s !== null) secoes.add(s);
  });
  return [...secoes];
}

function alternarItem(p) {
  const lista = lerLista(), i = lista.findIndex(e => norm(e.item) === norm(p.nome));

  if (i >= 0) lista.splice(i, 1);
  else lista.push({ item: p.nome, status: "pendente" });

  gravarJSON(CHAVE_LISTA, lista);
  gravarJSON(CHAVE_SECOES, recalcularSecoes(lista));
  atualizarBadge();
}

/* ===== Badge (duplicado em lista.js) ===== */
function atualizarBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  let n = 0;
  try { n = (JSON.parse(localStorage.getItem("listaCompras")) || []).filter(e => e.status === "pendente").length; } catch { }
  badge.textContent = n;
  badge.hidden = !n;
}

/* ===== Tela de busca ===== */
const campo = document.getElementById("barra-pesquisa");
const btnLimpar = document.getElementById("limpar");
const resultados = document.getElementById("resultados");
const atalhos = document.getElementById("atalhos");
const mapa = document.getElementById("mercado2d");
const tabs = document.getElementById("tabs");

const ATALHOS = ["Frutas", "Verduras", "Padaria", "Carnes", "Laticínios", "Bebidas", "Limpeza", "Higiene"];
const comProdutos = new Set(produtos.map(p => p.seção));
let secaoFixa = null;

const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function montarMapa() {
  const esq = [8, 7, 6, 5, 0, 4, 3, 2, 1], dir = [9, 10, 11, 12, 0, 13, 14, 15, 16];
  const celula = (n, base) => {
    if (!n) return `<div></div>`;
    const s = base + n, vazia = !comProdutos.has(s);
    const nome = NOMES_SECOES[s] || "—";
    return `<button type="button" class="secao${vazia ? " vazia" : ""}" data-secao="${s}"
      style="--h:${grupoDe(s).h};--s:${grupoDe(s).s}%;--w:${5 + (s * 3) % 4}px" aria-label="Seção ${s}: ${esc(nome)}" ${vazia ? "disabled" : ""}>
      <span class="produtos"></span><span class="etiqueta"><small>${esc(nome)}</small></span></button>`;
  };
  mapa.innerHTML = [0, 1, 2].map(c => `
    <div class="gondula">
      <div class="coluna">${esq.map(n => celula(n, c * 16)).join("")}</div>
      <div class="corredor"><span>CORREDOR ${c + 1}</span></div>
      <div class="coluna">${dir.map(n => celula(n, c * 16)).join("")}</div>
    </div>`).join("");
  tabs.innerHTML = [1, 2, 3].map((c, i) => `<button type="button" data-corredor="${c}"${i ? "" : ' class="ativo"'}>Corredor ${c}</button>`).join("");
}
function marcarLista() {
  const s = new Set(secoesDaLista());
  mapa.querySelectorAll(".secao").forEach(el => el.classList.toggle("na-lista", s.has(Number(el.dataset.secao))));
}
function marcarBusca(qtds) {
  mapa.classList.toggle("buscando", qtds.size > 0);
  mapa.querySelectorAll(".secao").forEach(el => {
    const q = qtds.get(Number(el.dataset.secao));
    el.classList.toggle("selecionada", Boolean(q));
    if (q) el.dataset.qtd = q; else delete el.dataset.qtd;
  });
}
function irParaCorredor(c) {
  mapa.scrollTo({ left: (c - 1) * mapa.clientWidth, behavior: "smooth" });
}

function pesquisar() {
  btnLimpar.hidden = !campo.value;
  atalhos.hidden = Boolean(campo.value.trim());
  const texto = campo.value.trim();

  if (!texto) { resultados.innerHTML = ""; marcarBusca(new Map()); return; }

  const achados = buscarProdutos(texto, secaoFixa);
  if (!achados.length) {
    resultados.innerHTML = `<p class="vazio">Não encontramos "${esc(texto)}".<br>Procure um atendente.</p>`;
    marcarBusca(new Map());
    return;
  }
  mostrar(achados);
}

function grupoHtml(s, itens) {
  const nome = NOMES_SECOES[s] || `Seção ${s}`;
  return `
    <article class="grupo">
      <button type="button" class="placa" data-secao="${s}">
        <span class="placa-num">${s}</span>
        <span class="placa-txt"><b>${esc(nome)}</b><small>Corredor ${corredorDe(s)} · lado ${ladoDe(s)}</small></span>
        <span class="placa-mapa">Ver no mapa</span>
      </button>
      <ul>${itens.map(p => {
    const no = naLista(p.nome);
    return `<li><span class="nome">${esc(p.nome)}</span><span class="preco">${brl(p.valor)}</span>
          <button type="button" class="add" data-i="${produtos.indexOf(p)}" aria-pressed="${no}"
            aria-label="${no ? "Remover da lista" : "Adicionar à lista"}: ${esc(p.nome)}">${no ? "✓" : "+"}</button></li>`;
  }).join("")}</ul>
    </article>`;
}

function mostrar(achados) {
  const grupos = agruparPorSecao(achados.slice(0, 60));

  let html = `<p class="info-busca">${achados.length} produto${achados.length > 1 ? "s" : ""} em ${grupos.length} seç${grupos.length > 1 ? "ões" : "ão"}</p>`;
  let atual = 0;
  grupos.forEach(([s, itens]) => {
    const c = corredorDe(s);
    if (c !== atual) {
      if (atual) html += "</section>";
      html += `<section class="trecho"><h3 class="trecho-nome">Corredor ${c}</h3>`;
      atual = c;
    }
    html += grupoHtml(s, itens);
  });
  resultados.innerHTML = html + "</section>";

  marcarBusca(new Map(grupos.map(([s, itens]) => [s, itens.length])));
  irParaCorredor(corredorDe(grupos[0][0]));
}

campo.addEventListener("input", () => { secaoFixa = null; pesquisar(); });
btnLimpar.addEventListener("click", () => { campo.value = ""; secaoFixa = null; pesquisar(); campo.focus(); });

atalhos.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  secaoFixa = null;
  campo.value = b.textContent;
  pesquisar();
});

resultados.addEventListener("click", e => {
  const add = e.target.closest(".add");
  if (add) {
    const p = produtos[Number(add.dataset.i)];
    alternarItem(p);
    const no = naLista(p.nome);
    add.setAttribute("aria-pressed", no);
    add.textContent = no ? "✓" : "+";
    marcarLista();
    return;
  }
  const placa = e.target.closest(".placa");
  if (placa) {
    const s = Number(placa.dataset.secao);
    marcarBusca(new Map([[s, 1]]));
    irParaCorredor(corredorDe(s));
    mapa.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

mapa.addEventListener("click", e => {
  const el = e.target.closest(".secao");
  if (!el || el.disabled) return;
  secaoFixa = Number(el.dataset.secao);
  campo.value = NOMES_SECOES[secaoFixa];
  pesquisar();
  resultados.scrollIntoView({ behavior: "smooth", block: "start" });
});

tabs.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) irParaCorredor(Number(b.dataset.corredor));
});
mapa.addEventListener("scroll", () => {
  const i = Math.round(mapa.scrollLeft / mapa.clientWidth);
  tabs.querySelectorAll("button").forEach((b, k) => b.classList.toggle("ativo", k === i));
}, { passive: true });

window.addEventListener("pageshow", () => { marcarLista(); atualizarBadge(); });

atalhos.innerHTML = ATALHOS.map(a => `<button type="button">${a}</button>`).join("");
montarMapa();
marcarLista();
atualizarBadge();
pesquisar();
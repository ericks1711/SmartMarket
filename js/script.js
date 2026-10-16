/* ===== Seções ===== */
const NOMES_SECOES = {
  1: "Frutas", 2: "Verduras e Legumes", 3: "Leites", 4: "Padaria", 5: "Bebidas (Águas)", 6: "Laticínios", 7: "Frios", 8: "Biscoitos e Salgadinhos",
  9: "Carnes", 10: "Confeitaria", 11: "Congelados", 12: "Bebidas (Refrigerantes e Sucos)", 13: "Sorvetes", 14: "Doces", 15: "Mercearia", 16: "Molhos",
  17: "Condimentos", 18: "Óleos e Vinagres", 19: "Temperos", 20: "Limpeza", 21: "Higiene Pessoal", 22: "Utilidades de Limpeza", 23: "Papelaria Doméstica",
  24: "Perfumaria", 25: "Bebidas Alcoólicas", 26: "Vinhos", 27: "Energéticos", 28: "Chás e Infusões", 30: "Produtos para Animais", 31: "Higiene Animal",
  33: "Peixaria", 34: "Salgados e Massas Prontas", 35: "Elétrica", 36: "Ferramentas e Utilidades", 38: "Descartáveis", 40: "Material Escolar",
  41: "Papelaria", 42: "Eletrônicos e Acessórios", 43: "Bebês", 44: "Alimentação Infantil", 45: "Jardinagem", 46: "Aquarismo", 47: "Churrasco", 48: "Utilidades / Automotivo"
};

const TONS_SECOES = {
  1: 100, 2: 130, 3: 210, 4: 32, 5: 195, 6: 48, 7: 350, 8: 25, 9: 5, 10: 330, 11: 185, 12: 12, 13: 300, 14: 340, 15: 40, 16: 8, 17: 35, 18: 55, 19: 90, 20: 175,
  21: 280, 22: 200, 23: 45, 24: 310, 25: 20, 26: 345, 27: 60, 28: 120, 30: 25, 31: 220, 33: 200, 34: 30, 35: 50, 36: 215, 38: 160, 40: 260, 41: 230, 42: 240,
  43: 320, 44: 35, 45: 110, 46: 190, 47: 8, 48: 215
};

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

function alternarItem(p) {
  const lista = lerLista(), i = lista.findIndex(e => norm(e.item) === norm(p.nome));
  const secoes = new Set(secoesDaLista());

  if (i >= 0) {
    lista.splice(i, 1);
    const aindaTem = lista.some(e => e.status === "pendente" && produtos.some(x => x.nome === e.item && x.seção === p.seção));
    if (!aindaTem) secoes.delete(p.seção);
  } else {
    lista.push({ item: p.nome, status: "pendente" });
    secoes.add(p.seção);
  }
  gravarJSON(CHAVE_LISTA, lista);
  gravarJSON(CHAVE_SECOES, [...secoes]);
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
      style="--h:${TONS_SECOES[s] ?? 0};--w:${5 + (s * 3) % 4}px" aria-label="Seção ${s}: ${esc(nome)}" ${vazia ? "disabled" : ""}>
      <span class="produtos"></span><span class="etiqueta"><b>${s}</b><small>${esc(nome)}</small></span></button>`;
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
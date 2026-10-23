// ===== SmartMarket — Planta interativa da loja =====
// Usa AREAS_MAPA e REGRAS_AREA do data.js para saber em que área fica cada produto.
// O desenho segue a planta: viewBox de 960 x 600, origem no canto superior esquerdo.

/* ===== Desenho das áreas =====
   formas: retângulos {x, y, w, h, r} ou caminhos {d}
   rotulo: texto da área (rot: -90 deixa o texto em pé); sem x/y fica no centro da 1ª forma
   h / s:  matiz e saturação da cor (igual ao GRUPOS do script.js) */
const DESENHO = [
  { id: "adega", h: 345, s: 42, formas: [{ d: "M180 112V58L208 30L245 20H285V40H250L222 58L210 70V112Z" }], rotulo: { x: 254, y: 68, t: ["Adega"] } },
  { id: "bebidas-churrasco", h: 18, s: 45, formas: [{ x: 288, y: 18, w: 212, h: 22 }], rotulo: { t: ["Bebidas e Churrasco"] } },
  { id: "laticinios", h: 190, s: 55, formas: [{ x: 522, y: 16, w: 246, h: 32 }], rotulo: { t: ["Laticínios"] } },
  { id: "hortifruti", h: 140, s: 45, formas: [{ x: 655, y: 90, w: 100, h: 44, r: 20 }, { d: "M772 16H850V132H814V50H772Z" }], rotulo: { t: ["Hortifrúti"] } },

  // Gôndolas centrais (lado de cima / lado de baixo)
  { id: "bebidas", h: 44, s: 50, formas: [{ x: 285, y: 100, w: 318, h: 22 }], rotulo: { t: ["Bebidas"] } },
  { id: "limpeza-utilidades", h: 32, s: 50, formas: [{ x: 285, y: 122, w: 318, h: 22 }], rotulo: { t: ["Produtos de Limpeza e Utilidades"] } },
  { id: "limpeza", h: 44, s: 50, formas: [{ x: 285, y: 185, w: 318, h: 22 }], rotulo: { t: ["Produtos de Limpeza"] } },
  { id: "perfumaria", h: 32, s: 50, formas: [{ x: 285, y: 207, w: 318, h: 22 }], rotulo: { t: ["Perfumaria"] } },
  { id: "perfumaria-higiene", h: 44, s: 50, formas: [{ x: 285, y: 265, w: 318, h: 22 }], rotulo: { t: ["Perfumaria e Higiene"] } },
  { id: "lataria", h: 32, s: 50, formas: [{ x: 285, y: 287, w: 159, h: 22 }], rotulo: { t: ["Lataria"] } },
  { id: "massas", h: 32, s: 50, formas: [{ x: 444, y: 287, w: 159, h: 22 }], rotulo: { t: ["Massas"] } },
  { id: "biscoitos-doces", h: 44, s: 50, formas: [{ x: 285, y: 345, w: 318, h: 22 }], rotulo: { t: ["Biscoitos · Balas · Doces · Sobremesas"] } },
  { id: "matinais", h: 32, s: 50, formas: [{ x: 285, y: 367, w: 159, h: 22 }], rotulo: { t: ["Matinais"] } },
  { id: "festas", h: 32, s: 50, formas: [{ x: 444, y: 367, w: 159, h: 22 }], rotulo: { t: ["Festas"] } },

  { id: "congelados", h: 205, s: 45, formas: [{ x: 652, y: 185, w: 46, h: 188 }], rotulo: { rot: -90, t: ["Congelados"] } },
  { id: "ovos", h: 48, s: 35, formas: [{ x: 702, y: 185, w: 26, h: 188 }], rotulo: { rot: -90, t: ["Ovos"] } },
  { id: "doces-bolos", h: 330, s: 40, formas: [{ x: 652, y: 378, w: 76, h: 32 }], rotulo: { t: ["Doces e", "Bolos"], tam: 10 } },
  { id: "carnes-preparadas", h: 8, s: 40, formas: [{ x: 764, y: 165, w: 36, h: 195 }], rotulo: { rot: -90, t: ["Carnes Preparadas"] } },
  { id: "acougue", h: 356, s: 55, formas: [{ x: 804, y: 160, w: 46, h: 200 }], rotulo: { rot: -90, t: ["Açougue"] } },
  { id: "refeicoes", h: 14, s: 55, formas: [{ x: 505, y: 455, w: 265, h: 34 }], rotulo: { t: ["Refeições (fabricação própria)"] } },
  { id: "paes", h: 30, s: 55, formas: [{ x: 285, y: 432, w: 150, h: 48 }], rotulo: { t: ["Pães"] } },
  { id: "cereais", h: 40, s: 50, formas: [{ x: 185, y: 528, w: 160, h: 26 }], rotulo: { t: ["Cereais"] } },
  { id: "leite", h: 200, s: 30, formas: [{ x: 345, y: 528, w: 95, h: 26 }], rotulo: { t: ["Leite"] } },
  { id: "revistas", h: 262, s: 25, formas: [{ x: 132, y: 368, w: 104, h: 62 }], rotulo: { t: ["Revistas"] } },
  { id: "flores", h: 120, s: 40, formas: [{ x: 132, y: 436, w: 104, h: 26 }], rotulo: { t: ["Flores"] } }
];

// Lugares que aparecem na planta mas não têm produtos
const SERVICOS = [
  { nome: "Caixas", x: 135, y: 95, w: 105, h: 80 },
  { nome: "Caixa rápido", x: 120, y: 208, w: 120, h: 42 },
  { nome: "Caixas", x: 135, y: 262, w: 105, h: 80 },
  { nome: "Atendimento", x: 72, y: 482, w: 106, h: 72 },
  { nome: "Padaria · Rotisseria · Confeitaria", x: 440, y: 494, w: 330, h: 62 },
  { nome: "Sanitários", x: 860, y: 372, w: 78, h: 120 }
];

/* ===== Onde fica cada produto ===== */
const AREA_POR_SECAO = {};
Object.entries(AREAS_MAPA).forEach(([id, a]) => a.secoes.forEach(s => (AREA_POR_SECAO[s] = id)));

function areaDoProduto(p) {
  const regra = REGRAS_AREA.find(r => r.comeca.some(c => p.nome.startsWith(c)));
  return regra ? regra.area : AREA_POR_SECAO[p.seção] || null;
}
const AREA_DO_PRODUTO = new Map(produtos.map(p => [p, areaDoProduto(p)]));

const norm = t => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Aceita plural simples: "bananas" acha "banana"
function contem(alvo, termo) {
  return alvo.includes(termo) || (termo.length > 3 && termo.endsWith("s") && alvo.includes(termo.slice(0, -1)));
}

function buscar(texto) {
  const termos = norm(texto).split(/\s+/).filter(Boolean);
  if (!termos.length) return [];
  return produtos.filter(p => {
    const area = AREA_DO_PRODUTO.get(p);
    const alvo = norm(p.nome + " " + (AREAS_MAPA[area]?.nome || "") + " " + (NOMES_SECOES[p.seção] || ""));
    return termos.every(t => contem(alvo, t));
  });
}

// Para itens da lista digitados à mão ("arroz"): escolhe a área com mais produtos encontrados
function localizarTexto(texto) {
  const exato = produtos.find(p => norm(p.nome) === norm(texto));
  if (exato) return { area: AREA_DO_PRODUTO.get(exato), secao: exato.seção };

  const termos = norm(texto).split(/[^a-z0-9]+/).filter(t => t.length > 1 && !/^\d/.test(t));
  if (!termos.length) return null;
  const achados = produtos.filter(p => termos.every(t => contem(norm(p.nome), t)));
  if (!achados.length) return null;

  const contar = chave => {
    const m = new Map();
    achados.forEach(p => { const k = chave(p); m.set(k, (m.get(k) || 0) + 1); });
    return [...m].sort((a, b) => b[1] - a[1])[0][0];
  };
  return { area: contar(p => AREA_DO_PRODUTO.get(p)), secao: contar(p => p.seção) };
}

/* ===== Lista de compras (mesmas chaves do script.js e do lista.js) ===== */
const CHAVE_LISTA = "listaCompras";
const CHAVE_SECOES = "secoesLista";

function lerLista() {
  try {
    const l = JSON.parse(localStorage.getItem(CHAVE_LISTA));
    return Array.isArray(l) ? l.filter(e => e && typeof e.item === "string") : [];
  } catch { return []; }
}
function gravar(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { }
}
const pendentes = () => lerLista().filter(e => e.status === "pendente");
const naLista = nome => lerLista().some(e => norm(e.item) === norm(nome));

function alternarItem(p) {
  const lista = lerLista(), i = lista.findIndex(e => norm(e.item) === norm(p.nome));
  if (i >= 0) lista.splice(i, 1);
  else lista.push({ item: p.nome, status: "pendente" });
  gravar(CHAVE_LISTA, lista);

  // Mantém o destaque das seções do index.html em dia
  const secoes = new Set();
  lista.forEach(e => {
    if (e.status !== "pendente") return;
    const l = localizarTexto(e.item);
    if (l) secoes.add(l.secao);
  });
  gravar(CHAVE_SECOES, [...secoes]);
  atualizarBadge();
}

function atualizarBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  const n = pendentes().length;
  badge.textContent = n;
  badge.hidden = !n;
}

/* ===== Elementos da página ===== */
const svg = document.getElementById("planta");
const wrap = document.getElementById("planta-wrap");
const painel = document.getElementById("painel");
const campo = document.getElementById("busca-mapa");
const btnLimpar = document.getElementById("limpar-mapa");
const btnLista = document.getElementById("ver-lista");
const qtdLista = document.getElementById("qtd-lista");
const aviso = document.getElementById("aviso-mapa");

let areaAtiva = null;
let mostrarLista = true;
let zoom = 0;
const ZOOMS = [1, 1.4, 1.9, 2.6];

/* ===== Desenhar a planta ===== */
function formaSvg(f) {
  return f.d
    ? `<path d="${f.d}"/>`
    : `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="${f.r ?? 4}"/>`;
}

function rotuloSvg(r, f) {
  const x = r.x ?? f.x + f.w / 2;
  const y = r.y ?? f.y + f.h / 2;
  const tam = r.tam ?? 12;
  const giro = r.rot ? ` transform="rotate(${r.rot} ${x} ${y})"` : "";
  const inicio = -((r.t.length - 1) * (tam + 2)) / 2;
  return `<text x="${x}" y="${y}" font-size="${tam}"${giro}>${r.t.map((linha, i) =>
    `<tspan x="${x}" dy="${i ? tam + 2 : inicio}">${esc(linha)}</tspan>`).join("")}</text>`;
}

function desenharPlanta() {
  const ruas = `
    <rect class="rua" x="0" y="0" width="56" height="600"/>
    <rect class="rua" x="0" y="568" width="960" height="32"/>
    <text class="rua-nome" x="28" y="300" transform="rotate(-90 28 300)">RUA 13 DE MAIO, 822</text>
    <text class="rua-nome" x="508" y="588">RUA CEL. NHONHÔ BRAGA</text>`;

  const paredes = `
    <path class="piso" d="M65 10H945V500H852V560H65Z"/>
    <path class="parede-int" d="M852 150V500M852 150H945M852 365H945"/>`;

  const entradas = [240, 430].map(y => `
    <g class="entrada">
      <path d="M74 ${y}h22m-8-8 8 8-8 8"/>
      <text x="92" y="${y - 14}">Entrada</text>
    </g>`).join("");

  const servicos = SERVICOS.map(s => `
    <g class="servico">
      <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="8"/>
      ${rotuloSvg({ t: s.nome.length > 14 && s.w < 140 ? s.nome.split(" ") : [s.nome], tam: 11 }, s)}
    </g>`).join("");

  const areas = DESENHO.map(a => {
    const info = AREAS_MAPA[a.id];
    return `
    <g class="area" data-area="${a.id}" tabindex="0" role="button"
       aria-label="${esc(info.nome)}" style="--h:${a.h};--s:${a.s}%">
      ${a.formas.map(formaSvg).join("")}
      ${rotuloSvg(a.rotulo, a.formas[0])}
      <g class="selo" hidden><circle r="11"/><text></text></g>
    </g>`;
  }).join("");

  svg.innerHTML = ruas + paredes + servicos + entradas + `<g class="areas">${areas}</g>`;

  // Posiciona o selo (contador) no canto de cada área
  svg.querySelectorAll(".area").forEach(g => {
    const forma = g.querySelector("rect, path").getBBox();
    const selo = g.querySelector(".selo");
    const cx = Math.min(forma.x + forma.width - 4, 948);
    const cy = Math.max(forma.y + 4, 12);
    selo.querySelector("circle").setAttribute("cx", cx);
    selo.querySelector("circle").setAttribute("cy", cy);
    const txt = selo.querySelector("text");
    txt.setAttribute("x", cx);
    txt.setAttribute("y", cy);
  });
}

function marcarSelo(g, n, tipo) {
  const selo = g.querySelector(".selo");
  selo.toggleAttribute("hidden", !n); // em SVG, .hidden não funciona
  selo.dataset.tipo = tipo || "";
  selo.querySelector("text").textContent = n > 99 ? "99+" : n;
}

/* ===== Estado visual ===== */
function areasDaLista() {
  const contagem = new Map();
  pendentes().forEach(e => {
    const l = localizarTexto(e.item);
    if (l && l.area) contagem.set(l.area, (contagem.get(l.area) || 0) + 1);
  });
  return contagem;
}

function atualizarPlanta(achados = null) {
  const lista = areasDaLista();
  qtdLista.textContent = pendentes().length;
  btnLista.setAttribute("aria-pressed", mostrarLista);

  const porArea = new Map();
  (achados || []).forEach(p => {
    const a = AREA_DO_PRODUTO.get(p);
    porArea.set(a, (porArea.get(a) || 0) + 1);
  });

  svg.classList.toggle("buscando", Boolean(achados && achados.length));
  svg.querySelectorAll(".area").forEach(g => {
    const id = g.dataset.area;
    const temDaLista = mostrarLista && lista.has(id);
    g.classList.toggle("na-lista", temDaLista);
    g.classList.toggle("achada", porArea.has(id));
    g.classList.toggle("ativa", id === areaAtiva);

    if (achados && achados.length) marcarSelo(g, porArea.get(id) || 0, "busca");
    else marcarSelo(g, temDaLista ? lista.get(id) : 0, "lista");
  });
}

/* ===== Painel abaixo da planta ===== */
function cartaoHtml(titulo, subtitulo, itens, area, numero) {
  return `
    <article class="grupo">
      <button type="button" class="placa" data-ir="${area || ""}">
        <span class="placa-num">${numero}</span>
        <span class="placa-txt"><b>${esc(titulo)}</b><small>${esc(subtitulo)}</small></span>
        ${area ? `<span class="placa-mapa">Ver na planta</span>` : ""}
      </button>
      <ul>${itens}</ul>
    </article>`;
}

function produtoHtml(p) {
  const no = naLista(p.nome);
  return `<li><span class="nome">${esc(p.nome)}</span><span class="preco">${brl(p.valor)}</span>
    <button type="button" class="add" data-i="${produtos.indexOf(p)}" aria-pressed="${no}"
      aria-label="${no ? "Remover da lista" : "Adicionar à lista"}: ${esc(p.nome)}">${no ? "✓" : "+"}</button></li>`;
}

function produtosDaArea(id) {
  return produtos
    .filter(p => AREA_DO_PRODUTO.get(p) === id)
    .sort((a, b) => a.seção - b.seção || a.nome.localeCompare(b.nome));
}

function subtituloArea(id) {
  const nomes = [...new Set(produtosDaArea(id).map(p => NOMES_SECOES[p.seção]))];
  return nomes.length ? nomes.join(" · ") : "Sem produtos cadastrados";
}

function mostrarArea(id) {
  const info = AREAS_MAPA[id];
  const itens = produtosDaArea(id);
  painel.innerHTML = `
    <div class="painel-topo-mapa">
      <h2>${esc(info.nome)}</h2>
      <button type="button" class="painel-fechar" aria-label="Fechar área">×</button>
    </div>
    ${cartaoHtml(`${itens.length} produto${itens.length === 1 ? "" : "s"}`, subtituloArea(id),
      itens.map(produtoHtml).join("") || `<li class="vazio-li">Nenhum produto nesta área.</li>`, null, itens.length)}`;
}

function mostrarBusca(texto, achados) {
  if (!achados.length) {
    painel.innerHTML = `<p class="vazio">Não encontramos "${esc(texto)}".<br>Procure um atendente.</p>`;
    return;
  }
  const grupos = new Map();
  achados.forEach(p => {
    const a = AREA_DO_PRODUTO.get(p);
    if (!grupos.has(a)) grupos.set(a, []);
    grupos.get(a).push(p);
  });
  const ordem = DESENHO.map(d => d.id).filter(id => grupos.has(id));
  painel.innerHTML =
    `<p class="info-busca">${achados.length} produto${achados.length > 1 ? "s" : ""} em ${ordem.length} área${ordem.length > 1 ? "s" : ""}</p>` +
    ordem.map(id => cartaoHtml(AREAS_MAPA[id].nome, subtituloArea(id),
      grupos.get(id).slice(0, 30).map(produtoHtml).join(""), id, grupos.get(id).length)).join("");
}

function mostrarResumoLista() {
  const itens = pendentes();
  if (!itens.length || !mostrarLista) {
    painel.innerHTML = `<p class="painel-dica">Toque numa área da planta para ver os produtos dela, ou procure um produto lá em cima.</p>`;
    return;
  }
  const grupos = new Map(), semLugar = [];
  itens.forEach(e => {
    const l = localizarTexto(e.item);
    if (!l || !l.area) { semLugar.push(e.item); return; }
    if (!grupos.has(l.area)) grupos.set(l.area, []);
    grupos.get(l.area).push(e.item);
  });
  const ordem = DESENHO.map(d => d.id).filter(id => grupos.has(id));
  painel.innerHTML =
    `<h2 class="painel-titulo">Sua lista na planta</h2>` +
    ordem.map(id => cartaoHtml(AREAS_MAPA[id].nome, `${grupos.get(id).length} item(ns) para pegar aqui`,
      grupos.get(id).map(i => `<li><span class="nome">${esc(i)}</span></li>`).join(""), id, grupos.get(id).length)).join("") +
    (semLugar.length ? cartaoHtml("Sem lugar na planta", "Procure um atendente",
      semLugar.map(i => `<li><span class="nome">${esc(i)}</span></li>`).join(""), null, semLugar.length) : "");
}

/* ===== Ações ===== */
function selecionarArea(id, rolar = true) {
  areaAtiva = id;
  if (id) {
    mostrarArea(id);
    if (rolar) centralizarArea(id);
  } else if (campo.value.trim()) {
    pesquisar();
    return;
  } else {
    mostrarResumoLista();
  }
  atualizarPlanta(campo.value.trim() ? buscar(campo.value) : null);
}

function pesquisar() {
  const texto = campo.value.trim();
  btnLimpar.hidden = !campo.value;
  areaAtiva = null;
  if (!texto) {
    atualizarPlanta();
    mostrarResumoLista();
    return;
  }
  const achados = buscar(texto);
  atualizarPlanta(achados);
  mostrarBusca(texto, achados);
  if (achados.length) centralizarArea(AREA_DO_PRODUTO.get(achados[0]));
}

function avisar(texto) {
  aviso.textContent = texto;
}

/* ===== Zoom e rolagem ===== */
function aplicarZoom() {
  const base = Math.max(wrap.clientWidth, 820);
  svg.style.width = Math.round(base * ZOOMS[zoom]) + "px";
  document.getElementById("zoom-menos").disabled = zoom === 0;
  document.getElementById("zoom-mais").disabled = zoom === ZOOMS.length - 1;
}

function centralizarArea(id) {
  const g = svg.querySelector(`.area[data-area="${id}"]`);
  if (!g) return;
  const caixa = g.getBBox();
  const escala = svg.clientWidth / 960;
  wrap.scrollTo({
    left: (caixa.x + caixa.width / 2) * escala - wrap.clientWidth / 2,
    top: (caixa.y + caixa.height / 2) * escala - wrap.clientHeight / 2,
    behavior: "smooth"
  });
}

function mudarZoom(passo) {
  const centroX = (wrap.scrollLeft + wrap.clientWidth / 2) / svg.clientWidth;
  const centroY = (wrap.scrollTop + wrap.clientHeight / 2) / svg.clientHeight;
  zoom = Math.min(Math.max(zoom + passo, 0), ZOOMS.length - 1);
  aplicarZoom();
  wrap.scrollLeft = centroX * svg.clientWidth - wrap.clientWidth / 2;
  wrap.scrollTop = centroY * svg.clientHeight - wrap.clientHeight / 2;
}

/* ===== Eventos ===== */
svg.addEventListener("click", e => {
  const g = e.target.closest(".area");
  if (!g) return;
  selecionarArea(g.dataset.area === areaAtiva ? null : g.dataset.area, false);
  if (areaAtiva) painel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

svg.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const g = e.target.closest(".area");
  if (!g) return;
  e.preventDefault();
  selecionarArea(g.dataset.area === areaAtiva ? null : g.dataset.area, false);
});

painel.addEventListener("click", e => {
  const add = e.target.closest(".add");
  if (add) {
    const p = produtos[Number(add.dataset.i)];
    alternarItem(p);
    const no = naLista(p.nome);
    add.setAttribute("aria-pressed", no);
    add.setAttribute("aria-label", `${no ? "Remover da lista" : "Adicionar à lista"}: ${p.nome}`);
    add.textContent = no ? "✓" : "+";
    atualizarPlanta(campo.value.trim() ? buscar(campo.value) : null);
    return;
  }
  if (e.target.closest(".painel-fechar")) {
    selecionarArea(null);
    return;
  }
  const placa = e.target.closest(".placa[data-ir]");
  if (placa && placa.dataset.ir) {
    areaAtiva = placa.dataset.ir;
    atualizarPlanta(campo.value.trim() ? buscar(campo.value) : null);
    centralizarArea(placa.dataset.ir);
    wrap.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

campo.addEventListener("input", () => { avisar(""); pesquisar(); });
btnLimpar.addEventListener("click", () => { campo.value = ""; avisar(""); pesquisar(); campo.focus(); });

btnLista.addEventListener("click", () => {
  mostrarLista = !mostrarLista;
  if (!areaAtiva && !campo.value.trim()) mostrarResumoLista();
  atualizarPlanta(campo.value.trim() ? buscar(campo.value) : null);
});

document.getElementById("zoom-mais").addEventListener("click", () => mudarZoom(1));
document.getElementById("zoom-menos").addEventListener("click", () => mudarZoom(-1));
document.getElementById("zoom-ajustar").addEventListener("click", () => { zoom = 0; aplicarZoom(); wrap.scrollTo({ left: 0, top: 0 }); });
window.addEventListener("resize", aplicarZoom);

// Ao voltar de outra página (botão voltar do celular), atualiza a lista
window.addEventListener("pageshow", () => {
  atualizarBadge();
  if (!areaAtiva && !campo.value.trim()) mostrarResumoLista();
  atualizarPlanta(campo.value.trim() ? buscar(campo.value) : null);
});

/* ===== Início =====
   Links aceitos: Mapa.html?secao=15  ·  Mapa.html?area=cereais
                  Mapa.html?busca=arroz  ·  Mapa.html?item=arroz (vindo da lista) */
desenharPlanta();
aplicarZoom();
atualizarBadge();

const params = new URLSearchParams(location.search);
const secaoUrl = Number(params.get("secao"));
const areaUrl = params.get("area");
const itemUrl = params.get("item");
const buscaUrl = params.get("busca");

if (areaUrl && AREAS_MAPA[areaUrl]) {
  selecionarArea(areaUrl);
} else if (secaoUrl && AREA_POR_SECAO[secaoUrl]) {
  selecionarArea(AREA_POR_SECAO[secaoUrl]);
  avisar(`${NOMES_SECOES[secaoUrl]} fica em ${AREAS_MAPA[AREA_POR_SECAO[secaoUrl]].nome}.`);
} else if (itemUrl) {
  const l = localizarTexto(itemUrl);
  if (l && l.area) {
    selecionarArea(l.area);
    avisar(`"${itemUrl}" fica em ${AREAS_MAPA[l.area].nome}.`);
  } else {
    selecionarArea(null);
    avisar(`Não achamos "${itemUrl}" na planta. Procure um atendente.`);
  }
} else if (buscaUrl) {
  campo.value = buscaUrl;
  pesquisar();
} else {
  selecionarArea(null);
}

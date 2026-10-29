const DESENHO = [
  { id: "adega", h: 345, s: 42, formas: [{ d: "M180 84V58L208 30L245 20H285V40H250L222 58L210 70V84Z" }], rotulo: { x: 258, y: 68, t: ["Bebidas", "Alcoólicas"], tam: 11 } },
  { id: "bebidas-churrasco", h: 18, s: 45, formas: [{ x: 288, y: 18, w: 212, h: 22 }], rotulo: { t: ["Churrasco"] } },
  { id: "laticinios", h: 190, s: 55, formas: [{ x: 522, y: 16, w: 246, h: 32 }], rotulo: { t: ["Laticínios"] } },
  { id: "hortifruti", h: 140, s: 45, formas: [{ x: 655, y: 90, w: 100, h: 44, r: 20 }, { d: "M772 16H850V132H814V50H772Z" }], rotulo: { t: ["Hortifrúti"] }, rotulo2: { x: 832, y: 76, rot: -90, t: ["Hortifrúti"] } },

  { id: "bebidas", h: 44, s: 50, formas: [{ x: 285, y: 100, w: 318, h: 22 }], rotulo: { t: ["Águas, Sucos e Refrigerantes"] } },
  { id: "limpeza-utilidades", h: 32, s: 50, formas: [{ x: 285, y: 122, w: 318, h: 22 }], rotulo: { t: ["Casa, Cozinha e Ferramentas"] } },
  { id: "limpeza", h: 44, s: 50, formas: [{ x: 285, y: 185, w: 318, h: 22 }], rotulo: { t: ["Produtos de Limpeza"] } },
  { id: "perfumaria", h: 32, s: 50, formas: [{ x: 285, y: 207, w: 318, h: 22 }], rotulo: { t: ["Perfumes e Hidratantes"] } },
  { id: "perfumaria-higiene", h: 44, s: 50, formas: [{ x: 285, y: 265, w: 318, h: 22 }], rotulo: { t: ["Higiene, Bebês e Saúde"] } },
  { id: "lataria", h: 32, s: 50, formas: [{ x: 285, y: 287, w: 159, h: 22 }], rotulo: { t: ["Molhos, Óleos e Latas"], tam: 10.5 } },
  { id: "massas", h: 32, s: 50, formas: [{ x: 444, y: 287, w: 159, h: 22 }], rotulo: { t: ["Massas e Temperos"] } },
  { id: "biscoitos-doces", h: 44, s: 50, formas: [{ x: 285, y: 345, w: 318, h: 22 }], rotulo: { t: ["Biscoitos, Salgadinhos e Doces"] } },
  { id: "matinais", h: 32, s: 50, formas: [{ x: 285, y: 367, w: 159, h: 22 }], rotulo: { t: ["Café da Manhã"] } },
  { id: "festas", h: 32, s: 50, formas: [{ x: 444, y: 367, w: 159, h: 22 }], rotulo: { t: ["Festas e Brinquedos"], tam: 11 } },

  { id: "congelados", h: 205, s: 45, formas: [{ x: 652, y: 185, w: 46, h: 188 }], rotulo: { rot: -90, t: ["Congelados e Sorvetes"] } },
  { id: "ovos", h: 48, s: 35, formas: [{ x: 702, y: 185, w: 26, h: 188 }], rotulo: { rot: -90, t: ["Ovos"] } },
  { id: "doces-bolos", h: 330, s: 40, formas: [{ x: 652, y: 378, w: 76, h: 32 }], rotulo: { t: ["Bolos e", "Doces"], tam: 10 } },
  { id: "carnes-preparadas", h: 8, s: 40, formas: [{ x: 764, y: 165, w: 36, h: 195 }], rotulo: { rot: -90, t: ["Frios e Queijos"] } },
  { id: "acougue", h: 356, s: 55, formas: [{ x: 804, y: 160, w: 46, h: 200 }], rotulo: { rot: -90, t: ["Açougue e Peixaria"] } },
  { id: "refeicoes", h: 14, s: 55, formas: [{ x: 505, y: 455, w: 265, h: 34 }], rotulo: { t: ["Salgados e Massas Prontas"] } },
  { id: "paes", h: 30, s: 55, formas: [{ x: 285, y: 432, w: 150, h: 48 }], rotulo: { t: ["Pães"] } },
  { id: "cereais", h: 40, s: 50, formas: [{ x: 185, y: 528, w: 160, h: 26 }], rotulo: { t: ["Grãos e Farinhas"] } },
  { id: "leite", h: 200, s: 30, formas: [{ x: 345, y: 528, w: 95, h: 26 }], rotulo: { t: ["Leites"] } },
  { id: "revistas", h: 262, s: 25, formas: [{ x: 132, y: 368, w: 104, h: 62 }], rotulo: { t: ["Papelaria e", "Eletrônicos"] } },
  { id: "flores", h: 120, s: 40, formas: [{ x: 132, y: 436, w: 104, h: 26 }], rotulo: { t: ["Jardim e Pets"] } }
];

const SERVICOS = [
  { nome: "Caixas", x: 135, y: 104, w: 105, h: 72 },
  { nome: "Caixa rápido", x: 120, y: 208, w: 120, h: 42 },
  { nome: "Caixas", x: 135, y: 262, w: 105, h: 80 },
  { nome: "Atendimento", x: 72, y: 482, w: 106, h: 72 },
  { nome: "Padaria · Rotisseria · Confeitaria", x: 440, y: 494, w: 330, h: 62 }
];
const CORREDORES = [
  { n: 1, areas: ["bebidas", "limpeza-utilidades"] },
  { n: 2, areas: ["limpeza", "perfumaria"] },
  { n: 3, areas: ["perfumaria-higiene", "lataria", "massas"] },
  { n: 4, areas: ["biscoitos-doces", "matinais", "festas"] },
  { n: 5, areas: ["congelados", "ovos"] }
];

function corredoresSvg() {
  return CORREDORES.map(c => {
    const formas = DESENHO.filter(a => c.areas.includes(a.id)).flatMap(a => a.formas);
    const x1 = Math.min(...formas.map(f => f.x)), x2 = Math.max(...formas.map(f => f.x + f.w));
    const y1 = Math.min(...formas.map(f => f.y)), y2 = Math.max(...formas.map(f => f.y + f.h));
    const deitado = x2 - x1 > y2 - y1;
    const cx = deitado ? x1 - 16 : (x1 + x2) / 2;
    const cy = deitado ? (y1 + y2) / 2 : y1 - 16;
    return `<g class="corredor-num"><circle cx="${cx}" cy="${cy}" r="12"/><text x="${cx}" y="${cy}">${c.n}</text></g>`;
  }).join("");
}

function buscar(texto) {
  return buscarItem(texto, { comLugar: true, prefixoMin: 2 })?.produtos || [];
}

const svg = document.getElementById("planta");
const wrap = document.getElementById("planta-wrap");
const painel = document.getElementById("painel");
const campo = document.getElementById("busca-mapa");
const btnLimpar = document.getElementById("limpar-mapa");
const btnLista = document.getElementById("ver-lista");
const atalhos = document.getElementById("atalhos");
const qtdLista = document.getElementById("qtd-lista");
const aviso = document.getElementById("aviso-mapa");

let areaAtiva = null;
let itemAtivo = null;
let mostrarLista = true;
let zoom = 0;
const ZOOMS = [1, 1.4, 1.9, 2.6];

function destaqueAtual() {
  if (campo.value.trim()) return buscar(campo.value);
  return itemAtivo ? itemAtivo.achados : null;
}

const VIEW = { x: 60, y: 5, w: 800, h: 560 };
svg.setAttribute("viewBox", `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`);

function formaSvg(f) {
  return f.d
    ? `<path d="${f.d}"/>`
    : `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="${f.r ?? 4}"/>`;
}

const ehCelular = () => window.innerWidth < 600;
let letrasGrandes = ehCelular();

function rotuloSvg(r, f) {
  const x = r.x ?? f.x + f.w / 2;
  const y = r.y ?? f.y + f.h / 2;
  const tam = Math.round((r.tam ?? 12) * (letrasGrandes ? 1.25 : 1) * 10) / 10;
  const giro = r.rot ? ` transform="rotate(${r.rot} ${x} ${y})"` : "";
  const inicio = -((r.t.length - 1) * (tam + 2)) / 2;
  return `<text x="${x}" y="${y}" font-size="${tam}"${giro}>${r.t.map((linha, i) =>
    `<tspan x="${x}" dy="${i ? tam + 2 : inicio}">${esc(linha)}</tspan>`).join("")}</text>`;
}

function desenharPlanta() {

  const paredes = `
    <path class="piso" d="M65 10H854V560H65Z"/>`;

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
      ${a.rotulo2 ? rotuloSvg(a.rotulo2, a.formas[1] || a.formas[0]) : ""}
    </g>`;
  }).join("");

  const selos = DESENHO.map(a =>
    `<g class="selo" data-area="${a.id}" hidden><circle r="11"/><text></text></g>`).join("");

  svg.innerHTML = paredes + servicos + entradas +
        `<g class="areas">${areas}</g><g class="corredores" aria-hidden="true">${corredoresSvg()}</g><g class="selos" aria-hidden="true">${selos}</g>`;

  svg.querySelectorAll(".area").forEach(g => {
    const forma = g.querySelector("rect, path").getBBox();
    const selo = seloDe(g);
    const cx = Math.min(forma.x + forma.width - 4, VIEW.x + VIEW.w - 12);
    const cy = Math.max(forma.y + 4, 12);
    selo.querySelector("circle").setAttribute("cx", cx);
    selo.querySelector("circle").setAttribute("cy", cy);
    const txt = selo.querySelector("text");
    txt.setAttribute("x", cx);
    txt.setAttribute("y", cy);
  });
}

const seloDe = g => svg.querySelector(`.selo[data-area="${g.dataset.area}"]`);

function marcarSelo(g, n, tipo) {
  const selo = seloDe(g);
  selo.toggleAttribute("hidden", !n);
  selo.dataset.tipo = tipo || "";
  selo.querySelector("text").textContent = n > 99 ? "99+" : n;
}

function areasDaLista() {
  const contagem = new Map();
  pendentes().forEach(e => {
    const l = localizar(e.item);
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

function mostrarItem() {
  const { texto, achados } = itemAtivo;
  const grupos = new Map();
  achados.forEach(p => {
    const a = AREA_DO_PRODUTO.get(p);
    if (!grupos.has(a)) grupos.set(a, []);
    grupos.get(a).push(p);
  });
  const ordem = [...grupos.keys()].sort((a, b) => grupos.get(b).length - grupos.get(a).length);
  const principal = ordem[0];

  painel.innerHTML = `
    <div class="painel-topo-mapa">
      <h2>${esc(texto)}</h2>
      <button type="button" class="painel-fechar" aria-label="Fechar">×</button>
    </div>` +
    ordem.map(id => cartaoHtml(AREAS_MAPA[id].nome, subtituloArea(id),
      grupos.get(id).map(produtoHtml).join(""), id, grupos.get(id).length)).join("") +
    `<button type="button" class="ver-area" data-area="${principal}">Ver todos os produtos de ${esc(AREAS_MAPA[principal].nome)}</button>`;
}

function mostrarResumoLista() {
  const itens = pendentes();
  if (!itens.length || !mostrarLista) {
    painel.innerHTML = `<p class="painel-dica">Toque numa área da planta para ver os produtos dela, ou procure um produto lá em cima.</p>`;
    return;
  }
  const grupos = new Map(), semLugar = [];
  itens.forEach(e => {
    const l = localizar(e.item);
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

function selecionarArea(id, rolar = true) {
  areaAtiva = id;
  itemAtivo = null;
  if (id) {
    mostrarArea(id);
    if (rolar) centralizarArea(id);
  } else if (campo.value.trim()) {
    pesquisar();
    return;
  } else {
    mostrarResumoLista();
  }
  atualizarPlanta(destaqueAtual());
}

function pesquisar() {
  const texto = campo.value.trim();
  btnLimpar.hidden = !campo.value;
  atalhos.hidden = Boolean(texto);
  areaAtiva = null;
  itemAtivo = null;
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

function aplicarZoom() {
  const base = ehCelular() ? 680 : Math.max(wrap.clientWidth, 820);
  svg.style.width = Math.round(base * ZOOMS[zoom]) + "px";
  document.getElementById("zoom-menos").disabled = zoom === 0;
  document.getElementById("zoom-mais").disabled = zoom === ZOOMS.length - 1;
}

function centralizarArea(id) {
  const g = svg.querySelector(`.area[data-area="${id}"]`);
  if (!g) return;
  const caixa = g.getBBox();
  const escala = svg.clientWidth / VIEW.w;
  wrap.scrollTo({
    left: (caixa.x - VIEW.x + caixa.width / 2) * escala - wrap.clientWidth / 2,
    behavior: "smooth"
  });

  const topoFixo = document.querySelector(".topo")?.getBoundingClientRect().bottom || 0;
  const barra = document.querySelector(".tabbar")?.getBoundingClientRect().top || window.innerHeight;
  const yNaTela = wrap.getBoundingClientRect().top + (caixa.y - VIEW.y + caixa.height / 2) * escala;
  if (yNaTela < topoFixo + 30 || yNaTela > barra - 30) {
    window.scrollBy({ top: yNaTela - (topoFixo + barra) / 2, behavior: "smooth" });
  }
}

function mudarZoom(passo) {
  const centroX = (wrap.scrollLeft + wrap.clientWidth / 2) / svg.clientWidth;
  zoom = Math.min(Math.max(zoom + passo, 0), ZOOMS.length - 1);
  aplicarZoom();
  wrap.scrollLeft = centroX * svg.clientWidth - wrap.clientWidth / 2;
}

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
    atualizarPlanta(destaqueAtual());
    return;
  }
  const verArea = e.target.closest(".ver-area");
  if (verArea) {
    avisar("");
    selecionarArea(verArea.dataset.area);
    return;
  }
  if (e.target.closest(".painel-fechar")) {
    avisar("");
    selecionarArea(null);
    return;
  }
  const placa = e.target.closest(".placa[data-ir]");
  if (placa && placa.dataset.ir) {
    areaAtiva = placa.dataset.ir;
    atualizarPlanta(destaqueAtual());
    centralizarArea(placa.dataset.ir);
    wrap.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

campo.addEventListener("input", () => { avisar(""); pesquisar(); });

const ATALHOS = ["Frutas", "Verduras", "Padaria", "Carnes", "Laticínios", "Bebidas", "Limpeza", "Higiene"];
atalhos.innerHTML = ATALHOS.map(a => `<button type="button">${a}</button>`).join("");
atalhos.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  campo.value = b.textContent;
  avisar("");
  pesquisar();
});
btnLimpar.addEventListener("click", () => { campo.value = ""; avisar(""); pesquisar(); campo.focus(); });

btnLista.addEventListener("click", () => {
  mostrarLista = !mostrarLista;
  if (!areaAtiva && !campo.value.trim()) mostrarResumoLista();
  atualizarPlanta(destaqueAtual());
});

document.getElementById("zoom-mais").addEventListener("click", () => mudarZoom(1));
document.getElementById("zoom-menos").addEventListener("click", () => mudarZoom(-1));
document.getElementById("zoom-ajustar").addEventListener("click", () => { zoom = 0; aplicarZoom(); wrap.scrollTo({ left: 0, top: 0 }); });
window.addEventListener("resize", () => {
  if (letrasGrandes !== ehCelular()) {
    letrasGrandes = ehCelular();
    desenharPlanta();
    atualizarPlanta(destaqueAtual());
  }
  aplicarZoom();
});

window.addEventListener("pageshow", () => {
  atualizarBadge();
  if (!areaAtiva && !campo.value.trim()) mostrarResumoLista();
  atualizarPlanta(destaqueAtual());
});

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
  const l = localizar(itemUrl);
  if (l && l.area) {
    itemAtivo = { texto: itemUrl, achados: produtosDoTexto(itemUrl) };
    areaAtiva = l.area;
    mostrarItem();
    atualizarPlanta(itemAtivo.achados);
    centralizarArea(l.area);
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
  if (ehCelular()) wrap.scrollLeft = (110 - VIEW.x) * (svg.clientWidth / VIEW.w);
}

// Coloca os números dos corredores no vão entre as gôndolas
(function () {
  const svg = document.getElementById('planta');
  if (!svg) return;
  const textos = [...svg.querySelectorAll('text')];

  function caixa(nome) {
    const el = textos.find(t => t.textContent.trim().startsWith(nome));
    if (!el) return null;
    const g = el.closest('g');
    if (g && g !== svg && g.querySelector('rect')) return g.querySelector('rect').getBBox();
    let r = el.previousElementSibling;
    while (r && r.tagName !== 'rect') r = r.previousElementSibling;
    return (r || el).getBBox();
  }

  function mover(n, cima, baixo) {
    const a = caixa(cima), b = caixa(baixo);
    const t = textos.find(el => el.textContent.trim() === String(n));
    if (!a || !b || !t) return;
    const x = b.x + b.width / 2;
    const y = (a.y + a.height + b.y) / 2;
    const g = t.closest('g');
    const c = (g && g !== svg && g.querySelector('circle')) ||
              (t.previousElementSibling?.tagName === 'circle' ? t.previousElementSibling : null);
    if (c) { c.setAttribute('cx', x); c.setAttribute('cy', y); c.removeAttribute('transform'); }
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'central');
    t.removeAttribute('transform');
  }

   mover(1, 'Churrasco', 'Águas');
  mover(2, 'Casa', 'Produtos de Limpeza');
  mover(3, 'Perfumes', 'Higiene');
  mover(4, 'Molhos', 'Biscoitos');
  mover(5, 'Café', 'Pães');
})();

// ===== SmartMarket — funções usadas por mais de uma página =====
// Carregue depois do data.js e antes do script da página:
//   <script src="js/data.js"></script>
//   <script src="js/comum.js"></script>
//   <script src="js/mapa.js"></script>   (ou lista.js)

/* ===== Texto ===== */

// "Açúcar" -> "acucar": tira acentos e deixa minúsculo, para comparar textos
const norm = t => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Protege o texto antes de colocar dentro do HTML (evita que "<" quebre a página)
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// 6.99 -> "R$ 6,99"
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ===== Lista de compras no navegador (localStorage) ===== */
const CHAVE_LISTA = "listaCompras";   // [{ item: "arroz", status: "pendente" }, ...]

function lerJSON(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; } catch { return padrao; }
}

function gravarJSON(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* sem armazenamento: vale só nesta visita */ }
}

function lerLista() {
  const l = lerJSON(CHAVE_LISTA, []);
  return Array.isArray(l) ? l.filter(e => e && typeof e.item === "string") : [];
}

const pendentes = () => lerLista().filter(e => e.status === "pendente");
const naLista = nome => lerLista().some(e => norm(e.item) === norm(nome));

// Número vermelho em cima da aba "Lista"
function atualizarBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  const n = pendentes().length;
  badge.textContent = n;
  badge.hidden = !n;
}

// Devolve o valor que mais aparece: maisComum(["a","b","a"]) -> "a"
function maisComum(valores) {
  const m = new Map();
  valores.forEach(v => m.set(v, (m.get(v) || 0) + 1));
  return [...m].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

/* ===== Área da planta onde fica cada produto (usa AREAS_MAPA e REGRAS_AREA do data.js) ===== */
const AREA_POR_SECAO = {};
Object.entries(AREAS_MAPA).forEach(([id, a]) => a.secoes.forEach(s => (AREA_POR_SECAO[s] = id)));

function areaDoProduto(p) {
  const regra = REGRAS_AREA.find(r => r.comeca.some(c => p.nome.startsWith(c)));
  return regra ? regra.area : AREA_POR_SECAO[p.seção] || null;
}
const AREA_DO_PRODUTO = new Map(produtos.map(p => [p, areaDoProduto(p)]));

/* ===== Busca (a mesma para o mapa e para a lista) =====
   Entende plural ("feijões" -> feijão), começo de palavra ("choco" -> chocolate),
   um erro de digitação ("chocolat") e ignora "de", "com", "2kg"... */

const IGNORAR = new Set(["de", "da", "do", "das", "dos", "e", "com", "para", "em", "a", "o", "um", "uma"]);

// Reduz plural: feijões -> feijao, pães -> pao, ovos -> ovo
function radical(p) {
  if (p.length > 3) {
    if (p.endsWith("oes") || p.endsWith("aes")) return p.slice(0, -3) + "ao";
    if (p.endsWith("s")) return p.slice(0, -1);
  }
  return p;
}

const palavrasDe = texto => norm(texto).split(/[^a-z0-9]+/).filter(Boolean).map(radical);

// Palavras do que a pessoa digitou, sem "de", "com"... e sem quantidades como "1kg", "2"
function palavrasBusca(texto) {
  return norm(texto)
    .split(/[^a-z0-9]+/)
    .filter(p => p.length > 1 && !IGNORAR.has(p) && !/^\d+(kg|g|l|ml|un|und)?$/.test(p))
    .map(radical);
}

// Quantas letras é preciso trocar para uma palavra virar a outra
function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

// A palavra digitada (q) combina com a palavra do produto (w)?
function casa(q, w, tolerante, prefixoMin) {
  if (q === w) return true;
  if (q.length >= prefixoMin && w.startsWith(q)) return true; // "choco" -> "chocolate"
  return tolerante && q.length >= 5 && Math.abs(q.length - w.length) <= 1 && distancia(q, w) <= 1;
}

// Palavras de cada produto: só o nome, ou o nome + a área da planta + a seção
const INDICE = produtos.map(p => ({
  produto: p,
  nome: palavrasDe(p.nome),
  comLugar: palavrasDe(p.nome + " " + (AREAS_MAPA[AREA_DO_PRODUTO.get(p)]?.nome || "") + " " + (NOMES_SECOES[p.seção] || ""))
}));

/* buscarItem("feijões") -> { produtos: [...], aproximado: false }
   opções: comLugar  -> também procura no nome da área/seção ("limpeza", "frutas")
           prefixoMin -> a partir de quantas letras vale o começo da palavra (busca enquanto digita usa 2) */
function buscarItem(texto, { comLugar = false, prefixoMin = 4 } = {}) {
  const q = palavrasBusca(texto);
  if (!q.length) return null;

  // 1ª tentativa sem erro; 2ª aceitando um erro de digitação
  for (const tolerante of [false, true]) {
    const achados = INDICE
      .map(e => ({ e, palavras: comLugar ? e.comLugar : e.nome }))
      .filter(({ palavras }) => q.every(t => palavras.some(w => casa(t, w, tolerante, prefixoMin))))
      .map(({ e, palavras }) => ({ produto: e.produto, rank: palavras.findIndex(w => casa(q[0], w, tolerante, prefixoMin)) }))
      .sort((a, b) => a.rank - b.rank);

    if (achados.length) return { produtos: achados.map(a => a.produto), aproximado: tolerante };
  }
  return { produtos: [], aproximado: false };
}

// Produtos de um item da lista digitado à mão ("arroz", "2kg de feijão")
function produtosDoTexto(texto) {
  const exato = produtos.find(p => norm(p.nome) === norm(texto));
  if (exato) return [exato];
  return buscarItem(texto)?.produtos || [];
}

/* ===== Onde fica um item da lista (usado pela lista e pelo mapa) =====
   localizar("arroz") -> {
     area: "cereais",            área da planta com mais produtos que combinam
     produtos: [...],            os produtos dessa área que combinam
     outrasAreas: ["massas"],    outras áreas onde também tem
     preco, precoExato,          preço do produto exato ou o menor encontrado
     aproximado                  true se a busca precisou aceitar erro de digitação
   }
   Devolve null se não achar nada. */
const cacheLocal = new Map();

function localizar(texto) {
  if (cacheLocal.has(texto)) return cacheLocal.get(texto);

  const exato = produtos.find(p => norm(p.nome) === norm(texto));
  const busca = exato ? null : buscarItem(texto);
  const achados = exato ? [exato] : busca?.produtos || [];
  let local = null;

  if (achados.length) {
    const area = maisComum(achados.map(p => AREA_DO_PRODUTO.get(p)));
    const daArea = achados.filter(p => AREA_DO_PRODUTO.get(p) === area);
    local = {
      area,
      produtos: daArea,
      outrasAreas: [...new Set(achados.map(p => AREA_DO_PRODUTO.get(p)))].filter(a => a && a !== area),
      preco: exato ? exato.valor : Math.min(...daArea.map(p => p.valor)),
      precoExato: Boolean(exato),
      aproximado: Boolean(busca?.aproximado)
    };
  }

  cacheLocal.set(texto, local);
  return local;
}

/* ===== Botão "+" dos produtos ===== */

// Põe ou tira o produto da lista e atualiza o badge
function alternarItem(p) {
  const lista = lerLista(), i = lista.findIndex(e => norm(e.item) === norm(p.nome));
  if (i >= 0) lista.splice(i, 1);
  else lista.push({ item: p.nome, status: "pendente" });
  gravarJSON(CHAVE_LISTA, lista);
  atualizarBadge();
}

// A chave "secoesLista" era do mapa de corredores, que não existe mais
try { localStorage.removeItem("secoesLista"); } catch { }

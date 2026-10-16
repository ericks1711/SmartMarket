// Lógica pura da busca: sem DOM. Fica fácil de testar e de trocar por uma API depois.
const SECOES_POR_CORREDOR = 16;

const norm = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const corredorDe = s => Math.ceil(s / SECOES_POR_CORREDOR);
// No mapa, as seções 1-8 de cada corredor ficam à esquerda e 9-16 à direita
const ladoDe = s => ((s - 1) % SECOES_POR_CORREDOR) < 8 ? "esquerdo" : "direito";

// Todas as palavras digitadas precisam aparecer no nome do produto ou no nome da seção.
// Com secaoFixa (toque no mapa) devolve tudo que está naquela seção.
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
      return { p, rank: pos < 0 ? 999 : pos }; // quem começa com a palavra vem primeiro
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank || a.p.nome.localeCompare(b.p.nome))
    .map(a => a.p);
}

// Agrupa por seção na ordem do caminho: corredor 1 -> 2 -> 3, seção crescente
function agruparPorSecao(prods) {
  const grupos = new Map();
  prods.forEach(p => {
    if (!grupos.has(p.seção)) grupos.set(p.seção, []);
    grupos.get(p.seção).push(p);
  });
  return [...grupos].sort((a, b) => a[0] - b[0]);
}

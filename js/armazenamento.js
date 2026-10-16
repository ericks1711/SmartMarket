// Tudo que lê/grava no navegador (localStorage) fica aqui. lista.js usa as mesmas chaves.
const CHAVE_LISTA = "listaCompras";
const CHAVE_SECOES = "secoesLista";

function lerJSON(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; } catch { return padrao; }
}
function gravarJSON(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* sem armazenamento */ }
}

function lerLista() {
  const l = lerJSON(CHAVE_LISTA, []);
  return Array.isArray(l) ? l : [];
}
const secoesDaLista = () => lerJSON(CHAVE_SECOES, []);
const naLista = nome => lerLista().some(e => norm(e.item) === norm(nome));

// Adiciona o produto à lista, ou tira se já estiver nela
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

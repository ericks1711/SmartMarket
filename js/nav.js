// Contador de itens pendentes na aba "Lista" (usado nas duas páginas)
function atualizarBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  let n = 0;
  try { n = (JSON.parse(localStorage.getItem("listaCompras")) || []).filter(e => e.status === "pendente").length; } catch { }
  badge.textContent = n;
  badge.hidden = !n;
}
atualizarBadge();

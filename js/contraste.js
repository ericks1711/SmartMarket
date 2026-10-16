// ===== SmartMarket — botão de alto contraste =====
// Carregue este arquivo dentro do <head> de cada página (sem "defer"),
// assim o contraste é aplicado antes da página aparecer, sem piscar.

(function () {
  var CHAVE = 'smartmarket-alto-contraste';
  var raiz = document.documentElement;

  function lerPreferencia() {
    try { return localStorage.getItem(CHAVE) === 'sim'; } catch (e) { return false; }
  }

  function salvarPreferencia(ligado) {
    try { localStorage.setItem(CHAVE, ligado ? 'sim' : 'nao'); } catch (e) {}
  }

  // Aplica já, antes de desenhar a página
  if (lerPreferencia()) raiz.classList.add('alto-contraste');

  function criarBotao() {
    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-contraste';
    botao.innerHTML =
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"></circle>' +
      '<path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"></path>' +
      '</svg>';

    function atualizar() {
      var ligado = raiz.classList.contains('alto-contraste');
      botao.setAttribute('aria-pressed', ligado ? 'true' : 'false');
      botao.setAttribute('aria-label', ligado ? 'Desligar alto contraste' : 'Ligar alto contraste');
      botao.title = ligado ? 'Desligar alto contraste' : 'Ligar alto contraste';
    }

    botao.addEventListener('click', function () {
      var ligado = raiz.classList.toggle('alto-contraste');
      salvarPreferencia(ligado);
      atualizar();
    });

    atualizar();

    // Se a página tiver um lugar reservado (id="lugar-contraste"), o botão vai lá;
    // senão, fica flutuando no canto superior direito.
    var lugar = document.getElementById('lugar-contraste');
    if (lugar) {
      botao.classList.add('botao-contraste--no-lugar');
      lugar.appendChild(botao);
    } else {
      document.body.appendChild(botao);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', criarBotao);
  } else {
    criarBotao();
  }
})();

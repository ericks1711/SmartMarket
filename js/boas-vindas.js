// ===== SmartMarket — Tela de boas-vindas =====

// Página para onde o botão leva no último slide (troque se criar uma tela de cadastro)
const DESTINO_FINAL = 'index.html';

// Marca que a pessoa já viu as boas-vindas, para o index.html não mandar ela de volta pra cá
try { localStorage.setItem('smartmarket-boas-vindas', 'vista'); } catch (e) {}

const slides = [
  {
    titulo: 'Ache qualquer produto.',
    texto: 'Digite o que procura e o SmartMarket mostra em que seção do mercado ele está.'
  },
  {
    titulo: 'O mercado na palma da mão.',
    texto: 'Veja o mapa das seções e toque em cada uma para descobrir o que tem lá.'
  },
  {
    titulo: 'Sua lista, sempre com você.',
    texto: 'Junte tudo o que precisa numa lista e consulte enquanto anda pelos corredores.'
  }
];

const titulo = document.getElementById('bv-titulo');
const descricao = document.getElementById('bv-descricao');
const blocoTexto = document.querySelector('.bv-texto');
const pontos = document.querySelectorAll('.bv-ponto');
const botao = document.getElementById('bv-continuar');
const botaoTexto = document.getElementById('bv-botao-texto');

let atual = 0;

function mostrarSlide(indice) {
  atual = indice;
  blocoTexto.classList.add('trocando');

  setTimeout(() => {
    titulo.textContent = slides[indice].titulo;
    descricao.textContent = slides[indice].texto;
    blocoTexto.classList.remove('trocando');
  }, 180);

  pontos.forEach((ponto, i) => {
    const ativo = i === indice;
    ponto.classList.toggle('ativo', ativo);
    if (ativo) ponto.setAttribute('aria-current', 'true');
    else ponto.removeAttribute('aria-current');
  });

  botaoTexto.textContent = indice === slides.length - 1 ? 'Começar' : 'Continuar';
}

pontos.forEach((ponto, i) => {
  ponto.addEventListener('click', () => mostrarSlide(i));
});

botao.addEventListener('click', () => {
  if (atual < slides.length - 1) {
    mostrarSlide(atual + 1);
  } else {
    window.location.href = DESTINO_FINAL;
  }
});

// Arrastar para o lado no celular
let inicioX = null;
document.querySelector('.bv-tela').addEventListener('touchstart', (e) => {
  inicioX = e.touches[0].clientX;
}, { passive: true });

document.querySelector('.bv-tela').addEventListener('touchend', (e) => {
  if (inicioX === null) return;
  const diferenca = e.changedTouches[0].clientX - inicioX;
  if (diferenca < -50 && atual < slides.length - 1) mostrarSlide(atual + 1);
  if (diferenca > 50 && atual > 0) mostrarSlide(atual - 1);
  inicioX = null;
});

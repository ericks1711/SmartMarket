algoritmo "ParOuImpar"
var
   numero: inteiro
inicio
   escreva("Digite um número inteiro: ")
   leia(numero)
   se (numero MOD 2 = 0) entao
      escreval("O número ", numero, " é PAR.")
   senao
      escreval("O número ", numero, " é ÍMPAR.")
   fimse
fimalgoritmo
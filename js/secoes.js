// Nome de cada seção do mercado (seções sem nome ainda não têm produtos)
const NOMES_SECOES = {
  1: "Frutas", 2: "Verduras e Legumes", 3: "Leites", 4: "Padaria", 5: "Bebidas (Águas)", 6: "Laticínios", 7: "Frios", 8: "Biscoitos e Salgadinhos",
  9: "Carnes", 10: "Confeitaria", 11: "Congelados", 12: "Bebidas (Refrigerantes e Sucos)", 13: "Sorvetes", 14: "Doces", 15: "Mercearia", 16: "Molhos",
  17: "Condimentos", 18: "Óleos e Vinagres", 19: "Temperos", 20: "Limpeza", 21: "Higiene Pessoal", 22: "Utilidades de Limpeza", 23: "Papelaria Doméstica",
  24: "Perfumaria", 25: "Bebidas Alcoólicas", 26: "Vinhos", 27: "Energéticos", 28: "Chás e Infusões", 30: "Produtos para Animais", 31: "Higiene Animal",
  33: "Peixaria", 34: "Salgados e Massas Prontas", 35: "Elétrica", 36: "Ferramentas e Utilidades", 38: "Descartáveis", 40: "Material Escolar",
  41: "Papelaria", 42: "Eletrônicos e Acessórios", 43: "Bebês", 44: "Alimentação Infantil", 45: "Jardinagem", 46: "Aquarismo", 47: "Churrasco", 48: "Utilidades / Automotivo"
};

// Cor dominante dos produtos de cada seção (matiz HSL), usada para "encher" as prateleiras do mapa
const TONS_SECOES = {
  1: 100, 2: 130, 3: 210, 4: 32, 5: 195, 6: 48, 7: 350, 8: 25, 9: 5, 10: 330, 11: 185, 12: 12, 13: 300, 14: 340, 15: 40, 16: 8, 17: 35, 18: 55, 19: 90, 20: 175,
  21: 280, 22: 200, 23: 45, 24: 310, 25: 20, 26: 345, 27: 60, 28: 120, 30: 25, 31: 220, 33: 200, 34: 30, 35: 50, 36: 215, 38: 160, 40: 260, 41: 230, 42: 240,
  43: 320, 44: 35, 45: 110, 46: 190, 47: 8, 48: 215
};

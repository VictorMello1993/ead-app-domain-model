export class NomesCapitulo {
  static aleatorio(): string {
    const index = Math.floor(Math.random() * NomesCapitulo.nomes.length);
    return NomesCapitulo.nomes[index];
  }

  static readonly nomes = [
    "Introdução",
    "Conclusão",
    "Conceitos Básicos",
    "Fundamentos",
    "Desafios",
    "Configuração do Ambiente",
    "Teoria",
    "Prática"
  ];
}

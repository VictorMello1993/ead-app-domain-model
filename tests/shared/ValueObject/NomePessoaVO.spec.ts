import Erros from "@/constants/Erros";
import { NomePessoaVO } from "@/shared/ValueObject/NomePessoaVO";

test("Deve lançar erro ao tentar criar nome vazio", () => {
  expect(() => new NomePessoaVO("")).toThrow(Erros.NOME_VAZIO);
  expect(() => new NomePessoaVO()).toThrow(Erros.NOME_VAZIO);
});

test("Deve lançar vários erros ao tentar criar nome vazio", () => {
  try {
    new NomePessoaVO();
  } catch (erros: any) {
    expect(erros[0].codigo).toBe(Erros.NOME_VAZIO);
    expect(erros[1].codigo).toBe(Erros.NOME_PEQUENO);
    expect(erros[1].extras.min).toBe(4);
    expect(erros[2].codigo).toBe(Erros.NOME_SEM_SOBRENOME);
  }
});

test("Deve lançar erro ao tentar criar nome menor que 4 caracteres", () => {
  expect(() => new NomePessoaVO("ab c")).toThrow(Erros.NOME_PEQUENO);
});

test("Deve lançar erro ao tentar criar nome maior que 120 caracteres", () => {
  const nome = "Pedro de Alcântara João Carlos Leopoldo Salvador Bibiano Francisco Xavier de Paula Leocádio Miguel Gabriel Rafael Gonzaga, d. Pedro II";
  expect(() => new NomePessoaVO(nome)).toThrow(Erros.NOME_GRANDE);
});

test("Deve lançar erro ao tentar criar nome sem sobrenome", () => {
  expect(() => new NomePessoaVO("Victor")).toThrow(Erros.NOME_SEM_SOBRENOME);
});

test("Deve lançar erro ao tentar criar nome com caracteres especiais", () => {
  expect(() => new NomePessoaVO("Victor Santos @0000Victor")).toThrow(Erros.NOME_CARACTERES_INVALIDOS);
});

test("Deve criar nome com sobrenome", () => {
  const nome = new NomePessoaVO("Victor Santos de Mello");
  expect(nome.nomeCompleto).toBe("Victor Santos de Mello");
  expect(nome.primeiroNome).toBe("Victor");
  expect(nome.sobrenomes).toEqual(["Santos", "de", "Mello"]);
  expect(nome.ultimoSobrenome).toEqual("Mello");
});

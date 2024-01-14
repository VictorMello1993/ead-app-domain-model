import { NomeSimplesVO } from "@/shared/ValueObject/NomeSimplesVO";

test("Deve retornar nome simples", () => {
  const nome = new NomeSimplesVO("Desenvolvimento Fullstack", 3, 30);
  expect(nome.completo).toBe("Desenvolvimento Fullstack");
});

test("Deve retornar erro com nome vazio ou undefined", () => {
  expect(() => new NomeSimplesVO(undefined as any, 3, 50)).toThrow();
  expect(() => new NomeSimplesVO("", 3, 50)).toThrow();
});

test("Deve lançar erro com nome muito pequeno", () => {
  expect(() => new NomeSimplesVO("Dev", 4, 50)).toThrow();
});

test("Deve lançar erro com nome muito grande", () => {
  expect(() => new NomeSimplesVO("Desenvolvimento Fullstack", 3, 10)).toThrow();
});

test("Deve retornar o nome em pascal case", () => {
  const nome = new NomeSimplesVO("arquitetura de computadores", 3, 30);
  expect(nome.pascalCase).toBe("Arquitetura De Computadores");
});

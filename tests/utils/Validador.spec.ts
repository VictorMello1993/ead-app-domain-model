import { Validador } from "@/utils/Validador";

test("Deve retornar null com texto não nulo", () => {
  const erro = Validador.naoNulo("Boa noite", "Texto inválido");
  expect(erro).toBeNull();
});

test("Deve retornar erro com texto nulo", () => {
  const msgErro = "Texto inválido";
  const erro = Validador.naoNulo(null, msgErro);
  expect(erro?.codigo).toBe(msgErro);
});

test("Deve retornar erro com texto nulo", () => {
  const msgErro = "Texto inválido";
  const erro = Validador.naoNulo(null, msgErro);
  expect(erro?.codigo).toBe(msgErro);
});

test("Deve retornar null com texto não vazio", () => {
  const erro = Validador.naoVazio("ABC", "Texto vazio");
  expect(erro).toBeNull();
});

test("Deve retornar erro com texto vazio e/ou nulo", () => {
  const msgErro = "Texto inválido";
  const erro1 = Validador.naoVazio("            ", msgErro);
  const erro2 = Validador.naoVazio(null, msgErro);
  expect(erro1?.codigo).toBe(msgErro);
  expect(erro2?.codigo).toBe(msgErro);
});

test("Deve retornar erro com texto undefined", () => {
  const msgErro = "Texto inválido";
  const erro1 = Validador.naoVazio(undefined, msgErro);
  expect(erro1?.codigo).toBe(msgErro);
});

test("Deve retornar null com texto menor que o tamanho máximo", () => {
  const erro = Validador.tamanhoMenorQue("teste", 6, "erro");
  expect(erro).toBeNull();
});

test("Deve retornar null com texto menor ou igual que o tamanho máximo", () => {
  const erro = Validador.tamanhoMenorQueOuIgual("teste", 5, "erro");
  expect(erro).toBeNull();
});

test("Deve retornar erro com texto maior que o tamanho máximo", () => {
  const erro = Validador.tamanhoMenorQue("Bom dia", 6, "erro");
  expect(erro?.codigo).toBe("erro");
});

test("Deve retornar erro com texto maior ou igual que o tamanho máximo", () => {
  const erro = Validador.tamanhoMenorQueOuIgual("Bom dia", 6, "erro");
  expect(erro?.codigo).toBe("erro");
});

test("Deve retornar null com texto maior que o tamanho mínimo", () => {
  const erro = Validador.tamanhoMaiorQue("teste", 4, "erro");
  expect(erro).toBeNull();
});

test("Deve retornar erro com texto menor que o tamanho mínimo", () => {
  const erro = Validador.tamanhoMaiorQue("bom", 4, "erro");
  expect(erro?.codigo).toBe("erro");
});

test("Deve retornar null com texto maior ou igual que o tamanho mínimo", () => {
  const erro = Validador.tamanhoMaiorQueOuIgual("teste", 5, "erro");
  expect(erro).toBeNull();
});

test("Deve retornar erro com texto menor ou igual que tamanho mínimo", () => {
  const erro = Validador.tamanhoMaiorQueOuIgual("Bom dia", 8, "erro");
  expect(erro?.codigo).toBe("erro");
});

test("Deve validar regex que só tem números", () => {
  const erro = Validador.regex("1234567890", /\d{10}/, "erro");
  expect(erro).toBeNull();
});

test("Deve retornar erro na validação de números", () => {
  const erro = Validador.regex("123456f7890", /\d{10}/, "erro");
  expect(erro?.codigo).toBe("erro");
});

test("Deve combinar os erros", () => {
  const erros = Validador.combinar(
    Validador.naoVazio("", "erro1"),
    Validador.naoVazio("", "erro2"),
    Validador.naoVazio("", "erro3"),
    Validador.naoVazio("teste", "nao erro 4"),
    Validador.naoVazio("", "erro5")
  );

  expect(erros?.map(erro => erro.codigo).join(", ")).toBe("erro1, erro2, erro3, erro5");
});

test("Deve combinar sem erros", () => {
  const erros = Validador.combinar(
    Validador.naoVazio("teste1", "nao erro 1"),
    Validador.naoVazio("teste2", "nao erro 2"),
    Validador.naoVazio("teste3", "nao erro 3"),
    Validador.naoVazio("teste4", "nao erro 4")
  );

  expect(erros).toBeNull();
});

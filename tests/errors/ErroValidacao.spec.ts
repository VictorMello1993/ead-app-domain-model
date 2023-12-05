import { ErroValidacao } from "@/errors/ErroValidacao";
import Erros from "@/constants/Erros";

test("Deve lançar um erro", () => {
  expect(() => ErroValidacao.lancar("Erro", "Valor")).toThrow("Erro");
  expect(() => ErroValidacao.lancar(undefined, "Valor")).toThrow(Erros.DESCONHECIDO);
});

test("Deve criar um erro com código e valor", () => {
  const erro = new ErroValidacao({
    codigo: Erros.EMAIL_INVALIDO,
    valor: "victor@"
  });

  expect(erro.codigo).toBe(Erros.EMAIL_INVALIDO);
  expect(erro.valor).toBe("victor@");
});

test("Deve criar um erro com código, valor e extras", () => {
  const erro = new ErroValidacao({
    codigo: Erros.NOME_PEQUENO,
    valor: "Pedro",
    extras: { min: 6 }
  });

  expect(erro.codigo).toBe(Erros.NOME_PEQUENO);
  expect(erro.valor).toBe("Pedro");
  expect(erro.extras.min).toEqual(6);
});

test("Deve criar um erro sem código especificado", () => {
  const erro1 = ErroValidacao.novo();
  const erro2 = new ErroValidacao();
  expect(erro1.codigo).toBe(Erros.DESCONHECIDO);
  expect(erro2.codigo).toBe(Erros.DESCONHECIDO);
});

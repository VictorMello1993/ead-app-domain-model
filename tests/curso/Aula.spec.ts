import Erros from "@/constants/Erros";
import { AulaBuilder } from "@/tests/data/AulaBuilder";

test("Deve lançar erro ao criar aula com duração zerada", () => {
  expect(() => AulaBuilder.criar().comDuracao(0).agora()).toThrow(Erros.AULA_DURACAO_ZERADA);
});

test("Deve criar uma aula com ordem padrão como 1", () => {
  const aula = AulaBuilder.criar().semOrdem().agora();
  expect(aula.ordem.valor).toBe(1);
});

test("Deve lançar erro ao tentar criar aula com ordem negativa ou zero", () => {
  expect(() => AulaBuilder.criar().comOrdem(0).agora()).toThrow(Erros.ORDEM_INVALIDA);
  expect(() => AulaBuilder.criar().comOrdem(-10).agora()).toThrow(Erros.ORDEM_INVALIDA);
});

test("Deve lançar erro ao tentar criar aula com nome pequeno", () => {
  expect(() => AulaBuilder.criar().comNome("x").agora()).toThrow(Erros.NOME_PEQUENO);
});

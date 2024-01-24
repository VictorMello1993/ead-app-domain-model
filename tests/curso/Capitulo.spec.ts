import Erros from "@/constants/Erros";
import { CapituloBuilder } from "@/tests/data/CapituloBuilder";
import { AulaBuilder } from "@/tests/data/AulaBuilder";

test("Deve lançar erro ao tentar criar capítulo sem nome", () => {
  expect(() => CapituloBuilder.criar().semNome().agora()).toThrow(Erros.NOME_VAZIO);
});

test("Deve lançar erro ao tentar criar capítulo sem aulas", () => {
  expect(() => CapituloBuilder.criar().semAulas().agora()).toThrow(Erros.CAPITULO_SEM_AULAS);
});

test("Deve criar capítulos com ordem padrão como 1", () => {
  const capitulo = CapituloBuilder.criar().comOrdem(1).agora();
  expect(capitulo.ordem.valor).toBe(1);
});

test("Deve lançar erro ao tentar criar capítulo com ordem negativa ou zero", () => {
  expect(() => CapituloBuilder.criar().comOrdem(0).agora()).toThrow(Erros.ORDEM_INVALIDA);
  expect(() => CapituloBuilder.criar().comOrdem(-100).agora()).toThrow(Erros.ORDEM_INVALIDA);
});

test("Deve calcular a duração do capítulo", () => {
  const aulas = [
    AulaBuilder.criar("Aula #1").comDuracao(63).comOrdem(1).agora(),
    AulaBuilder.criar("Aula #2").comDuracao(1007).comOrdem(2).agora(),
    AulaBuilder.criar("Aula #3").comDuracao(3784).comOrdem(3).agora()
  ];

  const capitulo = CapituloBuilder.criar().comAulas(aulas).agora();
  expect(capitulo.duracao.segundos).toBe(4854);
  expect(capitulo.duracao.hm).toBe("01h 20m");
});

test("Deve ordenar corretamente as aulas de um capítulo", () => {
  const aulas = [
    AulaBuilder.criar("Aula #1").comDuracao(63).semOrdem().agora(),
    AulaBuilder.criar("Aula #2").comDuracao(1007).semOrdem().agora(),
    AulaBuilder.criar("Aula #3").comDuracao(3784).semOrdem().agora()
  ];

  const capitulo = CapituloBuilder.criar().comAulas(aulas).agora();

  expect(capitulo.aulas[0].ordem.valor).toBe(1);
  expect(capitulo.aulas[1].ordem.valor).toBe(2);
  expect(capitulo.aulas[2].ordem.valor).toBe(3);
});

test("Deve ordenar corretamente as aulas de um capítulo via props", () => {
  const aulas = [
    AulaBuilder.criar("Aula #1").comDuracao(63).semOrdem().agora(),
    AulaBuilder.criar("Aula #2").comDuracao(1007).semOrdem().agora(),
    AulaBuilder.criar("Aula #3").comDuracao(3784).semOrdem().agora()
  ];

  const capitulo = CapituloBuilder.criar().comAulas(aulas).agora();

  expect(capitulo.props.aulas![0].ordem).toBe(1);
  expect(capitulo.props.aulas![1].ordem).toBe(2);
  expect(capitulo.props.aulas![2].ordem).toBe(3);
});

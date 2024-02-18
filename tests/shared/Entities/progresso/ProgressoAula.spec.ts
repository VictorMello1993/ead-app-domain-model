import { ProgressoAulaBuilder } from "@/tests/data/ProgressoAulaBuilder";
import Erros from "@/constants/Erros";

test("Deve retornar concluído como true mesmo quando não iniciado", () => {
  const progresso = ProgressoAulaBuilder.criar().naoIniciado().concluido().agora();
  expect(progresso.concluido).toBeTruthy();
});

test("Deve concluir progresso sem iniciá-lo", () => {
  const progresso = ProgressoAulaBuilder.criar().naoIniciado().naoConcluido().agora();
  const progressoConcluido = progresso.concluir();
  const dataConclusao = progressoConcluido.dataConclusao!.getTime();
  const dataAtual = new Date().getTime();

  expect(progressoConcluido.iniciado).toBeFalsy();
  expect(progressoConcluido.concluido).toBeTruthy();
  expect(dataAtual - dataConclusao).toBeLessThan(1000);
});

test("Deve concluir progresso mesmo sendo iniciado", () => {
  const progresso = ProgressoAulaBuilder.criar().iniciado().naoConcluido().agora();
  const progressoConcluido = progresso.concluir();

  expect(progressoConcluido.iniciado).toBeTruthy();
  expect(progressoConcluido.concluido).toBeTruthy();
});

test("Deve lançar erro quando o nome da aula for indefinido", () => {
  expect(() => ProgressoAulaBuilder.criar().semNomeAula().agora()).toThrow(Erros.NOME_VAZIO);
});

test("Deve lançar erro quando a duração for zerada", () => {
  expect(() => ProgressoAulaBuilder.criar().comDuracao(0).agora()).toThrow(Erros.DURACAO_ZERADA);
});

test("Deve lançar erro quando a duração for negativa", () => {
  expect(() => ProgressoAulaBuilder.criar().comDuracao(-10).agora()).toThrow(Erros.DURACAO_NEGATIVA);
});

test("Deve lançar erro quando id for undefined", () => {
  expect(() => ProgressoAulaBuilder.criar().semId().agora()).toThrow(Erros.ID_INVALIDO);
});

test("Deve iniciar o progresso da aula", () => {
  const progresso = ProgressoAulaBuilder.criar().naoIniciado().naoConcluido().agora();
  const novoProgresso = progresso.iniciar();

  expect(novoProgresso.dataInicio).toBeDefined();
  expect(novoProgresso.iniciado).toBeTruthy();
  expect(novoProgresso.dataConclusao).toBeUndefined();
  expect(novoProgresso.concluido).toBeFalsy();
});

test("Deve zerar o progresso da aula", () => {
  const progresso = ProgressoAulaBuilder.criar().iniciado().concluido().agora();

  expect(progresso.dataInicio).toBeDefined();
  expect(progresso.iniciado).toBeTruthy();
  expect(progresso.dataConclusao).toBeDefined();
  expect(progresso.concluido).toBeTruthy();

  const novoProgresso = progresso.zerar();

  expect(novoProgresso.dataInicio).toBeDefined();
  expect(novoProgresso.iniciado).toBeTruthy();
  expect(novoProgresso.dataConclusao).toBeUndefined();
  expect(novoProgresso.concluido).toBeFalsy();
});

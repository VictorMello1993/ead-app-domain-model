import Erros from "@/constants/Erros";
import { ProgressoCursoBuilder } from "@/tests/data/ProgressoCursoBuilder";
import { ProgressoAulaBuilder } from "@/tests/data/ProgressoAulaBuilder";
import { ProgressoAulaProps } from "@/shared/Entities/progresso/ProgressoAula";
import { ProgressoCurso } from "../../../../src/shared/Entities/progresso/ProgressoCurso";

const builder = () => ProgressoAulaBuilder.criar().naoIniciado().naoConcluido();

const aulas: ProgressoAulaProps[] = [
  builder().comDuracao(100).agora().props,
  builder().comDuracao(200).agora().props,
  builder().comDuracao(300).agora().props,
  builder().comDuracao(400).agora().props,
  builder().comDuracao(500).agora().props
];

test("Deve lançar erro ao criar progresso sem aulas", () => {
  expect(() => ProgressoCursoBuilder.criar().semAulas().agora()).toThrow(Erros.PROGRESSO_SEM_AULA);
  expect(() => ProgressoCursoBuilder.criar().comAulas([]).agora()).toThrow(Erros.PROGRESSO_SEM_AULA);
});

test("Deve calcular a duração assistida", () => {
  let progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();
  expect(progresso.duracaoAssistida.segundos).toBe(0);

  progresso = progresso.concluirESelecionarProximaAula();
  expect(progresso.duracaoAssistida.segundos).toBe(100);

  progresso = progresso.concluirESelecionarProximaAula();
  expect(progresso.duracaoAssistida.segundos).toBe(300);

  progresso = progresso.concluirESelecionarProximaAula();
  expect(progresso.duracaoAssistida.segundos).toBe(600);
});

test("Deve calcular a duração total", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();
  expect(progresso.duracaoTotal.segundos).toBe(1500);
});

test("Ao criar aulas num curso, o percentual assistido deve ser zero", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();
  expect(progresso.percentualAssistido).toBe(0);
});

test("Deve calcular o percentual de progresso", () => {
  const progresso = ProgressoCursoBuilder
    .criar()
    .comAulas(aulas)
    .agora()
    .concluirESelecionarProximaAula()
    .concluirESelecionarProximaAula()
    .concluirESelecionarProximaAula();

  expect(progresso.percentualAssistido).toBe(40);
});

test("Deve concluir a aula atual", () => {
  const progresso = ProgressoCursoBuilder
    .criar()
    .comAulas(aulas)
    .agora()
    .concluirAulaAtual()
    .concluirAulaAtual();

  expect(progresso.aulas[0].concluido).toBeTruthy();
  expect(progresso.aulas[1].concluido).toBeFalsy();
});

test("Deve concluir curso", () => {
  const progresso = ProgressoCursoBuilder
    .criar()
    .comAulas(aulas)
    .agora();

  expect(progresso.percentualAssistido).toBe(0);
  expect(progresso.concluido).toBeFalsy();

  const progressoConcluido = progresso
    .concluirESelecionarProximaAula()
    .concluirESelecionarProximaAula()
    .concluirESelecionarProximaAula()
    .concluirESelecionarProximaAula()
    .concluirESelecionarProximaAula();

  expect(progressoConcluido.percentualAssistido).toBe(100);
  expect(progressoConcluido.concluido).toBeTruthy();
});

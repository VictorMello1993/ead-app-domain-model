import Erros from "@/constants/Erros";
import { ProgressoCursoBuilder } from "@/tests/data/ProgressoCursoBuilder";
import { ProgressoAulaBuilder } from "@/tests/data/ProgressoAulaBuilder";
import { ProgressoAulaProps } from "@/shared/Entities/progresso/ProgressoAula";
import { faker } from "@faker-js/faker";

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

test("Deve concluir curso aula por aula", () => {
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

test("Deve concluir curso", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();

  expect(progresso.percentualAssistido).toBe(0);
  expect(progresso.concluido).toBeFalsy();

  const progressoConcluido = progresso.concluirCurso();

  expect(progressoConcluido.percentualAssistido).toBe(100);
  expect(progressoConcluido.concluido).toBeTruthy();
});

test("Deve retornar o mesmo curso ao tentar concluir mais de uma vez", () => {
  const progresso = ProgressoCursoBuilder
    .criar()
    .comAulas(aulas)
    .agora()
    .concluirCurso();

  expect(progresso.concluirAulaAtual()).toBe(progresso);
  expect(progresso.concluirCurso()).toBe(progresso);
});

test("Deve selecionar progresso da aula por id", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();
  const selecionado = progresso.progressoAula(aulas[2].id!); // Selecionando terceiro progresso da aula

  console.log(selecionado);

  expect(selecionado!.id.valor).toBe(aulas[2].id!);
  expect(progresso.progressoAula("")).toBeUndefined();
});

test("Deve criar um progresso com data indefinida", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).semData().agora();
  expect(progresso.data).toBeDefined();
  expect(progresso.data.getTime()).toBeLessThan(Date.now());
  expect((Date.now() - progresso.data.getTime())).toBeLessThanOrEqual(1);
});

test("Deve criar progresso concluindo uma aula selecionada", () => {
  const progresso = ProgressoCursoBuilder
    .criar()
    .comAulas(aulas)
    .comAulaSelecionadaId(aulas[4].id!) // Selecionando 5ª aula
    .agora()
    .concluirAulaAtual();

  expect(progresso.duracaoAssistida.segundos).toBe(500);
});

test("Deve criar progresso sem aula selecionada", () => {
  const progresso = ProgressoCursoBuilder
    .criar()
    .comAulas(aulas)
    .semAulaSelecionadaId()
    .agora() // Sem aula selecionada, por padrão irá obter a primeira aula
    .concluirAulaAtual();

  expect(progresso.duracaoAssistida.segundos).toBe(100);
});

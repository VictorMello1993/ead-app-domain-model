import Erros from "@/constants/Erros";
import { ProgressoCursoBuilder } from "@/tests/data/ProgressoCursoBuilder";
import { ProgressoAulaBuilder } from "@/tests/data/ProgressoAulaBuilder";
import { ProgressoAulaProps } from "@/shared/Entities/progresso/ProgressoAula";
import { CursoConcluido } from "@/shared/Events/CursoConcluido";
import { faker } from "@faker-js/faker";
import { IdVO } from "@/shared/ValueObject/IdVO";

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

const aulaRisco = (minutoAssistido: number, duracaoEmMinutos: number) => {
  return ProgressoAulaBuilder
    .criar()
    .comDataInicio(new Date(2024, 0, 10, 9, minutoAssistido)) // Aula criada no dia 10/01/24 09:Xmin:00
    .comDuracao(60 * duracaoEmMinutos)
    .agora()
    .props;
};

test("Deve calcular como risco de fraude como 0%", () => {
  const aulas = [
    aulaRisco(7, 3), // Data início: 10/01/24 09:07:00 -> Duração: 180 segundos -> 20% de 180 = 36 segundos
    aulaRisco(8, 5), // Data início: 10/01/24 09:08:00 -> Duração: 300 segundos -> 20% de 300 = 60 segundos
    aulaRisco(10, 7), // Data início: 10/01/24 09:10:00 -> Duração: 420 segundos -> 20% de 420 = 84 segundos
    aulaRisco(12, 2), // Data início: 10/01/24 09:12:00 -> Duração: 120 segundos -> 20% de 120 = 24 segundos
    aulaRisco(13, 1) // Data início: 10/01/24 09:13:00 -> Duração: 60 segundos  -> 20% de 60  = 12 segundos
  ];

  // Duração total: 1080 segundos (18 min)
  // Intervalo real: 1min (60 seg), 2min (120 seg), 2min (120 seg), 1min (60 seg)
  //                36 seg < 60s: 0 -> 60 seg < 120 seg: 0 -> 84 seg < 120 seg: 0 -> 24 seg < 60 seg: 0

  // Intervalos entre aulas: 4
  // Total risco de fraude: 0 / 4 => 0%
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();

  expect(progresso.riscoDeFraude()).toBe(0);
});

test("Deve calcular o risco de fraude como 25%", () => {
  const aulas = [
    aulaRisco(7, 3), // Data início: 10/01/24 09:07:00 -> Duração: 180 segundos -> 20% de 180 = 36 segundos
    aulaRisco(8, 5), // Data início: 10/01/24 09:08:00 -> Duração: 300 segundos -> 20% de 300 = 60 segundos
    aulaRisco(10, 7), // Data início: 10/01/24 09:10:00 -> Duração: 420 segundos -> 20% de 420 = 84 segundos
    aulaRisco(11, 2), // Data início: 10/01/24 09:11:00 -> Duração: 60 segundos  -> 20% de 60  = 12 segundos
    aulaRisco(13, 1) // Data início: 10/01/24 09:13:00 -> Duração: 60 segundos  -> 20% de 60  = 12 segundos
  ];

  // OBS: a terceira aula entrou no intervalo suspeito, pois assistiu num tempo menor em relação à quarta aula
  //     Ou seja, 84 seg (intervalo suspeito) > 60 seg (intervalo real)

  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();
  expect(progresso.riscoDeFraude()).toBe(25);
});

test("Deve calcular o risco de fraude como 100%", () => {
  const aulas = [
    aulaRisco(7, 8),
    aulaRisco(8, 12),
    aulaRisco(9, 17),
    aulaRisco(10, 23),
    aulaRisco(11, 9)
  ];

  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();
  expect(progresso.riscoDeFraude()).toBe(100);
});

test("Deve calcular como risco de fraude como 0% se curso possui apenas uma aula", () => {
  const progresso = ProgressoCursoBuilder.criar(1).agora().concluirCurso();
  expect(progresso.riscoDeFraude()).toBe(0);
});

test("Deve iniciar aula atual", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora();
  const novo = progresso.iniciarAulaAtual();
  expect(novo.aulas[0].iniciado).toBeTruthy();
});

test("Deve zerar conclusão de uma aula", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora().concluirCurso();
  expect(progresso.concluido).toBeTruthy();

  const novoProgresso = progresso.zerarAula(progresso.aulas[0].id.valor);
  expect(novoProgresso.concluido).toBeFalsy();
  expect(novoProgresso.aulas[0].concluido).toBeFalsy();
});

test("Deve alternar a conclusão de uma aula", () => {
  const progresso = ProgressoCursoBuilder.criar().comAulas(aulas).agora().concluirCurso();
  expect(progresso.concluido).toBeTruthy();
  expect(progresso.aulas[0].concluido).toBeTruthy();

  const novoProgresso = progresso.alternarAula(progresso.aulas[0].id.valor);
  expect(novoProgresso.concluido).toBeFalsy();
  expect(novoProgresso.aulas[0].concluido).toBeFalsy();

  const novoProgresso2 = novoProgresso.alternarAula(novoProgresso.aulas[0].id.valor);
  expect(novoProgresso2.concluido).toBeTruthy();
  expect(novoProgresso2.aulas[0].concluido).toBeTruthy();
});

test("Deve ignorar a alternância da conclusão de uma aula com id inexistente", () => {
  const progresso = ProgressoCursoBuilder.criar().agora();
  const novoProgresso = progresso.alternarAula("blabla");
  expect(novoProgresso).toBe(progresso);
});

test("Deve notificar a conclusão do curso", () => {
  const email = faker.internet.email();
  const id = IdVO.novo.valor;

  const progresso = ProgressoCursoBuilder.criar().comEmailUsuario(email).comId(id).agora().registrar({
    eventoOcorreu(evento: CursoConcluido) {
      expect(evento.idCurso.valor).toBe(id);
      expect(evento.emailUsuario.valor).toBe(email);
      expect(evento.data).toBeDefined();
    }
  });

  progresso.concluirCurso();
});

test("Deve ignorar a notificação de conclusão do curso já concluído", () => {
  const progressoConcluido = ProgressoCursoBuilder.criar().agora().concluirCurso();
  const progresso = progressoConcluido.registrar({
    eventoOcorreu(evento: CursoConcluido) {
      throw new Error("Deve falhar se o método for chamado");
    }
  });
  const aulaId = progresso.aulas[0].id.valor;
  progresso.zerarAula(aulaId).concluirCurso();
});

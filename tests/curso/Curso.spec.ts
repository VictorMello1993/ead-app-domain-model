import { CursoBuilder } from "@/tests/data/CursoBuilder";
import Erros from "@/constants/Erros";
import { AulaBuilder } from "../data/AulaBuilder";
import { CapituloBuilder } from "../data/CapituloBuilder";
import { IdVO } from "@/shared/ValueObject/IdVO";
import { NomesCurso } from "../data/NomesCurso";
import { Curso } from "@/shared/Aggregates/Curso/Curso";

test("Deve criar um curso com um novo id", () => {
  const curso = CursoBuilder.criar().semId().agora();
  expect(curso.id.valor).not.toBeNull();
});

test("Deve lançar erro ao tentar criar curso sem nome", () => {
  expect(() => CursoBuilder.criar().semNome().agora()).toThrow(Erros.NOME_VAZIO);
});

test("Deve lançar erro ao tentar criar curso sem duração e capítulos", () => {
  expect(() => CursoBuilder.criar().semDuracao().semCapitulos().agora()).toThrow(Erros.CURSO_SEM_DURACAO);
});

test("Deve lançar erro ao tentar criar curso sem quantidade de aulas e de capítulos", () => {
  expect(() => CursoBuilder.criar()
    .semQuantidadeDeAulas()
    .comDuracao(100)
    .semCapitulos()
    .agora())
    .toThrow(Erros.CURSO_SEM_AULAS);
});

test("Deve calcular a duração do curso", () => {
  const aulas = [
    AulaBuilder.criar("Aula #1").comDuracao(63).comOrdem(1).agora(),
    AulaBuilder.criar("Aula #2").comDuracao(1007).comOrdem(2).agora(),
    AulaBuilder.criar("Aula #3").comDuracao(3784).comOrdem(3).agora()
  ];

  const capitulo = CapituloBuilder.criar().comAulas(aulas).agora();

  const curso = CursoBuilder.criar().comCapitulos([
    capitulo,
    capitulo.clone({ id: IdVO.novo.valor }),
    capitulo.clone({ id: IdVO.novo.valor })
  ]).agora();

  expect(curso.duracao.segundos).toBe(14562); // Cada capítulo tem duração de 4854 segundos
  // 4854 segundos = 1,35h

  // 1h = 3600s cada curso.
  // 1800 segundos = 50% de 1h = 30min cada curso
  // 1200 segundos = 30% de 1h = 20min cada curso.

  // 1:20:54 (1254 segundos restantes) cada curso

  // Com 3 cursos => 3762 segundos restantes para dar 14562 segundos corresponde a 1:02:42. Ou seja, 3600s + 162s
  // Logo, a diferença dará 10800 segundos (3h) = 3:00:00
  // Somando-se, dará 04:02:42
  expect(curso.duracao.hms).toBe("04h 02m 42s");

  expect(curso.props.duracao).toBe(14562);
});

test("Deve criar cursos sem capítulos e manter duração e quantidade de aulas", () => {
  const CINQUENTA_OITO_MINUTOS = 58;
  const curso = CursoBuilder.criar()
    .semCapitulos()
    .comDuracao(60 * CINQUENTA_OITO_MINUTOS)
    .comQuantidadeDeAulas(45)
    .agora();

  expect(curso.capitulos).toHaveLength(0);
  expect(curso.duracao.hm).toBe("58m");
  expect(curso.quantidadeDeAulas).toBe(45);
});

test("Deve recalcular a duração e quantidade de aulas quanto tiver capítulos", () => {
  const CINQUENTA_OITO_MINUTOS = 58;

  // Um curso com 10 capítulos, cada um com 20 aulas
  // Total de aulas: 200
  const curso = CursoBuilder.criar(10, 20)
    .comDuracao(60 * CINQUENTA_OITO_MINUTOS)
    .comQuantidadeDeAulas(45)
    .agora();

  expect(curso.quantidadeDeAulas).toBe(200);
  expect(curso.duracao.segundos).toBeGreaterThan(0);
});

test("Deve calcular a ordem corretamente", () => {
  const capitulos = [
    CapituloBuilder.criar().comOrdem(1).agora(),
    CapituloBuilder.criar().comOrdem(1).agora(),
    CapituloBuilder.criar().comOrdem(1).agora()
  ];

  const curso = CursoBuilder.criar().comCapitulos(capitulos).agora();
  expect(curso.capitulos[0].ordem.valor).toBe(1);
  expect(curso.capitulos[1].ordem.valor).toBe(2);
  expect(curso.capitulos[2].ordem.valor).toBe(3);
});

test("Deve criar curso com capitulos undefined", () => {
  const curso = new Curso({
    nome: NomesCurso.aleatorio(),
    duracao: 100,
    quantidadeDeAulas: 10,
    capitulos: undefined
  });

  expect(curso.capitulos).toHaveLength(0);
});

test("Deve lançar erro ao criar curso com capítulo sem aulas", () => {
  expect(() => new Curso({
    nome: NomesCurso.aleatorio(),
    duracao: 100,
    quantidadeDeAulas: 10,
    capitulos: [
      { nome: "Capítulo 1", ordem: 1, aulas: undefined }
    ]
  })).toThrow(Erros.CAPITULO_SEM_AULAS);
});

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

test("Deve ordenar corretamente as aulas de um capítulo via props inicialmente sem aulas", () => {
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

test("Deve ordenar corretamente as aulas de um capítulo via props com ordens inconsistentes", () => {
  const aulas = [
    AulaBuilder.criar("Aula #1").comDuracao(63).comOrdem(37).agora(),
    AulaBuilder.criar("Aula #2").comDuracao(1007).comOrdem(2).agora(),
    AulaBuilder.criar("Aula #3").comDuracao(3784).comOrdem(4).agora()
  ];

  const capitulo = CapituloBuilder.criar().comAulas(aulas).agora();

  expect(capitulo.props.aulas![0].ordem).toBe(1);
  expect(capitulo.props.aulas![1].ordem).toBe(2);
  expect(capitulo.props.aulas![2].ordem).toBe(3);
});

test("Deve retornar a quantidade de aulas de um capítulo", () => {
  const capitulo = CapituloBuilder.criar(15).agora();
  expect(capitulo.quantidadeAulasDoCapitulo).toBe(15);
});

test("Deve retornar primeira e última aula de um capítulo", () => {
  const aulas = [
    AulaBuilder.criar("Aula #2").comDuracao(1007).comOrdem(2).agora(),
    AulaBuilder.criar("Aula #3").comDuracao(3784).comOrdem(3).agora(),
    AulaBuilder.criar("Aula #1").comDuracao(63).comOrdem(1).agora()
  ];

  const capitulo = CapituloBuilder.criar().comAulas(aulas).agora();

  expect(capitulo.primeiraAulaDoCapitulo.nome.completo).toBe("Aula #1");
  expect(capitulo.primeiraAulaDoCapitulo.ordem.valor).toBe(1);
  expect(capitulo.ultimaAulaDoCapitulo.nome.completo).toBe("Aula #3");
  expect(capitulo.ultimaAulaDoCapitulo.ordem.valor).toBe(3);
});

test("Deve adicionar aula", () => {
  const capitulo = CapituloBuilder.criar(3).agora();
  const novaAula = AulaBuilder.criar("Aula #4").agora();
  const novoCapitulo = capitulo.adicionarAula(novaAula);

  expect(novoCapitulo.ultimaAulaDoCapitulo.nome.completo).toBe(novaAula.nome.completo);
  expect(novoCapitulo.quantidadeAulasDoCapitulo).toBe(4);
});

test("Deve adicionar aula no início do capítulo", () => {
  const capitulo = CapituloBuilder.criar(3).agora();
  const novaAula = AulaBuilder.criar("Bem-vindo").agora();
  const novoCapitulo = capitulo.adicionarAula(novaAula, 0);

  console.log(novoCapitulo.aulas);

  expect(novoCapitulo.primeiraAulaDoCapitulo.nome.completo).toBe(novaAula.nome.completo);
  expect(novoCapitulo.quantidadeAulasDoCapitulo).toBe(4);
});

test("Deve remover uma aula", () => {
  const capitulo = CapituloBuilder.criar(5).agora();
  const segundaAula = capitulo.aulas[1];
  const novoCapitulo = capitulo.removerAula(segundaAula);
  expect(novoCapitulo.quantidadeAulasDoCapitulo).toBe(4);
});

test("Deve mover aula uma posição para baixo", () => {
  const capitulo = CapituloBuilder.criar().agora();
  const segundaAula = capitulo.aulas[1];
  const novoCapitulo = capitulo.moverAulaParaBaixo(segundaAula);
  expect(novoCapitulo.aulas[2].nome.completo).toBe(segundaAula.nome.completo);
});

test("Deve mover aula uma posição para cima", () => {
  const capitulo = CapituloBuilder.criar().agora();
  const segundaAula = capitulo.aulas[1];
  const novoCapitulo = capitulo.moverAulaParaCima(segundaAula);
  expect(novoCapitulo.aulas[0].nome.completo).toBe(segundaAula.nome.completo);
});

test("Deve ignorar quando mover primeira aula para cima", () => {
  const capitulo = CapituloBuilder.criar().agora();
  const novoCapitulo = capitulo.moverAulaParaCima(capitulo.primeiraAulaDoCapitulo);
  expect(novoCapitulo).toBe(capitulo);
});

test("Deve ignorar quando mover última aula para baixo", () => {
  const capitulo = CapituloBuilder.criar().agora();
  const novoCapitulo = capitulo.moverAulaParaBaixo(capitulo.ultimaAulaDoCapitulo);
  expect(novoCapitulo).toBe(capitulo);
});

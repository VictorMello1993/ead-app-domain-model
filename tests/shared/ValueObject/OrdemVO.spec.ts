import { OrdemVO } from "@/shared/ValueObject/OrdemVO";
import Erros from "@/constants/Erros";

test("Deve criar ordem como 1", () => {
  const ordem = new OrdemVO();
  expect(ordem.valor).toBe(1);
});

test("Deve criar ordem como 1000", () => {
  const ordem = new OrdemVO(1000);
  expect(ordem.valor).toBe(1000);
});

test("Deve lançar erro com a ordem zerada", () => {
  expect(() => new OrdemVO(0)).toThrow(Erros.ORDEM_INVALIDA);
});

test("Deve lançar erro com a ordem negativa", () => {
  expect(() => new OrdemVO(-10)).toThrow(Erros.ORDEM_INVALIDA);
});

test("Deve comparar duas ordens como iguais", () => {
  const ordem1 = new OrdemVO(10);
  const ordem2 = new OrdemVO(10);

  expect(ordem1.valor).toEqual(ordem2.valor);
  expect(ordem1.igual(ordem2)).toBe(true);
  expect(ordem1.diferente(ordem2)).toBe(false);
  expect(ordem1.comparar(ordem2)).toBe(0);
  expect(ordem1.comparar(ordem2, true)).toBe(0);
  expect(OrdemVO.ordenar({ ordem: ordem1 }, { ordem: ordem2 })).toBe(0);
  expect(OrdemVO.ordenar({ ordem: ordem1 }, { ordem: ordem2 }, true)).toBe(0);
});

test("Deve comparar ordens como diferentes", () => {
  const ordem1 = new OrdemVO(10);
  const ordem2 = new OrdemVO(20);

  expect(ordem1.valor).not.toEqual(ordem2.valor);
  expect(ordem1.igual(ordem2)).toBe(false);
  expect(ordem1.diferente(ordem2)).toBe(true);
});

test("Deve comparar duas ordens, sendo uma maior que a outra", () => {
  const ordem1 = new OrdemVO(20);
  const ordem2 = new OrdemVO(30);
  expect(ordem2.comparar(ordem1)).toBe(1);
  expect(OrdemVO.ordenar({ ordem: ordem2 }, { ordem: ordem1 })).toBe(1);
});

test("Deve comparar duas ordens, sendo uma menor que a outra", () => {
  const ordem1 = new OrdemVO(20);
  const ordem2 = new OrdemVO(30);
  expect(ordem1.comparar(ordem2)).toBe(-1);
  expect(OrdemVO.ordenar({ ordem: ordem1 }, { ordem: ordem2 })).toBe(-1);
});

test("Deve ordernar corretamente de maneira ascendente", () => {
  const itens = [
    { ordem: new OrdemVO(3) },
    { ordem: new OrdemVO(1) },
    { ordem: new OrdemVO(2) }
  ];
  itens.sort(OrdemVO.ordenar);
  expect(itens[0].ordem.valor).toBe(1);
  expect(itens[1].ordem.valor).toBe(2);
  expect(itens[2].ordem.valor).toBe(3);
});

test("Deve ordernar corretamente de maneira descentente", () => {
  const itens = [
    { ordem: new OrdemVO(3) },
    { ordem: new OrdemVO(1) },
    { ordem: new OrdemVO(2) }
  ];
  itens.sort((a, b) => OrdemVO.ordenar(a, b, true));
  expect(itens[0].ordem.valor).toBe(3);
  expect(itens[1].ordem.valor).toBe(2);
  expect(itens[2].ordem.valor).toBe(1);
});

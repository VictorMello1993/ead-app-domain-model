import { DuracaoVO } from "@/shared/ValueObject/DuracaoVO";
import Erros from "@/constants/Erros";

test("É permitido criar uma duração vazia", () => {
  expect(new DuracaoVO().segundos).toBe(0);
  expect(new DuracaoVO().hm).toBe("00m");
  expect(new DuracaoVO().hms).toBe("00s");
  expect(new DuracaoVO().zerada).toBe(true);
});

test("É permitido criar uma duração zerada", () => {
  expect(new DuracaoVO(0).segundos).toBe(0);
  expect(new DuracaoVO(0).hm).toBe("00m");
  expect(new DuracaoVO(0).hms).toBe("00s");
  expect(new DuracaoVO(0).zerada).toBe(true);
});

test("É permitido criar uma duração vazia", () => {
  expect(new DuracaoVO().segundos).toBe(0);
  expect(new DuracaoVO().hm).toBe("00m");
  expect(new DuracaoVO().hms).toBe("00s");
});

test("Deve formatar duração em horas e minutos", () => {
  expect(new DuracaoVO(3600).hm).toBe("01h 00m");
  expect(new DuracaoVO(3660).hm).toBe("01h 01m");
  expect(new DuracaoVO(180).hm).toBe("03m");
});

test("Deve formatar duração em horas, minutos e segundos", () => {
  expect(new DuracaoVO(3601).hms).toBe("01h 00m 01s");
  expect(new DuracaoVO(3660).hms).toBe("01h 01m 00s");
  expect(new DuracaoVO(180).hms).toBe("03m 00s");
  expect(new DuracaoVO(58).hms).toBe("58s");
});

test("Deve somar durações", () => {
  const d1 = new DuracaoVO(3600);
  const d2 = new DuracaoVO(180);
  expect(d1.somar(d2).segundos).toBe(3780);
  expect(d1.somar(d2).hm).toBe("01h 03m");
});

test("Deve comparar durações como iguais", () => {
  const d1 = new DuracaoVO(3600);
  const d2 = new DuracaoVO(3600);
  expect(d1.igual(d2)).toBe(true);
  expect(d1.diferente(d2)).toBe(false);
});

test("Deve comparar durações como diferentes", () => {
  const d1 = new DuracaoVO(3600);
  const d2 = new DuracaoVO(3601);
  expect(d1.igual(d2)).toBe(false);
  expect(d1.diferente(d2)).toBe(true);
});

test("Não deve permitir durações negativas", () => {
  expect(() => new DuracaoVO(-3600)).toThrow(Erros.DURACAO_NEGATIVA);
});

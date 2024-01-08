import Erros from "@/constants/Erros";
import SenhaVO from "@/shared/ValueObject/SenhaVO";

test("Deve lançar erro com senha apenas com números", () => {
  expect(() => new SenhaVO("123456789")).toThrow(Erros.SENHA_FRACA);
});

test("Deve lançar erro com senha apenas com letras", () => {
  expect(() => new SenhaVO("abcdeffggf")).toThrow(Erros.SENHA_FRACA);
});

test("Deve lançar erro com senha apenas com caracteres especiais", () => {
  expect(() => new SenhaVO("!$%%^%$#&*$$%*()_+")).toThrow(Erros.SENHA_FRACA);
});

test("Deve lançar erro com senha com menos de 8 caracteres", () => {
  expect(() => new SenhaVO("%S3nh4%")).toThrow(Erros.SENHA_FRACA);
});

test("Deve lançar erro com senha vazia", () => {
  expect(() => new SenhaVO("")).toThrow(Erros.SENHA_FRACA);
  expect(() => new SenhaVO()).toThrow(Erros.SENHA_FRACA);
});

test("Deve ser possível criar senha forte", () => {
  const senha = "%S3nh4F0rt3%";
  expect(new SenhaVO(senha).valor).toBe(senha);
});

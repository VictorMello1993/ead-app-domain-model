import Erros from "@/constants/Erros";
import { SenhaHashVO } from "@/shared/ValueObject/SenhaHashVO";

test("Deve lançar erro com senha apenas com números", () => {
  expect(() => new SenhaHashVO("123456789")).toThrow(Erros.SENHA_HASH_INVALIDA);
});

test("Deve lançar erro com senha apenas com letras", () => {
  expect(() => new SenhaHashVO("abcdeffggf")).toThrow(Erros.SENHA_HASH_INVALIDA);
});

test("Deve lançar erro com senha apenas com caracteres especiais", () => {
  expect(() => new SenhaHashVO("!$%%^%$#&*$$%*()_+")).toThrow(Erros.SENHA_HASH_INVALIDA);
});

test("Deve lançar erro com senha com menos de 8 caracteres", () => {
  expect(() => new SenhaHashVO("%S3nh4%")).toThrow(Erros.SENHA_HASH_INVALIDA);
});

test("Deve ser possível criar um hash de senha", () => {
  const hashs = [
    "$2a$12$znt17B6g7FoYBe3r7XNVKe.3YDrPitpBlcewBMo8cKUn4JFYcM6D2",
    "$2a$13$yDlaeWieqfp087JaIxJxTOqGPsiccYrs8DwjY85CTdQ0bhoSDQUdW",
    "$2a$10$9jyUFwFSOgerBj3SVqPNFeb3Z255hR/ukAYyX/aFAkk34yEu7WdDG",
    "$2a$08$oxMhgVxdDGa4j8Yi1nxOHe50Br5cpT1umrnv/t9Hzq22iGzVG/jC6"
  ];

  expect(new SenhaHashVO(hashs[0])).toBeDefined();
  expect(new SenhaHashVO(hashs[1])).toBeDefined();
  expect(new SenhaHashVO(hashs[2])).toBeDefined();
  expect(new SenhaHashVO(hashs[3])).toBeDefined();
});

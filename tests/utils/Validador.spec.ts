import { Validador } from "@/utils/Validador";

test("Deve retornar null com texto não nulo", () => {
  const erro = Validador.naoNulo("Boa noite", "Texto inválido");
  expect(erro).toBeNull();
});

test("Deve retornar erro com texto nulo", () => {
  const msgErro = "Texto inválido";
  const erro = Validador.naoNulo(null, msgErro);
  expect(erro?.codigo).toBe(msgErro);
});

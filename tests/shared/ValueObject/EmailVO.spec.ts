import { EmailVO } from "@/shared/ValueObject/EmailVO";
import Erros from "@/constants/Erros";

test("Deve criar um e-mail válido", () => {
  const email = new EmailVO("fulano@teste.com.br");
  expect(email.valor).toBe("fulano@teste.com.br");
});

test("Deve retornar o nome do usuário de e-mail", () => {
  const email = new EmailVO("fulano@teste.com.br");
  expect(email.usuario).toBe("fulano");
});

test("Deve retornar o domínio do e-mail", () => {
  const email = new EmailVO("fulano@teste.com.br");
  expect(email.dominio).toBe("teste.com.br");
});

test("Deve retornar erro ao criar um e-mail inválido", () => {
  expect(() => new EmailVO()).toThrow(Erros.EMAIL_INVALIDO);
  expect(() => new EmailVO("")).toThrow(Erros.EMAIL_INVALIDO);
  expect(() => new EmailVO("fulano")).toThrow(Erros.EMAIL_INVALIDO);
  expect(() => new EmailVO("fulano@teste")).toThrow(Erros.EMAIL_INVALIDO);
});

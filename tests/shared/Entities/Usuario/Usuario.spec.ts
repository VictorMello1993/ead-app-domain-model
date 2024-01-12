import { UsuarioBuilder } from "@/tests/data/UsuarioBuilder";
import Erros from "@/constants/Erros";

test("Deve criar um usuário", () => {
  const nomeCompleto = "Victor Santos de Mello";
  const email = "email@teste.com";

  const usuario = UsuarioBuilder
    .criar()
    .comId("66facc11-201a-4eb3-b6b3-c3fce496cfe9")
    .comNome(nomeCompleto)
    .comEmail(email)
    .comSenha("$2a$12$YTlC5Nlr2YSgqacfVwMDiOTFyRoLIFZ/LBzOUk6lofGaCBLNkcGzu")
    .agora();

  expect(usuario.nome.nomeCompleto).toBe(nomeCompleto);
  expect(usuario.email.valor).toBe(email);
  expect(usuario.senha).toBeDefined();
});

test("Deve criar um usuário sem senha", () => {
  const usuario = UsuarioBuilder.criar().semSenha().agora();
  expect(usuario.senha).toBeUndefined();
});

test("Não deve permitir criar um usuário sem nome", () => {
  expect(() => UsuarioBuilder.criar().semNome().agora()).toThrow(Erros.NOME_VAZIO);
});

test("Não deve permitir criar um usuário sem e-mail", () => {
  expect(() => UsuarioBuilder.criar().semEmail().agora()).toThrow(Erros.EMAIL_INVALIDO);
});

test("Não deve permitir criar um usuário sem sobrenome", () => {
  expect(() => UsuarioBuilder.criar().comNome("Victor").agora()).toThrow(Erros.NOME_SEM_SOBRENOME);
});

test("Deve permitir criar um usuário com id gerado automaticamente", () => {
  const usuario = UsuarioBuilder.criar().semId().agora();
  expect(usuario.id.valor).toBeDefined();
  expect(usuario.id.novo).toBe(true);
});

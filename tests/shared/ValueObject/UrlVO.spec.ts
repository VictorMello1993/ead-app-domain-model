import { UrlVO } from "@/shared/ValueObject/UrlVO";
import Erros from "@/constants/Erros";

test("Deve retornar o domínio da URL", () => {
  const url = new UrlVO("https://www.google.com/search?q=vasco");
  expect(url.dominio).toBe("www.google.com");
});

test("Deve retornar o protocolo da URL", () => {
  const url = new UrlVO("https://www.google.com/search?q=vasco");
  expect(url.protocolo).toBe("https:");
});

test("Deve retornar o caminho da URL", () => {
  const url = new UrlVO("https://www.google.com/search?q=vasco");
  expect(url.caminho).toBe("/search");
});

test("Deve retornar os parâmetros da URL", () => {
  const url = new UrlVO("https://www.google.com/search?q=vasco&sca_esv=598437705&tbm=isch");
  expect(url.parametros).toEqual({ q: "vasco", sca_esv: "598437705", tbm: "isch" });
  expect(url.parametros.q).toBe("vasco");
  expect(url.parametros.sca_esv).toBe("598437705");
  expect(url.parametros.tbm).toBe("isch");
});

test("Deve lançar erro com url inválida", () => {
  expect(() => new UrlVO()).toThrow(Erros.URL_INVALIDA);
  expect(() => new UrlVO("")).toThrow(Erros.URL_INVALIDA);
  expect(() => new UrlVO("www.google.com")).toThrow(Erros.URL_INVALIDA);
  expect(() => new UrlVO("https//www.google.com")).toThrow(Erros.URL_INVALIDA);
});

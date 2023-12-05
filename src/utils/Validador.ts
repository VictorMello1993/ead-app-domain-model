import { ErroValidacao } from "@/errors/ErroValidacao";

export class Validador {
  static naoNulo(valor: any, erro: string): ErroValidacao | null {
    return valor !== null && valor !== undefined ? null : ErroValidacao.novo(erro, valor);
  }
}

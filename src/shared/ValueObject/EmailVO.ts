import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";

export class EmailVO {
  static readonly EMAIL_VALIDO_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  readonly valor: string;

  constructor(valor?: string) {
    this.valor = valor?.trim() ?? "";

    if (!EmailVO.isValido(this.valor)) {
      ErroValidacao.lancar(Erros.EMAIL_INVALIDO);
    }
  }

  get usuario(): string {
    return this.valor.split("@")[0];
  }

  get dominio(): string {
    return this.valor.split("@")[1];
  }

  static isValido(email: string): boolean {
    return EmailVO.EMAIL_VALIDO_REGEX.test(email);
  }
}

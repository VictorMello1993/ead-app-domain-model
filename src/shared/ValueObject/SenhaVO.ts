import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";

export default class SenhaVO {
  static readonly SENHA_FORTE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  constructor(readonly valor: string) {
    if (!SenhaVO.isValida(valor)) {
      ErroValidacao.lancar(Erros.SENHA_FRACA);
    }
  }

  static isValida(senha: string): boolean {
    return this.SENHA_FORTE_REGEX.test(senha);
  }
}

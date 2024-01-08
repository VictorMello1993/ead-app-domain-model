import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";

export class SenhaHashVO {
  static readonly SENHA_HASH_REGEX = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9\.\/]{53}$/;

  constructor(readonly valor?: string) {
    if (!valor || SenhaHashVO.isValida(valor)) {
      ErroValidacao.lancar(Erros.SENHA_HASH_INVALIDA, valor);
    }
  }

  static isValida(hash: string): boolean {
    return SenhaHashVO.SENHA_HASH_REGEX.test(hash);
  }
}

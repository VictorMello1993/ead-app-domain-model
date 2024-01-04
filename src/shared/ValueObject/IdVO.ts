import { v4 as uuid, validate } from "uuid";
import { ErroValidacao } from "@/errors/ErroValidacao";
import Erros from "@/constants/Erros";

export class IdVO {
  readonly valor: string;
  readonly novo: boolean;

  constructor(valor?: string) {
    this.valor = valor ?? uuid();
    this.novo = !valor;

    if (!validate(this.valor)) {
      ErroValidacao.lancar(Erros.ID_INVALIDO, this.valor);
    }
  }

  static get novo() {
    return new IdVO();
  }

  igual(id: IdVO) {
    return this.valor === id.valor;
  }

  diferente(id: IdVO) {
    return this.valor !== id.valor;
  }
}

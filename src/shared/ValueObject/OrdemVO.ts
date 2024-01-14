import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";

export class OrdemVO {
  constructor(readonly valor: number = 1) {
    if (valor <= 0) {
      ErroValidacao.lancar(Erros.ORDEM_INVALIDA);
    }
  }

  igual(outraOrdem: OrdemVO) {
    return this.valor === outraOrdem.valor;
  }

  diferente(outraOrdem: OrdemVO) {
    return this.valor !== outraOrdem.valor;
  }

  comparar(outraOrdem: OrdemVO, desc: boolean = false): number {
    if (this.igual(outraOrdem)) {
      return 0;
    }

    if (!desc) {
      return this.valor > outraOrdem.valor ? 1 : -1;
    }

    return this.valor < outraOrdem.valor ? 1 : -1;
  }

  static ordenar(a: {ordem: OrdemVO}, b: {ordem: OrdemVO}, desc: boolean = false) {
    return a.ordem.comparar(b.ordem, desc);
  }
}

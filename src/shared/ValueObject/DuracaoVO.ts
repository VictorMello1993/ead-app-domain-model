import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";

export class DuracaoVO {
  static readonly UM_MINUTO = 60;
  static readonly UMA_HORA = 3600;

  readonly segundos: number;

  constructor(segundos?: number) {
    if (segundos && segundos < 0) {
      ErroValidacao.lancar(Erros.DURACAO_NEGATIVA);
    }

    this.segundos = segundos ?? 0;
  }

  somar(duracao: DuracaoVO): DuracaoVO {
    return new DuracaoVO(this.segundos + duracao.segundos);
  }

  igual(duracao: DuracaoVO): boolean {
    return this.segundos === duracao.segundos;
  }

  diferente(duracao: DuracaoVO): boolean {
    return this.segundos !== duracao.segundos;
  }

  get zerada(): boolean {
    return this.segundos === 0;
  }

  get hm () {
    const { horas, minutos } = this.partes;
    const h = horas.toString().padStart(2, "0");
    const m = minutos.toString().padStart(2, "0");

    if (horas) {
      return `${h}h ${m}m`;
    }

    return `${m}m`;
  }

  get hms() {
    const { horas, minutos, segundos } = this.partes;
    const h = horas.toString().padStart(2, "0");
    const m = minutos.toString().padStart(2, "0");
    const s = segundos.toString().padStart(2, "0");

    if (horas) {
      return `${h}h ${m}m ${s}s`;
    }

    if (minutos) {
      return `${m}m ${s}s`;
    }

    return `${s}s`;
  }

  private get partes() {
    return {
      horas: Math.floor(this.segundos / DuracaoVO.UMA_HORA),
      minutos: Math.floor((this.segundos % DuracaoVO.UMA_HORA) / DuracaoVO.UM_MINUTO),
      segundos: this.segundos % DuracaoVO.UM_MINUTO
    };
  }
}

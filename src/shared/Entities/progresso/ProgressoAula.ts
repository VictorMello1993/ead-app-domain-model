import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { NomeSimplesVO } from "@/shared/ValueObject/NomeSimplesVO";
import { DuracaoVO } from "@/shared/ValueObject/DuracaoVO";
import { ErroValidacao } from "@/errors/ErroValidacao";
import Erros from "@/constants/Erros";

export interface ProgressoAulaProps extends EntidadeProps {
  nomeAula?: string;
  duracao?: number;
  dataInicio?: Date
  dataConclusao?: Date
}

export class ProgressoAula extends Entidade<ProgressoAula, ProgressoAulaProps> {
  readonly nomeAula: NomeSimplesVO;
  readonly duracao: DuracaoVO;
  readonly dataInicio?: Date;
  readonly dataConclusao?: Date;

  constructor(props: ProgressoAulaProps) {
    super(props);

    this.nomeAula = new NomeSimplesVO(props.nomeAula!, 3, 50);
    this.duracao = new DuracaoVO(props.duracao!);
    this.dataInicio = props.dataInicio;
    this.dataConclusao = props.dataConclusao;

    if (!props.id) {
      ErroValidacao.lancar(Erros.ID_INVALIDO, props.id);
    }

    if (this.duracao.zerada) {
      ErroValidacao.lancar(Erros.DURACAO_ZERADA);
    }
  }

  get iniciado(): boolean {
    return this.dataInicio !== undefined;
  }

  get concluido(): boolean {
    return this.dataConclusao !== undefined;
  }

  iniciar(): ProgressoAula {
    return this.clone({ dataInicio: new Date() });
  }

  concluir(): ProgressoAula {
    return this.clone({ dataConclusao: new Date() });
  }

  zerar(): ProgressoAula {
    return this.clone({ dataConclusao: undefined });
  }
}

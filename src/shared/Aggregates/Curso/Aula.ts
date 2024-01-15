import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { NomeSimplesVO } from "@/shared/ValueObject/NomeSimplesVO";
import { DuracaoVO } from "@/shared/ValueObject/DuracaoVO";
import { UrlVO } from "@/shared/ValueObject/UrlVO";
import { OrdemVO } from "@/shared/ValueObject/OrdemVO";
import { ErroValidacao } from "@/errors/ErroValidacao";
import Erros from "@/constants/Erros";

export interface AulaProps extends EntidadeProps {
  nome?: string
  duracao?: number,
  videoUrl?: string
  ordem?: number
}

export class Aula extends Entidade<Aula, AulaProps> {
  readonly nome: NomeSimplesVO;
  readonly duracao: DuracaoVO;
  readonly videoUrl: UrlVO;
  readonly ordem: OrdemVO;

  constructor(props: AulaProps) {
    super({ ...props, ordem: props.ordem ?? 1 });
    this.nome = new NomeSimplesVO(this.props.nome!, 3, 50);
    this.duracao = new DuracaoVO(this.props.duracao);
    this.videoUrl = new UrlVO(this.props.videoUrl);
    this.ordem = new OrdemVO(this.props.ordem);

    if (this.duracao.zerada) {
      ErroValidacao.lancar(Erros.AULA_DURACAO_ZERADA);
    }
  }
}

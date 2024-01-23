import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { Aula, AulaProps } from "./Aula";
import { NomeSimplesVO } from "@/shared/ValueObject/NomeSimplesVO";
import { OrdemVO } from "@/shared/ValueObject/OrdemVO";
import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";
import { DuracaoVO } from "../../ValueObject/DuracaoVO";

export interface CapituloProps extends EntidadeProps {
  nome?: string;
  ordem?: number;
  aulas?: AulaProps[]
}

export class Capitulo extends Entidade<Capitulo, CapituloProps> {
  readonly nome: NomeSimplesVO;
  readonly ordem: OrdemVO;
  readonly aulas: Aula[];

  constructor(props: CapituloProps) {
    super(props);
    this.nome = new NomeSimplesVO(props.nome!, 3, 50);
    this.ordem = new OrdemVO(props.ordem);

    if (!props.aulas) {
      ErroValidacao.lancar(Erros.CAPITULO_SEM_AULAS);
    }

    this.aulas = props.aulas?.map(aula => new Aula(aula)) ?? [];
  }

  get duracao(): DuracaoVO {
    return new DuracaoVO(0);
  }
}

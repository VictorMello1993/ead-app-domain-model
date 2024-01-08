import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { NomePessoaVO } from "@/shared/ValueObject/NomePessoaVO";

export interface UsuarioProps extends EntidadeProps{
  nome?: string
}

export class Usuario extends Entidade<Usuario, UsuarioProps> {
  readonly nome: NomePessoaVO;

  constructor(props: UsuarioProps) {
    super(props);
    this.nome = new NomePessoaVO(props.nome);
  }
}

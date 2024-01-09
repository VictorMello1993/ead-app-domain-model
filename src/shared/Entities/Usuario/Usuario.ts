import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { NomePessoaVO } from "@/shared/ValueObject/NomePessoaVO";
import { EmailVO } from "@/shared/ValueObject/EmailVO";
import { SenhaHashVO } from "@/shared/ValueObject/SenhaHashVO";

export interface UsuarioProps extends EntidadeProps{
  nome?: string
  email?: string
  senha?: string
}

export class Usuario extends Entidade<Usuario, UsuarioProps> {
  readonly nome: NomePessoaVO;
  readonly email: EmailVO;
  readonly senha?: SenhaHashVO;

  constructor(props: UsuarioProps) {
    super(props);
    this.nome = new NomePessoaVO(props.nome);
    this.email = new EmailVO(props.email);

    if (props.senha) {
      this.senha = new SenhaHashVO(props.senha);
    }
  }
}

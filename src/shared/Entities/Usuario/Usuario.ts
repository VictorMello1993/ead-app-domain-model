import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { NomePessoaVO } from "@/shared/ValueObject/NomePessoaVO";
import { EmailVO } from "@/shared/ValueObject/EmailVO";
import SenhaVO from "@/shared/ValueObject/SenhaVO";

export interface UsuarioProps extends EntidadeProps{
  nome?: string
  email?: string
  senha?: string
}

export class Usuario extends Entidade<Usuario, UsuarioProps> {
  readonly nome: NomePessoaVO;
  readonly email: EmailVO;
  readonly senha?: SenhaVO;

  constructor(props: UsuarioProps) {
    super(props);
    this.nome = new NomePessoaVO(props.nome);
    this.email = new EmailVO(props.email);

    if (props.senha) {
      this.senha = new SenhaVO(props.senha);
    }
  }
}

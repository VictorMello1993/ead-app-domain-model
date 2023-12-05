import Erros from "@/constants/Erros";

export interface ErroValidacaoProps {
  codigo?: string,
  valor?: any,
  extras?: object
}

export class ErroValidacao extends Error {
  readonly codigo: string;
  readonly valor?: any;
  readonly extras: any;

  constructor(readonly props?: ErroValidacaoProps) {
    super(props?.codigo ?? Erros.DESCONHECIDO);
    this.codigo = props?.codigo ?? Erros.DESCONHECIDO;
    this.valor = props?.valor;
    this.extras = props?.extras ?? {};
  }

  static novo(codigo?: string, valor?: any, extras?:any): ErroValidacao {
    return new ErroValidacao({ codigo, valor, extras });
  }

  static lancar(codigo?: string, valor?: any, extras?:any): never {
    throw new ErroValidacao({ codigo, valor, extras });
  }
}

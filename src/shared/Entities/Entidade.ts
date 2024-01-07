import { IdVO } from "@/shared/ValueObject/IdVO";

export interface EntidadeProps {
  id?: string,
}

export abstract class Entidade<Tipo, Props extends EntidadeProps> {
  readonly id: IdVO;
  readonly props: Props;

  constructor(props: Props) {
    this.id = new IdVO(props.id);
    this.props = { ...props, id: this.id.valor };
  }

  igual(entidade: Entidade<Tipo, Props>): boolean {
    return this.id.igual(entidade.id);
  }

  diferente(entidade: Entidade<Tipo, Props>): boolean {
    return this.id.diferente(entidade.id);
  }

  clone(novasProps: Props, ...args: any[]): Tipo {
    return new (this.constructor as any)(
      {
        ...this.props,
        ...novasProps
      },
      ...args
    );
  }
}

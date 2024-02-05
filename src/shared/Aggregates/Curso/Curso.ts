import { Entidade, EntidadeProps } from "../../Entities/Entidade";
import { DuracaoVO } from "../../ValueObject/DuracaoVO";
import { NomeSimplesVO } from "../../ValueObject/NomeSimplesVO";
import { OrdemVO } from "../../ValueObject/OrdemVO";
import { Capitulo, CapituloProps } from "./Capitulo";

interface CursoProps extends EntidadeProps {
  nome?: string;
  data?: Date;
  capitulos?: CapituloProps[]
  duracao?: number
  quantidadeAulas?: number
}

export class Curso extends Entidade<Curso, CursoProps> {
  readonly nome: NomeSimplesVO;
  readonly data: Date;
  readonly capitulos: Capitulo[];
  readonly duracao: DuracaoVO;
  readonly quantidadeDeAulas: number;

  constructor(props: CursoProps) {
    super({
      ...props,
      ...Curso.calcularNumerosDoCurso(props),
      data: props.data ?? new Date(),
      capitulos: Curso.ordenarCapitulos(props.capitulos ?? [])
    });

    this.data = this.props.data!;
    this.nome = new NomeSimplesVO(this.props.nome!, 3, 50);
    this.capitulos = this.props.capitulos!.map(capitulo => new Capitulo(capitulo));
    this.duracao = new DuracaoVO(this.props.duracao);
    this.quantidadeDeAulas = this.props.quantidadeAulas!;
  }

  private static calcularNumerosDoCurso(props: CursoProps) {
    if (!props.capitulos) {
      return {
        duracao: props.duracao ?? 0,
        quantidadeDeAulas: props.quantidadeAulas ?? 0
      };
    }

    const capitulos = props.capitulos.map(props => new Capitulo(props));
    const duracao = capitulos.reduce((total, capitulo) => total + capitulo.duracao.segundos, 0);
    const quantidadeDeAulas = capitulos.reduce((total, capitulo) => total + capitulo.quantidadeAulasDoCapitulo, 0);

    return {
      duracao,
      quantidadeDeAulas
    };
  }

  private static ordenarCapitulos(capituloProps: CapituloProps[]): CapituloProps[] {
    const capitulos = capituloProps.map(props => new Capitulo(props));
    const capitulosOrdenados = capitulos.sort(OrdemVO.ordenar);
    return Curso.reordenarAulasCapitulos(capitulosOrdenados).map(capitulo => capitulo.props);
  }

  private static reordenarAulasCapitulos(capitulos: Capitulo[]): Capitulo[] {
    return capitulos.map((capitulo, index) => capitulo.clone({ ordem: index + 1 }));
  }
}

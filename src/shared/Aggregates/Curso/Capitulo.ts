import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { Aula, AulaProps } from "./Aula";
import { NomeSimplesVO } from "@/shared/ValueObject/NomeSimplesVO";
import { OrdemVO } from "@/shared/ValueObject/OrdemVO";
import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";
import { DuracaoVO } from "@/shared/ValueObject/DuracaoVO";

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
    super({
      ...props,
      aulas: Capitulo.ordenarAulas(props.aulas ?? [])
    });
    this.nome = new NomeSimplesVO(props.nome!, 3, 50);
    this.ordem = new OrdemVO(props.ordem);

    if (!this.props.aulas!.length) {
      ErroValidacao.lancar(Erros.CAPITULO_SEM_AULAS);
    }

    this.aulas = this.props.aulas!.map(aula => new Aula(aula));
  }

  get duracao(): DuracaoVO {
    // const totalSegundosAulas = this.aulas.reduce((segundos, aula) => aula.duracao.segundos + segundos, 0);
    // return new DuracaoVO(totalSegundosAulas)

    // Ou

    return this.aulas.reduce((duracaoTotal: DuracaoVO, aula: Aula) => {
      return duracaoTotal.somar(aula.duracao);
    }, new DuracaoVO(0));
  }

  get quantidadeAulasDoCapitulo(): number {
    return this.aulas.length;
  }

  get primeiraAulaDoCapitulo() {
    return this.aulas[0];
  }

  get ultimaAulaDoCapitulo() {
    return this.aulas[this.quantidadeAulasDoCapitulo - 1];
  }

  adicionarAula(aula: Aula, posicao?: number): Capitulo {
    const novasAulas = posicao !== undefined
      ? [...this.aulas.slice(0, posicao), aula, ...this.aulas.slice(posicao)]
      : [...this.aulas, aula];

    const aulas = Capitulo.reordenarAulas(novasAulas).map(aula => aula.props);
    return this.clone({ aulas });
  }

  removerAula(aulaSelecionada: Aula): Capitulo {
    const outrasAulas = this.aulas.filter(aula => aula.diferente(aulaSelecionada));
    const aulas = Capitulo.reordenarAulas(outrasAulas).map(aula => aula.props);
    return this.clone({ aulas });
  }

  moverAula(aulaSelecionada: Aula, posicao: number): Capitulo {
    return this.removerAula(aulaSelecionada).adicionarAula(aulaSelecionada, posicao);
  }

  moverAulaParaCima(aulaSelecionada: Aula): Capitulo {
    const posicaoAtual = this.aulas.findIndex(aula => aula.igual(aulaSelecionada));
    const primeiraPosicao = posicaoAtual === 0;
    return primeiraPosicao ? this : this.moverAula(aulaSelecionada, posicaoAtual - 1);
  }

  moverAulaParaBaixo(aulaSelecionada: Aula): Capitulo {
    const posicaoAtual = this.aulas.findIndex(aula => aula.igual(aulaSelecionada));
    const ultimaPosicao = posicaoAtual === this.quantidadeAulasDoCapitulo - 1;
    return ultimaPosicao ? this : this.moverAula(aulaSelecionada, posicaoAtual + 1);
  }

  private static ordenarAulas(aulasProps: AulaProps[]): AulaProps[] {
    const aulas = aulasProps.map(props => new Aula(props));
    const aulasOrdenadas = aulas.sort(OrdemVO.ordenar);
    return Capitulo.reordenarAulas(aulasOrdenadas).map(aula => aula.props);
  }

  private static reordenarAulas(aulas: Aula[]): Aula[] {
    return aulas.map((aula, index) => aula.clone({ ordem: index + 1 }));
  }
}

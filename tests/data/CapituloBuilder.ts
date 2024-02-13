import { Capitulo, CapituloProps } from "@/shared/Aggregates/Curso/Capitulo";
import { NomesCapitulo } from "./NomesCapitulo";
import { faker } from "@faker-js/faker";
import { AulaBuilder } from "./AulaBuilder";
import { Aula, AulaProps } from "@/shared/Aggregates/Curso/Aula";

export class CapituloBuilder {
  private constructor(private props: CapituloProps) {}

  static criar(qteAulas: number = 10): CapituloBuilder {
    return new CapituloBuilder({
      nome: NomesCapitulo.aleatorio(),
      ordem: faker.number.int({ min: 1, max: 100 }),
      aulas: AulaBuilder.criarListaCom(qteAulas).map(aula => aula.props)
    });
  }

  static criarListaCom(qteCapitulos: number, qteAulas: number): Capitulo[] {
    const capitulo = (index: number) => CapituloBuilder.criar(qteAulas).comOrdem(index + 1).agora();
    return Array.from({ length: qteCapitulos }).map((_, index) => capitulo(index));
  }

  comId(id: string): CapituloBuilder {
    this.props.id = id;
    return this;
  }

  semId(): CapituloBuilder {
    this.props.id = undefined;
    return this;
  }

  comNome(nome: string): CapituloBuilder {
    this.props.id = nome;
    return this;
  }

  semNome(): CapituloBuilder {
    this.props.nome = undefined;
    return this;
  }

  comOrdem(ordem: number): CapituloBuilder {
    this.props.ordem = ordem;
    return this;
  }

  semOrdem(): CapituloBuilder {
    this.props.ordem = undefined;
    return this;
  }

  comAulas(aulas: (Aula | AulaProps)[]): CapituloBuilder {
    this.props.aulas = aulas.map(aula => aula instanceof Aula ? aula.props : aula);
    return this;
  }

  semAulas(): CapituloBuilder {
    this.props.aulas = undefined;
    return this;
  }

  agora(): Capitulo {
    return new Capitulo(this.props);
  }
}

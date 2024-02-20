import { ProgressoCurso, ProgressoCursoProps } from "@/shared/Entities/progresso/ProgressoCurso";
import { faker } from "@faker-js/faker";
import { IdVO } from "@/shared/ValueObject/IdVO";
import { NomesCurso } from "./NomesCurso";
import { ProgressoAulaBuilder } from "./ProgressoAulaBuilder";
import { ProgressoAulaProps } from "@/shared/Entities/progresso/ProgressoAula";

export class ProgressoCursoBuilder {
  private constructor(public props: ProgressoCursoProps) {}

  static criar(qteAulas?: number): ProgressoCursoBuilder {
    const aulas = ProgressoAulaBuilder.criarListaCom(qteAulas).map(aula => aula.props);

    return new ProgressoCursoBuilder({
      id: IdVO.novo.valor,
      nomeCurso: NomesCurso.aleatorio(),
      data: faker.date.recent(),
      emailUsuario: faker.internet.email(),
      aulaSelecionadaId: aulas[0].id,
      aulas
    });
  }

  static criarListaCom(qtde: number = 10): ProgressoCurso[] {
    return Array.from({ length: qtde }).map(() => ProgressoCursoBuilder.criar().agora());
  }

  comId(id: string): ProgressoCursoBuilder {
    this.props.id = id;
    return this;
  }

  semId(): ProgressoCursoBuilder {
    this.props.id = undefined;
    return this;
  }

  comEmailUsuario(email: string): ProgressoCursoBuilder {
    this.props.emailUsuario = email;
    return this;
  }

  semEmailUsuario(): ProgressoCursoBuilder {
    this.props.emailUsuario = undefined;
    return this;
  }

  comNomeCurso(nome: string): ProgressoCursoBuilder {
    this.props.nomeCurso = nome;
    return this;
  }

  semNomeCurso(): ProgressoCursoBuilder {
    this.props.nomeCurso = undefined;
    return this;
  }

  comData(data: Date): ProgressoCursoBuilder {
    this.props.data = data;
    return this;
  }

  semData(): ProgressoCursoBuilder {
    this.props.data = undefined;
    return this;
  }

  comAulaSelecionadaId(id: string): ProgressoCursoBuilder {
    this.props.aulaSelecionadaId = id;
    return this;
  }

  semAulaSelecionadaId(): ProgressoCursoBuilder {
    this.props.aulaSelecionadaId = undefined;
    return this;
  }

  comAulas(aulas: ProgressoAulaProps[]): ProgressoCursoBuilder {
    this.props.aulas = [...aulas];
    this.props.aulaSelecionadaId = this.props.aulas[0]?.id;
    return this;
  }

  semAulas(): ProgressoCursoBuilder {
    this.props.aulas = undefined;
    return this;
  }

  agora(): ProgressoCurso {
    return new ProgressoCurso(this.props);
  }
}

import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";
import { EmailVO } from "@/shared/ValueObject/EmailVO";
import { NomeSimplesVO } from "@/shared/ValueObject/NomeSimplesVO";
import { Entidade, EntidadeProps } from "../Entidade";
import { ProgressoAula, ProgressoAulaProps } from "./ProgressoAula";
import { DuracaoVO } from "@/shared/ValueObject/DuracaoVO";

export interface ProgressoCursoProps extends EntidadeProps {
  emailUsuario?: string;
  nomeCurso?: string,
  data?: Date,
  aulas?: ProgressoAulaProps[]
  aulaSelecionadaId?: string
}

export class ProgressoCurso extends Entidade<ProgressoCurso, ProgressoCursoProps> {
  readonly emailUsuario: EmailVO;
  readonly nomeCurso: NomeSimplesVO;
  readonly data: Date;
  readonly dataConclusao?: Date;
  readonly aulaSelecionada: ProgressoAula;
  readonly aulas: ProgressoAula[];

  constructor(props: ProgressoCursoProps) {
    super(props);

    if (!props.aulas?.length) {
      ErroValidacao.lancar(Erros.PROGRESSO_SEM_AULA);
    }

    this.emailUsuario = new EmailVO(props.emailUsuario);
    this.nomeCurso = new NomeSimplesVO(props.nomeCurso!, 3, 50);
    this.data = props.data ?? new Date();
    this.aulas = props.aulas.map(props => new ProgressoAula(props));
    this.aulaSelecionada = this.aulas.find(aula => aula.id.valor === props.aulaSelecionadaId) ?? this.aulas[0];
  }

  iniciarAula(aulaId: string): ProgressoCurso {
    const aulas = this.aulas.map(aula => aula.id.valor === aulaId ? aula.iniciar().props : aula.props);
    return this.clone({ aulas, data: new Date() });
  }

  concluirAula(aulaId: string): ProgressoCurso {
    if (this.concluido) {
      return this;
    }

    const aulas = this.aulas.map(aula => aula.id.valor === aulaId ? aula.concluir().props : aula.props);
    return this.clone({ aulas, data: new Date() });
  }

  concluirCurso(): ProgressoCurso {
    if (this.concluido) {
      return this;
    }

    const aulasConcluidas = this.aulas.map(aula => aula.concluir().props);
    return this.clone({ aulas: aulasConcluidas, data: new Date() });
  }

  zerarAula(aulaId: string): ProgressoCurso {
    const aulas = this.aulas.map(aula => aula.id.valor === aulaId ? aula.zerar().props : aula.props);
    return this.clone({ aulas, data: new Date() });
  }

  alternarAula(aulaId: string): ProgressoCurso {
    const aula = this.progressoAula(aulaId);

    if (!aula) {
      return this;
    }

    return aula.concluido ? this.zerarAula(aula.id.valor) : this.concluirAula(aula.id.valor);
  }

  iniciarAulaAtual(): ProgressoCurso {
    return this.iniciarAula(this.aulaSelecionada.id.valor);
  }

  concluirAulaAtual(): ProgressoCurso {
    return this.concluirAula(this.aulaSelecionada.id.valor);
  }

  selecionarAula(aulaId: string): ProgressoCurso {
    return this.clone({ aulaSelecionadaId: aulaId, data: new Date() });
  }

  selecionarProximaAula(): ProgressoCurso {
    const aulaAtualIndex = this.aulas.indexOf(this.aulaSelecionada);
    const proximaAula = this.aulas[aulaAtualIndex + 1];
    return proximaAula ? this.selecionarAula(proximaAula.id.valor) : this;
  }

  concluirESelecionarProximaAula(): ProgressoCurso {
    return this.concluirAulaAtual().selecionarProximaAula();
  }

  progressoAula(aulaId: string): ProgressoAula | undefined {
    return this.aulas.find(aula => aula.id.valor === aulaId);
  }

  get concluido() {
    return this.aulas.every(aula => aula.concluido);
  }

  get duracaoTotal(): DuracaoVO {
    return this.aulas.reduce((total, aula) => total.somar(aula.duracao),
      new DuracaoVO());
  }

  get duracaoAssistida(): DuracaoVO {
    return this.aulas
      .filter(aula => aula.concluido)
      .reduce((total, aula) => total.somar(aula.duracao), new DuracaoVO());
  }

  get percentualAssistido(): number {
    const fator = this.duracaoAssistida.segundos / this.duracaoTotal.segundos;
    return Math.floor(fator * 100);
  }
}

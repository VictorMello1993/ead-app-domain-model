import Erros from "@/constants/Erros";
import { ErroValidacao } from "@/errors/ErroValidacao";
import { EmailVO } from "@/shared/ValueObject/EmailVO";
import { NomeSimplesVO } from "@/shared/ValueObject/NomeSimplesVO";
import { Entidade, EntidadeProps } from "../Entidade";
import { ProgressoAula, ProgressoAulaProps } from "./ProgressoAula";
import { DuracaoVO } from "@/shared/ValueObject/DuracaoVO";
import { IObserverEventoDominio } from "@/shared/Events/IObserverEventoDominio";
import { CursoConcluido } from "@/shared/Events/CursoConcluido";

export interface ProgressoCursoProps extends EntidadeProps {
  emailUsuario?: string;
  nomeCurso?: string,
  data?: Date,
  dataConclusao?: Date,
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

  constructor(props: ProgressoCursoProps, private observers: IObserverEventoDominio<CursoConcluido>[] = []) {
    super({
      ...props,

      /* OBS: a conclusão do curso é notificada apenas uma única vez, evitando que toda vez que o usuário
             desmarque e marque a última aula como concluída sucessivas vezes que o sistema notifique o
             evento de conclusão */
      dataConclusao: ProgressoCurso.calcularDataConclusao(props)
    });

    if (!props.aulas?.length) {
      ErroValidacao.lancar(Erros.PROGRESSO_SEM_AULA);
    }

    this.emailUsuario = new EmailVO(props.emailUsuario);
    this.nomeCurso = new NomeSimplesVO(props.nomeCurso!, 3, 50);
    this.data = props.data ?? new Date();
    this.dataConclusao = this.props.dataConclusao;
    this.aulas = props.aulas.map(props => new ProgressoAula(props));
    this.aulaSelecionada = this.aulas.find(aula => aula.id.valor === props.aulaSelecionadaId) ?? this.aulas[0];

    const acabouDeConcluir = !props.dataConclusao && this.dataConclusao;

    if (acabouDeConcluir) {
      this.notificarConclusao();
    }
  }

  riscoDeFraude(): number {
    /* Curso muito pequeno, com pouquíssimas aulas fica quase impossível de determinar
      algum risco de fraude */
    if (this.aulas.length < 2) {
      return 0;
    }

    const LIMITE_FRAUDE_PERCENTUAL = 0.2;
    const NUMERO_INTERVALOS_ENTRE_AULAS = this.aulas.length - 1;

    const total = this.aulas.reduce((total, aula, index) => {
      const dataInicioAulaAtual = aula.dataInicio;
      const dataInicioProximaAula = this.aulas[index + 1]?.dataInicio;

      if (!dataInicioAulaAtual || !dataInicioProximaAula) {
        return total;
      }

      const intervaloSuspeitoMilis = aula.duracao.segundos * LIMITE_FRAUDE_PERCENTUAL * 1000;
      const intervaloRealMilis = Math.abs(dataInicioAulaAtual.getTime() - dataInicioProximaAula.getTime());

      return total + (intervaloRealMilis < intervaloSuspeitoMilis ? 1 : 0);
    }, 0);

    return Math.floor((total / NUMERO_INTERVALOS_ENTRE_AULAS) * 100);
  }

  iniciarAula(aulaId: string): ProgressoCurso {
    const aulas = this.aulas.map(aula => aula.id.valor === aulaId ? aula.iniciar().props : aula.props);
    return this.clone({ aulas, data: new Date() }, this.observers);
  }

  concluirAula(aulaId: string): ProgressoCurso {
    if (this.concluido) {
      return this;
    }

    const aulas = this.aulas.map(aula => aula.id.valor === aulaId ? aula.concluir().props : aula.props);
    return this.clone({ aulas, data: new Date() }, this.observers);
  }

  concluirCurso(): ProgressoCurso {
    if (this.concluido) {
      return this;
    }

    const aulasConcluidas = this.aulas.map(aula => aula.concluir().props);
    return this.clone({ aulas: aulasConcluidas, data: new Date() }, this.observers);
  }

  zerarAula(aulaId: string): ProgressoCurso {
    const aulas = this.aulas.map(aula => aula.id.valor === aulaId ? aula.zerar().props : aula.props);
    return this.clone({ aulas, data: new Date() }, this.observers);
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
    return this.clone({ aulaSelecionadaId: aulaId, data: new Date() }, this.observers);
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

  registrar(observer: IObserverEventoDominio<CursoConcluido>): ProgressoCurso {
    return this.clone(this.props, [...this.observers, observer]);
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

  private static calcularDataConclusao(props: ProgressoCursoProps): Date | undefined {
    const cursoConcluido = props.aulas?.every(aula => aula.dataConclusao) ?? false;
    return cursoConcluido && !props.dataConclusao ? new Date() : props.dataConclusao;
  }

  private notificarConclusao() {
    const evento = new CursoConcluido(this.emailUsuario, this.id, new Date());
    this.observers.forEach(observer => observer.eventoOcorreu(evento));
  }
}

import { Entidade, EntidadeProps } from "@/shared/Entities/Entidade";
import { IdVO } from "@/shared/ValueObject/IdVO";

interface EntidadeTesteProps extends EntidadeProps {
  nome?: string
  idade?: number
}

class EntidadeTeste extends Entidade<EntidadeTeste, EntidadeTesteProps> {
  constructor(props: EntidadeTesteProps) {
    super(props);
  }
}

test("Deve calcular igualdade para true quando as entidades possuem o mesmo id", () => {
  const id = IdVO.novo.valor;
  const entidade1 = new EntidadeTeste({ id });
  const entidade2 = new EntidadeTeste({ id });
  expect(entidade1.igual(entidade2)).toBeTruthy();
});

test("Deve calcular igualdade para false quando as entidades possuem ids diferentes", () => {
  const id1 = IdVO.novo.valor;
  const id2 = IdVO.novo.valor;
  const entidade1 = new EntidadeTeste({ id: id1 });
  const entidade2 = new EntidadeTeste({ id: id2 });
  expect(entidade1.igual(entidade2)).toBeFalsy();
  expect(entidade1.diferente(entidade2)).toBeTruthy();
});

test("Deve clonar uma entidade", () => {
  const entidade = new EntidadeTeste({
    id: IdVO.novo.valor,
    nome: "Fulano",
    idade: 20
  });

  const clone = entidade.clone({ idade: 30 });

  expect(clone.id.valor).toBe(entidade.id.valor);
  expect(clone.props.nome).toBe(entidade.props.nome);
  expect(clone.props.idade).toBe(30);
});

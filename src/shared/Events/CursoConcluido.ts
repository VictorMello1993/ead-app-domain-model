import { EmailVO } from "../ValueObject/EmailVO";
import { IdVO } from "../ValueObject/IdVO";
import { IEventoDominio } from "./IEventoDominio";

export class CursoConcluido implements IEventoDominio {
  constructor(
    readonly emailUsuario: EmailVO,
    readonly idCurso: IdVO,
    readonly data: Date
  ) {}
}

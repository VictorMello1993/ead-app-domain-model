import { IEventoDominio } from "./IEventoDominio";

export interface IObserverEventoDominio<E extends IEventoDominio> {
  eventoOcorreu(evento: E): void
}

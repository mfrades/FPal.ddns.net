import {Cualificacion} from './cualificacion';
export class Itinerario {
  itinerarioId: number = null;
  userId: number = null;
  cualificacion: string = null;
  terminada: boolean = false;
  fechaAdd: string = null;
  fechaFin: string = null;
  orden: number = null;
  cualificacionO: Cualificacion = null;
}

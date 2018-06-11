import {Realizacion} from './realizacion';
export class Competencia {
  codigo: string = null;
  nivel: number = null;
  nombre: string = null;
  medios: string = null;
  productos: string = null;
  informacion: string = null;
  realizaciones: Realizacion[] = [];
}

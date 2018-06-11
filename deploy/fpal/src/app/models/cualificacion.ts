import {Competencia} from './competencia';
export class Cualificacion {
  codigo: string = null;
  nivel: number = null;
  nombre: string = null;
  familia: string = null;
  descripcion: string = null;
  entorno: string = null;
  competencias: Competencia[] = [];
}

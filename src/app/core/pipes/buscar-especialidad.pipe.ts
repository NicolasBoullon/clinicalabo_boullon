import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarEspecialidad',
  standalone: true
})
export class BuscarEspecialidadPipe implements PipeTransform {

/**
 * 
 * @param especialidades array de especialidades
 * @param args categoria a buscar 
 * @returns 
 */
  transform(especialidades: any[], buscarEspecialidad: string): any {
    if(!especialidades || !buscarEspecialidad){
      return  especialidades;
    }
    return especialidades.filter(especialidad => especialidad.Especialidad.toLowerCase().includes(buscarEspecialidad.toLowerCase()))
  }

}

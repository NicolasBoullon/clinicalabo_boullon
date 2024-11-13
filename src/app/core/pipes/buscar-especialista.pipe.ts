import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarEspecialista',
  standalone: true
})
export class BuscarEspecialistaPipe implements PipeTransform {
/**
 * 
 * @param pacientes array de pacientes
 * @param args categoria a buscar 
 * @returns 
 */
transform(pacientes: any[], paciente: string): any {
  if(!pacientes || !paciente){
    return  pacientes;
  }
  return pacientes.filter(paciente => paciente.nombre.toLowerCase().includes(paciente.toLowerCase()))
}

}

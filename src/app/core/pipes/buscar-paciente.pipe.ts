import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarPaciente',
  standalone: true
})
export class BuscarPacientePipe implements PipeTransform {
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
  return pacientes.filter(pac => pac.usuario.nombre.toLowerCase().includes(paciente.toLowerCase()) ||pac.usuario.apellido.toLowerCase().includes(paciente.toLowerCase()))
}

}

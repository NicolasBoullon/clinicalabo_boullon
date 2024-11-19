import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarPacienteEspecialidad',
  standalone: true
})
export class BuscarPacienteEspecialidadPipe implements PipeTransform {

  transform(turnos: any[], buscar:string):  any{
    if(!turnos && !buscar){
      return turnos;
    }

    return turnos.filter((turno)=> turno.especialidad.toLowerCase().includes(buscar.toLowerCase()) ||
     turno.paciente.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
      turno.paciente.apellido.toLowerCase().includes(buscar.toLowerCase()));
  }

}

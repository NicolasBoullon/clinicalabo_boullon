import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarEspecialistaEspecialidad',
  standalone: true
})
export class BuscarEspecialistaEspecialidadPipe implements PipeTransform {

  transform(turnos: any[], buscar:string):  any{
    if(!turnos && !buscar){
      return turnos;
    }

    return turnos.filter((turno)=> turno.especialidad.toLowerCase().includes(buscar.toLowerCase()) ||
     turno.especialista.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
      turno.especialista.apellido.toLowerCase().includes(buscar.toLowerCase()));
  }

}

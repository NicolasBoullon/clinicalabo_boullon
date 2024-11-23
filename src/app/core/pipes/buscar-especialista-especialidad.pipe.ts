import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarEspecialistaEspecialidad',
  standalone: true
})
export class BuscarEspecialistaEspecialidadPipe implements PipeTransform {

  transform(turnos: any[], buscar:any):  any{
    if(!turnos && !buscar){
      return turnos;
    }

    return turnos.filter((turno) => {
      const fecha = new Date(turno.dia.seconds * 1000);
      const fechaFormateada = formatDate(fecha, 'dd MMMM yyyy', 'es-AR');
      
      return (
        turno.especialidad.toLowerCase().includes(buscar.toLowerCase()) ||
        turno.especialista.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
        turno.horario.toLowerCase().includes(buscar.toLowerCase()) ||
        fechaFormateada.toLowerCase().includes(buscar.toLowerCase()) ||
        turno.especialista.apellido.toLowerCase().includes(buscar.toLowerCase())
      );
    });
  }

    //  turno.historialClinico.peso.toString().includes(buscar.toLowerCase()) ||
    //  turno.historialClinico.presion.toString().includes(buscar.toLowerCase()) ||
    //  turno.historialClinico.temperatura.toString().includes(buscar.toLowerCase()) ||
}

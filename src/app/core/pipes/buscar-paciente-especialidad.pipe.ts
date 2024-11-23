import { formatDate } from '@angular/common';
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

    return turnos.filter((turno)=>{
      const fecha = new Date(turno.dia.seconds * 1000);
      const fechaFormateada = formatDate(fecha, 'dd MMMM yyyy', 'es-AR');

      if(turno.historialClinico){
        return (
          turno.especialidad.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.paciente.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.estado.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.horario.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.historialClinico.presion.toLowerCase().includes(buscar.toLowerCase())  ||
          turno.historialClinico.altura.toString().toLowerCase().includes(buscar.toLowerCase())  ||
          turno.historialClinico.peso.toString().toLowerCase().includes(buscar.toLowerCase())  ||
          turno.historialClinico.temperatura.toString().toLowerCase().includes(buscar.toLowerCase())  ||
          Object.keys(turno.historialClinico.campoDinamicoUno).toString().toLowerCase().includes(buscar.toLowerCase())  ||//din
          Object.values(turno.historialClinico.campoDinamicoUno).toString().toLowerCase().includes(buscar.toLowerCase())  ||//din
          Object.keys(turno.historialClinico.campoDinamicoDos).toString().toLowerCase().includes(buscar.toLowerCase())  ||//din
          Object.values(turno.historialClinico.campoDinamicoDos).toString().toLowerCase().includes(buscar.toLowerCase())  ||//din
          Object.keys(turno.historialClinico.campoDinamicoTres).toString().toLowerCase().includes(buscar.toLowerCase())  ||//din
          Object.values(turno.historialClinico.campoDinamicoTres).toString().toLowerCase().includes(buscar.toLowerCase())  ||//din
          fechaFormateada.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.paciente.apellido.toLowerCase().includes(buscar.toLowerCase())
        );
      }else{

        return (
          turno.especialidad.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.paciente.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.estado.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.horario.toLowerCase().includes(buscar.toLowerCase()) ||
          // turno.historialClinico.presion? (turno.historialClinico.presion.toLowerCase().includes(buscar.toLowerCase())): false  ||
          fechaFormateada.toLowerCase().includes(buscar.toLowerCase()) ||
          turno.paciente.apellido.toLowerCase().includes(buscar.toLowerCase())
        );
      }
      
    })
  }

}

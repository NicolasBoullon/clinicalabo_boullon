import { Component, OnInit } from '@angular/core';
import { EspecialidadesService } from '../../core/services/especialidades.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BuscarEspecialidadPipe } from '../../core/pipes/buscar-especialidad.pipe';
import { EspecialistasService } from '../../core/services/especialistas.service';
import { SeleccionoEspecialidadDirective } from '../../core/directives/selecciono-especialidad.directive';
import { SeleccionoEspecialistaDirective } from '../../core/directives/selecciono-especialista.directive';
import { TurnosService } from '../../core/services/turnos.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FormsModule,CommonModule,BuscarEspecialidadPipe,DatePipe,SeleccionoEspecialidadDirective,SeleccionoEspecialistaDirective],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit {

  especialidades:any;
  especialistas:any[] = [];
  especialistasConEspecialidadSeleccionada:any = [];
  BuscarEspecialidad:string = '';
  BuscarEspecialista:string = '';
  especialidadSeleccionada:string|null = '';
  especialistaSeleccionado:string|null|any = '';
  turnos30 = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];
  turnos30sabado = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
    '13:00','13:30','14:00'];
  turnos60 = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  turno60sabado = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00'];
  turnosLunes!:any;
  turnosMartes!:any;
  turnosMiercoles!:any;
  turnosJueves!:any;
  turnosViernes!:any;
  turnosSabado!:any;
  diasDeLasSemanas:any;
  semanaUno:boolean = true;

  sub!:Subscription;
  
  turnos:any = [];
  constructor(private especialidadesService:EspecialidadesService,private especialistasService:EspecialistasService,private turnosService:TurnosService,private authService:AuthService){}


  ngOnInit(): void {
    this.IniciarEspecialidades();
    this.IniciarEspecialistas();
    this.GetDiasDosSemanas();
    this.sub = this.turnosService.GetTurnos().subscribe({
      next: ((resp)=>{
        this.turnos = resp;
        console.log(this.turnos);
        
      }),
      error:((err)=>{
        console.log(err);
      })
    })
  }
  
  cambiarSemana(){
    this.semanaUno = !this.semanaUno;
  }



  SetearDias(especialista:any){
    if (especialista.usuario.lunes.horarios.desde !== '----' && especialista.usuario.lunes.dias.especialidad === this.especialidadSeleccionada) {
      especialista.usuario.lunes.dias.hora == 30 ? this.turnosLunes = this.turnos30 : this.turnosLunes = this.turnos60;
    } else {
      this.turnosLunes = [];
    }
    
    if (especialista.usuario.martes.horarios.desde !== '----' && especialista.usuario.martes.dias.especialidad === this.especialidadSeleccionada) {
      especialista.usuario.martes.dias.hora == 30 ? this.turnosMartes = this.turnos30 : this.turnosMartes = this.turnos60;
    } else {
      this.turnosMartes = [];
    }
    
    if (especialista.usuario.miercoles.horarios.desde !== '----' && especialista.usuario.miercoles.dias.especialidad === this.especialidadSeleccionada) {
      especialista.usuario.miercoles.dias.hora == 30 ? this.turnosMiercoles = this.turnos30 : this.turnosMiercoles = this.turnos60;
    } else {
      this.turnosMiercoles = [];
    }
    
    if (especialista.usuario.jueves.horarios.desde !== '----' && especialista.usuario.jueves.dias.especialidad === this.especialidadSeleccionada) {

      especialista.usuario.jueves.dias.hora == 30 ? this.turnosJueves = this.turnos30 : this.turnosJueves = this.turnos60;

    } else {
      this.turnosJueves = [];

    }
    
    if (especialista.usuario.viernes.horarios.desde !== '----' && especialista.usuario.viernes.dias.especialidad === this.especialidadSeleccionada) {
      especialista.usuario.viernes.dias.hora == 30 ? this.turnosViernes = this.turnos30 : this.turnosViernes = this.turnos60;
    } else {
      this.turnosViernes = [];
    }
    
    if (especialista.usuario.sabado.horarios.desde !== '----' && especialista.usuario.sabado.dias.especialidad === this.especialidadSeleccionada) {
      especialista.usuario.sabado.dias.hora == 30 ? this.turnosSabado = this.turnos30 : this.turnosSabado = this.turnos60;
    } else {
      this.turnosSabado = [];
    }
  }

  SacarTurno(turno:any,dia:any){
    console.log(turno,dia);
    console.log(this.authService.usuarioConectado);
    console.log(this.especialistaSeleccionado.usuario);
    console.log(this.especialidadSeleccionada);
    this.turnosService.AgendarTurno(this.authService.usuarioConectado,this.especialistaSeleccionado.usuario,this.especialidadSeleccionada,dia,turno,'pendiente');
  }

  TurnoOcupado(turno:any,dia:any){
    const turnos = this.turnos;

    for (let i = 0; i < turnos.length; i++) {
        // Convertimos el timestamp de Firebase a una fecha
        const timestampMs = new Date(turnos[i].dia.seconds * 1000).toString();
        const diaActual = dia.toString();

        // Dividimos la fecha y extraemos los componentes que queremos comparar
        const fechaTurno = timestampMs.split(' ').slice(0, 3).join(' '); // Ejemplo: "Tue Nov 12"
        const fechaDia = diaActual.split(' ').slice(0, 3).join(' ');      // Ejemplo: "Tue Nov 12"

        // Comprobamos si el día y el horario coinciden
        if (fechaTurno === fechaDia && turno === turnos[i].horario) {
            console.log('desactivado');
            return true;
        }
    }

    return false;
  }

  GetDiasDosSemanas(){
    let today = new Date();
    const arrayDeDias: any[] = [];
    let daysAdded = 0;
  
    while (daysAdded < 15) {
      // Crear una nueva instancia de Date en cada iteración
      const date = new Date(today);
      date.setDate(today.getDate() + daysAdded);
  
      // Si no es domingo (día 0), añadirlo al array
      if (date.getDay() !== 0) {
        arrayDeDias.push(date);
      } else {
        // Si es domingo, saltarlo y no incrementar `daysAdded`
        daysAdded++;
        continue;
      }
      
      daysAdded++;
    }
    this.diasDeLasSemanas = arrayDeDias;
    console.log(arrayDeDias);
  }

  ElegirEspecialidad(especialidadSeleccionada:string){
    this.especialidadSeleccionada = especialidadSeleccionada;
    this.especialistasConEspecialidadSeleccionada = this.especialistas.filter(esp => esp.usuario.especialidades.includes(especialidadSeleccionada));
    this.especialistaSeleccionado = null;

  }

  ElegirEspecialista(especialistaSeleccionado:any){
    this.especialistaSeleccionado = especialistaSeleccionado;
    console.log(especialistaSeleccionado);
    this.SetearDias(especialistaSeleccionado);
  }

  async IniciarEspecialidades(){
    this.especialidadesService.GetEspecialidades().subscribe({
      next:(value)=>{
        console.log(value);
        if(value.length == 0){
          console.log('no hay especialidades creadas');
        }else{
          this.especialidades = value;
        }
      }
    })
  }

  async IniciarEspecialistas(){
    this.especialistasService.GetTodosEspecialistas().subscribe({
      next:(value)=>{
        if(value.length == 0){
          console.log('no hay especialistas creados');
        }else{
          this.especialistas = value;
        }
      }
    })
  }
}

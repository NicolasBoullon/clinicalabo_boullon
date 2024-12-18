import { Component, OnDestroy, OnInit } from '@angular/core';
import { EspecialidadesService } from '../../core/services/especialidades.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BuscarEspecialidadPipe } from '../../core/pipes/buscar-especialidad.pipe';
import { EspecialistasService } from '../../core/services/especialistas.service';
// import { SeleccionoEspecialidadDirective } from '../../core/directives/selecciono-especialidad.directive';
// import { SeleccionoEspecialistaDirective } from '../../core/directives/selecciono-especialista.directive';
import { TurnosService } from '../../core/services/turnos.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { PacientesService } from '../../core/services/pacientes.service';
import { BuscarPacientePipe } from '../../core/pipes/buscar-paciente.pipe';
import { BuscarEspecialistaPipe } from '../../core/pipes/buscar-especialista.pipe';
import { especialidadesImages } from '../../shared/especialidades';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FormsModule,CommonModule,BuscarEspecialidadPipe,DatePipe,BuscarPacientePipe,BuscarEspecialistaPipe,StyleButtonDirective],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit ,OnDestroy{

  especialidades:any;
  pacientes:any[] = []
  especialistas:any[] = [];
  especialistasConEspecialidadSeleccionada:any = [];
  BuscarEspecialidad:string = '';
  BuscarEspecialista:string = '';
  BuscarPaciente:string = '';
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

  rol:any = '';
  //aaaaa
  //aaaa
  diasDeLasSemanas:any;
  semanaUno:boolean = true;
  turnosOrdenados:any;
  sub!:Subscription;
  subEsp!:Subscription;
  subEspecialistas!:Subscription;
  subPacientes!:Subscription;
  turnos:any = [];

  wait!:Promise<boolean>;
  esAdmin!:Promise<boolean>;
  turnosSemanaActual!:any;
  turnosSemanaSiguiente!:any;
  especialidadesArray:string[] = especialidadesImages;
  pacienteSeleccionado:any;
  constructor(private especialidadesService:EspecialidadesService,private pacientesService:PacientesService,
    private especialistasService:EspecialistasService,private turnosService:TurnosService,private authService:AuthService,private toastr:ToastrService){}


  ngOnInit(): void {
    this.IniciarEspecialidades();
    this.IniciarEspecialistas();
    this.IniciarPacientes();
    this.GetDiasDosSemanas();
    // setTimeout(() => {
      this.ConstultarAdmin();
    // }, 1000);
    this.sub = this.turnosService.GetTurnos().subscribe({
      next: ((resp)=>{
        this.turnos = resp;        
      }),
      error:((err)=>{
        console.log(err);
      })
    })
  }
  
  cambiarSemana(){
    this.semanaUno = !this.semanaUno;
  }


  ElegirPaciente(paciente:any){
    this.pacienteSeleccionado = paciente;
  }

  SetearDias(especialista:any){
    const turnosSemana: any = Array(15).fill([]); // Creamos un array de 15 días
    console.log(turnosSemana);
    
    console.log(this.especialidadSeleccionada);
    

    // Configuración de los turnos para cada día (del 0 al 14), evitando los domingos
    this.diasDeLasSemanas.forEach((fecha:any, index:any) => {
        const dia = fecha.getDay(); // Obtenemos el día de la semana (0 = Domingo, 1 = Lunes, etc.)
        console.log(dia);
        console.log(this.turnos30);
        console.log(this.turnos60);
        
        switch (dia) {
          case 1: // Lunes
              if (especialista.usuario.lunes.horarios.desde !== '----' && especialista.usuario.lunes.dias.especialidad === this.especialidadSeleccionada) {
                console.log('tiene');
                
                  turnosSemana[index] = especialista.usuario.lunes.dias.hora == 30 ? this.turnos30 : this.turnos60;
                  let desde = turnosSemana[index].indexOf(especialista.usuario.lunes.horarios.desde);
                  let hasta = turnosSemana[index].indexOf(especialista.usuario.lunes.horarios.hasta);
                  turnosSemana[index] = turnosSemana[index].slice(desde, hasta + 1);
                  console.log(turnosSemana[index]);
                  
              }
              break;
          case 2: // Martes
              if (especialista.usuario.martes.horarios.desde !== '----' && especialista.usuario.martes.dias.especialidad === this.especialidadSeleccionada) {
                  turnosSemana[index] = especialista.usuario.martes.dias.hora == 30 ? this.turnos30 : this.turnos60;
                  let desde = turnosSemana[index].indexOf(especialista.usuario.martes.horarios.desde);
                  let hasta = turnosSemana[index].indexOf(especialista.usuario.martes.horarios.hasta);
                  turnosSemana[index] = turnosSemana[index].slice(desde, hasta + 1);
              }
              break;
          case 3: // Miércoles
              if (especialista.usuario.miercoles.horarios.desde !== '----' && especialista.usuario.miercoles.dias.especialidad === this.especialidadSeleccionada) {
                  turnosSemana[index] = especialista.usuario.miercoles.dias.hora == 30 ? this.turnos30 : this.turnos60;
                  let desde = turnosSemana[index].indexOf(especialista.usuario.miercoles.horarios.desde);
                  let hasta = turnosSemana[index].indexOf(especialista.usuario.miercoles.horarios.hasta);
                  turnosSemana[index] = turnosSemana[index].slice(desde, hasta + 1);
              }
              break;
          case 4: // Jueves
              if (especialista.usuario.jueves.horarios.desde !== '----' && especialista.usuario.jueves.dias.especialidad === this.especialidadSeleccionada) {
                  turnosSemana[index] = especialista.usuario.jueves.dias.hora == 30 ? this.turnos30 : this.turnos60;
                  let desde = turnosSemana[index].indexOf(especialista.usuario.jueves.horarios.desde);
                  let hasta = turnosSemana[index].indexOf(especialista.usuario.jueves.horarios.hasta);
                  turnosSemana[index] = turnosSemana[index].slice(desde, hasta + 1);
              }
              break;
          case 5: // Viernes
              if (especialista.usuario.viernes.horarios.desde !== '----' && especialista.usuario.viernes.dias.especialidad === this.especialidadSeleccionada) {
                  turnosSemana[index] = especialista.usuario.viernes.dias.hora == 30 ? this.turnos30 : this.turnos60;
                  let desde = turnosSemana[index].indexOf(especialista.usuario.viernes.horarios.desde);
                  let hasta = turnosSemana[index].indexOf(especialista.usuario.viernes.horarios.hasta);
                  turnosSemana[index] = turnosSemana[index].slice(desde, hasta + 1);
              }
              break;
          case 6: // Sábado
              if (especialista.usuario.sabado.horarios.desde !== '----' && especialista.usuario.sabado.dias.especialidad === this.especialidadSeleccionada) {
                  turnosSemana[index] = especialista.usuario.sabado.dias.hora == 30 ? this.turnos30sabado : this.turno60sabado;
                  let desde = turnosSemana[index].indexOf(especialista.usuario.sabado.horarios.desde);
                  let hasta = turnosSemana[index].indexOf(especialista.usuario.sabado.horarios.hasta);
                  turnosSemana[index] = turnosSemana[index].slice(desde, hasta + 1);
              }
              break;
      }
      
    });

    console.log(turnosSemana);
    
    // Dividir turnosSemana en dos semanas
    this.turnosSemanaActual = turnosSemana.slice(0, 6);
    console.log(this.turnosSemanaActual);
    
    this.turnosSemanaSiguiente = turnosSemana.slice(6, 12);
  }

  SacarTurno(turno:any,dia:any){
    if(this.pacienteSeleccionado){
      this.turnosService.AgendarTurno(this.pacienteSeleccionado.usuario,this.especialistaSeleccionado.usuario,this.especialidadSeleccionada,dia,turno,'pendiente');
    }else{
      this.turnosService.AgendarTurno(this.authService.usuarioConectado,this.especialistaSeleccionado.usuario,this.especialidadSeleccionada,dia,turno,'pendiente');
    }
    this.toastr.success("Turno Agendando Correctamente.",'Perfecto!',{timeOut:2000});
  }

  TurnoOcupado(turno:any,dia:any){
    
    for (let i = 0; i < this.turnos.length; i++) {
        // Convertimos el timestamp de Firebase a una fecha
        const timestampMs = new Date(this.turnos[i].dia.seconds * 1000).toString();
        const diaActual = dia.toString();

        // Dividimos la fecha y extraemos los componentes que queremos comparar
        const fechaTurno = timestampMs.split(' ').slice(0, 3).join(' '); // Ejemplo: "Tue Nov 12"
        const fechaDia = diaActual.split(' ').slice(0, 3).join(' ');      // Ejemplo: "Tue Nov 12"
        // console.log(fechaTurno);
        // console.log(fechaDia);
        
        // Comprobamos si el día y el horario coinciden
        if (fechaTurno === fechaDia && turno === this.turnos[i].horario && this.especialistaSeleccionado.usuario.correo == this.turnos[i].especialista.correo) {
          // console.log('Turno',this.turnos[i].horario);
            console.log('desactivado',turno);
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
  }

  ElegirEspecialidad(especialidadSeleccionada:string)
  {
    this.especialidadSeleccionada = especialidadSeleccionada;
    console.log(this.especialidadSeleccionada);
    
    this.especialistasConEspecialidadSeleccionada = this.especialistas.filter(esp => esp.usuario.especialidades.includes(especialidadSeleccionada));
    console.log(this.especialistasConEspecialidadSeleccionada);

    this.especialistaSeleccionado = null;
  }

  ElegirEspecialista(especialistaSeleccionado:any){
    this.especialistaSeleccionado = especialistaSeleccionado;
    this.SetearDias(especialistaSeleccionado);
  }

  Reiniciar()
  {
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;
    this.semanaUno = true;
  }

  async IniciarEspecialidades(){
    this.subEsp = this.especialidadesService.GetEspecialidades().subscribe({
      next:async(value)=>{
        console.log(value);
        if(value.length == 0){
          console.log('no hay especialidades creadas');
        }else{  
          this.especialidades = value;
          // setTimeout(() => {
          // await  this.IniciarArrayEspecialidades(this.especialidades);
          this.wait = Promise.resolve(false)
          // }, 2000);
        }
      }
    })
  }
  especialidadIncluida(especialidad: string): boolean {
    return this.especialidadesArray.includes(especialidad.toLowerCase());
  }
  // async IniciarArrayEspecialidades(especialidades:any){
  //   console.log(especialidades);
  //   this.especialidadesArray = especialidades.map((esp:any) => esp.Especialidad.toLowerCase());
  // }

  async IniciarPacientes(){
    this.subPacientes = this.pacientesService.GetTodosPacientes().subscribe({
      next:(value)=>{
        if(value.length == 0){
          console.log('no hay pacientes');
        }else{
          this.pacientes = value;
        }
      }
    })
  }
  async IniciarEspecialistas(){
    this.subEspecialistas = this.especialistasService.GetTodosEspecialistas().subscribe({
      next:(value)=>{
        if(value.length == 0){
          console.log('no hay especialistas creados');
        }else{
          this.especialistas = value;
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subEsp.unsubscribe();
    this.subEspecialistas.unsubscribe();
  }

   ConstultarAdmin(){
    this.rol = this.authService.GetUserRol();
    if(this.rol == 'Administrador'){
      this.esAdmin = Promise.resolve(true);
    }
  }
  

  buscarImagen(especialidad:string){
    // console.log(especialidad.toLowerCase());
    console.log('ahora lee');
    console.log(especialidad.toLowerCase());
    
    if(this.especialidadesArray.includes(especialidad.toLowerCase())){
      return true;
    }else{
      return false;
    }
  }


  EsEspecialistaConEspecialidad(especialista:any){
    if(especialista.usuario.especialidades.includes(this.especialidadSeleccionada)){
      return true;
    }
    return false;
  }

  HayAlgunEspecialistaConEspecialidadSeleccionada(){
    for (let index = 0; index < this.especialistas.length; index++) {
  
      if(this.especialistas[index].usuario.especialidades.includes(this.especialidadSeleccionada)){
        return true;
      }
    }
    return false;
  }
}

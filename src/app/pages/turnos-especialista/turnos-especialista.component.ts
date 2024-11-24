import { Component } from '@angular/core';
import { EspecialistasService } from '../../core/services/especialistas.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule, formatDate } from '@angular/common';
import { CancelarTurnoComponent } from '../turnos-paciente/components/cancelar-turno/cancelar-turno.component';
import { VerComentarioComponent } from '../turnos-paciente/components/ver-comentario/ver-comentario.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormsModule } from '@angular/forms';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';
import { FinalizarTurnoComponent } from './components/finalizar-turno/finalizar-turno.component';
import { EstadoTurnoColorDirective } from '../../core/directives/estado-turno-color.directive';
import { BuscarPacienteEspecialidadPipe } from '../../core/pipes/buscar-paciente-especialidad.pipe';
import { HistoriaClinicaComponent } from './components/historia-clinica/historia-clinica.component';
import { PacientesService } from '../../core/services/pacientes.service';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [CommonModule,FormsModule,VerComentarioComponent,CancelarTurnoComponent,StyleButtonDirective,EstadoTurnoColorDirective,BuscarPacienteEspecialidadPipe],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent {
  constructor(private authService:AuthService,private especialistaService:EspecialistasService,private firestore:FirestoreService,private _matDialog:MatDialog,private pacientesService:PacientesService){}


  turnos:any = [];
  subTurnos!:Subscription;
  subPacientes:any;
  pacientes:any[] = [];
  BuscarPacienteEspecialidad:string = '';
  ngOnInit(): void {
      console.log(this.authService.usuarioConectado);
      this.GetTurnos();
      this.GetPacientes();
  }

  async GetTurnos(){
   this.subTurnos= this.firestore.getCollectionOrderedByDate('turnos','dia')
    .subscribe({
      next: (turnos=>{
        console.log(turnos,'turnos ordenados');
        if(turnos.length == 0){
                
        }else{
          this.turnos = this.TurnosFiltrados(turnos);
          console.log(this.turnos);
          console.log(this.authService.usuarioConectado);
          
          
        }
      })
    })
  }

  async GetPacientes(){
    this.subPacientes = this.pacientesService.GetTodosPacientes()
    .subscribe({
      next:((value)=>{
        console.log(value);
        this.pacientes = value;
      })
    })
  }

  SelectChange(turno:any,evento:Event){
    
    const select = (evento.target as HTMLSelectElement).value;
    switch(select){
      case 'cancelado':
        this.CancelarTurno(turno);
      break;

      case 'rechazado':
        this.AbrirCajaDeComentario(turno,'rechazado');
      break;

      case 'aceptado':
        this.firestore.updateDocumentField('turnos',turno.id,'estado','aceptado');
      break;
    }
    console.log(select);
    
  }
  FinalizarTUrno(turno:any){
    const dialogRef = this._matDialog.open(FinalizarTurnoComponent,{
      disableClose:true
    });

    dialogRef.afterClosed().subscribe({
      next:(values)=>{
        console.log(values);
        if(values){
          // this.firestore.updateDocumentField('turnos',turno.id,'comentario',values.comentario);
          this.firestore.updateDocumentField('turnos',turno.id,'diagnostico',values);
          this.firestore.updateDocumentField('turnos',turno.id,'estado','finalizado');
        }
      }
    })
  }

  VerResenia(turno:any){
    this._matDialog.open(VerComentarioComponent,{
      data:turno.diagnostico
    });
  }

  async CancelarTurno(turno:any){
    await this.AbrirCajaDeComentario(turno,'cancelado');
  }

  CargarHistorialClinico(turno:any){
    console.log(this.pacientes);
    // console.log(this.pacientes);
    
    const pacienteCompleto:any = this.pacientes.filter((paciente)=> paciente.usuario.correo == turno.paciente.correo);
    // console.log(pacienteCompleto);
    
    const refHistorial = this._matDialog.open(HistoriaClinicaComponent,{
      disableClose:true,
      width: '900px',
      height: '900px'
    });

    refHistorial.afterClosed().subscribe({
      next:(async (value)=>{
        console.log(value);
        if(value){
          value['especialista'] = `${turno.especialista.nombre} ${turno.especialista.apellido}`;
          console.log(value);
          
          await this.firestore.updateDocumentField('turnos',turno.id,'historialClinico',value);
          
          this.firestore.addElementArrayField('pacientes',pacienteCompleto[0].uid,`usuario.historialClinico`,value);
        }
      })
    })

  }

  async AbrirCajaDeComentario(turno:any,accion: 'cancelado' | 'rechazado'){
    const dialogRef = this._matDialog.open(CancelarTurnoComponent,{
      width:'600px',
      disableClose:true,
      data:turno.comentario
    })

    dialogRef.afterClosed()
    .subscribe({
      next:(comentario)=>{
        if(comentario) {
          console.log(comentario);
           this.firestore.updateDocumentField('turnos',turno.id,'comentarioCancelado',comentario);
           this.firestore.updateDocumentField('turnos',turno.id,'estado',accion);
        }
      }
    })
    
  }

  TurnosFiltrados(arrayTurnos:Array<any>){
    return arrayTurnos.filter(turno=> turno.especialista.correo == this.authService.usuarioConectado?.correo)
  }

  ngOnDestroy(): void {
    this.subTurnos.unsubscribe();
  }

  formatDate(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000); 
    
    return formatDate(date, 'dd MMMM yyyy', 'es-AR');
  }
}

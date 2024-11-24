import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PacientesService } from '../../core/services/pacientes.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';
import { MatDialog } from '@angular/material/dialog';
import { CancelarTurnoComponent } from './components/cancelar-turno/cancelar-turno.component';
import { VerComentarioComponent } from './components/ver-comentario/ver-comentario.component';
import { EstadoTurnoColorDirective } from '../../core/directives/estado-turno-color.directive';
import { CalificarAtencionComponent } from './components/calificar-atencion/calificar-atencion.component';
import { RealizarEncuestaComponent } from './components/realizar-encuesta/realizar-encuesta.component';
import { FormsModule } from '@angular/forms';
import { BuscarEspecialistaEspecialidadPipe } from '../../core/pipes/buscar-especialista-especialidad.pipe';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [DatePipe,CommonModule,StyleButtonDirective,EstadoTurnoColorDirective,FormsModule,BuscarEspecialistaEspecialidadPipe],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit,OnDestroy{

  constructor(private authService:AuthService,private pacientesService:PacientesService,private firestore:FirestoreService,private _matDialog:MatDialog){}

  BuscarEspecialistaEspecialidad:string  = '';
  turnos:any = [];
  subTurnos!:Subscription;
  mostrar!:Promise<boolean>
  ngOnInit(): void {
      console.log(this.authService.usuarioConectado);
      this.GetTurnos();
  }

  async GetTurnos(){
   this.subTurnos= this.firestore.getCollectionOrderedByDate('turnos','dia')
    .subscribe({
      next: (turnos=>{
        console.log(turnos);
        if(turnos.length == 0){
                
        }else{
          this.turnos = this.TurnosFiltrados(turnos);
          console.log(this.turnos);
          console.log(this.authService.usuarioConectado);
          
        }
      })
    })
  }

  VerResenia(turno:any){
    this._matDialog.open(VerComentarioComponent,{
      data:turno.diagnostico
    });
  }

  async CancelarTurno(turno:any){
    await this.AbrirCajaDeComentario(turno);
  }

  CalificarAtencion(turno:any)
  {
    const estrellas = this._matDialog.open(CalificarAtencionComponent,{
      disableClose:true,
    });

    estrellas.afterClosed().subscribe({
      next:(value=>{
        console.log(value);
        if(value == null){
          console.log('es nulo');
          
        }else{
          console.log('no es nulo');
          // this.firestore.updateDocumentField('turnos',turno.id,'calificacion-atencion',value);
        }
      })
    })
  }
  async AbrirCajaDeComentario(turno:any){
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
           this.firestore.updateDocumentField('turnos',turno.id,'comentarioCancelarTurno',comentario);
           this.firestore.updateDocumentField('turnos',turno.id,'estado','cancelado');
        }
      }
    })
  }

  RealizarEncuesta(turno:any){
    const encuesta = this._matDialog.open(RealizarEncuestaComponent,{
      disableClose:true,
    })

    encuesta.afterClosed().subscribe({
      next:((value)=>{
        console.log(value);
        if(value){
          this.firestore.updateDocumentField('turnos',turno.id,'encuesta',value)
        }else{
          console.log('cancelo');
          
        }
      })
    })
  }

  TurnosFiltrados(arrayTurnos:Array<any>){

    return arrayTurnos.filter(turno=> turno.paciente.correo == this.authService.usuarioConectado?.correo)
  }

  ngOnDestroy(): void {
    this.subTurnos.unsubscribe();
  }

  formatDate(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000); 
    
    return formatDate(date, 'dd MMMM yyyy', 'es-AR');
    // return formatDate(date, 'dd MMM yyyy, h:mm a', 'en-US');
  }
}

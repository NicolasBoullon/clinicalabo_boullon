import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TurnosService } from '../../core/services/turnos.service';
import { Subscription } from 'rxjs';
import { EstadoTurnoColorDirective } from '../../core/directives/estado-turno-color.directive';
import { BuscarEspecialistaEspecialidadPipe } from '../../core/pipes/buscar-especialista-especialidad.pipe';
import { CancelarTurnoComponent } from '../turnos-paciente/components/cancelar-turno/cancelar-turno.component';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../core/services/firestore.service';
import { FormatTimeStampPipe } from '../../core/pipes/format-time-stamp.pipe';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule,CommonModule,EstadoTurnoColorDirective,BuscarEspecialistaEspecialidadPipe,DatePipe,FormatTimeStampPipe,StyleButtonDirective],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit, OnDestroy{

  constructor(private turnosService:TurnosService,private _matDialog:MatDialog,private firestoreService:FirestoreService){}
  
  sub!:Subscription;
  turnos:any[] =[];
  BuscarEspecialistaEspecialidad:string = '';
  // showSpinner:
  ngOnInit(): void {
    this.sub = this.turnosService.GetTurnos()
    .subscribe({
      next:((value)=>{
        this.turnos = value;
      }),
      error:((error)=>{
        console.log(error);
      })
    })
  }

  async CancelarTurno(turno:any){
    await this.AbrirCajaDeComentario(turno);
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
           this.firestoreService.updateDocumentField('turnos',turno.id,'comentarioCancelarTurno',comentario);
           this.firestoreService.updateDocumentField('turnos',turno.id,'estado','cancelado');
        }
      }
    })
  }

  // formatDate(timestamp: { seconds: number, nanoseconds: number }): string {
    // const date = new Date(timestamp.seconds * 1000); 
    
    // return formatDate(date, 'dd MMMM yyyy', 'es-AR');
    // return formatDate(date, 'dd MMM yyyy, h:mm a', 'en-US');
  // }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

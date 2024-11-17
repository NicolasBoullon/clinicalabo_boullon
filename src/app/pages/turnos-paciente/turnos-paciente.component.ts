import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PacientesService } from '../../core/services/pacientes.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [DatePipe,CommonModule,StyleButtonDirective],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit,OnDestroy{

  constructor(private authService:AuthService,private pacientesService:PacientesService,private firestore:FirestoreService){}


  turnos:any = [];
  subTurnos!:Subscription;
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

  CancelarTurno(turno:any){
    
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

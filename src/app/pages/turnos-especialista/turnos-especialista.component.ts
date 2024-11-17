import { Component } from '@angular/core';
import { EspecialistasService } from '../../core/services/especialistas.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent {
  constructor(private authService:AuthService,private especialistaService:EspecialistasService,private firestore:FirestoreService){}


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

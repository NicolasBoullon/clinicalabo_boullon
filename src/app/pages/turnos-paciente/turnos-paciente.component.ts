import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PacientesService } from '../../core/services/pacientes.service';
import { FirestoreService } from '../../core/services/firestore.service';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit{

  constructor(private authService:AuthService,private pacientesService:PacientesService,private firestore:FirestoreService){}


  ngOnInit(): void {
      console.log(this.authService.usuarioConectado);
      this.GetTurnos();
  }

  async GetTurnos(){
    this.firestore.getCollection('turnos')
    .subscribe({
      next: (turnos=>{
        console.log(turnos);
        if(turnos.length == 0){
                
        }
      })
    })
  }
}

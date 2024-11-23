import { Component, OnInit } from '@angular/core';
import { PacientesService } from '../../core/services/pacientes.service';
import { TurnosService } from '../../core/services/turnos.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { ObjectKeyValuePipe } from '../../core/pipes/object-key-value.pipe';
import { MatDialog } from '@angular/material/dialog';
import { VerComentarioComponent } from '../turnos-paciente/components/ver-comentario/ver-comentario.component';
import { EstadoTurnoColorDirective } from '../../core/directives/estado-turno-color.directive';
import { FormatTimeStampPipe } from '../../core/pipes/format-time-stamp.pipe';
@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [FormsModule,CommonModule,MatIconModule,MatDividerModule,MatButtonModule,MatMenuModule,ObjectKeyValuePipe,EstadoTurnoColorDirective,FormatTimeStampPipe],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit{

  constructor(private pacientesService:PacientesService,private TurnosService:TurnosService,private authService:AuthService,private _matDialog:MatDialog){}

  pacientes:any[] = [];
  turnos:any[] = [];
  emailDelEspecialista:any;
  yaInicio!:Promise<boolean>;
  pacientesFiltradosAtendio:any[] = [];
  seleccionoPaciente:any;
  ngOnInit(): void {
    setTimeout(async () => {
      
      await this.GetPacientes();
      await this.GetTurnos();
      await this.GetEmail();
    }, 100);
  }

  async GetEmail(){
    this.emailDelEspecialista = await this.authService.GetUserEmailAsync();
  }

  SeleccionoPaciente(paciente:any){
    this.seleccionoPaciente = paciente;
  }
  FiltrarTurnoPorPaciente(paciente:any){

  }

  async GetPacientes(){
    this.pacientesService.GetTodosPacientes().subscribe({
      next:((value)=>{
        console.log(value);
        this.pacientes = value;
      })
    })
  }

  async GetTurnos(){
    this.TurnosService.GetTurnos().subscribe({
      next:(async (value)=>{
        this.turnos = value;
       await this.GetEmails();
      
      })
    })
  }

  FiltrarPacientesAtendidos(correos:any[]){
    this.pacientesFiltradosAtendio = this.pacientes.filter((paciente)=> correos.includes(paciente.usuario.correo));
  }

  async GetEmails(){
    const emails:string[] = [];
    this.turnos.forEach((turno)=>{
      if(turno.especialista.correo == this.emailDelEspecialista){
        emails.push(turno.paciente.correo);
      }
    })
    console.log(emails);
    this.yaInicio = Promise.resolve(true);
    let CorreosSinRepetidos = Array.from(new Set(emails));

    this.FiltrarPacientesAtendidos(CorreosSinRepetidos);
    return CorreosSinRepetidos;
  }


  VerResenia(turno:any){
    this._matDialog.open(VerComentarioComponent,{
      data:turno.diagnostico
    });
  }
}

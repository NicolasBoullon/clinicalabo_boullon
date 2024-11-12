import { Component, OnDestroy, OnInit } from '@angular/core';
import { EspecialistasService } from '../../core/services/especialistas.service';
import { PacientesService } from '../../core/services/pacientes.service';
import { Subscription } from 'rxjs';
import { Especialista } from '../../core/models/Especialista';
import { Paciente } from '../../core/models/Paciente';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormEspecialistaComponent } from '../registro-especialista/components/form-especialista/form-especialista.component';
import { FormSocioComponent } from '../registro-socio/components/form-socio/form-socio.component';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { FormAdministradorComponent } from './components/form-administrador/form-administrador.component';
import { AdministradorService } from '../../core/services/administrador.service';
import { AprobadoPipe } from '../../core/pipes/aprobado.pipe';
import { EstaAprobadoDirective } from '../../core/directives/esta-aprobado.directive';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, SpinnerComponent,AprobadoPipe,EstaAprobadoDirective],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit,OnDestroy{

  showSpinner:boolean = true;
  subEspecialistas!:Subscription;
  subPacientes!:Subscription;
  subAdministradores!:Subscription;
  especialistas:any;
  pacientes:any;
  administradores:any;
  constructor(private especialistasService:EspecialistasService
    ,private pacientesService:PacientesService,
    private administradoresService:AdministradorService,
    private _matDialog:MatDialog){}

  ngOnInit(): void {
    
    this.AbrirSpinner();
    this.subEspecialistas = this.especialistasService.GetTodosEspecialistas().subscribe({
      next: (respuesta:any)=>{
        console.log(respuesta);
        this.especialistas = respuesta;
      },
      error: (err:any)=>{
        console.log(err);
        
      }
    })
    this.subPacientes = this.pacientesService.GetTodosPacientes().subscribe({
      next: (respuesta:any)=>{
        this.pacientes = respuesta;
        console.log(respuesta);
        // setTimeout(() => {
          this.CerrarSpinner();
        // }, 1500);
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
    this.subAdministradores = this.administradoresService.GetTodosAdministradores().subscribe({
      next: (respuesta:any)=>{
        this.administradores = respuesta;
      }
    })
  }

  ToggleActivado(especialista: any) {    
    console.log(especialista);
    
    const activado = especialista.usuario.aprobada;
    
    this.especialistasService.ActivarEspecialista(especialista, activado);
  }

  AbrirFormEspecialista(){
    this._matDialog.open(FormEspecialistaComponent);
  }

  AbrirFormPaciente(){
    this._matDialog.open(FormSocioComponent,{
      data:{creadoUser:true}
    });
  }

  AbrirFormAdministrador(){
    this._matDialog.open(FormAdministradorComponent);
  }

  AbrirSpinner(){
    this._matDialog.open(SpinnerComponent);
  }

  CerrarSpinner(){
    this._matDialog.closeAll();
  }

  ngOnDestroy(): void {
    this.subAdministradores.unsubscribe();
    this.subEspecialistas.unsubscribe();
    this.subPacientes.unsubscribe();
  }
}

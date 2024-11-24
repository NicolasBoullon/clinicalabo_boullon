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
import { VerHistoriaClinicaComponent } from '../../shared/ver-historia-clinica/ver-historia-clinica.component';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, SpinnerComponent,AprobadoPipe,EstaAprobadoDirective,StyleButtonDirective,FormsModule,CommonModule],
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
  
  DescargarUsuariosExcel(tipo?: 'especialistas' | 'pacientes' | 'administradores') {
    let usuarios!: any[];
  
    if (tipo) {
      // Descargar solo un tipo de usuarios
      if (tipo === 'especialistas') {
        usuarios = this.especialistas.map((especialista: any) => ({
          Nombre: especialista.usuario.nombre,
          Apellido: especialista.usuario.apellido,
          Correo: especialista.usuario.correo,
          DNI: especialista.usuario.dni,
          Edad: especialista.usuario.edad,
          Rol: especialista.usuario.rol,
          Imagen: especialista.usuario.imagen,
          Especialidades: especialista.usuario.especialidades.join(', ') // Mantener el array de especialidades
        }));
      } else if (tipo === 'pacientes') {
        usuarios = this.pacientes.map((paciente: any) => ({
          Nombre: paciente.usuario.nombre,
          Apellido: paciente.usuario.apellido,
          Correo: paciente.usuario.correo,
          DNI: paciente.usuario.dni,
          Edad: paciente.usuario.edad,
          Rol: paciente.usuario.rol,
          ImagenUno: paciente.usuario.imagenUno,
          ImagenDos: paciente.usuario.imagenDos,
          ObraSocial: paciente.usuario.obraSocial
        }));
      } else if (tipo === 'administradores') {
        usuarios = this.administradores.map((administrador: any) => ({
          Nombre: administrador.usuario.nombre,
          Apellido: administrador.usuario.apellido,
          Correo: administrador.usuario.correo,
          DNI: administrador.usuario.dni,
          Edad: administrador.usuario.edad,
          Rol: administrador.usuario.rol,
          Imagen: administrador.usuario.imagen
        }));
      }
  
      const ws = XLSX.utils.json_to_sheet(usuarios);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
      XLSX.writeFile(wb, `${tipo}.xlsx`);
    } else {
      // Combinar todos los usuarios en un solo Excel con títulos
      const data: any[] = [];
  
      // Añadir encabezado para los datos (los títulos de las columnas)
      data.push([
        'Nombre', 'Apellido', 'Correo', 'DNI', 'Edad', 'Rol', 'Imagen', 'Especialidades'
      ]);
  
      // Añadir especialistas con título
      data.push(['Especialistas']);
      this.especialistas.forEach((especialista: any) => {
        data.push([
          especialista.usuario.nombre,
          especialista.usuario.apellido,
          especialista.usuario.correo,
          especialista.usuario.dni,
          especialista.usuario.edad,
          especialista.usuario.rol,
          especialista.usuario.imagen,
          especialista.usuario.especialidades.join(', '), // Especialidades como texto separado por comas
        ]);
      });
      data.push([]);
  
      // Añadir pacientes con título
      data.push([
        'Nombre', 'Apellido', 'Correo', 'DNI', 'Edad', 'Rol', 'ImagenUno', 'ImagenDos', 'ObraSocial'
      ]);
      data.push(['Pacientes']);
      this.pacientes.forEach((paciente: any) => {
        data.push([
          paciente.usuario.nombre,
          paciente.usuario.apellido,
          paciente.usuario.correo,
          paciente.usuario.dni,
          paciente.usuario.edad,
          paciente.usuario.rol,
          paciente.usuario.imagenUno,
          paciente.usuario.imagenDos,
          paciente.usuario.obraSocial
        ]);
      });
      data.push([]);
  
      // Añadir administradores con título
      data.push([
        'Nombre', 'Apellido', 'Correo', 'DNI', 'Edad', 'Rol', 'Imagen'
      ]);
      data.push(['Administradores']);
      this.administradores.forEach((administrador: any) => {
        data.push([
          administrador.usuario.nombre,
          administrador.usuario.apellido,
          administrador.usuario.correo,
          administrador.usuario.dni,
          administrador.usuario.edad,
          administrador.usuario.rol,
          administrador.usuario.imagen
        ]);
      });
  
      // Crear hoja de cálculo
      const ws = XLSX.utils.aoa_to_sheet(data); // Usamos aoa_to_sheet para manejar títulos y datos
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
      XLSX.writeFile(wb, `TodosLosUsuarios.xlsx`);
    }
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

  VerHistoriaClinica(paciente:any){
    this._matDialog.open(VerHistoriaClinicaComponent,{
      data: paciente,
      width: 'fit-content',
      height: 'fit-content',
      maxWidth:'none',
      maxHeight: '1200px',

    })
  }
}

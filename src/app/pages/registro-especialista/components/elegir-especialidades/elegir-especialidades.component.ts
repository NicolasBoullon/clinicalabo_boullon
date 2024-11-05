import { Component, Inject, OnInit } from '@angular/core';
import { EspecialidadesService } from '../../../../core/services/especialidades.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuscarEspecialidadPipe } from '../../../../core/pipes/buscar-especialidad.pipe';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-elegir-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, BuscarEspecialidadPipe, SpinnerComponent],
  templateUrl: './elegir-especialidades.component.html',
  styleUrl: './elegir-especialidades.component.css'
})
export class ElegirEspecialidadesComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private especialidadesService:EspecialidadesService,
    private dialogRef: MatDialogRef<ElegirEspecialidadesComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any
  ){
    if(this.data.especialidadesPreelegidas.value.length > 0){
      this.especialidadesElegidas = [...this.data.especialidadesPreelegidas.value];
      this.especialidadesElegidasNuevas = [...this.data.especialidadesPreelegidas.value];
    }
  }
  
  BuscarEspecialidad:string = '';
  especialidades:any[] = [];
  EspecialidadParaAgregar:string = '';
  
  especialidadesElegidas:any[] = [];
  especialidadesElegidasNuevas:any[] = [];

  showSpinner:boolean = true;

  
  ngOnInit(): void {
    this.especialidadesService.GetEspecialidades().subscribe({
      next: (resp:any[])=>{
        this.especialidades = resp;
        setTimeout(() => {
            this.showSpinner = false;
        }, 1500);
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  /**
   * 
   * @param especialidad especialdiad seleccionada para agregar al array
   */
  ElegirEspecialidad(especialidad:string){
    const index = this.especialidadesElegidasNuevas.indexOf(especialidad);
    if (index === -1) {
      this.especialidadesElegidasNuevas.push(especialidad);
    } else {
      this.especialidadesElegidasNuevas.splice(index, 1);
    }
  }
  

  /**
   * 
   * @returns no retorna nada, agrega la especialidad a la lista en firestore
   */
  AgregarEspecialidad():any{
    if(!this.EspecialidadParaAgregar || this.EspecialidadParaAgregar == '' || this.EspecialidadParaAgregar.trim() == '' ) return;
    
    const exists = this.especialidades.some(
      (especialidad) => especialidad.Especialidad === this.EspecialidadParaAgregar.trim()
    );
    if (!exists) {
      this.especialidadesService.AddEspecialidad(this.EspecialidadParaAgregar.trim());
      this.EspecialidadParaAgregar = ''; // Limpia el campo después de agregar
    }
    else{
      console.log('ya existe');
      this.toastr.warning('Atencion!', 'Especialidad ya esta agregada!',
        {timeOut: 2000}
      );
    }
  }

    // this.especialidadesElegidas = [...this.especialidadesElegidasNuevas]
  /**
   * Envia el modal si toca el boton aceptar enviando las especialidades nuevas
   */
  EnviarModalAceptar(){
    this.dialogRef.close(this.especialidadesElegidasNuevas);
  }

  /**
   * Cierra el modal si toca el boton cancelar, sin enviar las nuevas especialidades elegidas
   */
  CerrarModalCancelar(){
    this.dialogRef.close(this.especialidadesElegidas)
  }
}

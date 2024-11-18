import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { StyleButtonDirective } from '../../../../core/directives/style-button.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-finalizar-turno',
  standalone: true,
  imports: [CommonModule,FormsModule,StyleButtonDirective],
  templateUrl: './finalizar-turno.component.html',
  styleUrl: './finalizar-turno.component.css'
})
export class FinalizarTurnoComponent {

  comentario:string = '';
  diagnostico:string = '';

  constructor(private _matDialogRef:MatDialogRef<FinalizarTurnoComponent>,private toastf:ToastrService){}

  EnviarComentario(){
    if(this.diagnostico.trim() == '' || this.diagnostico == ''){
      this.toastf.error('Debe rellenar los campos','Espera!',{timeOut:2000});
    }else{
      this._matDialogRef.close(this.diagnostico)
    }
  }
}

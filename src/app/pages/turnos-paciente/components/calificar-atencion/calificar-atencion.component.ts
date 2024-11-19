import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { StyleButtonDirective } from '../../../../core/directives/style-button.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calificar-atencion',
  standalone: true,
  imports: [FormsModule,CommonModule,StyleButtonDirective],
  templateUrl: './calificar-atencion.component.html',
  styleUrl: './calificar-atencion.component.css'
})
export class CalificarAtencionComponent {

  constructor(private _matDialogRef:MatDialogRef<CalificarAtencionComponent>,private toastf:ToastrService){}

  comentario:string = '';
  valor:number = 0;
  Calcular(valor:number){
    this.valor = valor;
  }
  
  Enviar()
  {
    if(this.comentario.trim() === '' || this.comentario === '' || this.valor == 0){
      this.toastf.warning('Tiene que completar todos los campos','Atencion!',{timeOut:2000})
    }else{
      this._matDialogRef.close({comentario:this.comentario,estrellas:this.valor});
      this.toastf.success('Calificacion enviada','Gracias!',{timeOut:2000})
    }
  }

  Cancelar(){
    this._matDialogRef.close(null);
  }
}

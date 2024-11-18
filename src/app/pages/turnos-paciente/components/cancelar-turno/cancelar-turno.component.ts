import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  MatDialogRef } from '@angular/material/dialog';
import { StyleButtonDirective } from '../../../../core/directives/style-button.directive';

@Component({
  selector: 'app-cancelar-turno',
  standalone: true,
  imports: [CommonModule,FormsModule,StyleButtonDirective],
  templateUrl: './cancelar-turno.component.html',
  styleUrl: './cancelar-turno.component.css'
})
export class CancelarTurnoComponent {

  constructor(private _matDialogRef:MatDialogRef<CancelarTurnoComponent>){
  }

  comentario:string = '';
  accion:string = '';
  EnviarComentario()
  {
    // const comentario = document.getElementById('input-comentario');
    console.log(this.comentario);

    //Guardar Comentario
    this._matDialogRef.close(this.comentario);
  }
}

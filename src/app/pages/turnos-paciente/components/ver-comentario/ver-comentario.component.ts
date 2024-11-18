import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StyleButtonDirective } from '../../../../core/directives/style-button.directive';

@Component({
  selector: 'app-ver-comentario',
  standalone: true,
  imports: [StyleButtonDirective],
  templateUrl: './ver-comentario.component.html',
  styleUrl: './ver-comentario.component.css'
})
export class VerComentarioComponent {

  comentario:string =''
  constructor(private _matDialogRef:MatDialogRef<VerComentarioComponent>,@Inject(MAT_DIALOG_DATA) private data:string){
    if(data){
      this.comentario = data;
    }
  }


  Cerrar(){
    this._matDialogRef.close();
  }
}

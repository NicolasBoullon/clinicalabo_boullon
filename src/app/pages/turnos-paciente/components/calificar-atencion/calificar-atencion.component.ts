import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-calificar-atencion',
  standalone: true,
  imports: [],
  templateUrl: './calificar-atencion.component.html',
  styleUrl: './calificar-atencion.component.css'
})
export class CalificarAtencionComponent {

  constructor(private _matDialogRef:MatDialogRef<CalificarAtencionComponent>){}

  Calcular(valor:number){
    this._matDialogRef.close(valor);
  }
}

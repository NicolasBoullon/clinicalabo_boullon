import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  constructor( @Optional() private matDialogRef:MatDialogRef<SpinnerComponent>,
    @Inject(MAT_DIALOG_DATA)  @Optional() private data:any
  ){
    if(data){
      if(data.opcion == 'cerrarsesion'){
        this.tema = 'cerrarsesion';
      }
    }
  }

  @Input() stroke!:string;
  @Input() background!:string;
  @Input() tema!:string;
}

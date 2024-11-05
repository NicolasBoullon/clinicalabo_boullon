import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  constructor(private matDialogRef:MatDialogRef<SpinnerComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any
  ){
    if(data){
      if(data.opcion == 'cerrarsesion'){
        this.tema = 'cerrarsesion';
      }
    }
  }

  @Input() background!:string;
  @Input() tema:string = '';
}

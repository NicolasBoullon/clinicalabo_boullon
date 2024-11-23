import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { ObjectKeyValuePipe } from '../../core/pipes/object-key-value.pipe';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-historia-clinica',
  standalone: true,
  imports: [ObjectKeyValuePipe],
  templateUrl: './ver-historia-clinica.component.html',
  styleUrl: './ver-historia-clinica.component.css'
})
export class VerHistoriaClinicaComponent implements OnInit{

  paciente:any;

  constructor(private _matDialogRef:MatDialogRef<VerHistoriaClinicaComponent>,@Inject(MAT_DIALOG_DATA) private data:any){
    if(data){
      this.paciente = data;
    }
  }

  ngOnInit(): void {
    // this._matDialogRef.updateSize('1000px', '50%');
  }
}

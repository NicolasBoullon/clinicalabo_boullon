import { Component } from '@angular/core';
import { FormSocioComponent } from "./components/form-socio/form-socio.component";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-registro-socio',
  standalone: true,
  imports: [FormSocioComponent],
  templateUrl: './registro-socio.component.html',
  styleUrl: './registro-socio.component.css'
})
export class RegistroSocioComponent {


  constructor(private router:Router,private _matDialog:MatDialog){}


  abrirModal(){
    const dialogRef = this._matDialog.open(SpinnerComponent,{
      // width: '0px',
      disableClose:true
    })
  }

  cerrarModal(){
    this._matDialog.closeAll();
  }
}

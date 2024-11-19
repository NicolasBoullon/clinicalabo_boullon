import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio'
import { MatDialogRef } from '@angular/material/dialog';
import { StyleButtonDirective } from '../../../../core/directives/style-button.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-realizar-encuesta',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,MatIconModule,MatInputModule,MatFormFieldModule,MatButtonModule,MatRadioModule,StyleButtonDirective],
  templateUrl: './realizar-encuesta.component.html',
  styleUrl: './realizar-encuesta.component.css'
})
export class RealizarEncuestaComponent implements OnInit{

  form!:FormGroup;
  tiempoDeEspera!:number ;

  private toastf = inject(ToastrService)

  constructor(private _matDialogRef:MatDialogRef<RealizarEncuestaComponent>){}

  ngOnInit(): void {
    this.form = new FormGroup({
      atencionRecepcion:new FormControl("",[Validators.required]),
      tiempoEspera: new FormControl("",[Validators.required]),
      facilOrientarse: new FormControl(false),
      comentarioGeneral: new FormControl("",[Validators.required]),
    })
  }
  

  EnviarForm()
  {
    if(this.form.invalid){
      this.toastf.warning('Debe llenar la encuesta completa','Atencion!',{timeOut:2000})
    }else{
      this.toastf.success('Encuesta enviada con exito','Gracias!',{timeOut:2000})
      this._matDialogRef.close(this.form.value);
    }
  }

  Cancelar(){
    this._matDialogRef.close(false);
  }

  get atencionRecepcion(){
    return this.form.get('atencionRecepcion');
  }

  get tiempoEspera(){
    return this.form.get('tiempoEspera');
  }

  get facilOrientarse(){
    return this.form.get('facilOrientarse');
  }

  get comentarioGeneral(){
    return this.form.get('comentarioGeneral');
  }

}

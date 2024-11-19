import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { StyleButtonDirective } from '../../../../core/directives/style-button.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    StyleButtonDirective
  ],
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  
  constructor(private _matDialogRef:MatDialogRef<HistoriaClinicaComponent>,private toastr:ToastrService){}

  form!: FormGroup; 
  keyDinamico1:string = '';
  keyDinamico2:string = '';
  keyDinamico3:string = '';
  valueDinamico1:any = '';
  valueDinamico2:any = '';
  valueDinamico3:any = '';
  ngOnInit(): void {
    this.form = new FormGroup({
      altura: new FormControl('', [
        Validators.min(0),
        Validators.max(300) 
      ]),
      peso: new FormControl('', [
        Validators.min(0),
        Validators.max(400) 
      ]),
      temperatura: new FormControl('', [
        Validators.min(35),
        Validators.max(42) 
      ]),
      presion: new FormControl('', [
        Validators.pattern(/^\d{2,3}\/\d{2,3}$/) 
      ]),
      campoDinamicoUno: new FormControl(''),
      campoDinamicoDos: new FormControl(''),
      campoDinamicoTres: new FormControl(''),
    });
  }


  EnviarForm(): void {
    if (this.form.valid) {
      //aca enviar el form
      this.ConstruirDinamicos();
      // console.log(this.form.value);
      this.toastr.success("Historia enviada con exito!",'Gracias!',{timeOut:2000})
      this._matDialogRef.close(this.form.value);
      
    } else {
      this.toastr.warning("Complete toda la historia clinica!",'Atencion!',{timeOut:2000})
    }
  }

  ConstruirDinamicos(){
    const campoDinamicoUnoValue = { [this.keyDinamico1]: this.valueDinamico1 };
    const campoDinamicoDosValue = { [this.keyDinamico2]: this.valueDinamico2 };
    const campoDinamicoTresValue = { [this.keyDinamico3]: this.valueDinamico3 };
  
    this.form.get('campoDinamicoUno')?.setValue(campoDinamicoUnoValue);
    this.form.get('campoDinamicoDos')?.setValue(campoDinamicoDosValue);
    this.form.get('campoDinamicoTres')?.setValue(campoDinamicoTresValue);
  }



  Cancelar(){
    this._matDialogRef.close(null);
  }

  // Getters para validación en la vista
  get altura() {
    return this.form.get('altura');
  }

  get peso() {
    return this.form.get('peso');
  }

  get temperatura() {
    return this.form.get('temperatura');
  }

  get presion() {
    return this.form.get('presion');
  }
}

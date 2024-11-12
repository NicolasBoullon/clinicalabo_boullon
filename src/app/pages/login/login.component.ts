import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { Router } from '@angular/router';
import { EspecialistasService } from '../../core/services/especialistas.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  form!:FormGroup;
  hide = true;

  constructor(private authService:AuthService
    ,private _matDialog:MatDialog,
    private router:Router,
    private especialistaService:EspecialistasService,
    private toastr:ToastrService){}
    

  ngOnInit(): void {
    this.form = new FormGroup({
      correo: new FormControl("",[Validators.required,Validators.email,Validators.maxLength(50)]),
      clave: new FormControl("",[Validators.required]),
    })
  }

  async EnviarForm()
  {
    if(this.form.valid)
    {
      this.AbrirModal();
      const res = await this.authService.LoginUser(this.form.get('correo')?.value,this.form.get('clave')?.value)

        if(res === true){

          setTimeout(() => {
            this.authService.IniciarUsuario();
            // console.log('esta aprobada');
            this.CerraModal();
            this.router.navigate(['Inicio']);
            // this.LimpiarFormulario();
          }, 2000);
        }else if(res === 'No verificado'){
          console.log('como q no');
          
          setTimeout(() => {
            console.log('No verificado');
            this.CerraModal();
            this.LimpiarFormulario();
            this.toastr.info('Importante','Correo no verificado',{timeOut:2000})
          }, 2000);
        }else if(res === false){            
          setTimeout(() => {
            
            this.CerraModal();
            this.LimpiarFormulario();
          }, 2000);
        }
        else{
          setTimeout(() => {            
            this.CerraModal();
            this.LimpiarFormulario();
          }, 2000);
        }

      // .catch(()=>{
      //   setTimeout(() => {
      //     console.log('No verificado');
          
      //     this.CerraModal();
      //     this.LimpiarFormulario();
      //   }, 2000);
      // })
    }else{
      console.log('error');
      
    }
  }

  AutoCompletar(usuario:string){
    switch(usuario){
      case 'administrador':
        this.correo = 'adminsudoclinica@yopmail.com';
        this.clave = 'admin123';
      break;

      case 'especialista':
        this.correo = 'alvathomased@yopmail.com';
        this.clave = 'hola123';
      break;

      case 'especialistaDos':
        this.correo = 'renefavalorinho@yopmail.com';
        this.clave = 'hola123';
      break;

      case 'paciente':
        this.correo = 'mirtitalegrand@yopmail.com';
        this.clave = 'hola123';
      break;

      case 'pacienteDos':
        this.correo = 'rodridepol@yopmail.com';
        this.clave = 'hola123';
      break;

      case 'pacienteTres':
        this.correo = 'mirtitalegrand@yopmail.com';
        this.clave = 'hola123';
      break;
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }


  get correo():AbstractControl<any, any>|null{
    return this.form.get('correo');
  }
  set correo(value:string){
    this.form.get('correo')?.setValue(value);
  }

  get clave():AbstractControl<any, any>|null{
    return this.form.get('clave');
  }

  set clave(value:string){
    this.form.get('clave')?.setValue(value);
  }
  LimpiarFormulario()
  {
    this.form.reset();
  }


  AbrirModal(){
    this._matDialog.open(SpinnerComponent,{
      disableClose: true
    });
  }

  CerraModal(){
    this._matDialog.closeAll();
  }
}

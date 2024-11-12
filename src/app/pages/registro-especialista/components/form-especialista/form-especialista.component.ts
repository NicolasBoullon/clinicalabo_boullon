import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ElegirEspecialidadesComponent } from '../elegir-especialidades/elegir-especialidades.component';
import { especialidadesElegidasValidator } from '../../../../core/validators/especialidadesElegidas.validator';
import { EspecialistasService } from '../../../../core/services/especialistas.service';
import { Especialista } from '../../../../core/models/Especialista';
import { AuthService } from '../../../../core/services/auth.service';
import { FotosService } from '../../../../core/services/fotos.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { Router } from '@angular/router';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha-18";

@Component({
  selector: 'app-form-especialista',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule,MatInputModule,MatIcon,ReactiveFormsModule,RecaptchaFormsModule,RecaptchaModule],
  templateUrl: './form-especialista.component.html',
  styleUrl: './form-especialista.component.css'
})
export class FormEspecialistaComponent implements OnInit,OnDestroy{

  foto1!:any;
  form!:FormGroup;
  hide = true;
  especialista!:Especialista;
  creadoPorAdmin:boolean = false;
  key = "6LekeSQqAAAAACDo_JYVNZ9ddEnyp-VKnlIedTxm";

  constructor(private _matDialog:MatDialog,private authService:AuthService,private fotosService:FotosService,private router:Router, @Optional() private matDialogRef:MatDialogRef<FormEspecialistaComponent>,
  @Inject(MAT_DIALOG_DATA)  @Optional() private data:any){
    if(data){ 
      this.creadoPorAdmin = data.creadoUser;
      console.log(this.creadoPorAdmin);
      
    }
  }


  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("",[Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.maxLength(50)]),
      apellido: new FormControl("",[Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.maxLength(50)]),
      edad: new FormControl("",[Validators.required,Validators.min(21),Validators.max(80)]),
      dni: new FormControl("",[Validators.min(10000000),Validators.max(99999999),Validators.required]),
      especialidad: new FormControl([],[Validators.required,especialidadesElegidasValidator]),
      correo: new FormControl("",[Validators.required,Validators.email,Validators.maxLength(50)]),
      clave: new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(30)]),
      file1: new FormControl("",[Validators.required]), //Validators de JPG
    })
  }

  async EnviarForm(){
    if(this.form.invalid){
      console.log(this.form.value);
    }else{
      this.abrirSpinner()
      const formValues = this.form.value;
      console.log(formValues);
      
      this.especialista = this.GetEspecialistaFormulario();
      let urlImagen = await this.fotosService.UploadFoto(this.foto1,`${formValues.correo}-A`,"especialistas");
      this.especialista.imagen = urlImagen;
      if(this.creadoPorAdmin){
        this.especialista.aprobada = true;
      }


      const resp = await this.authService.AltaUsuarioAuthentication(formValues.correo,formValues.clave,this.especialista,'especialista');
      console.log(this.creadoPorAdmin);
      
       setTimeout(() => {
          this.cerrarSpinner();
          this.LimpiarFormulario(); 
          if (!this.creadoPorAdmin) {
            this.authService.LogoutUser(false);
            this.router.navigate(['login']);
          }
       }, 2000); 
      
    }
  }

  token:boolean = false;
  executeRecaptchaVisible(token:any){
    this.token = !this.token;
  }


  LimpiarFormulario(){
    this.nombre = '';
    this.apellido = '';
    this.edad = '';
    this.dni = '';
    this.correo = '';
    this.clave = '';
    this.especialidad = '';
    this.file1 = '';
    }

  abrirModalEspecialidades(){
    const dialogRef = this._matDialog.open(ElegirEspecialidadesComponent,{
      width: '1200px',
      disableClose: true,
      data: {especialidadesPreelegidas: this.especialidad}
    })

    dialogRef.afterClosed()
    .subscribe({
      next:(especialidadesElegidasPorEspecialista)=>{
        if(especialidadesElegidasPorEspecialista) {
          this.especialidad = especialidadesElegidasPorEspecialista;
        }
      }
    })


  }
  GetEspecialistaFormulario():Especialista{
    const formValues = this.form.value;
    let especialista:any;
    return  especialista = {
      rol: "Especialista",
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      edad: formValues.edad,
      dni: formValues.dni,
      especialidades: formValues.especialidad,
      correo: formValues.correo,
      imagen: '',
      aprobada: false,
      lunes:{
        dias:{especialidad:'Seleccione',hora:'30'},
        horarios:{desde:'----',hasta:'----'}
      },
      martes:{        
        dias:{especialidad:'Seleccione',hora:'30'},
        horarios:{desde:'----',hasta:'----'}

      },
      miercoles:{
        dias:{especialidad:'Seleccione',hora:'30'},
        horarios:{desde:'----',hasta:'----'}

      },
      jueves:{
        dias:{especialidad:'Seleccione',hora:'30'},
        horarios:{desde:'----',hasta:'----'}

      },
      viernes:{
        dias:{especialidad:'Seleccione',hora:'30'},
        horarios:{desde:'----',hasta:'----'}

      },
      sabado:{  
        dias:{especialidad:'Seleccione',hora:'30'},
        horarios:{desde:'----',hasta:'----'}

      },
    }
  }

  uploadFile1($event:any){
    this.foto1 = $event.target.files[0];  
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  get nombre():any{
    return this.form.get('nombre');
  }
  
  set nombre(value:string){
    this.form.get('nombre')?.setValue(value);
  }

  get apellido():any{
    return this.form.get('apellido'); 
  }

  set apellido(value:string) {
    this.form.get('apellido')?.setValue(value); 
  }

  get edad():any{
    return this.form.get('edad');
  }

  set edad(value:string){
    this.form.get('edad')?.setValue(value);
  }

  get dni():any {
    return this.form.get('dni');
  }

  set dni(value:string) {
    this.form.get('dni')?.setValue(value);
  }

  get especialidad() {
    return this.form.get('especialidad');
  }

  set especialidad(valor:any){
    if(valor){
      this.form.get('especialidad')?.setValue(valor);
    }
  }

  get correo():any{
    return this.form.get('correo');
  }

  set correo(value:string) {
    this.form.get('correo')?.setValue(value);
  }

  get clave():any{
    return this.form.get('clave');
  }

  set clave(value:string) {
    this.form.get('clave')?.setValue(value);
  }

  get file1():any{
    return  this.form.get('file1');
  }

  set file1(value:string) {
    this.form.get('file1')?.setValue(value);
  }

  abrirSpinner(){
    const dialogRef = this._matDialog.open(SpinnerComponent,{
      disableClose:true
    })
  }

  cerrarSpinner(){
    this._matDialog.closeAll();
  }

  ngOnDestroy(): void {
  }
}

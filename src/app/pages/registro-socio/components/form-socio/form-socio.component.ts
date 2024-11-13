import { Component, Inject, OnInit, Optional } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Paciente } from '../../../../core/models/Paciente';
import { FotosService } from '../../../../core/services/fotos.service';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha-18";
@Component({
  selector: 'app-form-socio',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule,RecaptchaFormsModule,RecaptchaModule],
  templateUrl: './form-socio.component.html',
  styleUrl: './form-socio.component.css'
})
export class FormSocioComponent implements OnInit{
  form!:FormGroup;
  hide = true;
  foto1!:any;
  foto2!:any;
  Paciente!:Paciente;
  creadoPorAdmin:boolean = false;
  key = "6LekeSQqAAAAACDo_JYVNZ9ddEnyp-VKnlIedTxm";
  constructor(private router:Router,private _matDialog:MatDialog,private authService:AuthService,private fotosService:FotosService, @Optional() private matDialogRef:MatDialogRef<FormSocioComponent>,
    @Inject(MAT_DIALOG_DATA)  @Optional() private data:any
  ){
    if(data){ 
      this.creadoPorAdmin = data.creadoUser;
      console.log(this.creadoPorAdmin);
      
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("",[Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.maxLength(50)]),
      apellido: new FormControl("",[Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.maxLength(50)]),
      edad: new FormControl("",[Validators.required,Validators.min(0),Validators.max(100)]),
      dni: new FormControl("",[Validators.required,Validators.pattern('^[0-9]+$'),Validators.min(10000000),Validators.max(99999999)]),
      obraSocial: new FormControl("",[Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.maxLength(30)]),
      correo: new FormControl("",[Validators.required,Validators.email,Validators.maxLength(50)]),
      clave: new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(30)]),
      file1: new FormControl("",[Validators.required]), //Validators de JPG?
      file2: new FormControl("",[Validators.required])
    })
  }

  /**
   * Envia las imagenes a storage, ademas de crear el usuario en auth y firestore
   */
   async EnviarForm(){
    if(this.form.invalid || !this.token){

    }else{
      const formValues = this.form.value;
      //Obtengo el formulario de tipo paciente.
      this.Paciente = this.GetPacienteFormulario();
      console.log(this.Paciente);
      
      this.abrirSpinner();

      let url1 = await this.fotosService.UploadFoto(this.foto1,`${formValues.correo}-A`,"pacientes");
      
      let url2 = await this.fotosService.UploadFoto(this.foto2,`${formValues.correo}-B`,"pacientes");
      this.Paciente.imagenUno = url1;
      this.Paciente.imagenDos = url2;

      //Envio al servicio toda la informacion para po der hacer el registro.
      const resp = await this.authService.AltaUsuarioAuthentication(formValues.correo,formValues.clave,this.Paciente,'paciente',this.creadoPorAdmin);


      setTimeout(() => {
        this.cerrarSpinner();
        this.LimpiarFormulario();
        if (!this.creadoPorAdmin) {
          this.authService.LogoutUser(false);
          this.router.navigate(['login']);
        }
     }, 1500); 
    }
  }
  token:boolean = false;
  executeRecaptchaVisible(token:any){
    this.token = !this.token;
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  /**
   * 
   * @returns devuelve valores del formulario creado de tipo Paciente
   */
  GetPacienteFormulario():Paciente{
    const formValues = this.form.value;
    let paciente:any;
    return  paciente = {
      rol: "Paciente",
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      edad: formValues.edad,
      dni: formValues.dni,
      obraSocial: formValues.obraSocial,
      imagenUno:formValues.file1,
      imagenDos:formValues.file2,
      correo: formValues.correo,
    }
  }

  uploadFile1($event:any){
    this.foto1 = $event.target.files[0];  
  }

  uploadFile2($event:any){
    this.foto2 = $event.target.files[0];  
  }

  LimpiarFormulario(){
    this.form.reset();
  }

  get nombre() {
    return this.form.get('nombre');
  }
  
  get apellido() {
    return this.form.get('apellido');
  }

  get edad() {
    return this.form.get('edad');
  }

  get dni() {
    return this.form.get('dni');
  }
  get obraSocial() {
    return this.form.get('obraSocial');
  }

  get correo() {
    return this.form.get('correo');
  }

  get clave() {
   return this.form.get('clave');
  }

  get file1() {
    return  this.form.get('file1');
  }

  get file2() {
    return this.form.get('file2');
  }

  reset(){
    this.form.reset();
  }

  abrirSpinner(){
    const dialogRef = this._matDialog.open(SpinnerComponent,{
      disableClose:true
    })
  }

  cerrarSpinner(){
    this._matDialog.closeAll();
  }
}

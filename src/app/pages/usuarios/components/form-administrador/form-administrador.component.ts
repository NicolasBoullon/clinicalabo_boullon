import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { FotosService } from '../../../../core/services/fotos.service';
import { Router } from '@angular/router';
import { Administrador } from '../../../../core/models/Administrador';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-form-administrador',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule,MatInputModule,MatIcon,ReactiveFormsModule],
  templateUrl: './form-administrador.component.html',
  styleUrl: './form-administrador.component.css'
})
export class FormAdministradorComponent {

  foto1!:any;
  form!:FormGroup;
  hide = true;
  administrador!:Administrador;
  creadoPorUser:boolean = false;
  constructor(private _matDialog:MatDialog,private authService:AuthService,private fotosService:FotosService,private router:Router){}


  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("",[Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.maxLength(50)]),
      apellido: new FormControl("",[Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.maxLength(50)]),
      edad: new FormControl("",[Validators.required,Validators.min(21),Validators.max(80)]),
      dni: new FormControl("",[Validators.min(100000),Validators.max(99999999),Validators.required]),
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
      
      this.administrador = this.GetAdministradorFormulario();
      let urlImagen = await this.fotosService.UploadFoto(this.foto1,`${formValues.dni}-A`,"administradores");
      this.administrador.imagen = urlImagen;
      const resp = await this.authService.AltaUsuarioAuthentication(formValues.correo,formValues.clave,this.administrador,'administrador');

       setTimeout(() => {
          this.cerrarSpinner();
          this.LimpiarFormulario(); 
          // !this.creadoPorUser ? this.router.navigate(['Inicio']) : '';
       }, 2000); 
      
    }
  }

  LimpiarFormulario(){
    this.nombre = '';
    this.apellido = '';
    this.edad = '';
    this.dni = '';
    this.correo = '';
    this.clave = '';
    this.file1 = '';
    }

  
  GetAdministradorFormulario():Administrador{
    const formValues = this.form.value;
    let especialista:any;
    return  especialista = {
      rol: "Administrador",
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      edad: formValues.edad,
      dni: formValues.dni,
      correo: formValues.correo,
      imagen: '',
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

import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollpageService } from '../../core/services/scrollpage.service';
import { AuthService } from '../../core/services/auth.service';
import { SpinnerComponent } from "../spinner/spinner.component";
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Administrador } from '../../core/models/Administrador';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [SpinnerComponent,MatButtonModule,MatMenuModule,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  constructor(private router:Router,private scroll:ScrollpageService,private authService:AuthService,private _matDialog:MatDialog){}
  mostrarNavBar:boolean = true;
  perfil!:any;
  showButton:boolean = true;
  ngOnInit(): void {
    this.abrirSpinner();
    setTimeout(async () => {
      // await this.CheckPerfil();
      this.perfil = await this.authService.GetUserPerfil();
      console.log(this.perfil);
      
    this.cerrarSpinner();
    }, 2500);
  }

  GoTo(path:string){
    this.scroll.updateData('null');
    this.router.navigate([path]);
  }
  
  GoToSection(path:string){
    this.router.navigate(['/']).then(() => {
      this.scroll.updateData(path);
    });
  }

  CrearAdmin(){  
    let administrador:Administrador = {
      nombre:'Sudo',
      apellido:'Admin',
      correo: 'adminutnclinica@yopmail.com',
      dni:202020220,
      edad: 45,
      imagen: '',
      rol: 'Administrador'
    };
    this.authService.AltaUsuarioAuthentication("adminutnclinica@yopmail.com",'admin123',administrador,'administrador');
  }

  UsuarioLogeado(){
    return this.authService.GetUserEmail();
  }

  async CheckPerfil(){
    setTimeout(async () => {
      let resp = await this.authService.GetUserPerfil();
        this.perfil = resp;
        console.log(resp);
        this.mostrarNavBar = false
        this.cerrarSpinner();
    }, 2000);
  }

  CerrarSesion(){
    this.perfil = '';
    this.authService.LogoutUser(true);
  }

  CheckUserLog(){
    this.perfil = this.authService.usuarioConectado?.rol;
    return this.authService.GetUserEmail();
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
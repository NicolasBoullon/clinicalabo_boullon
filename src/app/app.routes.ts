import { Routes } from '@angular/router';
import { registroGuard } from './core/guards/registro.guard';

export const routes: Routes = [
    {path:'',redirectTo:'Inicio',pathMatch:'full'},
    {path:'Inicio',loadComponent:()=> import('./pages/inicio/inicio.component').then((c)=> c.InicioComponent)},
    {path:'registro',loadComponent:()=> import('./pages/registro/registro.component').then((c)=> c.RegistroComponent),canActivate: [registroGuard]},
    {path:'login',loadComponent:()=> import('./pages/login/login.component').then((c)=> c.LoginComponent)},
    {path:'registro-socio',loadComponent:()=> import('./pages/registro-socio/registro-socio.component').then((c)=> c.RegistroSocioComponent)},
    {path:'registro-especialista',loadComponent:()=> import('./pages/registro-especialista/registro-especialista.component').then((c)=> c.RegistroEspecialistaComponent)},
    {path:'perfil',loadComponent:()=> import('./pages/perfil/perfil.component').then((c)=> c.PerfilComponent)},
    {path:'usuarios',loadComponent:()=> import('./pages/usuarios/usuarios.component').then((c)=> c.UsuariosComponent)},
    // {path:'login',loadComponent:()=> import('./pages/login/login.component').then((c)=> c.LoginComponent)},
    {path:'**',redirectTo:'Inicio',pathMatch:'full'},
];


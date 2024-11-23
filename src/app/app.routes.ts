import { Routes } from '@angular/router';
import { registroGuard } from './core/guards/registro.guard';
import { estaLogGuard } from './core/guards/esta-log.guard';

export const routes: Routes = [
    {path:'',redirectTo:'Inicio',pathMatch:'full'},
    {path:'Inicio',loadComponent:()=> import('./pages/inicio/inicio.component').then((c)=> c.InicioComponent)},
    {path:'registro',loadComponent:()=> import('./pages/registro/registro.component').then((c)=> c.RegistroComponent),canActivate: [registroGuard]},
    {path:'login',loadComponent:()=> import('./pages/login/login.component').then((c)=> c.LoginComponent)},
    {path:'registro-socio',loadComponent:()=> import('./pages/registro-socio/registro-socio.component').then((c)=> c.RegistroSocioComponent)},
    {path:'registro-especialista',loadComponent:()=> import('./pages/registro-especialista/registro-especialista.component').then((c)=> c.RegistroEspecialistaComponent)},
    {path:'usuarios',loadComponent:()=> import('./pages/usuarios/usuarios.component').then((c)=> c.UsuariosComponent),canActivate: [estaLogGuard]},
    {path:'mi-perfil',loadComponent:()=> import('./pages/mi-perfil/mi-perfil.component').then((c)=> c.MiPerfilComponent),canActivate: [estaLogGuard]},
    {path:'turnos-paciente',loadComponent:()=> import('./pages/turnos-paciente/turnos-paciente.component').then((c)=> c.TurnosPacienteComponent),canActivate: [estaLogGuard]},
    {path:'turnos-especialista',loadComponent:()=> import('./pages/turnos-especialista/turnos-especialista.component').then((c)=> c.TurnosEspecialistaComponent),canActivate: [estaLogGuard]},
    {path:'solicitar-turno',loadComponent:()=> import('./pages/solicitar-turno/solicitar-turno.component').then((c)=> c.SolicitarTurnoComponent),canActivate: [estaLogGuard]},
    {path:'turnos',loadComponent:()=> import('./pages/turnos/turnos.component').then((c)=> c.TurnosComponent),canActivate: [estaLogGuard]},
    {path:'pacientes',loadComponent:()=> import('./pages/pacientes/pacientes.component').then((c)=> c.PacientesComponent),canActivate: [estaLogGuard]},
    // {path:'login',loadComponent:()=> import('./pages/login/login.component').then((c)=> c.LoginComponent)},
    {path:'**',redirectTo:'Inicio',pathMatch:'full'},
];


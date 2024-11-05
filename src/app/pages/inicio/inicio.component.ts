import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarruselComponent } from "./components/carrusel/carrusel.component";
import { ScrollpageService } from '../../core/services/scrollpage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule, CarruselComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit,OnDestroy{
  email = 'miclinicaimperio@contacto.com'
  sub!:Subscription;
  constructor(private scrollService:ScrollpageService,private router:Router,private authService:AuthService){}
  ngOnInit(): void {
    this.sub = this.scrollService.data$.subscribe({
      next:((data)=>{
        this.scrollToSection(data);
      }),
      error:((e)=>{

      })
    }); 
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  GoTo(path:string){
    this.router.navigate([path]);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  UsuarioLogeado(){
    return this.authService.GetUserEmail();
  }
}

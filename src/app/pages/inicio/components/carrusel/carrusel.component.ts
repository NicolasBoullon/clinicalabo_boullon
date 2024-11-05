import { Component } from '@angular/core';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {
  imagenes = [
    {
      src : '../../../assets/galeria/galeria1.jpg'
    },
    {
      src: '../../../assets/galeria/galeria2.jpg'
    },
    {
      src: '../../../assets/galeria/galeria3.jpg'
    },
    {
      src: '../../../assets/galeria/galeria4.avif'
    },
    {
      src: '../../../assets/galeria/galeria5.avif'
    },
    {
      src: '../../../assets/galeria/galeria6.jpg'
    },
    {
      src: '../../../assets/galeria/hospitalsede1.jpg'
    },
    {
      src: '../../../assets/galeria/hospitalsede2.jpg'
    },
    {
      src: '../../../assets/galeria/hospitalsede3.jpg'
    }
  ]

  nextProductRight(){
    const cards = document.getElementById('cards');
    cards?.scrollTo({
      left: cards.scrollLeft + 1260,
      behavior: 'smooth'
    }) 
  }
  nextProductLeft(){
    const cards = document.getElementById('cards');
    cards?.scrollTo({
      left: cards.scrollLeft - 1260,
      behavior: 'smooth'
    }) 
  }
}

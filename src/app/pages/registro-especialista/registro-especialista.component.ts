import { Component } from '@angular/core';
import { FormEspecialistaComponent } from "./components/form-especialista/form-especialista.component";

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [FormEspecialistaComponent],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent {

}

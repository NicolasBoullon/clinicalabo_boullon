import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-realizar-encuesta',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './realizar-encuesta.component.html',
  styleUrl: './realizar-encuesta.component.css'
})
export class RealizarEncuestaComponent implements OnInit{

  form!:FormGroup;

  ngOnInit(): void {
    
  }
}

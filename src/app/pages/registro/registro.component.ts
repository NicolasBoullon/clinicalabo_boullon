import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit{

  constructor(private router:Router){}

  ngOnInit(): void {

  }


  GoTo(path:string){
    this.router.navigate([path]);
  }
}

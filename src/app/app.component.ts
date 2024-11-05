import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'clinicalabo';

  /**
   *
   */
  constructor(private authService:AuthService) {
    
  }

  ngOnInit(): void {
    setTimeout(async () => {
      await this.authService.IniciarUsuario();
    }, 1000);
  }

}

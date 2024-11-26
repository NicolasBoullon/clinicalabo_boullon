import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { AuthService } from './core/services/auth.service';
import { slideInAnimation } from './shared/animations/up-down';
import { bounceInAnimation } from './shared/animations/bounce';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations:[slideInAnimation,bounceInAnimation]
})
export class AppComponent implements OnInit{
  title = 'clinicalabo';


  constructor(private authService:AuthService,private _matDialog:MatDialog,private contexts: ChildrenOutletContexts) { }

  getRouteAnimationData() {
 
      const animationData = this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
      // console.log('Animation Data:', animationData);
      return animationData;
  }

  ngOnInit(): void {
    this.abrirSpinner();
    setTimeout(async () => {
      await this.authService.IniciarUsuario();
      this.cerrarSpinner();
    }, 1000);
  }

  abrirSpinner(){
    this._matDialog.open(SpinnerComponent);
  }
  cerrarSpinner(){
    this._matDialog.closeAll();
  }

}

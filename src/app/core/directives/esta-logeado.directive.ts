import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Directive({
  selector: '[appEstaLogeado]',
  standalone: true
})
export class EstaLogeadoDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authS: AuthService
  ) {
    this.checkUserStatus();
  }

  private async checkUserStatus() {
    const userRole = await this.authS.GetUserEmail();

    // Si el usuario está logueado y la vista no se ha mostrado, se crea la vista.
    if (userRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } 
    // Si el usuario no está logueado y la vista ya está creada, se elimina.
    else if (!userRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

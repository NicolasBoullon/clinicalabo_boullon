import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appShowButton]',
  standalone: true
})
export class ShowButtonDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authS:AuthService
  ) {}
  @Input() set appShowButton(condition: string) {
    const userRole = this.authS.usuarioConectado?.rol;

    // Si el usuario tiene el rol especificado y la vista no se ha mostrado, se crea la vista.
    if (userRole === condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
    // Si el usuario no tiene el rol y la vista ya está creada, se elimina.
    else if (userRole !== condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

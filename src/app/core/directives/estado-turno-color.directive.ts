import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[EstadoTurnoColor]',
  standalone: true
})
export class EstadoTurnoColorDirective {

  constructor(private el:ElementRef) { }
  
  @Input() set EstadoTurnoColor(estado: 'pendiente'|'rechazado'|'aceptado'|'cancelado'|'finalizado'){
    
    switch(estado){
      case 'pendiente':
        this.el.nativeElement.style.backgroundColor = '#17b3f2'
      break;
      case 'rechazado':
        this.el.nativeElement.style.backgroundColor = '#dd6405'
      break;
      case 'cancelado':
        this.el.nativeElement.style.backgroundColor = '#e53333'
      break;
      case 'aceptado':
        this.el.nativeElement.style.backgroundColor = '#f6f633'
      break;
      case 'finalizado':
        this.el.nativeElement.style.backgroundColor = '#6afb4d'
      break;
    }
  }
}

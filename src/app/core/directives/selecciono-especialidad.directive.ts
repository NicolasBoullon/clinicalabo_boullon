import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSeleccionoEspecialidad]',
  standalone: true
})
export class SeleccionoEspecialidadDirective implements OnChanges{

  @Input() especialidadSeleccionada: any; // Especialidad seleccionada actual
  @Input() especialidad: any; // Especialidad de este elemento (la que se muestra en el td)
  
  private originalColor: string = '';
  private originalColorLetter: string = '';

  constructor(private el: ElementRef) {
    this.originalColor = this.el.nativeElement.style.backgroundColor; 
    this.originalColorLetter = this.el.nativeElement.style.color; 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['especialidadSeleccionada']) {
      this.updateHighlight();
    }
  }

  private updateHighlight() {
    if (this.especialidadSeleccionada === this.especialidad) {
      this.el.nativeElement.style.backgroundColor = '#D4AF37';
      this.el.nativeElement.style.color = 'black';

    } else {
      this.el.nativeElement.style.backgroundColor = this.originalColor;
      this.el.nativeElement.style.color = this.originalColorLetter;
    }
  }

}

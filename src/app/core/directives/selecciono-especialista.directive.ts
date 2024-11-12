import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSeleccionoEspecialista]',
  standalone: true
})
export class SeleccionoEspecialistaDirective implements OnChanges{
  @Input() especialistaSeleccionado: any; // Especialidad seleccionada actual
  @Input() especialista: any; // Especialidad de este elemento (la que se muestra en el td)
  
  private originalColor: string = '';
  private originalColorLetter: string = '';

  constructor(private el: ElementRef) {
    this.originalColor = this.el.nativeElement.style.backgroundColor; 
    this.originalColorLetter = this.el.nativeElement.style.color; 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['especialistaSeleccionado']) {
      this.updateHighlight();
    }
  }

  private updateHighlight() {
    if (this.especialistaSeleccionado === this.especialista) {
      this.el.nativeElement.style.backgroundColor = '#D4AF37';
      this.el.nativeElement.style.color = 'black';

    } else {
      this.el.nativeElement.style.backgroundColor = this.originalColor;
      this.el.nativeElement.style.color = this.originalColorLetter;
    }
  }
}

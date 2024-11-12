import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[estaAprobado]',
  standalone: true
})
export class EstaAprobadoDirective implements OnChanges{

  constructor(private el:ElementRef,private renderer:Renderer2) { }

  @Input() estaAprobado:boolean = false;
  

  ngOnChanges(changes: SimpleChanges): void {
    console.log('cambio');
    
    if(changes['estaAprobado']){
      if(this.estaAprobado){
        this.el.nativeElement.style.backgroundColor = '#556B2F';
        this.el.nativeElement.style.color = 'white';

        this.renderer.setStyle(this.el.nativeElement, 'transform','translateX(200%)');
        this.renderer.setStyle(this.el.nativeElement, 'transition','transform 1s');
      }else{
        this.el.nativeElement.style.backgroundColor = '#8B0000';
        this.el.nativeElement.style.color = 'white';

        this.renderer.setStyle(this.el.nativeElement, 'transform','translateX(0)');
        this.renderer.setStyle(this.el.nativeElement, 'transition','transform 1s');
      }
    }
  }
}

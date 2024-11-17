import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[StyleButtonCommon]',
  standalone: true
})
export class StyleButtonDirective {

  constructor(private el:ElementRef) {
    this.el.nativeElement.style.borderRadius = '4px';
    this.el.nativeElement.style.border = '1px solid var(--color-dorado)';
    this.el.nativeElement.style.color = 'var(--color-dorado)';
    this.el.nativeElement.style.height = 'fit-content';
    this.el.nativeElement.style.width = 'fit-content';
    this.el.nativeElement.style.margin = '0px 5px';
    this.el.nativeElement.style.backgroundColor = 'var(--color-rojo-medio)';
    this.el.nativeElement.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
  }


  

}

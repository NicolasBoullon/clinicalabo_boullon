import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aprobado',
  standalone: true
})
export class AprobadoPipe implements PipeTransform {

  transform(value: boolean): string {
    if(value){
      return 'Aprobado';
    }else{
      return 'No Aprobado';
    }
  }

}

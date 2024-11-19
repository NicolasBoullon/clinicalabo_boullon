import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeyValue',
  standalone: true
})
export class ObjectKeyValuePipe implements PipeTransform {

  transform(objetoKeyValue: Object): string {

    if(objetoKeyValue == ''){
      return 'No tiene un dato extra'
    }
    const objetoEnString = `${Object.keys(objetoKeyValue)} : ${Object.values(objetoKeyValue)}`;
    return objetoEnString;
  }

}

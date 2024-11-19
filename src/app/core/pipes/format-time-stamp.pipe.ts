import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimeStamp',
  standalone: true
})
export class FormatTimeStampPipe implements PipeTransform {

  transform(timestamp: { seconds: number, nanoseconds: number }, formato:'dd MMMM yyyy' | 'dd MM yyyy' | 'dd MM' | 'dd MM yy '): string{
 
      const date = new Date(timestamp.seconds * 1000); 
      return formatDate(date, formato, 'es-AR');
  }

}

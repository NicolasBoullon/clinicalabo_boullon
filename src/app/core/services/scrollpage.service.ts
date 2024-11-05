import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollpageService {
  private dataSubject = new BehaviorSubject<string>('');
  data$ = this.dataSubject.asObservable();

  updateData(newValue: string) {
    this.dataSubject.next(newValue);
  }
  constructor() { }
}

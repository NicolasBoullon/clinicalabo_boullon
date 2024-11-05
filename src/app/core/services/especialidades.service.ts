import { Injectable } from '@angular/core';
import { Firestore,addDoc,collection,collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(private firestore:Firestore) { }

  GetEspecialidades(): Observable<any[]> {
    let col = collection(this.firestore, 'Especialidades');
    return collectionData(col);
  }

  AddEspecialidad(especialidad:string) {
    let col = collection(this.firestore, 'Especialidades');
    addDoc(col,{"Especialidad":especialidad});
  }

  
}

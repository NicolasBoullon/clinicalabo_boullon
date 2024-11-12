import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Turno } from '../models/Turnos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore:Firestore) { }

  /**
   * 
   * @param paciente 
   * @param especialista 
   * @param especialidad 
   * @param dia 
   * @param horario 
   * @param estado 
   */
  AgendarTurno(paciente:any,especialista:any,especialidad:any,dia:any,horario:string,estado:string){
    let col = collection(this.firestore,'turnos');
    let nuevoTurno: Turno = {
      paciente,
      especialista,
      especialidad,
      dia,
      horario: horario, // Asegúrate de convertir el horario a número si es necesario
      estado: estado,    // Convierte el estado a número si corresponde
      id: ''                       // Deja el id vacío temporalmente
    };
  
    // Agregar el turno a Firestore
    addDoc(col, nuevoTurno).then((docRef) => {
      // Asigna el ID generado al objeto turno
      nuevoTurno.id = docRef.id;
  
      // Actualizar el documento en Firestore con el ID generado
      return updateDoc(doc(this.firestore, 'turnos', docRef.id), { id: nuevoTurno.id });
    }).then(() => {
      console.log("Turno agendado y actualizado con ID:", nuevoTurno.id);
    }).catch((error) => {
      console.error("Error al agendar turno:", error);
    });
  }


   GetTurnos(): Observable<any[]> {
    const colRef = collection(this.firestore,'turnos');
    return collectionData(colRef) as Observable<any[]>;
  }

}
import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  constructor(private firestore:Firestore) { }


  /**
   * 
   * @param uid uid de auth para poder agregarlo como identificador en firestore
   * @param paciente objeto paciente con los datos para cargar en firestore  
   */
  async AddUserCompletoPaciente(uid: string, paciente: any) :Promise<any>{
    const docRef = doc(this.firestore, `pacientes/${uid}`);
    console.log(uid);
    console.log(paciente);
    
    console.log('agregando?');
    
    setDoc(docRef, {
        fecha: new Date(),
        uid:uid,
        paciente: paciente
    })
    .then(() => {
        console.log("Usuario agregado con UID:", uid);
    })
    .catch((error) => {
        console.error("Error al agregar el usuario:", error);
    });
  }

  GetTodosPacientes(){
    const col = collection(this.firestore, 'pacientes');
    return collectionData(col);
  }
}

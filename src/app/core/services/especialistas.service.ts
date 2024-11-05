import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialistasService {

  constructor(private firestore:Firestore) { }


  /**
   * 
   * @param uid uid de auth para poder agregarlo como identificador en firestore
   * @param especialista objeto especialista con los datos para cargar en firestore
   * @returns 
   */
  async AddUserCompletoEspecialista(uid: string, especialista: any):Promise<boolean> {
    const docRef = doc(this.firestore, `especialistas/${uid}`);
    
    setDoc(docRef, {
        fecha: new Date(),
        uid:uid,
        especialista: especialista
    })
    .then(() => {
        console.log("Especialista agregado con UID:", uid);
        return true;
    })
    .catch((error) => {
        console.error("Error al agregar el usuario:", error);
        return false;
    });
    return false;
  }


  /**
   * chequea si esta aprobada la acc, y si existe o no.
   * @param uid uid cuando se logea
   * @returns devuelve true|false si la tiene o no aprobado, si no encuentra el doc, retorna null
   */
  async CuentaAprobada(uid:string){
    const docRef = doc(this.firestore,'especialistas',uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      console.log(docSnap.data()['especialista'].aprobada);
      console.log(docSnap.data()['especialista']);
      
      return docSnap.data()['especialista'].aprobada;
    }else{
      return null;
    }
  }

  GetTodosEspecialistas(){
    const col = collection(this.firestore, 'especialistas');
    return collectionData(col);
  }

  async ActivarEspecialista(especialista:any,activado:boolean){
    console.log('a');
    if(especialista){
      const refEspecialista = doc(this.firestore,`especialistas/${especialista.uid}`);
      especialista.especialista.aprobada = activado;
      console.log(especialista);
      console.log(especialista.especialista);
      console.log(especialista.especialista.aprobada);
      
      await updateDoc(refEspecialista,especialista)
    }
  }
}

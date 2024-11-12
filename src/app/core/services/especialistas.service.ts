import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialistasService {

  constructor(private firestore:Firestore,private toastr:ToastrService,private firestoreService:FirestoreService) { }


  /**
   * 
   * @param uid uid de auth para poder agregarlo como identificador en firestore
   * @param especialista objeto especialista con los datos para cargar en firestore
   * @returns 
   */
  async AddUserCompletoEspecialista(uid: string, especialista: any):Promise<boolean> {
    console.log(uid);
    console.log(especialista);
    
    
    const docRef = doc(this.firestore, `especialistas/${uid}`);
    
    setDoc(docRef, {
        fecha: new Date(),
        uid:uid,
        usuario: especialista
    })
    .then(() => {
        console.log("Especialista agregado con UID:", uid);
        this.toastr.info('Aviso!','Se ha enviado un correo de verificacion',{timeOut:3000})
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

      console.log(docSnap.data()['usuario'].aprobada);
      console.log(docSnap.data()['usuario']);
      
      return docSnap.data()['usuario'].aprobada;
    }else{
      return null;
    }
  }

  GetTodosEspecialistas(): Observable<any[]> {
    const col = collection(this.firestore, 'especialistas');
    return collectionData(col);
  }

  GetEspecialista(uid:string){
    const docRef = doc(this.firestore, `especialistas/${uid}`);
    return docData(docRef);
  }

  async ActivarEspecialista(especialista:any,activado:boolean){
    console.log('a');
    if(especialista){
      const refEspecialista = doc(this.firestore,`especialistas/${especialista.uid}`);
      especialista.usuario.aprobada = activado;
      console.log(especialista);
      console.log(especialista.usuario);
      console.log(especialista.usuario.aprobada);
      
      await updateDoc(refEspecialista,especialista)
    }
  }

  CambiarHorarios(especialistaCopmleto:any,horario:string,especialidad:string){
    
  }
}

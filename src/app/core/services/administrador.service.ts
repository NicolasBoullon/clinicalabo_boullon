import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  constructor(private firestore:Firestore,private toastr:ToastrService) { }


  async AddUserCompletoAdministrador(uid: string, administrador: any):Promise<boolean> {
    const docRef = doc(this.firestore, `administradores/${uid}`);
    
    setDoc(docRef, {
        fecha: new Date(),
        uid:uid,
        usuario: administrador
    })
    .then(() => {
        console.log("Administrador agregado con UID:", uid);
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
   * 
   * @param uid uid del auth
   * @returns return true|false si existe o no el admin
   */
  async EsAdmin(uid:string){
    const docRef = doc(this.firestore,'administradores',uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      return true;
    }else{
      return false;
    }
  }

  GetTodosAdministradores(){
    const col = collection(this.firestore, 'administradores');
    return collectionData(col);
  }
}

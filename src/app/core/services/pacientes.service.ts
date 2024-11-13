import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  constructor(private firestore:Firestore,private toastr:ToastrService) { }


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
        usuario: paciente
    })
    .then(() => {
        console.log("Usuario agregado con UID:", uid);
        this.toastr.info('Aviso!','Se ha enviado un correo de verificacion',{timeOut:3000})

    })
    .catch((error) => {
        console.error("Error al agregar el usuario:", error);
    });
  }

  GetTodosPacientes(): Observable<any[]> {
    const col = collection(this.firestore, 'pacientes');
    return collectionData(col);
  }
}

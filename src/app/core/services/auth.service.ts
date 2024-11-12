import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut ,sendEmailVerification} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PacientesService } from './pacientes.service';
import { EspecialistasService } from './especialistas.service';
import { Paciente } from '../models/Paciente';
import { Especialista } from '../models/Especialista';
import { Administrador } from '../models/Administrador';
import { ToastrService } from 'ngx-toastr';
import { AdministradorService } from './administrador.service';
import { Firestore ,doc,getDoc} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioConectado!:Especialista|Paciente|Administrador|null;
  constructor(private auth:Auth,
    private router:Router,
    private pacienteService:PacientesService,
    private especialistaService:EspecialistasService,
    private administradorService:AdministradorService,
    private firestore:Firestore,
    private _matDialog:MatDialog,
    private toastf:ToastrService) { }

    /**
     * 
     * @param correo si se deslogea solo, correo en false;
     */
  async LogoutUser(correo:boolean)
  { 
    if(correo){
      this.AbrirModal();
      signOut(this.auth).then(() => {
        setTimeout(() => {
          this.router.navigate(["Inicio"]);
          this.usuarioConectado = null;
          this.toastf.info('Atencion','Sesion cerrada con exito',{timeOut:2000})
          this.CerraModal();
        }, 2500);
      })
    }else{
      signOut(this.auth);
    }
  }
  AbrirModal(){
    this._matDialog.open(SpinnerComponent,{
      disableClose: true,
      data:{opcion:'cerrarsesion'}
    });
  }

  CerraModal(){
    this._matDialog.closeAll();
  }
  /**
   * Funcion para loguearse con auth
   * @param usuarioMail correo de la persona para loguearse
   * @param usuarioPass clave de la persona para loguearse
   * @returns 
   */
  async LoginUser(usuarioMail: string, usuarioPass: string): Promise<any> {
    try {
      const res = await signInWithEmailAndPassword(this.auth, usuarioMail, usuarioPass);
      const user = res.user;
      console.log(user);
      
      if(user.emailVerified){ //Aca ya tiene el email verificado
        //Hay que ver si es especialista y si tiene aprobada o no la acc.
        const resp = await this.especialistaService.CuentaAprobada(user.uid);
        if(resp === null){
          //Aca se sabe que es usuario y esta email verificado
          return true;          
        }else if(resp === true){
          console.log('es especialista y esta aprobado');
          return true;
        }else{
          this.toastf.warning('Alerta','Cuenta no aprobada por administrador',{timeOut:2000})
          this.LogoutUser(false);
          return false;
        }
        return true;
      }else{
        const resp = await this.administradorService.EsAdmin(user.uid);
        if(!resp){
          this.toastf.warning('Alerta!','Correo no verificado',{timeOut:2000})
          this.LogoutUser(false);
          return 'No existe';
        }else{
          console.log('es admin claro');
          return true;
        }
      }
      
    } catch (e:any) { //Manejo de error al loguearse
      switch (e.code) {
        case "auth/invalid-email":
          this.toastf.warning('Atencion!',"Correo electrónico inválido.",
            {timeOut: 2000}
          );
          break;
        case "auth/email-already-in-use":
          this.toastf.warning('Atencion!',"El correo electrónico ya está en uso.",
            {timeOut: 2000}
          );
          break;
        case "auth/weak-password":
          this.toastf.warning('Atencion!',"La contraseña es muy débil.",
            {timeOut: 2000}
          );
          break;
        case "auth/invalid-credential":
          this.toastf.warning('Atencion!',"Credencial inválida.",
            {timeOut: 2000}
          );
          break;
        default:
          this.toastf.warning('Error!',"Error inesperado",
            {timeOut: 2000}
          );
        break;
      }
    }
  }


  /**
   * Registra un usuario nuevo, puede ser paciente o especialista
   * @param correoNuevoUsuario el correo del nuevo usuario a registrar
   * @param claveNuevaUsuario la clave del nuevo usuario a registrar
   * @param usuarioCompletoNuevo usuario completo con todos los datos menos las imagenes
   * @param tipo tipo de usuario, puede ser paciente|especialista
   * @returns 
   */
  async AltaUsuarioAuthentication(correoNuevoUsuario:string,claveNuevaUsuario:string,usuarioCompletoNuevo:Paciente|Especialista|Administrador,tipo:string,creadoPorUser?:boolean):Promise<any>{
    try {
      const userLog = this.auth.currentUser;
      console.log(userLog);
      
      const res = await createUserWithEmailAndPassword(this.auth, correoNuevoUsuario, claveNuevaUsuario);
      if (res.user) {
        // Enviar verificación al correo
        await sendEmailVerification(res.user);
        console.log(res.user);
        console.log(usuarioCompletoNuevo);
        
        if (tipo === "paciente") {
          // Guardar usuario en la colección de pacientes
          // console.log('es paciente locura');
          // console.log(this.auth.currentUser);
          
          await this.pacienteService.AddUserCompletoPaciente(res.user.uid, usuarioCompletoNuevo);
        } else if (tipo === "especialista") {
          // Guardar usuario en la colección de especialistas
          await this.especialistaService.AddUserCompletoEspecialista(res.user.uid, usuarioCompletoNuevo);
        } else if (tipo === "administrador"){
          // Guardar usuario en la colección de administrador
          await this.administradorService.AddUserCompletoAdministrador(res.user.uid, usuarioCompletoNuevo);
        }

        setTimeout(async () => {
          if(userLog){
            await this.auth.updateCurrentUser(userLog);
            console.log(this.auth.currentUser);
          }
        }, 2000);
        
        return true; 
      }
    } catch (e:any) {
      switch (e.code) {
        case "auth/invalid-email":
          console.error("Correo electrónico inválido.");
          break;
        case "auth/email-already-in-use":
          console.error("El correo electrónico ya está en uso.");
          break;
        case "auth/weak-password":
          console.error("La contraseña es muy débil.");
          break;
        case "auth/invalid-credential":
          console.error("Credencial inválida.");
          break;
        default:
          console.error("Error", e.message);
          break;
      }
    }
  }

  /**
   * Carga el usuario en el servicio, usuarioConectado
   * @param uid recibe uid del auth
   * @returns devuelve true|false
   */
  async ObtenerUsuarioCompleto(uid: string): Promise<boolean> {
    const docRefPaciente = doc(this.firestore, 'pacientes', uid);
    const docSnapPaciente = await getDoc(docRefPaciente);

    if (docSnapPaciente.exists()) {
        this.usuarioConectado = docSnapPaciente.data()['usuario'];
        return true;
    }

    const docRefEspecialista = doc(this.firestore, 'especialistas', uid);
    const docSnapEspecialista = await getDoc(docRefEspecialista);

    if (docSnapEspecialista.exists()) {
        const especialista = docSnapEspecialista.data()['usuario'];
        if (especialista.aprobada) {
            this.usuarioConectado = especialista;
        } else {
            console.log('no tiene la cuenta aprobada');
            return false;
        }
        return true;
    }

    const docRefAdmin = doc(this.firestore, 'administradores', uid);
    const docSnapAdmin = await getDoc(docRefAdmin);

    if (docSnapAdmin.exists()) {
        this.usuarioConectado = docSnapAdmin.data()['usuario'];
        return true;
    }

    return false;
    }

   GetUserEmail(){
    return this.auth.currentUser?.email;
  }

  async GetUserPerfil(){
    // console.log(this.usuarioConectado.rol);
    if(this.usuarioConectado){
      return this.usuarioConectado.rol;
    }
    return null;
  }

  async GetUserPerfilCompleto(){
    if(this.auth.currentUser){
      const docRef = doc(this.firestore,'pacientes',this.auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        console.log('supuestamente paciente');
        
        return docSnap.data();
      }else{
        const docRef = doc(this.firestore,'especialistas',this.auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log('supuestamente espe');
        if(docSnap.exists()){
          console.log(docSnap.data());
          
          return docSnap.data();
        }else{
          const docRef = doc(this.firestore,'administradores',this.auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          console.log('supuestamente admind');

          if(docSnap.exists()){
            return docSnap.data();
          }else{
          console.log('no se encontro el usuario');
            return false;
          }
        }
      }
    }else{
      console.log('no hay nadie conectado');
      return false;
    }
  }

  async IniciarUsuario(){
    if(this.auth.currentUser){
      await this.ObtenerUsuarioCompleto(this.auth.currentUser.uid);
      console.log(this.usuarioConectado);
      return true;
    }else{
      return false;
    }

  }


}

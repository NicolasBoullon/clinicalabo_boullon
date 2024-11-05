import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, getStorage,ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

  constructor(private storage: Storage) { }

  async UploadFoto(file: File,nombre:string,carpeta:string) {
    const imgRef = ref(this.storage, `images/${carpeta}/${nombre}`);
    console.log(nombre);
  
    return uploadBytes(imgRef, file)
      .then(() => {
        // Después de que el archivo se suba, obtenemos la URL de descarga
        return getDownloadURL(imgRef);
      })
      .then((url) => {
        console.log('URL de descarga:', url);
        return url; // Devuelve la URL de descarga para que pueda ser usada fuera de la función
      })
      .catch((error) => {
        console.error('Error al subir el archivo o al obtener la URL:', error);
        throw error;
      });
  }

  
}

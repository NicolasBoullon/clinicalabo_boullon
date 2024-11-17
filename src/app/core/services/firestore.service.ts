import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, getDoc, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

    constructor(private firestore:Firestore){}
    
    public getCollection(path: string): Observable<any[]> {
      const colRef = collection(this.firestore, path);
      return collectionData(colRef, { idField: 'id' }) as Observable<any[]>;
    }

    public getCollectionOrderedByDate(path: string, field: string): Observable<any[]> {
      const colRef = collection(this.firestore, path);
      const q = query(colRef, orderBy(field, 'desc'));
      return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    }
    
    public getCollectionFilteredByDate(path: string, field: string, startDate: Date, endDate: Date): Observable<any[]> {
      const colRef = collection(this.firestore, path);
      const q = query(
          colRef,
          where(field, '>=', startDate),
          where(field, '<=', endDate),
          orderBy(field, 'desc')
      );
      return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    }

    public getDocumentById(collectionPath: string, documentId: string): Observable<any> {
      const docRef = doc(this.firestore, `${collectionPath}/${documentId}`);
      return docData(docRef, { idField: 'id' }) as Observable<any>;
    }


    public updateDocument(collectionPath: string, documentId: string, data: any): Promise<void> {
      const docRef = doc(this.firestore, `${collectionPath}/${documentId}`);
      return updateDoc(docRef, { ...data });
    }

    public updateDocumentField(collectionPath: string, documentId: string, field: string, value: any): Promise<void> {
      const docRef = doc(this.firestore, `${collectionPath}/${documentId}`);
      return updateDoc(docRef, { [field]: value });
    }
}

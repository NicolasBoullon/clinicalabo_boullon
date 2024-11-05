import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { provideToastr } from 'ngx-toastr';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes,withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',
  }),), provideAnimationsAsync(),
  provideAnimations(),
   provideFirebaseApp(() => initializeApp({
    "projectId":"clinicaboullon",
    "appId":"1:299995371834:web:8cca614c8b97a1f11cd803",
    "storageBucket":"clinicaboullon.appspot.com",
    "apiKey":"AIzaSyC1QL_DkDUTZLQ8lUyoV-rb3hosUnSZJSI",
    "authDomain":"clinicaboullon.firebaseapp.com",
    "messagingSenderId":"299995371834"})),
     provideAuth(() => getAuth()),
     provideToastr(),
      provideFirestore(() => getFirestore()),
       provideStorage(() => getStorage())]
};

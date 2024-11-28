import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

registerLocaleData(localeEsAr, 'es-AR');

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideToastr } from 'ngx-toastr';
import {envirConfig} from './enviroments'
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes,withInMemoryScrolling({scrollPositionRestoration: 'enabled',}),), 
  provideAnimationsAsync(),
  provideAnimations(),
  { provide: LOCALE_ID, useValue: 'es-AR' },
   provideFirebaseApp(() => initializeApp(envirConfig)),
     provideAuth(() => getAuth()),
     provideToastr(),
      provideFirestore(() => getFirestore()),
       provideStorage(() => getStorage())]
};

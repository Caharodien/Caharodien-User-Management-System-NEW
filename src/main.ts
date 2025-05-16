import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component'; 
import { JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './app/_helpers'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app-routing.module'; 

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes), 
        provideHttpClient(withInterceptorsFromDi()), 
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      // fakeBackendProvider 
    ]
}).catch(err => console.error(err));
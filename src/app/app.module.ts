import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Configuracion de locale de la app
import localeEsBO from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';

// Sockets
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const token = localStorage.getItem('token') || '';
const config: SocketIoConfig = { 
  url: environment.wsUrl, 
  options: {
    extraHeaders: {
      authentication: token,
    },
  } 
};

registerLocaleData( localeEsBO );

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ToastrModule.forRoot({
      timeOut: 3000, // Duración predeterminada de 3 segundos
      positionClass: 'toast-top-right', // Posición del Toastr
      preventDuplicates: true, // Evitar mostrar Toastrs duplicados
    }),
    SocketIoModule.forRoot(config),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ClipboardModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-BO' },
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

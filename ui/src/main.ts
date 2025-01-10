import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Usar provideHttpClient en lugar de HttpClientModule
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Asegúrate de tener las rutas configuradas
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Aquí proves HttpClient
    provideRouter(routes), provideAnimationsAsync() // Si estás usando rutas
  ]
});

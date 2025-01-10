import { Routes } from '@angular/router';
import { StatsComponent } from './components/stats/stats.component';
// import { HomeComponent } from './home/home.component';

export const routes: Routes = [
//   { path: '', component: HomeComponent }, // Ruta raíz
  { path: 'stats', component: StatsComponent }, // Ruta para el componente Stats
  { path: 'stats/:restaurantId', component: StatsComponent },
  { path: '**', redirectTo: '/stats' } // Ruta de fallback
];

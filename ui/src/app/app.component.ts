import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa el RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],  // Asegúrate de importar RouterModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

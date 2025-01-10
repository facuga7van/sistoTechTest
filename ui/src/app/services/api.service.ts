import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Esto sigue permitiendo que el servicio sea inyectado globalmente
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/restaurants'); // Ajusta la URL según tu API
  }

  getStatsDaily(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/statsDaily?betriebId=${restaurantId}`);
  }
  getStatsTotal(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/statsTotal?betriebId=${restaurantId}`);
  }
  getStatsReservation(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/statsReservation?betriebId=${restaurantId}`);
  }
}

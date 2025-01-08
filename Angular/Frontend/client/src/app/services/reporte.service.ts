import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reporte } from '../models/reportes';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  url = 'http://localhost:4000/api/reportes/';

  constructor(private http: HttpClient) { }

  getReportes(): Observable<any>{
    return this.http.get(this.url);
  }

  deleteReporte(id: string): Observable<any>{
    return this.http.delete(this.url + id);
  }

  crearReporte(reporte: Reporte): Observable<any>{
    return this.http.post(this.url, reporte)
  }

  getReporte(id: string): Observable<any>{
    return this.http.get(this.url + id)
  }
}

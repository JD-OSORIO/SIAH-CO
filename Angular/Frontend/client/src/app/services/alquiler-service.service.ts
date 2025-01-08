import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alquiler } from '../models/alquiler';

@Injectable({
  providedIn: 'root'
})
export class AlquilerServiceService {

  url = 'http://localhost:4000/api/alquilers/';

  constructor(private http: HttpClient) { }

  getAlquilers(): Observable<any>{
    return this.http.get(this.url);
  }

  eliminarAlquiler(id: string): Observable<any>{
    return this.http.delete(this.url + id);
  }

  guardarAlquiler(alquiler: Alquiler): Observable<any>{
    return this.http.post(this.url, alquiler)
  }

  obtenerAlquiler(id: string): Observable<any>{
    return this.http.get(this.url + id)
  }

  editarAlquiler(id: string, alquiler: Alquiler): Observable <any>{
    return this.http.put(this.url + id, alquiler);
  }

  actualizarStock():Observable<any>{
    return this.http.post(`${this.url}/actualizarStock`,{});
  }

}




import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:4000/api/categorias/';


  getCategorias(): Observable<any>{
    return this.http.get(this.url);
  }

  deleteCategoria(id: string): Observable<any>{
    return this.http.delete(this.url + id);
  }

  crearCategoria(categoria: Categoria): Observable<any>{
    return this.http.post(this.url, categoria)
  }

  getCategoria(id: string): Observable<any>{
    return this.http.get(this.url + id)
  }

}

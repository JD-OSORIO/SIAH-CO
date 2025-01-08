import { Factura } from './../models/factura';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaServiceService {

  url = 'http://localhost:4000/api/facturas/';

  constructor(private http: HttpClient) { }

  getFacturas(): Observable<any>{
    return this.http.get(this.url);
  }

  eliminarFactura(id: string): Observable<any>{
    return this.http.delete(this.url + id);
  }

  guardarFactura(factura: Factura): Observable<any>{
    return this.http.post(this.url, factura)
  }

  obtenerFactura(id: string): Observable<any>{
    return this.http.get(this.url + id)
  }

  editarFactura(id: string, factura: Factura): Observable <any>{
    return this.http.put(this.url + id, factura);
  }
}



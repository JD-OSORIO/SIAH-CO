import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/models/factura';
import { Producto } from 'src/app/models/producto';
import { FacturaServiceService } from 'src/app/services/factura-service.service';
import { ProductoServiceService } from 'src/app/services/producto-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.css']
})
export class ListaProductoComponent implements OnInit {

  listaProducto: Producto[] = [];
  listaFactura: Factura[]=[];
  filtroProducto = '';

  constructor(private _productoService: ProductoServiceService,
              private _facturaService: FacturaServiceService,) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerFacturas();
  }


  obtenerFacturas(){
    this._facturaService.getFacturas().subscribe(data =>{
      console.log(data);
      this.listaFactura = data;

    }, error =>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo Salio Mal',
        footer: 'Revisa El Error'
      })
    })
  }

  obtenerProductos(){
    this._productoService.getProductos().subscribe(data =>{
      console.log(data);
      this.listaProducto = data;
    }, error =>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo Salio Mal, Revisa el error',
        footer: 'No se estan trayendo los datos'
      })
      console.log(error);
    })
  }

  filtrarProductos() {
    if (this.filtroProducto.trim() === '') {
      // Si el filtro está vacío, restaura la lista completa
      this.obtenerProductos();
    }else{
          // Filtra la lista de productos basándose en el criterio de búsqueda
      this.listaProducto = this.listaProducto.filter(producto =>
        producto.nombre.toLowerCase().includes(this.filtroProducto.toLowerCase())
      );
    }


}


  eliminarProducto(id: any){
    Swal.fire({
      title: 'Estas Seguro De Eliminar?',
      text: "No puedes recuperar los datos! despues",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Borrado',
          'Los Datos han sido borrados',
          'success'
        )
        this._productoService.eliminarProducto(id).subscribe(data=>{
          this.obtenerProductos();
        },error =>{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo Salio Mal, Revisa el error',
            footer: 'No se elimino el dato'
          })
          console.log(error);
        })
      }
    })
  }
}

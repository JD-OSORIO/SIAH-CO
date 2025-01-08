import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/models/factura';
import { FacturaServiceService } from 'src/app/services/factura-service.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-lista-factura',
  templateUrl: './lista-factura.component.html',
  styleUrls: ['./lista-factura.component.css']
})
export class ListaFacturaComponent implements OnInit {

  listaFactura: Factura[] = [];
  titulo = "Crear Factura";
  filtroFactura = '';

  constructor(private _facturaService: FacturaServiceService) { }

  ngOnInit(): void {
    this.obtenerFacturas()
  }


  generarPDF(factura: any) {
    const pdf = new jsPDF();

    // Encabezado de la factura
    pdf.setFontSize(18);
    pdf.text('Factura', pdf.internal.pageSize.width / 2, 15, { align: 'center' });

    // Datos del cliente
    pdf.setFontSize(12);
    pdf.text(`Cliente: ${factura.nombre}`, 20, 30);
    pdf.text(`Tipo de Cliente: ${factura.tipocliente}`, 20, 45);
    pdf.text(`Teléfono: ${factura.telefono}`, 20, 60);
    pdf.text(`Dirección: ${factura.direccion}`, 20, 75);

    // Línea divisoria
    pdf.line(20, 85, pdf.internal.pageSize.width - 20, 85);

    // Detalles de la factura
    pdf.setFontSize(14);
    pdf.text('Producto', 20, 100);
    pdf.text('Cantidad', 50, 100);
    pdf.text('Iva', 80, 100);
    pdf.text('Precio Unitario', 110, 100);
    pdf.text('Total', 160, 100);

    // Contenido de la tabla
    pdf.setFontSize(12);
    pdf.text(factura.productoF, 20, 115);
    pdf.text(factura.cantidades.toString(), 50, 115);
    pdf.text('19%', 80, 115);
    pdf.text(`${(factura.price / factura.cantidades).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`, 110, 115);
    pdf.text(`${(factura.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`, 160, 115);

    // Precio total
    pdf.setFontSize(14);
    pdf.text(`Total: ${(factura.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`, 20, 145);

    // Puedes agregar más contenido según tus necesidades

    // Descargar el archivo PDF
    pdf.save('factura.pdf');
  }



  filtrarProductos() {
    if (this.filtroFactura.trim() === '') {
      // Si el filtro está vacío, restaura la lista completa
      this.obtenerFacturas();
    }else{
      this.listaFactura = this.listaFactura.filter(factura =>
        factura.nombre.toLowerCase().includes(this.filtroFactura.toLowerCase())
      );
    }
    // Filtra la lista de productos basándose en el criterio de búsqueda
}





  obtenerFacturas(){
    this._facturaService.getFacturas().subscribe(data =>{
      console.log(data);
      this.listaFactura = data;
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

  eliminarFactura(id: any){
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
        this._facturaService.eliminarFactura(id).subscribe(data=>{
          this.obtenerFacturas();
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

import { Component, Injectable, OnInit } from '@angular/core';
import { Alquiler } from 'src/app/models/alquiler';
import { AlquilerServiceService } from 'src/app/services/alquiler-service.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-lista-alquiler',
  templateUrl: './lista-alquiler.component.html',
  styleUrls: ['./lista-alquiler.component.css']
})
export class ListaAlquilerComponent implements OnInit {

  listaAlquiler: Alquiler[] = [];
  filtroAlquiler = '';

  constructor(private _alquilerService: AlquilerServiceService) { }

  ngOnInit(): void {
    this.obtenerAlquilers()
  }

  obtenerAlquilers(){
    this._alquilerService.getAlquilers().subscribe(data =>{
      console.log(data);
      this.listaAlquiler = data;
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
    if (this.filtroAlquiler.trim() === '') {
      // Si el filtro está vacío, restaura la lista completa
      this.obtenerAlquilers();
    }else{
      this.listaAlquiler = this.listaAlquiler.filter(alquiler =>
        alquiler.nombre.toLowerCase().includes(this.filtroAlquiler.toLowerCase())
      );
    }
}

  eliminarAlquiler(id: any){
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
        this._alquilerService.eliminarAlquiler(id).subscribe(data=>{
          this.obtenerAlquilers();
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

  generarPDF(alquiler: any) {
    const pdf = new jsPDF();

    // Encabezado del PDF
    pdf.setFontSize(18);
    pdf.text('Alquiler', pdf.internal.pageSize.width / 2, 15, { align: 'center' });

    // Datos del cliente
    pdf.setFontSize(12);
    pdf.text(`Cliente: ${alquiler.tipocliente}`, 20, 30);
    pdf.text(`Tipo de Cliente: ${alquiler.nombre}`, 20, 45);
    pdf.text(`Teléfono: ${alquiler.telefono}`, 20, 60);
    pdf.text(`Dirección: ${alquiler.direccion}`, 20, 75);

    // Línea divisoria
    pdf.line(20, 85, pdf.internal.pageSize.width - 20, 85);

    // Detalles de la factura
    pdf.setFontSize(14);
    pdf.text('Herramienta', 20, 100);
    pdf.text('Dias', 60, 100);
    pdf.text('Cantidad', 80, 100);
    pdf.text('Deposito', 110, 100);
    pdf.text('Total Alquiler', 150, 100);
    pdf.text('Total Pago', 20, 150);

    // Contenido de la tabla
    pdf.setFontSize(12);
    pdf.text(alquiler.codigoherramienta, 20, 115);
    pdf.text(alquiler.diasprestamo.toString(), 60, 115);
    pdf.text(alquiler.cantidades.toString(), 80, 115);
    pdf.text((alquiler.deposito).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }), 110, 115);
    pdf.text((alquiler.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }), 150, 115);
    pdf.text((alquiler.totalPagar).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),20 , 165);

    // Puedes agregar más contenido según tus necesidades

    // Descargar el archivo PDF
    pdf.save('alquiler.pdf');
  }
}

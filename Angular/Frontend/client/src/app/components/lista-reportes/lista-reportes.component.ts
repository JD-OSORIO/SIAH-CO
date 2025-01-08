import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reportes';
import { AuthService } from 'src/app/services/auth.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-reportes',
  templateUrl: './lista-reportes.component.html',
  styleUrl: './lista-reportes.component.css'
})
export class ListaReportesComponent implements OnInit{

  listaReporte: Reporte[] = [];
  selectedReportIndex: number | null = null;

  constructor(private _reporteService: ReporteService,
              private authservice: AuthService,
              private userservice: UserService){}

  ngOnInit(): void {
    this.getReportes();

  }

  getReportes(){
    this._reporteService.getReportes().subscribe(data=>{
      console.log(data);
      this.listaReporte = data;
    }, error =>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo Salio Mal',
        footer: 'Revisa El Error'
      })
    })
  }

  deleteReporte(id: any){
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
        this._reporteService.deleteReporte(id).subscribe(data=>{
          this.getReportes();
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

  mostrarDetalle(index: number) {
    this.selectedReportIndex = index;
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reporte } from 'src/app/models/reportes';
import { AuthService } from 'src/app/services/auth.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-reportes',
  templateUrl: './crear-reportes.component.html',
  styleUrl: './crear-reportes.component.css'
})
export class CrearReportesComponent implements OnInit{

  ReporteForm: FormGroup;
  nombre = '';
  roles = '';
  rola='';
  listaUser = [] =[];
  user = {};
  username = '';
  id: string | null;

  constructor(private fb: FormBuilder,
              private _reporteService: ReporteService,
              private router: Router,
              private aRoute: ActivatedRoute,
              private authservice: AuthService,
              private userservice: UserService) {
        this.ReporteForm = this.fb.group({
          title: ['', Validators.required],
          name: ['', Validators.required],
          text: ['', Validators.required],
        })
      this.id = this.aRoute.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.showName();
  }

  addReporte(){
    console.log(this.ReporteForm);
    this.showName();

    if(this.ReporteForm.invalid){
      return Object.values(this.ReporteForm.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }

    const REPORTE: Reporte = {
      title: this.ReporteForm.get('title')?.value,
      name: this.nombre,
      text: this.ReporteForm.get('text')?.value
    }

    if(this.id !==null){
      //Edit
      console.log("Ya existe el reporte");
    }else{
      console.log(REPORTE);
      this._reporteService.crearReporte(REPORTE).subscribe(data =>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Guardado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.router.navigate(['/inicio']);
      }, error =>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo Salio Mal, Revisa el error',
          footer: 'No se guardaron los datos'
        })
        this.ReporteForm.reset();
      })
    }
  }

  showName() {
    const user = this.authservice.getUser();
    if (user && 'userName' in user) {
      this.username = user.userName;

      this.userservice.getUsers().subscribe((users: any[]) => {
        const matchedUser = users.find(u => u.userName === this.username);
        if (matchedUser) {
          this.nombre = matchedUser.name;
          console.log(this.nombre);
        } else {
          console.log("No se encontró un usuario con ese nombre de usuario");
        }
      });
    } else {
      console.error('Error: Usuario no tiene la propiedad userName', user);
      this.user = { userName: '', pass: '' };
      this.username = '';
    }
  }

  actualizarName(){
    this.showName();
    const titleValue = this.nombre
    this.ReporteForm.get('name')?.setValue(titleValue);
  }

  //validaciones
  get TitleNV(){
    return this.ReporteForm.get('title')?.invalid && this.ReporteForm.get('title')?.touched
  }
  get textArea(){
    return this.ReporteForm.get('text')?.invalid && this.ReporteForm.get('text')?.touched
  }

}

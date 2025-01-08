import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrl: './crear-categoria.component.css'
})
export class CrearCategoriaComponent implements OnInit{

  CategoriaForm: FormGroup;
  titulo = 'Crear Categoria'
  id: string | null;
  listaCategoria: Categoria[]=[];

  constructor(private fb: FormBuilder,
              private _categoriaService: CategoriaService,
              private router: Router,
              private aRoute: ActivatedRoute,
              private zone: NgZone,
              private renderer: Renderer2) {
    this.CategoriaForm = this.fb.group({
      categoria: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this._categoriaService.getCategorias().subscribe(data=>{
      console.log(data);
      this.listaCategoria = data
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

  addCategoria(){
    console.log(this.CategoriaForm);

    if(this.CategoriaForm.invalid){
      return Object.values(this.CategoriaForm.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }

    const CATEGORIA: Categoria = {
      categoria: this.CategoriaForm.get('categoria')?.value
    }

    if(this.id !== null){
      console.log("Ya existe el categoria");
    }else{
      //crear
      console.log(CATEGORIA);
      this._categoriaService.crearCategoria(CATEGORIA).subscribe(data=>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Guardado Correctamente',
          showConfirmButton: false,
          timer: 1100
        });
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.renderer.setProperty(document.location, 'href', document.location.href);
            });
          }, 1000);
        });
      }, error =>{
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo Salio Mal, Revisa el error',
          footer: 'No se guardaron los datos'
        })
        this.CategoriaForm.reset();
      })
    }
  }

  deleteCategoria(id: any){
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
        this._categoriaService.deleteCategoria(id).subscribe(data=>{
          this.zone.runOutsideAngular(() => {
            setTimeout(() => {
              this.zone.run(() => {
                this.renderer.setProperty(document.location, 'href', document.location.href);
              });
            }, 1000);
          });
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



  get CategoriaN(){
    return this.CategoriaForm.get('categoria')?.invalid && this.CategoriaForm.get('categoria')?.touched
  }

}

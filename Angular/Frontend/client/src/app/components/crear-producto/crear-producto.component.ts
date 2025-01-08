import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProductoServiceService } from 'src/app/services/producto-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import Swal from 'sweetalert2';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {

  ProductoForm : FormGroup;
  titulo = 'Crear Producto';
  title = 'Crear Categoria'
  seleccionado = 'categoria';
  listaCategoria: Categoria[]=[];

  id: string | null;
  constructor(private fb: FormBuilder,
              private _productoService: ProductoServiceService,
              private _categoriaService: CategoriaService,
              private authservice: AuthService,
              private router: Router,
              private aRoute : ActivatedRoute) {
    this.ProductoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      cantidad: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
   }

  ngOnInit(): void {
    this.esEditar();
    this.getCategorias();
  }

  getCategorias(){
    this._categoriaService.getCategorias().subscribe(data =>{
      console.log(data);
      this.listaCategoria = data;
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

  agregarProducto(){
    console.log(this.ProductoForm);

    if(this.ProductoForm.invalid){

      return Object.values(this.ProductoForm.controls).forEach(control =>{

        control.markAllAsTouched();

      })

    }

    const PRODUCTO : Producto ={
      nombre : this.ProductoForm.get('producto')?.value,
      categoria : this.ProductoForm.get('categoria')?.value,
      cantidad : this.ProductoForm.get('cantidad')?.value,
      stock : this.ProductoForm.get('stock')?.value,
      precio : this.ProductoForm.get('precio')?.value
    }

    if(this.id !== null)
    {
      //editar
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data =>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Editado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.router.navigate(['/lista-producto'])
      })
    }else{
      //crear
      console.log(PRODUCTO);
      this._productoService.guardarProducto(PRODUCTO).subscribe(data =>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Guardado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.router.navigate(['/lista-producto'])
      },error =>{
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo Salio Mal, Revisa el error',
          footer: 'No se guardaron los datos'
        })
        this.ProductoForm.reset();
      })
    }
  }
  esEditar(){
    if(this.id !== null){
      this.titulo = "Editar Producto"
      this._productoService.obtenerProducto(this.id).subscribe(data=>{
        this.ProductoForm.setValue({
          producto: data.nombre,
          categoria: data.categoria,
          cantidad: data.cantidad,
          stock: data.stock,
          precio: data.precio
        })
      })
    }
  }

  showAdminLink(): boolean {
    const expectedRole = 'admin'; // o puedes obtener esto de alguna manera dinámica si es necesario
    const userRole = this.authservice.getUserRole();

    // Muestra el enlace solo si el rol del usuario coincide con el rol esperado
    return userRole === expectedRole;
  }
      //Validaciones
get nombreNoValido(){
  return this.ProductoForm.get('producto')?.invalid && this.ProductoForm.get('producto')?.touched
}

get categoriaNoValido(){
  return this.ProductoForm.get('categoria')?.invalid && this.ProductoForm.get('categoria')?.touched
}
get cantidadNoValido(){
  return this.ProductoForm.get('cantidad')?.invalid && this.ProductoForm.get('cantidad')?.touched
}
get priceNoValido(){
  return this.ProductoForm.get('precio')?.invalid && this.ProductoForm.get('precio')?.touched
}
get stockNoValido(){
  return this.ProductoForm.get('stock')?.invalid && this.ProductoForm.get('stock')?.touched
}
}

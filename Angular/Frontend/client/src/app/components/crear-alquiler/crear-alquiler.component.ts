import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alquiler } from 'src/app/models/alquiler';
import { Producto } from 'src/app/models/producto';
import { AlquilerServiceService } from 'src/app/services/alquiler-service.service';
import { ProductoServiceService } from 'src/app/services/producto-service.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crear-alquiler',
  templateUrl: './crear-alquiler.component.html',
  styleUrls: ['./crear-alquiler.component.css']
})
export class CrearAlquilerComponent implements OnInit {

  AlquilerForm : FormGroup;
  titulo = 'Crear Alquiler';
  id: string | null;
  listaProducto: Producto[]=[];
  seleccionado = 'producto';
  filtroNombre: string = '';

  constructor(private fb: FormBuilder,
              private _alquilerService: AlquilerServiceService,
              private _productoService: ProductoServiceService,
              private router: Router,
              private aRoute : ActivatedRoute,
              private renderer: Renderer2,
              private zone: NgZone) {
    this.AlquilerForm = this.fb.group({
      tipocliente: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]],
      direccion: ['', Validators.required],
      codigoherramienta: ['', Validators.required],
      diasprestamo: [null, Validators.required],
      cantidades: [null, Validators.required],
      deposito: ['', Validators.required],
      total: [null, Validators.required],
      totalPagar: [null, Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
   }


  ngOnInit(): void {
    this.esEditar()
    this.obtenerProductos()
  }

  obtenerProductos(){
    this._productoService.getProductos().subscribe(data =>{
      console.log(data);
      this.listaProducto = data;
    }, error =>{
      console.log(error);
    })
  }

  agregarAlquiler(){
    console.log(this.AlquilerForm);

    if(this.AlquilerForm.invalid){

      return Object.values(this.AlquilerForm.controls).forEach(control =>{

        control.markAllAsTouched();

      })

    }

    const ALQUILER : Alquiler ={
      tipocliente : this.AlquilerForm.get('tipocliente')?.value,
      nombre : this.AlquilerForm.get('nombre')?.value,
      telefono : this.AlquilerForm.get('telefono')?.value,
      direccion : this.AlquilerForm.get('direccion')?.value,
      codigoherramienta : this.AlquilerForm.get('codigoherramienta')?.value,
      diasprestamo : this.AlquilerForm.get('diasprestamo')?.value,
      deposito : this.AlquilerForm.get('deposito')?.value,
      cantidades: this.AlquilerForm.get('cantidades')?.value,
      total : this.calcularPrecio(),
      totalPagar: this.calcularPrecioAlquiler()
    }

    if(this.id !== null)
    {
      //editar
      this._alquilerService.editarAlquiler(this.id, ALQUILER).subscribe(data =>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Editado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.router.navigate(['/lista-alquiler'])
      })
    }else{
      //crear
      console.log(ALQUILER);
      this._alquilerService.guardarAlquiler(ALQUILER).subscribe(data =>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Guardado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.actualizarStock();
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.renderer.setProperty(document.location, 'href', document.location.href);
            });
          }, 1000);
        });
      },error =>{
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo Salio Mal, Revisa el error',
          footer: 'No se guardaron los datos'
        })
        this.AlquilerForm.reset();
      })
    }
  }
  esEditar(){
    if(this.id !== null){
      this.titulo = "Editar Alquiler"
      this._alquilerService.obtenerAlquiler(this.id).subscribe(data=>{
        this.AlquilerForm.setValue({
          tipocliente: data.tipocliente,
          nombre: data.nombre,
          telefono: data.telefono,
          direccion: data.direccion,
          codigoherramienta: data.codigoherramienta,
          cantidades: data.cantidades,
          diasprestamo: data.diasprestamo,
          deposito: data.deposito,
          total: this.calcularPrecio(),
          totalPagar: this.calcularPrecioAlquiler()
        })
      })
    }
  }

calcularPrecio(): number {
  const cantidad = this.AlquilerForm.get('diasprestamo')?.value || 0;
  const cantidad2 = this.AlquilerForm.get('cantidades')?.value || 0;
  const productoSeleccionado = this.listaProducto.find(producto => producto.nombre === this.AlquilerForm.get('codigoherramienta')?.value);


  if (productoSeleccionado) {
    const valordia = 0.05;
    const operacion = productoSeleccionado.precio * valordia;
    const operacion2 = operacion * cantidad2;
    const suma = operacion2 * cantidad;
    return suma;
  } else {
    console.error('No se pudo encontrar el producto seleccionado.');
    return 0;
  }
}
calcularPrecioAlquiler(): number {
  const cantidad = this.AlquilerForm.get('deposito')?.value || 0;
  const cantidad2 = this.AlquilerForm.get('cantidades')?.value || 0;


  if (true) {
    const operacion = cantidad2 * cantidad
    return operacion;
  }
}

calcularPrecioTotal(): number {
  const cantidad = this.AlquilerForm.get('total')?.value || 0;
  const cantidad2 = this.AlquilerForm.get('deposito')?.value || 0;


  if (true) {
    const operacion = cantidad + cantidad2;
    return operacion;
  }
}

actualizarStock(): void {
  this._alquilerService.actualizarStock().subscribe(
      response => {
          console.log(response.message); // Mensaje de éxito desde el backend
      },
      error => {
          console.error(error);
      }
  );
}

actualizarPrecio(){
  this.AlquilerForm.patchValue({
    total: this.calcularPrecio()
  })
}

actualizarPrecioAlquiler(){
  this.AlquilerForm.patchValue({
    deposito: this.calcularPrecioAlquiler()
  })
}

actualizarPrecioTotal(){
  this.AlquilerForm.patchValue({
    totalPagar: this.calcularPrecioTotal()
  })
}
  //Validaciones
get tipoCNoValido(){
  return this.AlquilerForm.get('tipocliente')?.invalid && this.AlquilerForm.get('tipocliente')?.touched
}
get nombreNoValido(){
  return this.AlquilerForm.get('nombre')?.invalid && this.AlquilerForm.get('nombre')?.touched
}
get telefonoNoValido(){
  return this.AlquilerForm.get('telefono')?.invalid && this.AlquilerForm.get('telefono')?.touched
}
get direccionNoValido(){
  return this.AlquilerForm.get('direccion')?.invalid && this.AlquilerForm.get('direccion')?.touched
}
get codigoHNoValido(){
  return this.AlquilerForm.get('codigoherramienta')?.invalid && this.AlquilerForm.get('codigoherramienta')?.touched
}
get diaspNoValido(){
  return this.AlquilerForm.get('diasprestamo')?.invalid && this.AlquilerForm.get('diasprestamo')?.touched
}
get depositoNoValido(){
  return this.AlquilerForm.get('deposito')?.invalid && this.AlquilerForm.get('deposito')?.touched
}

}


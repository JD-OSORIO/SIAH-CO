import { Producto } from './../../models/producto';
import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/models/factura';
import { FacturaServiceService } from 'src/app/services/factura-service.service';
import { ProductoServiceService } from 'src/app/services/producto-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-factura',
  templateUrl: './crear-factura.component.html',
  styleUrls: ['./crear-factura.component.css']
})
export class CrearFacturaComponent implements OnInit {

  FacturaForm : FormGroup;
  titulo = 'Crear Factura';
  id: string | null;
  listaProducto: Producto[] = [];
  seleccionado = 'producto';


  constructor(private fb: FormBuilder,
              private _facturaService: FacturaServiceService,
              private _productoService: ProductoServiceService,
              private router: Router,
              private aRoute : ActivatedRoute,
              private renderer: Renderer2,
              private zone: NgZone) {
    this.FacturaForm = this.fb.group({
      tipocliente: ['', Validators.required],
      factura: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]],
      direccion: ['', Validators.required],
      productoF: ['', Validators.required],
      cantidades: [null, Validators.required],
      price: [null, Validators.required]
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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo Salio Mal',
        footer: 'Revisa El Error'
      })
    })
  }



  agregarFactura(){
    console.log(this.FacturaForm);


    if(this.FacturaForm.invalid){

      return Object.values(this.FacturaForm.controls).forEach(control =>{

        control.markAllAsTouched();

      })

    }

    const FACTURA : Factura ={
      tipocliente : this.FacturaForm.get('tipocliente')?.value,
      nombre : this.FacturaForm.get('factura')?.value,
      telefono : this.FacturaForm.get('telefono')?.value,
      direccion : this.FacturaForm.get('direccion')?.value,
      productoF : this.FacturaForm.get('productoF')?.value,
      cantidades : this.FacturaForm.get('cantidades')?.value,
      price : this.calcularPrecio()
    }

    if(this.id !== null)
    {
      //editar
      this._facturaService.editarFactura(this.id, FACTURA).subscribe(data =>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Editado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.router.navigate(['/lista-factura'])
      })
    }else{
      //crear
      console.log(FACTURA);
      this._facturaService.guardarFactura(FACTURA).subscribe(data =>{
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
          text: 'Error al Guardar',
          footer: 'Es posible que la cantidad exceda a la existente en los productos'
        })
        this.FacturaForm.reset();
      })
    }
  }
  esEditar(){
    if(this.id !== null){
      this.titulo = "Editar Factura"
      this._facturaService.obtenerFactura(this.id).subscribe(data=>{
        this.FacturaForm.setValue({
          tipocliente: data.tipocliente,
          factura: data.nombre,
          telefono: data.telefono,
          direccion: data.direccion,
          productoF: data.productoF,
          cantidades: data.cantidades,
          price: this.calcularPrecio()
        })
      })
    }
  }

  actualizarStock(): void {
    this._productoService.actualizarStock().subscribe(
        response => {
            console.log(response.message); // Mensaje de éxito desde el backend
        },
        error => {
            console.error(error);
        }
    );
}

calcularPrecio(): number {
  const cantidad = this.FacturaForm.get('cantidades')?.value || 0;
  const productoSeleccionado = this.listaProducto.find(producto => producto.nombre === this.FacturaForm.get('productoF')?.value);

  if (productoSeleccionado) {
    const iva = 0.19;
    const operacion = productoSeleccionado.precio * cantidad;
    const operacion2 = operacion * iva;
    const suma = operacion + operacion2;
    return suma;
  } else {
    console.error('No se pudo encontrar el producto seleccionado.');
    return 0;
  }
}

  actualizarPrecio(){
    this.FacturaForm.patchValue({
      price: this.calcularPrecio()
    })
  }

    //Validaciones
get tipoCNoValido(){
  return this.FacturaForm.get('tipocliente')?.invalid && this.FacturaForm.get('tipocliente')?.touched
}
get nombreNoValido(){
  return this.FacturaForm.get('factura')?.invalid && this.FacturaForm.get('factura')?.touched
}
get telefonoNoValido(){
  return this.FacturaForm.get('telefono')?.invalid && this.FacturaForm.get('telefono')?.touched
}
get direccionNoValido(){
  return this.FacturaForm.get('direccion')?.invalid && this.FacturaForm.get('direccion')?.touched
}
get codigoHNoValido(){
  return this.FacturaForm.get('productoF')?.invalid && this.FacturaForm.get('productoF')?.touched
}
get cantidadNoValido(){
  return this.FacturaForm.get('cantidades')?.invalid && this.FacturaForm.get('cantidades')?.touched
}
}


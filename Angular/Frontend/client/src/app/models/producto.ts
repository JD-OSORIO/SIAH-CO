export class Producto{

    _id?: number;
    nombre: string;
    categoria: string;
    cantidad: number;
    stock: number;
    precio: number;

    constructor(nombre: string, categoria: string, cantidad: number,stock: number,precio: number){
        this.nombre=nombre;
        this.categoria= categoria;
        this.cantidad= cantidad;
        this.stock=stock;
        this.precio=precio;
    }
}

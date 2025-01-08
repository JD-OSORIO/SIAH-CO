export class Factura{

    _id?: number;
    tipocliente: string;
    nombre: string;
    telefono: number;
    direccion: string;
    productoF: String;
    cantidades:number;
    price: number;

    constructor(tipocliente: string,nombre: string, telefono: number, direccion: string,productoF: string, cantidades: number, price: number){
        this.tipocliente=tipocliente;
        this.nombre=nombre;
        this.telefono= telefono;
        this.direccion= direccion;
        this.productoF=productoF;
        this.cantidades= cantidades;
        this.price = price;
    }
}

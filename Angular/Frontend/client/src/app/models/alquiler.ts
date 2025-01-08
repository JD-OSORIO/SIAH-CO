export class Alquiler{

    _id?: number;
    tipocliente: string;
    nombre: string;
    telefono: number;
    direccion: string;
    codigoherramienta: string;
    diasprestamo: number;
    cantidades: number;
    deposito: number;
    total: number;
    totalPagar: number;

    constructor(tipocliente: string,totalPagar: number ,nombre: string, telefono:number,direccion: string,codigoherramienta: string, diasprestamo: number, deposito: number, total: number, cantidades: number){
        this.tipocliente=tipocliente;
        this.nombre=nombre;
        this.telefono=telefono;
        this.direccion=direccion;
        this.codigoherramienta=codigoherramienta;
        this.diasprestamo= diasprestamo;
        this.deposito= deposito;
        this. total=total;
        this. cantidades = cantidades;
        this.totalPagar = totalPagar;
    }
}

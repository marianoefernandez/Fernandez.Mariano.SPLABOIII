import { Anuncio } from "./anuncio.js";

export class Anuncio_Auto extends Anuncio
{
    constructor(id,titulo,transaccion,descripcion,precio,cantPuertas,cantKm,cantPotencia)
    {
        super(id,titulo,transaccion,descripcion,precio);
        this.cantPuertas=cantPuertas;
        this.cantKm=cantKm;
        this.cantPotencia=cantPotencia;
    }

    set CantPotencia(value)
    {
        this.cantPotencia = value;
    }

    set CantPuertas(value)
    {
        this.cantPuertas = value;
    }

    set CantKm(value)
    {
        this.cantKm = value;
    }

    get CantPuertas()
    {
        return this.cantPuertas;
    }

    get CantPortencia()
    {
        return this.cantPotencia;
    }

    get CantKm()
    {
        return this.cantKm;
    }


    Equals(anuncioAuto)
    {
        return (
            this.Titulo == anuncioAuto.titulo && 
            this.Descripcion == anuncioAuto.descripcion &&
            this.Precio == anuncioAuto.precio && 
            this.Transaccion == anuncioAuto.transaccion &&
            this.CantPuertas == anuncioAuto.cantPuertas && 
            this.CantPotencia == anuncioAuto.cantPotencia &&
            this.CantKm == anuncioAuto.cantKm 
            );
    }
}
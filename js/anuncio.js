export class Anuncio
{
    //#region Constructor

    constructor(id,titulo,transaccion,descripcion,precio)
    {
        this.Id=id;
        this.Titulo=titulo;
        this.Transaccion=transaccion;
        this.Descripcion=descripcion;
        this.Precio=precio;
    }

    //#endregion

    //#region Propiedades

    //PROPIEDADES SET

    set Id(value)
    {
        this.id = value;
    }

    set Titulo(value)
    {
        this.titulo = value;
    }

    set Transaccion(value)
    {
        this.transaccion = value;
    }

    set Descripcion(value)
    {
        this.descripcion = value;
    }

    set Precio(value)
    {
        this.precio = value;
    }

    //PROPIEDADES GET

    get Id()
    {
        return this.id;
    }

    get Titulo()
    {
        return this.titulo;
    }

    get Transaccion()
    {
        return this.transaccion;
    }

    get Descripcion()
    {
        return this.descripcion;
    }

    get Precio()
    {
        return this.precio;
    }

    //#endregion

    //#region Métodos

    Equals(anuncio)
    {
        return (
            this.Titulo == anuncio.titulo && 
            this.Descripcion == anuncio.descripcion &&
            this.Precio == anuncio.precio && 
            this.Transaccion == anuncio.transaccion
            );
    }
    //#endregion
}
 
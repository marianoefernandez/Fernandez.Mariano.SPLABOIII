import { Anuncio_Auto } from "./anuncio_auto.js";
import { CrearTabla, CrearThead, CrearCheckBoxs } from "./tablaDinamica.js";

const URL = "http://localhost:3000/autos";

//#region Contenido  

const $selectFiltro = document.getElementById('selectorFiltro');

$selectFiltro.addEventListener('change',ActualizarTablaFiltros);

const anuncios = InicializarLista("anuncios");
let listaFiltrada = InicializarLista("anuncios");
anuncios.sort(OrdenarPorTitulo);
const cabecera = [];
let anunciosServer = [];//Guardo los anuncios del servidor
InicializarDatosServer(URL)//Inicializa los datos del db.json por si habia elementos en el LocalStorage antes.
const divSpinner = document.querySelector(".spinner");

const $divTabla = document.getElementById("divTabla");
const $divTablaFiltros = document.getElementById("filtroTabla");
const $divMensaje = document.getElementById("divMensaje");
const $divCheckBoxFiltros = document.getElementById("filtroCheckbox");
const $formulario = document.forms[0];
const $promedioPrecios = document.getElementById("promedioPrecios");

$divTabla.addEventListener("click",RetornarAnuncio);


const $btnGuardar = document.getElementById("btnGuardar");
const $btnEliminar = document.getElementById("btnEliminar");
const $btnCancelar = document.getElementById("btnCancelar");

let idElementoABorrar=-1;
let promedioAnterior=0;

$formulario.addEventListener("submit",AgregarElemento);//Boton guardar/modificar
$btnEliminar.addEventListener("click",EliminarElemento);//Boton Eliminar
$btnCancelar.addEventListener("click",CancelarSeleccion);//Boton Cancelar

cabecera.push(new Anuncio_Auto(0,"","","",0,0,0,0));//Para crear dinamicamente la cabecera de la tabla
$divCheckBoxFiltros.appendChild(CrearCheckBoxs(anuncios));
anuncios.length > 0 ? ActualizarTabla(anuncios,$divTabla) : CrearThead(cabecera);
listaFiltrada.length > 0 ? ActualizarTabla(listaFiltrada,$divTablaFiltros) : CrearThead(cabecera);
$promedioPrecios.value="N/A";

$divCheckBoxFiltros.addEventListener('change',(e)=>
{
    listaFiltrada = InicializarLista("anuncios");

    ManejarCheckBox();
    
    ActualizarTablaPorTransaccion($selectFiltro.value);
});

//#endregion

//#region Métodos

function RetornarAnuncio(e) 
{    
    //console.log(e.target.parentElement.dataset.id);
    if(e.target.matches("td"))
    {
        let anuncio = anuncios.find((objeto) => objeto.id == e.target.parentElement.dataset.id);
        CargarFormulario(anuncio);
        idElementoABorrar = anuncio.id;
        $btnEliminar.setAttribute("type","button");
        $btnCancelar.setAttribute("type","button");
        $btnGuardar.setAttribute("value","Modificar");
    }    
}

function CargarFormulario(anuncio) 
{
    const {txtId, txtTitulo, rdoTransaccion, txtDescripcion , txtPrecio, txtPuertas, txtKm, txtPotencia} = $formulario;

    txtId.value = anuncio.id;
    txtTitulo.value = anuncio.titulo;
    rdoTransaccion.value = anuncio.transaccion;
    txtDescripcion.value = anuncio.descripcion;
    txtPrecio.value = anuncio.precio;
    txtPuertas.value = anuncio.cantPuertas;
    txtKm.value = anuncio.cantKm;
    txtPotencia.value = anuncio.cantPotencia;
}

function LimpiarTabla(tabla) 
{
    while(tabla.hasChildNodes())
    {
        tabla.removeChild(tabla.firstElementChild);
    }
}

function ActualizarTabla(lista,tabla) 
{
    lista.sort(OrdenarPorTitulo);
    LimpiarTabla(tabla);
    tabla.appendChild(CrearTabla(lista));
}
 
async function AgregarElemento(e)
{
    e.preventDefault();

    const {txtId, txtTitulo, rdoTransaccion, txtDescripcion , txtPrecio, txtPuertas, txtKm, txtPotencia} = $formulario;
    const anuncioAux = new Anuncio_Auto(parseInt(txtId.value), txtTitulo.value, rdoTransaccion.value ,txtDescripcion.value, parseFloat(txtPrecio.value), parseInt(txtPuertas.value) , parseInt(txtKm.value), parseInt(txtPotencia.value));
    let mensaje = "No se agrego el anuncio debido a que es exactamente igual a otro anuncio de la lista.";


    if(txtId.value === "")
    {
        anuncioAux.Id = GenerarId(anuncios);

        if(!(EstaEnLista(anuncios,anuncioAux)))
        {
            await CrearAnuncioServer(anuncioAux);//AGREGO LOS DATOS AL SERVER
            AltaElemento(anuncios,anuncioAux,"anuncios");
            mensaje = "¡Anuncio agregado con éxito!";
        }
    }
    else
    {
        if(ModificarUnElemento(anuncios,anuncioAux,"anuncios"))
        {
            await ModificarAnuncioServer(anuncioAux);
            ActualizarTabla(anuncios,$divTabla);
            mensaje = "¡Anuncio modificado con éxito!";        }
        else
        {
            mensaje = "El anuncio es igual al anterior, no hay necesidad de modificarlo"; 
        }
    }
    console.log("HOLA?")

    setTimeout(() =>
    {
        ImprimirMensaje(2500,mensaje);
        ActualizarTabla(anuncios,$divTabla);
        $formulario.reset();   
        CancelarSeleccion(e);
    }, 3000);
}

function EliminarElemento(e) 
{
    e.preventDefault();
    let respuesta = confirm("¿Desea eliminar el anuncio?");
    let mensaje="¡Operacion Cancelada!";

    if (respuesta) 
    {
        if(idElementoABorrar != -1)
        {
            BorrarAnuncioServer(idElementoABorrar);
            DarDeBajaUnElemento(anuncios,idElementoABorrar,"anuncios");
            mensaje="¡Anuncio borrado con éxito!";
        }
        else
        {
            mensaje="¡No se pudo borrar el anuncio!";
        }
    }

    setTimeout(() => 
    {
        CancelarSeleccion(e);
        ImprimirMensaje(2500,mensaje);
        ActualizarTabla(anuncios,$divTabla);
    }, 3000);

}

function CancelarSeleccion(e) 
{
    const {txtId} = $formulario;

    txtId.value="";

    e.preventDefault();
    idElementoABorrar=-1;
    $btnEliminar.setAttribute("type","hidden");
    $btnCancelar.setAttribute("type","hidden");
    $btnGuardar.setAttribute("value","Guardar");
    $formulario.reset();
}

function ImprimirMensaje(tiempo,mensaje) 
{
    const $fragmento = document.createDocumentFragment();
    let $div1=document.createElement("div");
    let $div2=document.createElement("div");
    let $p=document.createElement("p");

    console.log("HOLA?")

    $div1.setAttribute("class","col-md-6");
    $div2.setAttribute("class","alert alert-success mt-5");
    $p.textContent = mensaje;

    $fragmento.appendChild($div1);
    $fragmento.appendChild($div2);
    $fragmento.appendChild($p);
    $divMensaje.appendChild($fragmento);

    setTimeout(function()
    { 
        $divMensaje.removeChild($p);
        $divMensaje.removeChild($div1);
        $divMensaje.removeChild($div2);
    }, tiempo);

}
//Me define si un objeto esta en la lista 
//necesito tener un método Equals para que funcione
function EstaEnLista(lista,objeto) 
{
    let retorno=false;

    lista.forEach(objetoAux => 
    {
        if(objeto.Equals(objetoAux))
        {
            retorno=true;
        }
    });

    return retorno;
}

function AltaElemento(lista,elemento,nombreElemento) 
{
    lista.push(elemento);
    ActualizarStorage(lista,nombreElemento);
}

function ModificarUnElemento(lista,elementoModificado,nombreElemento)
{
    let retorno=false;

    let indice = lista.findIndex((elemento)=>
    {
        return elemento.id == elementoModificado.id;
    });

    if(!(elementoModificado.Equals(lista[indice])))
    {
        lista.splice(indice,1);

        lista.push(elementoModificado);
    
        ActualizarStorage(lista,nombreElemento);

        retorno=true;
    }

    return retorno;
}


function DarDeBajaUnElemento(lista,idABorrar,nombreElemento) 
{
    let indiceABorrar = BuscarElementoPorId(idABorrar,lista);

    if(indiceABorrar != -1)
    {
        lista.splice(indiceABorrar,1);    
    }

    ActualizarStorage(lista,nombreElemento);

    return lista;
}

function EliminarDatos(nombreDeObjeto) 
{
    localStorage.removeItem(nombreDeObjeto);
}

function ActualizarStorage(elemento,nombreDeObjeto)
{
    localStorage.setItem(nombreDeObjeto,JSON.stringify(elemento));
}

//lista = Lista en la que voy a hardcodear los datos, nombreObjeto es el nombre del objeto en el localStorage
function HardcodearDatos(lista,nombreDeObjeto) 
{
    ActualizarStorage(lista,nombreDeObjeto);
}

function OrdenarPorTitulo(a,b) 
{
    let retorno = 0;

    if(a!=undefined && b!=undefined)
    {
        if(a.titulo > b.titulo)
        {
            retorno = 1;
        }
    
        if(a.titulo < b.titulo)
        {
            retorno = -1;
        }
    }

    return retorno;
}

function InicializarLista(nombreObjeto) 
{
    return JSON.parse(localStorage.getItem(nombreObjeto)) || [];    
}

function BuscarElementoPorId(id,lista)
{
    let index=-1;
    let len = lista.length;

    for (let i = 0; i < len; i++) 
    {
        if(lista[i].id == id)
        {
            index=i;
            break;
        }
    }

    return index;
}

//Para que esto funcione, el objeto debe tener el atributo id, sino no funcionara correctamente
function GenerarId(lista)
{
    let len=lista.length;
    let idAutoIncremental = JSON.parse(localStorage.getItem("idAutoIncremental")) || 0;

    if(len!=0)
    {
        idAutoIncremental = JSON.parse(localStorage.getItem("idAutoIncremental")) || lista[len-1].id;
    }

    idAutoIncremental++;

    ActualizarStorage(idAutoIncremental,"idAutoIncremental");

    return idAutoIncremental;   
}

async function ObtenerElementos(url) 
{
    try
    {
        const {data} = await axios.get(URL);
        anunciosServer = data;
    }
    catch(error)
    {
        console.error(error.response);
    }
}

async function AgregarElementoAsync(url,contenido)
{
    const options = 
    {
        method:"POST",
        headers:
        {
            "Content-type":"application/json"
        },
        data:JSON.stringify(contenido)
    };
        
    try
    {
        await axios(url,options);   
    }
    catch(error)
    {
        console.error(error.response);
    }
}

async function InicializarDatosServer(url)
{
    await ObtenerElementos(url);

    if(anunciosServer.length === 0)
    {
        anuncios.forEach(anuncio => 
        {
            AgregarElementoAsync(url,anuncio);
        });
    }
}

function GetSpinner()
{
    const spinner = document.createElement("img");
    spinner.setAttribute("src","./img/spinner.png");
    spinner.setAttribute("alt","loader");
    return spinner;
}

function LimpiarSpinner()
{
    while(divSpinner.hasChildNodes())
    {
        divSpinner.removeChild(divSpinner.firstChild);
    }
}

//ABM 

//AGREGAR AXIOS

async function CrearAnuncioServer(anuncio)
{
    const options = 
    {
        method:"POST",
        headers:
        {
            "Content-type":"application/json"
        },
        data:JSON.stringify(anuncio)
    };
    
    divSpinner.appendChild(GetSpinner());
    
    try
    {
        const {data} = await axios(URL,options);
    }
    catch(error)
    {
        console.error(error.response);
    }
    finally
    {
        LimpiarSpinner();
    }
}

//BORRAR FETCH CON PROMESAS

function BorrarAnuncioServer(id)
{
    const options = 
    {
        method:"DELETE",
    };
    
    divSpinner.appendChild(GetSpinner());
    fetch(URL + "/" + id,options)
    .then((res)=>res.ok?res.json():Promise.reject("Error " + res.status + ":" + res.statusText))
    .then((data)=>data)
    .catch((error)=>console.error(error))
    .finally(()=>LimpiarSpinner());
}

//MODIFICAR AJAX

function ModificarAnuncioServer(anuncioAModificar)
{
    const xhr = new XMLHttpRequest();
    divSpinner.appendChild(GetSpinner());

    xhr.addEventListener('readystatechange',()=>
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status > 199 && xhr.status < 300)
            {
                const data = JSON.parse(xhr.responseText);
            }
            else
            {
                console.log("Error" + xhr.status +  ":" + xhr.statusText);
            }
            LimpiarSpinner();
        }
    });    

    xhr.open("PUT", URL + "/" + anuncioAModificar.id);
    xhr.setRequestHeader("Content-type","application/json;charset=utf8")
    xhr.send(JSON.stringify(anuncioAModificar));
}

function ObtenerAnuncio(url,id)//Obtener un anuncio Axios con promesas
{
    axios.get(url + "/" + id)
    .then(({data})=>console.log(data))
    .catch((error)=>console.error(error.response))
}

function ActualizarTablaPorTransaccion(transaccion)
{
    LimpiarTabla($divTablaFiltros);
    listaFiltrada=InicializarLista("anuncios");
    transaccion != "Todos" ? listaFiltrada = listaFiltrada.filter((anuncio)=> anuncio.transaccion == transaccion) : listaFiltrada = listaFiltrada;

    if(listaFiltrada.length > 0)
    {        
        if(listaFiltrada.hasOwnProperty(transaccion))
        {
            CalcularPromedioDePrecio(listaFiltrada);
            ActualizarTabla(listaFiltrada,$divTablaFiltros);   
        }
        else
        {
            listaFiltrada = InicializarLista("anuncios");
            transaccion != "Todos" ? listaFiltrada = listaFiltrada.filter((anuncio)=> anuncio.transaccion == transaccion) : listaFiltrada = listaFiltrada;
            ManejarCheckBox();
            ActualizarTabla(listaFiltrada,$divTablaFiltros);
        }
    }
    else
    {
        LimpiarTabla($divTablaFiltros);
        const $p = document.createElement("p");
        $p.textContent = ("No hay elementos en la lista para la transacción " + transaccion);
        $divTablaFiltros.appendChild($p);
    }

    transaccion!="Todos" ? CalcularPromedioDePrecio(listaFiltrada) : $promedioPrecios.value="N/A"

}

function CalcularPromedioDePrecio(lista)
{
    let nuevaListaTemporal = InicializarLista("anuncios");
    $promedioPrecios.value = 0;

    if(lista.length>0)
    {
        if((lista[0].hasOwnProperty('precio')))
        {
            $promedioPrecios.value = lista.reduce((acumulador,actual)=>
            {
                return (acumulador + actual.precio);
            },0) / lista.length;
        }
        else//Por si en el checkbox deselecciono el precio
        {
            nuevaListaTemporal = nuevaListaTemporal.filter((anuncio)=> anuncio.transaccion == $selectFiltro.value);

            $promedioPrecios.value = nuevaListaTemporal.reduce((acumulador,actual)=>
            {
                return (acumulador + actual.precio);
            },0) / lista.length;
        }
    }
}

function ManejarCheckBox()//Funcion que maneja los checkbox
{
    let check = ($divCheckBoxFiltros.querySelectorAll(".checkBoxFiltro"));

    check.forEach(elemento => 
    {
        if(!elemento.checked)
        {
            listaFiltrada.map((anuncio)=>
            {
                delete (anuncio[elemento.value]);
            });
        }
    });
}

function ActualizarTablaFiltros(e)
{
    ActualizarTablaPorTransaccion(e.target.value);
}
//#endregion
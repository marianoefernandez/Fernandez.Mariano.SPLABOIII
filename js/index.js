import { Anuncio_Auto } from "./anuncio_auto.js";
import { CrearAnuncios } from "./anuncio_dinamico.js";

const URL = "http://localhost:3000/autos";


const anuncios = InicializarLista("anuncios");

ObtenerAnuncios(URL)

anuncios.sort(OrdenarPorTitulo);

const $sectionListaAnuncios = document.getElementById("listaAnuncios");

function CrearListaAnuncios(lista) 
{    
    lista.sort(OrdenarPorTitulo);
    $sectionListaAnuncios.appendChild(CrearAnuncios(lista));
}

function InicializarLista(nombreObjeto) 
{
    return JSON.parse(localStorage.getItem(nombreObjeto)) || [];    
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

function ObtenerAnuncios(url)//Funcion que carga en el index los anuncios, por AJAX
{
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange',()=>
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status > 199 && xhr.status < 300)
            {
                const data = JSON.parse(xhr.responseText);
                
                CrearListaAnuncios(data);
            }
            else
            {
                console.log("Error" + xhr.status +  ":" + xhr.statusText);
            }
        }
    });    

    xhr.open("GET", url);
    xhr.send();
}
import { Anuncio_Auto } from "./anuncio_auto.js";
import { CrearAnuncios } from "./anuncio_dinamico.js";

const anuncios = InicializarLista("anuncios");

anuncios.sort(OrdenarPorTitulo);

const $sectionListaAnuncios = document.getElementById("listaAnuncios");

CrearListaAnuncios(anuncios);

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
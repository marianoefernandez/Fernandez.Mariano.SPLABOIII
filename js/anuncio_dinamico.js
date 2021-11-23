//#region Métodos

export function CrearAnuncios(lista) 
{
    const $divAnuncios = document.createElement("div");
    const $fragmento = document.createDocumentFragment();

    lista.forEach(objeto => 
    {
        const $articulo = document.createElement("article");
        const $ul = document.createElement("ul");
        let $imagen = "./img/Puerta.png";
        const $a = document.createElement("a");
        $a.textContent="Ver vehiculo";
        $a.setAttribute("href","#");
        $a.setAttribute("class","verVehiculo");

        for (const dato in objeto) 
        {
            switch(dato)
            {
                case "id":
                    $articulo.setAttribute("data-id",parseInt(objeto[dato]));
                    break;

                case "titulo":
                case "descripcion":
                    let $etiqueta;

                    if(dato == "titulo")
                    {
                        $etiqueta = document.createElement("h3");
                    }
                    else
                    {
                        $etiqueta = document.createElement("p");
                    }

                    $etiqueta.textContent = objeto[dato];
                    $etiqueta.setAttribute("class",dato);
                    $fragmento.appendChild($etiqueta);
                    break;

                case "precio":
                    const $p = document.createElement("p");

                    $p.setAttribute("class",dato + "Index");
                    $p.textContent = ConvertirNumeros(objeto[dato],'en-US');
                    $fragmento.appendChild($p);
                    break;
                
                default:

                if(dato!= "transaccion")
                {
                    const $il = document.createElement("il");
                    const $span = document.createElement("span");
                    const $img = document.createElement("img");

                    $span.textContent = objeto[dato];
                    $img.setAttribute("src",dato);

                    switch(dato)
                    {
                        case "cantKm":
                            $imagen = "./img/Velocimetro.png";
                            break;

                        case "cantPotencia":
                            $span.textContent = ConvertirNumeros(objeto[dato],"de-DE");
                            $imagen = "./img/Motor.png";
                            break;
                    }

                    $img.setAttribute("src",$imagen);
                    $img.setAttribute("class","iconos");
                    
                    $il.appendChild($img);
                    $il.appendChild($span);

                    console.log($il);

                    $ul.appendChild($il);
                }
                    break;
            }
        }

        $fragmento.appendChild($ul);
        $fragmento.appendChild($a);
        $articulo.appendChild($fragmento);
        $divAnuncios.appendChild($articulo);
    });

    return $divAnuncios;

}

function ConvertirNumeros(numero,formato)
{
    return numero.toLocaleString(formato);
}
  

//#endregion
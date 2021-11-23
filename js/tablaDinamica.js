//#region Métodos
export function CrearThead(lista) 
{
    const $thead = document.createElement("thead");
    const $cabecera = document.createElement("tr");
    $cabecera.style.backgroundColor = "red";

    for (const dato in lista[0]) 
    {
        if(dato !== "id")
        {
            const th = document.createElement("th");
            const $contenido = document.createTextNode(dato);
            th.appendChild($contenido);
            $cabecera.appendChild(th);            
        }
    }

    $thead.appendChild($cabecera);

    return $thead;
}

function CrearTbody(lista) 
{
    const $tbody = document.createElement("tbody");

    lista.forEach(objeto => 
    {
        const $tr = document.createElement("tr");

        for (const dato in objeto) 
        {
            if(dato === "id")
            {
                $tr.setAttribute("data-id",parseInt(objeto[dato]));
            }
            else
            {
                const $td = document.createElement("td");
                $td.textContent = objeto[dato];

                switch(dato)
                {
                    case "precio":
                        $td.setAttribute("class",dato);
                        $td.textContent = ConvertirNumeros(objeto[dato],'de-DE');
                        break;

                    default:
                        if(!(isNaN(objeto[dato])))
                        {
                            $td.textContent = ConvertirNumeros(objeto[dato],'de-DE'); 
                        }  
                        break;
                }

                $tr.appendChild($td)
            }
        }
        $tbody.appendChild($tr);
    });
    return $tbody;
}

export function CrearTabla(lista) 
{
    const $tabla = document.createElement("table");
    $tabla.setAttribute("class","table table-bordered table-striped ")
    const $thead = CrearThead(lista);
    const $tbody = CrearTbody(lista);

    $tabla.appendChild($thead);
    $tabla.appendChild($tbody);

    return $tabla;
}

export function CrearCheckBoxs(lista) 
{
    const $div = document.createElement("div");
    const $fragmento = new DocumentFragment();

    for (const dato in lista[0]) 
    {
        if(dato !== "id")
        {
            const $checkbox = document.createElement("input");
            const $label = document.createElement("label");
            $label.textContent = dato;
            $checkbox.setAttribute("type","checkbox");
            $checkbox.setAttribute("name","chb" + dato);
            $checkbox.setAttribute("class","checkBoxFiltro");
            $checkbox.setAttribute("value",dato);
            $checkbox.setAttribute("checked","");
            $fragmento.appendChild($label);
            $fragmento.appendChild($checkbox);
        }
    }

    $div.appendChild($fragmento);

    return $div;
}

function ConvertirNumeros(numero,formato)
{
    return numero.toLocaleString(formato);
}
  

//#endregion
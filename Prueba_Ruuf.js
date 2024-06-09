function techoRectangular(anchoT, altoT, anchoP, altoP){
    let cantVertical = 0;
    //Calcular la cantidad de paneles de forma horizontal caben en el ancho del techo
    const nPanelesHorizontal = Math.trunc(anchoT / anchoP);
    
    //Calcular cuantas filas caben en lo alto del techo
    const filas = Math.trunc(altoT / altoP);
    //Calcular la cantidad total de paneles horizontales caben en el techo
    const cantHorizontal = nPanelesHorizontal * filas;
    
    //Calcular cuanto espacio en el ancho y el alto quedan disponible
    const espacioAncho = anchoT-nPanelesHorizontal*anchoP;
    const espacioAlto = altoT-filas*altoP;
   
    //Si queda espacio en el techo, se calculan cuantos paneles caben en ese espacio
    if(espacioAncho > 0){
        const nPanelesVertical = Math.trunc(espacioAncho / altoP);
        const columnas = Math.trunc(altoT / anchoP);
        cantVertical = nPanelesVertical * columnas;
    }
    if(espacioAlto > 0){   
        const nPanelesVertical = Math.trunc(espacioAlto / anchoP);
        const columnas = Math.trunc(anchoT / altoP);
        cantVertical = nPanelesVertical * columnas;
    }
    //Si no queda espacio, se devuelve la cantidad de paneles horizontales
    else{   
        return cantHorizontal;
    }
    //Se calcula el total de paneles horizontales y verticales que caben en el techo
    const total = cantHorizontal + cantVertical;
    return Math.trunc(total);
}



function techoTriangular(anchoT, altoT, anchoP, altoP){
    let rectangulo = rectanguloInscrito(anchoT, altoT);
    let paneles = techoRectangular(rectangulo[0], rectangulo[1], anchoP, altoP);
    let i = 0;
    while(i <= 0){
        const rectanguloNuevo = rectanguloInscrito(rectangulo[0], (altoT-rectangulo[1]));
        
        if(Math.trunc(rectanguloNuevo[0]) > 0 && Math.trunc(rectanguloNuevo[1]) > 0){
            for(let j=0; j<rectangulo.length; j++){
                rectangulo[j] = rectanguloNuevo[j];
                
            }
            const panelesExtra = techoRectangular(rectanguloNuevo[0], rectanguloNuevo[1], anchoP, altoP);
            paneles = paneles + panelesExtra;
        }
        else
            
            i++;
    }
    return paneles;
}

function rectanguloInscrito(base, altura){
    const x = base/2;
    const y = altura/2;
    return [x,y];
}



function techoSuperpuesto(anchoT, altoT, anchoP, altoP){
    /* Para los techos superpuestos los separo en techo A y techo B
     *      -El techo A corresponde a un techo rectangular normal
     *      -El techo B corresponde al otro techo rectangular, pero sin el area superpuesta. 
     *       Este techo se divide en 2 rectangulos más pequeños
    */
    //Calcular cuantos paneles caben en uno de los 2 rectangulos superpuestos
    const panelesTechoA = techoRectangular(anchoT, altoT, anchoP, altoP);
    
    //-------------------PARAMETRIZACIÓN-------------------
    //Para poder parametrizar la superposicion de los rectangulos se necesita el valor de la esquina inferior izquierda de cada uno de ellos
    //Coordenadas (x1, y1)
    const esquinaInferiorA = [1, 1];
    //Coordenadas (x2, y2)
    const esquinaInferiorB = [4, 2];
    
    //Con los valores de las esquinas de cada rectangulo podemos calcular los limites necesarios para la parametrización
    //Se calcula el limite izquierdo buscando el valor maximo de las coordenadas 'x' de las esquinas inferiores izqiuierdas
    const limiteIzquierdo = esquinaInferiorA[0] > esquinaInferiorB[0] ? esquinaInferiorA[0] : esquinaInferiorB[0];
    //Se calcula el limite derecho buscando el valor minimo de las coordenadas 'x' de las esquinas superiores derechas --> (x1 + ancho del techo) y (x2 + ancho del techo)
    const limiteDerecho = (esquinaInferiorA[0] + anchoT) < (esquinaInferiorB[0] + anchoT) ? esquinaInferiorA[0] + anchoT : esquinaInferiorB[0] + anchoT;
    //Se calcula el limite inferior buscando el valor maximo de las coordenadas 'y' de las esquinas inferiores izquierdas
    const limiteInferior = esquinaInferiorA[1] > esquinaInferiorB[1] ? esquinaInferiorA[1] : esquinaInferiorB[1];
    //Se calcula el limite derecho buscando el valor minimo de las coordenadas 'y' de las esquinas superiores derechas --> (y1 + alto del techo) y (y2 + alto del techo)
    const limiteSuperior = (esquinaInferiorA[1] + altoT) < (esquinaInferiorB[1] + altoT) ? esquinaInferiorA[1] + altoT : esquinaInferiorB[1] + altoT;
    
    //Verificar que exista interseccion entre los 2 rectángulos
    if(limiteIzquierdo > limiteDerecho && limiteInferior > limiteSuperior){
        return "No se encontro una intersección valida";
    }

    //Con los limites calculados anteriormente se pueden calcular el ancho y alto de la superposición
    const anchoSuperposicion = limiteDerecho - limiteIzquierdo;
    const altoSuperposicion = limiteSuperior - limiteInferior;

    //El techo B se divide en 2 rectangulos más pequeños
    const techoB1 = [anchoT - anchoSuperposicion, altoT];
    const techoB2 = [anchoSuperposicion, altoT - altoSuperposicion];

    //Se calculan cuantos paneles caben en cada rectangulo pequeños del techo B
    const panelesTechoB1 = techoRectangular(techoB1[0], techoB1[1], anchoP, altoP);
    const panelesTechoB2 = techoRectangular(techoB2[0], techoB2[1], anchoP, altoP);

    //Se calcula el total de paneles que caben en el techo B
    const panelesTechoB = panelesTechoB1 + panelesTechoB2;
    //Se suman los paneles del techo A y B para saber cuantos paneles caben en total
    return Math.trunc(panelesTechoA + panelesTechoB); 
}

function cantidadPaneles(baseTecho, altoTecho, anchoPanel, altoPanel, techo){
    let cant = 0;
    //Verificar que las dimensiones del techo y los paneles sean validas (que sean reales y no una fantasia en nuestras cabezas)
    if(baseTecho == 0 || altoTecho == 0 || anchoPanel == 0 || altoPanel == 0){
        return "Las dimensiones no son validas";
    }
    //Luego de verificar la existencia del techo y los paneles se ira a la función correspondiente según el tipo de techo ingresado
    else{
        switch(techo){
            case 'Rectangular':
                cant = techoRectangular(baseTecho, altoTecho, anchoPanel, altoPanel);
                break;
            case 'Triangular':
                cant = techoTriangular(baseTecho, altoTecho, anchoPanel, altoPanel);
                break;
            case 'Superpuesto':
                cant = techoSuperpuesto(baseTecho, altoTecho, anchoPanel, altoPanel);
                break;
            default:
                return 'Tipo de techo no disponible';
        }
        return [cant, techo];
    }
    
}

/*  Ingresar los datos necesarios para calcular la cantidad de paneles que se necesitaran para el techo
 *      Los primeros 2 valores son las dimensiones del techo --> ancho x alto
 *      Los siguientes 2 valores corresponden a las dimensiones de los paneles --> ancho x alto
 *      Finalmente se ingresa el tipo de techo que corresponda teniendo 3 opciones:
 *          -Rectangular
 *          -Triangular
 *          -Superpuesto
 */
const resultado = cantidadPaneles(5, 3, 1, 2, 'Triangular');
console.log("Tu techo", resultado[1], "tiene el espacio disponible para", resultado[0], "paneles");
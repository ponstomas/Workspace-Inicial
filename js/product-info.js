//Inicio Agregado
const listaEstrellas = [...document.getElementsByClassName("fa-star")];         // Traigo del html una lista con las 5 estrellas
let posicion;

function pintarEstrellas() {       
    const pintada = "fa fa-star checked";
    const vacia = "fa fa-star";
    let i;

    listaEstrellas.map((estrella) => {                       // Uso map para iterar sobre los elementos del array (cada estrella) y modificarlos (pintarlos)
        estrella.addEventListener('click', () => {           // Escucho el click sobre las estrellas vacias
            i = listaEstrellas.indexOf(estrella);            // Le asigno a i el numero de lugar en el que se encuentra la estrella que se clickeo
    
            if (estrella.className===vacia) {                                   // Condicional que calcula cuntas estrellas pintar asignandole la clase correspondiente
                for (i; i >= 0; --i) listaEstrellas[i].className = pintada;
            } else {
                for (i; i < listaEstrellas.length; ++i) listaEstrellas[i].className = vacia;
            }
        });   
    });
};

pintarEstrellas();


//Fin Agregado
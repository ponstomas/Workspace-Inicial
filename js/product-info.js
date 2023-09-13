//Inicio Agregado

const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista');
const btn = document.getElementById('btn');
const listaEstrellas = [...document.getElementsByClassName("fa-star")];


formulario.addEventListener('submit', e => {
    e.preventDefault()
    // const puntuacion = document.getElementById('puntuacion').value;
    const opinion = document.getElementById('opinion').value;

    // let contador = 0;
    // let starClass = "";

    // for (let i = 0; i < puntuacion; i++) {
    //     starClass += '<span class="fa fa-star checked"></span>';
    //     contador++;
    // }
    // for (let i = contador; i < 5; i++) {
    //     starClass += '<span class="fa fa-star"></span>';
    // }

    lista.innerHTML += `<li class="list-group-item">
    ${opinion} 
    </li>`

})

function pintarEstrellas() {
    const pintada = "fa fa-star checked";
    const vacia = "fa fa-star";
    let i;

    listaEstrellas.map((estrella) => {

        estrella.addEventListener('click', () => {
            i = listaEstrellas.indexOf(estrella)

            if (estrella.className === vacia) {
                for (i; i >= 0; i--) {
                    listaEstrellas[i].className = pintada;                  
                };
            }
            else {
                for (i; i < listaEstrellas.length; i++) {
                    listaEstrellas[i].className = vacia;
                };
            };
        });
    });
};

pintarEstrellas()



//Fin Agregado






const api_url = 'https://pokeapi.co/api/v2/';
let randomPokemon = null; 

function generarPokemonAleatorio() {
    // Generamos un número aleatorio entre 1 y 151
    const pokemonId = Math.floor(Math.random() * 151) + 1;

    // Hacemos la petición a la API para obtener los datos del Pokémon
    fetch(`${api_url}pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(data => {
            // Guardamos el Pokémon generado en la variable
            randomPokemon = data;

            // Mostramos el Pokémon en la consola (sin mostrarlo en la interfaz)
            console.log('Pokémon generado al azar:', randomPokemon.name);
            console.log('Detalles del Pokémon:', randomPokemon);
        })
        .catch(error => {
            console.error("Error al generar el Pokémon:", error);
        });
}

// Llamamos a la función para generar el Pokémon aleatorio cuando se carga la página
window.onload = function() {
    generarPokemonAleatorio();
};

function adivinarPokemon() {
    const pokemonName = document.getElementById("pokemon-name").value.toLowerCase();
    
    fetch(`${api_url}pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            // Obtenemos los detalles del Pokémon introducido por el usuario
            const sprite = data.sprites.front_default;
            const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const type1 = data.types[0].type.name;
            const type2 = data.types[1] ? data.types[1].type.name : 'Ninguno';
            
            // Traducimos los tipos
            const translatedType1 = traducir(type1);
            const translatedType2 = traducir(type2);
            
            // Obtenemos la etapa evolutiva real del Pokémon
            getEvolutionStage(data.species.url).then(evolutionStage => {
                // Verificamos si la tabla ya existe o si necesitamos crearla
                let pokemonTableDiv = document.querySelector('.pokemon-table-container');
                if (!pokemonTableDiv) {
                    // Creamos el contenedor de la tabla solo una vez
                    pokemonTableDiv = document.createElement('div');
                    pokemonTableDiv.classList.add('pokemon-table-container');
                    
                    // Agregamos el encabezado de la tabla
                    pokemonTableDiv.innerHTML = `
                        <table class="pokemon-table">
                            <thead>
                                <tr>
                                    <th>Sprite</th>
                                    <th>Nombre</th>
                                    <th>Tipo 1</th>
                                    <th>Tipo 2</th>
                                    <th>Etapa Evolutiva</th>
                                </tr>
                            </thead>
                            <tbody id="pokemon-table-body">
                            </tbody>
                        </table>
                    `;
                    document.getElementById('pokemonInfo').appendChild(pokemonTableDiv);
                }
                
                // Ahora añadimos la nueva fila con la información del Pokémon
                const tableBody = document.getElementById('pokemon-table-body');
                
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td><img class="pokemon-sprite" src="${sprite}" alt="Sprite de ${name}" /></td>
                    <td>${name}</td>
                    <td>${translatedType1}</td>
                    <td>${translatedType2}</td>
                    <td>${evolutionStage}</td>
                `;
                
                tableBody.appendChild(newRow);

                // Comparamos cada atributo del Pokémon introducido con el Pokémon generado al azar
                if (randomPokemon) {
                    const randomName = randomPokemon.name;
                    const randomType1 = randomPokemon.types[0].type.name;
                    const randomType2 = randomPokemon.types[1] ? randomPokemon.types[1].type.name : 'Ninguno';
                    
                    // Obtenemos la etapa evolutiva del Pokémon generado al azar
                    getEvolutionStage(randomPokemon.species.url).then(randomEvolutionStage => {
                        // Comparación de atributos
                        const isNameMatch = name.toLowerCase() === randomName.toLowerCase();
                        const isType1Match = translatedType1 === traducir(randomType1);
                        const isType2Match = translatedType2 === traducir(randomType2);
                        const isEvolutionMatch = evolutionStage === randomEvolutionStage;

                        // Resaltamos las celdas según si coinciden o no
                        const cells = newRow.querySelectorAll('td');
                        cells[1].style.backgroundColor = isNameMatch ? 'lightgreen' : 'lightcoral'; // Nombre
                        cells[2].style.backgroundColor = isType1Match ? 'lightgreen' : 'lightcoral'; // Tipo 1
                        cells[3].style.backgroundColor = isType2Match ? 'lightgreen' : 'lightcoral'; // Tipo 2
                        cells[4].style.backgroundColor = isEvolutionMatch ? 'lightgreen' : 'lightcoral'; // Etapa evolutiva

                        // Verificamos si todos los atributos coinciden
                        if (isNameMatch && isType1Match && isType2Match && isEvolutionMatch) {
                            // Mostramos un mensaje de felicitaciones
                            mostrarMensajeFelicitaciones();
                        }
                    });
                }
            });
        })
        .catch(error => {
            alert("Pokémon no encontrado. Intenta de nuevo.");
        });
}

// Función para mostrar un mensaje de felicitaciones
function mostrarMensajeFelicitaciones() {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('mensaje-felicitaciones');
    mensajeDiv.innerHTML = `
        <p>¡Felicidades! ¡Has adivinado el Pokémon correctamente!</p>
        <button onclick="reiniciarJuego()">Jugar de nuevo</button>
    `;
    document.body.appendChild(mensajeDiv);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Limpiamos la tabla y el mensaje de felicitaciones
    const pokemonTableDiv = document.querySelector('.pokemon-table-container');
    if (pokemonTableDiv) {
        pokemonTableDiv.remove();
    }
    const mensajeDiv = document.querySelector('.mensaje-felicitaciones');
    if (mensajeDiv) {
        mensajeDiv.remove();
    }

    // Generamos un nuevo Pokémon aleatorio
    generarPokemonAleatorio();
}

// Función para obtener la etapa evolutiva correcta
async function getEvolutionStage(speciesUrl) {
    // Obtenemos la URL de la cadena evolutiva desde los datos de la especie
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;
    
    // Obtenemos la cadena evolutiva completa
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();
    
    // Analizamos la cadena evolutiva
    let evolutionStage = 0;
    let currentSpecies = evolutionChainData.chain;
    
    // Comprobamos en qué etapa se encuentra el Pokémon
    while (currentSpecies) {
        if (currentSpecies.species.name === speciesData.name) {
            break; // Encontramos el Pokémon en la cadena
        }
        evolutionStage++; // Incrementamos el nivel de evolución
        currentSpecies = currentSpecies.evolves_to[0]; // Pasamos a la siguiente etapa evolutiva
    }
    
    return `Etapa ${evolutionStage + 1}`; // Ajustamos para que comience desde 1
}

// Función para traducir los tipos de Pokémon al español
function traducir(types) {
    const tiposTraducidos = {
        "normal": "Normal",
        "fire": "Fuego",
        "water": "Agua",
        "electric": "Eléctrico",
        "grass": "Planta",
        "ice": "Hielo",
        "fighting": "Lucha",
        "poison": "Veneno",
        "ground": "Tierra",
        "flying": "Volador",
        "psychic": "Psíquico",
        "bug": "Bicho",
        "rock": "Roca",
        "ghost": "Fantasma",
        "dragon": "Dragón",
        "dark": "Siniestro",
        "steel": "Acero",
        "fairy": "Hada"
    };

    return types
        .split(', ')  // Si hay más de un tipo, lo dividimos
        .map(type => tiposTraducidos[type.toLowerCase()] || type)  // Traducimos a español
        .join(', ');  // Unimos los tipos de nuevo en una cadena
}


const api_url = 'https://pokeapi.co/api/v2/';

function clickenBoton_SearchPokemon() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    const pokemonInfoDiv = document.getElementById('pokemonInfo');
  
    // Limpiar el contenido anterior
    pokemonInfoDiv.innerHTML = `
        <div class="pokemon-grid">
            <div class="pokemon-details">
                <img class="pokemon-sprite" src="" alt="Sprite Pokémon">
                <h3 class="pokemon-name"></h3>
                <p class="pokemon-types"></p>
            </div>
            <div class="pokemon-evolutions">
                <h3>Linea evolutiva:</h3>
                <div class="evolutions"></div>
            </div>
        </div>
    `;
  
    // Mostrar el contenedor de información del Pokémon
    pokemonInfoDiv.style.display = 'block';
  
    // Hacer la solicitud a la API para obtener la información básica del Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        })
        .then(data => {
            const name = data.name;
            let types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
            types = traducir(types); // Traducir los tipos
            const sprite = data.sprites.front_default; // URL del sprite frontal
  
            // Mostrar el nombre, los tipos y el sprite del Pokémon
            const pokemonNameElement = pokemonInfoDiv.querySelector('.pokemon-name');
            const pokemonTypesElement = pokemonInfoDiv.querySelector('.pokemon-types');
            const pokemonSpriteElement = pokemonInfoDiv.querySelector('.pokemon-sprite');
  
            pokemonNameElement.textContent = name;
            pokemonTypesElement.textContent = `Tipos: ${types}`;
            pokemonSpriteElement.src = sprite;
            pokemonSpriteElement.alt = name;
  
            // Obtener la especie del Pokémon para obtener la cadena de evolución
            return fetch(data.species.url);
        })
        .then(response => response.json())
        .then(speciesData => {
            // Obtener la URL de la cadena de evolución
            return fetch(speciesData.evolution_chain.url);
        })
        .then(response => response.json())
        .then(evolutionData => {
            // Extraer la cadena de evolución
            const evolutionChain = getEvolutionChain(evolutionData.chain);
  
            // Mostrar las evoluciones
            const evolutionsDiv = pokemonInfoDiv.querySelector('.evolutions');
            if (evolutionChain.length > 1) {
                evolutionsDiv.innerHTML = renderEvolutionChain(evolutionData.chain);
            } else {
                evolutionsDiv.innerHTML = `<p class="no-evolutions">No tiene evoluciones.</p>`;
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
            pokemonInfoDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
  }

// Función para obtener la cadena de evolución
function getEvolutionChain(chain) {
  const evolutions = [];

  // Función recursiva para recorrer todas las ramas
  function traverse(currentChain) {
      if (!currentChain) return;

      // Agregar el nombre del Pokémon actual
      evolutions.push(currentChain.species.name);

      // Si hay múltiples evoluciones, recorrer cada una
      if (currentChain.evolves_to.length > 0) {
          currentChain.evolves_to.forEach(evolution => {
              traverse(evolution); // Llamada recursiva para cada evolución
          });
      }
  }

  // Iniciar el recorrido desde la cadena principal
  traverse(chain);

  return evolutions;
}

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
      .split(', ')
      .map(type => tiposTraducidos[type.toLowerCase()] || type)
      .join(', ');
}

// Función para generar el HTML de la cadena de evolución
function renderEvolutionChain(chain) {
  if (!chain.evolves_to.length) {
      return `
          <div class="evolution-node">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(chain.species.url)}.png" alt="${chain.species.name}">
              <p>${chain.species.name}</p>
          </div>
      `;
  }

  return `
      <div class="evolution-chain">
          <div class="evolution-node">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(chain.species.url)}.png" alt="${chain.species.name}">
              <p>${chain.species.name}</p>
          </div>
          <span class="evolution-arrow">→</span>
          <div class="evolution-branch">
              ${chain.evolves_to.map(evolution => renderEvolutionChain(evolution)).join('')}
          </div>
      </div>
  `;
}

// Función para obtener el ID de un Pokémon desde su URL
function getPokemonId(url) {
  const matches = url.match(/\/pokemon-species\/(\d+)\//);
  return matches ? matches[1] : null;
}

document.getElementById("randomPokemonButton").addEventListener("click", function () {
    const randomId = Math.floor(Math.random() * 1025) + 1; // Número aleatorio entre 1 y 1025
    document.getElementById("pokemonName").value = randomId; // Opcional: Mostrar el número en el input
    clickenBoton_SearchPokemon(); // Llamar a la función existente
});
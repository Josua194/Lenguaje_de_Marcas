let currentGeneration = 1;
const generations = [
    { name: "Generación 1", starters: [1, 4, 7] }, 
    { name: "Generación 2", starters: [152, 155, 158] }, 
    { name: "Generación 3", starters: [252, 255, 258] },
    { name: "Generación 4", starters: [387, 390, 393] },
    { name: "Generación 5", starters: [495, 498, 501] },
    { name: "Generación 6", starters: [650, 653, 656] },
    { name: "Generación 7", starters: [722, 725, 728] },
    { name: "Generación 8", starters: [810, 813, 816] },
    { name: "Generación 9", starters: [906, 909, 912] }
];

function loadGeneration(generation) {
    const table = document.querySelector("table");
    const caption = table.querySelector("caption");
    const tbody = table.querySelector("tbody");

    // Actualiza el título de la generación
    caption.textContent = generation.name;

    // Borra las filas anteriores
    tbody.innerHTML = "";

    // Realiza solicitudes a la API para obtener solo los Pokémon iniciales de la generación
    generation.starters.forEach(id => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => {
                const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1); // Capitaliza el nombre
                const pokemonImage = data.sprites.front_default; // Obtiene la imagen del Pokémon

                // Crea una fila en la tabla con el nombre y la imagen
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${pokemonName}</td>
                    <td><img src="${pokemonImage}" alt="${pokemonName}"></td>
                `;
                tbody.appendChild(row);
            })
            .catch(error => {
                console.error('Hubo un error con la API:', error);
            });
    });
}

// Botón de "Siguiente"
document.getElementById("nextButton").addEventListener("click", () => {
    currentGeneration = (currentGeneration === generations.length) ? 1 : currentGeneration + 1;
    loadGeneration(generations[currentGeneration - 1]);
});

// Botón de "Anterior"
document.getElementById("prevButton").addEventListener("click", () => {
    currentGeneration = (currentGeneration === 1) ? generations.length : currentGeneration - 1;
    loadGeneration(generations[currentGeneration - 1]);
});

// Cargar la primera generación al cargar la página
loadGeneration(generations[currentGeneration - 1]);
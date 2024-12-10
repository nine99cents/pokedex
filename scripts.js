let currentPokemonIndex = 1; // Start with the first Pokémon (Bulbasaur)
const totalPokemon = 898; // Total number of Pokémon (as of now)
let currentPokemonCries = {}; // Store the current Pokémon's cries

// Fetch Pokémon data from PokeAPI
function fetchPokemon(idOrName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`)
        .then(response => response.json())
        .then(data => {
            loadPokemonData(data);
            currentPokemonIndex = data.id; // Update the currentPokemonIndex to the fetched Pokémon's ID
            showTab('random'); // Switch to the Pokémon card tab
        })
        .catch(error => console.error('Error:', error));
}

// Load Pokémon data into the card
function loadPokemonData(pokemon) {
    document.getElementById('pokemonName').innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('pokemonNumber').innerText = `#${pokemon.id}`;
    document.getElementById('pokemonType').innerText = pokemon.types.map(type => type.type.name).join(', ');
    document.getElementById('pokemonHeight').innerText = `${pokemon.height / 10}m`;
    document.getElementById('pokemonWeight').innerText = `${pokemon.weight / 10}kg`;
    document.getElementById('pokemonAbilities').innerText = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    document.getElementById('pokemonImage').src = pokemon.sprites.front_default;

    // Update forms dropdown
    const formSelect = document.getElementById('formSelect');
    formSelect.innerHTML = '';
    pokemon.forms.forEach(form => {
        const option = document.createElement('option');
        option.value = form.name;
        option.innerText = form.name.charAt(0).toUpperCase() + form.name.slice(1);
        formSelect.appendChild(option);
    });

    // Update cries dropdown and store cries URLs
    const crySelect = document.getElementById('crySelect');
    crySelect.innerHTML = '';
    currentPokemonCries = pokemon.cries || {}; // Store the cries URLs
    Object.keys(currentPokemonCries).forEach(cry => {
        const option = document.createElement('option');
        option.value = cry;
        option.innerText = cry.charAt(0).toUpperCase() + cry.slice(1);
        crySelect.appendChild(option);
    });

    // Change background color based on Pokémon type
    const pokemonCard = document.querySelector('.pokemon-card');
    pokemonCard.className = 'pokemon-card'; // Reset class list
    const primaryType = pokemon.types[0].type.name;
    pokemonCard.classList.add(primaryType);
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(tab).style.display = 'block';
}

function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * totalPokemon) + 1;
    fetchPokemon(randomId);
}

function previousPokemon() {
    if (currentPokemonIndex > 1) {
        currentPokemonIndex--;
        fetchPokemon(currentPokemonIndex);
    }
}

function nextPokemon() {
    if (currentPokemonIndex < totalPokemon) {
        currentPokemonIndex++;
        fetchPokemon(currentPokemonIndex);
    }
}

function playCry() {
    const crySelect = document.getElementById('crySelect').value;
    const audioUrl = currentPokemonCries[crySelect];
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    } else {
        alert('Cry not available');
    }
}

function searchByName() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    console.log(`Searching by name: ${searchInput}`); // Debugging statement
    if (searchInput) {
        fetchPokemon(searchInput);
    } else {
        alert('Please enter a valid Pokémon name.');
    }
}

function searchByNumber() {
    const searchInput = document.getElementById('searchInput').value.trim();
    console.log(`Searching by number: ${searchInput}`); // Debugging statement
    if (!isNaN(searchInput) && searchInput > 0 && searchInput <= totalPokemon) {
        fetchPokemon(searchInput);
    } else {
        alert('Please enter a valid Pokémon number.');
    }
}

// Initial load of the first Pokémon
fetchPokemon(currentPokemonIndex);

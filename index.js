
const getPokemon = () => { // Fetching the first 20 pokemon from the Pokemon API.
    fetch('https://pokeapi.co/api/v2/pokemon')
    .then(response => response.json())
    .then((fetchedPokemon) => {
        fetchedPokemon.results.forEach((pokemon) => { 
            fetchEachPokemon(pokemon); 
        });
    });
};

const fetchEachPokemon = (pokemon) => { // Using the individual URLs for each pokemon to fetch further information for their template.
    let pokeUrl = pokemon.url; // <-- Individual URL; example: https://pokeapi.co/api/v2/pokemon/1/

    fetch(pokeUrl)
    .then(response => response.json())
    .then((fetchedPokemon) => {
        renderPokemonTemplate(fetchedPokemon);
    });
};

const renderPokemonTemplate = (fetchedPokemon) => { 
    let pokemonTemplateContainer = document.getElementById('pokemon-container'); // Calling for the container wrapping all templates. 

    let pokemonTemplate = document.createElement('div'); // Render individual template container for each pokemon.
    pokemonTemplate.classList.add('pokemon-template');
    pokemonTemplate.id = fetchedPokemon.id;

    let pokemonImg = document.createElement('img'); // Render Pokemon avatar
    pokemonImg.className = 'poke-avatar';
    pokemonImg.srcset = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fetchedPokemon.id}.png`; // URL to default pokemon avatar.

    let pokemonName = document.createElement('h2'); // Render name
    pokemonName.className = 'pokemon-name';
    pokemonName.innerText = capitalize(fetchedPokemon.name);

    let pokemonAbililty = document.createElement('p');  // Render Pokemon ability p element

    for (let i = 0; i < fetchedPokemon.abilities.length; i++) { 

        // Loop going through all the Pokemon's abilities and checking for the first one that the property is_hidden is false.

        if (!fetchedPokemon.abilities[i].is_hidden) {
        pokemonAbililty.innerText = `Ability: ${capitalize(fetchedPokemon.abilities[i].ability.name)}`;
        };
    };

    let pokemonMoves = document.createElement('div');  // Rendering div element to contain the rendered moves.
    pokemonMoves.classList.add('moves-list');

    setMovesList(fetchedPokemon, pokemonMoves); // Render moves list.

    let pokemonSpeed = document.createElement('p'); // Render Pokemon speed.
    pokemonSpeed.id = 'pokemon-speed';
    pokemonSpeed.innerText = `Speed: ${fetchedPokemon.stats[5].base_stat}`;

    let pokemonSpDef = document.createElement('p'); // Render Pokemon special defence.
    pokemonSpDef.id = 'pokemon-sp-def';
    pokemonSpDef.innerText = `Special Defence: ${fetchedPokemon.stats[4].base_stat}`;

    let pokemonSpAtt = document.createElement('p'); // Render Pokemon special attack.
    pokemonSpAtt.id = 'pokemon-sp-att';
    pokemonSpAtt.innerText = `Special Attack: ${fetchedPokemon.stats[3].base_stat}`;

    let pokemonDef = document.createElement('p'); // Render Pokemon defence.
    pokemonDef.id = 'pokemon-def';
    pokemonDef.innerText = `Defence: ${fetchedPokemon.stats[2].base_stat}`;

    let pokemonAttack = document.createElement('p'); // Render Pokemon attack.
    pokemonAttack.id = 'pokemon-att';
    pokemonAttack.innerText = `Attack: ${fetchedPokemon.stats[1].base_stat}`;

    let pokemonHp = document.createElement('p'); // Render Pokemon health points.
    pokemonHp.id = 'pokemon-hp';
    pokemonHp.innerText = `HP: ${fetchedPokemon.stats[0].base_stat}`;

    pokemonTemplate.append( // Appeding all the details to the Pokemon template.
        pokemonImg,
        pokemonName,
        pokemonAbililty,
        pokemonMoves,
        pokemonSpeed,
        pokemonSpDef,
        pokemonSpAtt,
        pokemonDef,
        pokemonAttack,
        pokemonHp
    );
    pokemonTemplateContainer.appendChild(pokemonTemplate); // Appending each template container that holds each Pokemon's details to the main div container.


};

const setMovesList = (pokemon, div) => { // Function to get the first four moves from the Pokemons moves list.

    for (let i = 0; i <= 3; i++) {
        let pokemonMove = document.createElement('p'); 
        pokemonMove.innerText = `Move #${i+1}: ${capitalize(pokemon.moves[i].move.name)}`; // Setting move number and name.
        div.append(pokemonMove);
    };
};

const capitalize = word => { // Change the first letter of a given word to upper case.
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalizedWord;
}

getPokemon(); // Render all Pokemon templates. 
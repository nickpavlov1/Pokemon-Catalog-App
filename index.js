const getPokemon = () => { // Fetching the first 20 pokemon from the Pokemon API.
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json())
    .then((fetchedPokemon) => {
        fetchedPokemon.results.forEach((pokemon) => { 
            fetchEachPokemon(pokemon); 
        });
    });
};

const fetchEachPokemon = pokemon => { // Using the individual URLs for each pokemon to fetch further information for their template.
    const pokeUrl = pokemon.url; // <-- Individual URL; example: https://pokeapi.co/api/v2/pokemon/1/

    fetch(pokeUrl)
    .then(response => response.json())
    .then((fetchedPokemon) => {
        renderPokemonTemplate(fetchedPokemon);
    });
};

const renderPokemonTemplate = fetchedPokemon => { 
    const pokemonTemplateContainer = document.getElementById('pokemon-container'); // Calling for the container wrapping all templates. 

    const pokemonTemplate = document.createElement('div'); // Render individual template container for each pokemon.
    pokemonTemplate.classList.add('pokemon-template');
    pokemonTemplate.id = fetchedPokemon.id;

    const pokemonImg = document.createElement('img'); // Render Pokemon avatar
    pokemonImg.id = 'poke-avatar';
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fetchedPokemon.id}.png`; // URL to default pokemon avatar.

    const pokemonAttackImg = document.createElement('img'); 
    pokemonAttackImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${fetchedPokemon.id}.png`;
    pokemonAttackImg.style.display = 'none';

    const pokemonName = document.createElement('h2'); // Render name
    pokemonName.id = 'pokemon-name';
    pokemonName.innerText = capitalize(fetchedPokemon.name);

    const pokemonAbililty = document.createElement('p');  // Render Pokemon ability p element
    pokemonAbililty.className = 'poke-stats';
    for (let i = 0; i < fetchedPokemon.abilities.length; i++) { 

        // Loop going through all the Pokemon's abilities and checking for the first one that the property is_hidden is false.

        if (!fetchedPokemon.abilities[i].is_hidden) {
        pokemonAbililty.innerText = `Ability: ${capitalize(fetchedPokemon.abilities[i].ability.name)}`;
        };
    };

    const pokemonMoves = document.createElement('div');  // Rendering div element to contain the rendered moves.
    pokemonMoves.className = 'poke-stats';

    setMovesList(fetchedPokemon, pokemonMoves); // Render moves list.

    const pokemonSpeed = document.createElement('p'); // Render Pokemon speed.
    pokemonSpeed.className = 'poke-stats';
    pokemonSpeed.innerText = `Speed: ${fetchedPokemon.stats[5].base_stat}`;

    const pokemonSpDef = document.createElement('p'); // Render Pokemon special defence.
    pokemonSpDef.className = 'poke-stats';
    pokemonSpDef.innerText = `Special Defence: ${fetchedPokemon.stats[4].base_stat}`;

    const pokemonSpAtt = document.createElement('p'); // Render Pokemon special attack.
    pokemonSpAtt.className = 'poke-stats';
    pokemonSpAtt.innerText = `Special Attack: ${fetchedPokemon.stats[3].base_stat}`;

    const pokemonDef = document.createElement('p'); // Render Pokemon defence.
    pokemonDef.className = 'poke-stats';
    pokemonDef.innerText = `Defence: ${fetchedPokemon.stats[2].base_stat}`;

    const pokemonAttack = document.createElement('p'); // Render Pokemon attack.
    pokemonAttack.className = 'poke-stats';
    pokemonAttack.innerText = `Attack: ${fetchedPokemon.stats[1].base_stat}`;

    const pokemonHp = document.createElement('p'); // Render Pokemon health points.
    pokemonHp.className = 'poke-stats';
    pokemonHp.innerText = `HP: ${fetchedPokemon.stats[0].base_stat}`;

    pokemonTemplate.append( // Appeding all the details to the Pokemon template.
        pokemonImg,
        pokemonAttackImg,
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

    selectPokemon(pokemonTemplate); // Click event to select a Pokemon to fight a random Pokemon from the catalog.

    pokemonTemplateContainer.appendChild(pokemonTemplate); // Appending each template container that holds each Pokemon's details to the main div container.

};

const setMovesList = (pokemon, div) => { // Function to get the first four moves from the Pokemons moves list.

    if (pokemon.name === 'ditto') { // Exception case for this Pokemon since it doesn't have more than one move.
        const pokemonMove = document.createElement('p');
        pokemonMove.innerText = `Move #1: ${capitalize(pokemon.moves[0].move.name)}`; 
        div.append(pokemonMove);
    } else {
        for (let i = 0; i <= 3; i++) {
            const pokemonMove = document.createElement('p');
            pokemonMove.innerText = `Move #${i+1}: ${capitalize(pokemon.moves[i].move.name)}`; // Setting move number and name.
            div.append(pokemonMove);
        };
    };
};

const capitalize = word => { // Change the first letter of a given word to upper case.
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalizedWord;
};

const selectPokemon = selectedPokemon => {

    // Function containing a click event that visualises a selected Pokemon and a random Pokemon in the canvas element and initiating a battle between them.

    selectedPokemon.addEventListener('click', () => { 

        const canvas = document.getElementById('poke-canvas');

        if (isCanvasEmpty(canvas)) { // Checking if the canvas is empty to generate a new battle. Using it not to overlap events.
            
            const context = canvas.getContext('2d');
            context.font = "26px Calibri";
            
            const selectedPokemonImg = document.getElementById(selectedPokemon.id).firstElementChild.nextSibling; // Using the selected Pokemon's ID to get it's backwards image.
            const selectedPokemonName = selectedPokemonImg.nextSibling.innerText; // Selecting the element containing the chosen Pokemon's name.
            const selectedPokemonFullHP = document.getElementById(selectedPokemon.id).lastElementChild.innerText.split(" ")[1]; // Getting the chosen Pokemon's HP and turning them into a number.
            let selectedPokemonCurrentHP = selectedPokemonFullHP; // Creating a variable containing the HP that will be decreased and visualised during the battle.

            context.drawImage(selectedPokemonImg, 30, 220, 150, 150); // Visualising the selected Pokemon's image on the canvas.
            context.fillText(selectedPokemonName, 260, 265); // Visualising the selected Pokemon's name.
            context.fillText(`HP: ${selectedPokemonCurrentHP}/${selectedPokemonFullHP}`, 260, 295); // Visualising the selected Pokemon's current HP and total HP.

            const randomOpponentId = pickRandomOpponent(selectedPokemon.id); // Generating a random ID to choose an opponent.

            const opponentPokemon = document.getElementById(randomOpponentId); // Getting opponent's template.
            const opponentImg = opponentPokemon.firstElementChild; // Getting opponent's image.
            const opponentName = opponentImg.nextSibling.nextSibling.innerText; // Getting opponent's name.
            const opponentFullHP = opponentPokemon.lastElementChild.innerText.split(" ")[1]; // Getting opponent's HP and turning them into a number.
            let opponentCurrentHP = opponentFullHP; // Creating a variable containing the HP that will be decreased and visualised during the battle.

            context.drawImage(opponentImg, 270, 20, 150, 150); // Visualising opponent's image on the canvas.
            context.fillText(opponentName, 80, 50); // Visualising opponet's name.
            context.fillText(`HP: ${opponentCurrentHP}/${opponentFullHP}`, 80, 80); // Visualising the oppponent's current HP and total HP.

            window.scrollTo(0, 0); // Scroll to top of the screen if needed.
        };
    });
};


const pickRandomOpponent = yourPokemonId => { // Picking a random number to generate for the opponent's ID without repeating the selected Pokemon's ID.
    let randomOpponentId = Math.floor(Math.random() * 151) + 1; // Random number from 1 to 20.

    if (yourPokemonId == randomOpponentId) { // Checking if it matches the selected Pokemon's ID. (string == number)
        if (randomOpponentId === 151) {
            randomOpponentId -= 1;
        } else {
            randomOpponentId += 1;
        };
    };
    return randomOpponentId;
};

const isCanvasEmpty = canvas => { // Checking if the canvas is empty. 
    const blankCanvas = document.getElementById('poke-canvas');

    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;

    return canvas.toDataURL() === blankCanvas.toDataURL(); // Returns true if empty.
};
getPokemon(); // Render all Pokemon templates. 

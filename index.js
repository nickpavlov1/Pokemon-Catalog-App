let yourX = 30;
let yourY = 230;
let opponentX = 210;
let opponentY = 20;
const imageSize = 150;

const canvas = document.getElementById('poke-canvas'); 
const context = canvas.getContext('2d');
context.font = "bold 30px Calibri";
context.fillText('Pick Your Pokemon!', 80, 200);

const getPokemon = () => { // Fetching the first 151 pokemon from the Pokemon API.
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json())
    .then((fetchedPokemon) => {
        fetchedPokemon.results.forEach(fetchEachPokemon);
    });
};

const fetchEachPokemon = pokemon => { // Using the individual URLs for each pokemon to fetch further information for their template.
    const pokeUrl = pokemon.url.slice(0, -1); // <-- Individual URL; example: https://pokeapi.co/api/v2/pokemon/1/
    // Slicing the last character "/" from url to prevent bug with receiving Pokemon with ID #4.
    fetch(pokeUrl)
    .then(response => response.json())
    .then(renderPokemonTemplate);
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

    const movesArray = pokemon.moves.slice(0, 4);

    for (let i = 0; i < movesArray.length; i++) {
        const pokemonMove = document.createElement('p');
        pokemonMove.innerText = `Move #${i+1}: ${capitalize(movesArray[i].move.name)}`; // Setting move number and name.
        div.append(pokemonMove);
    };
};

const capitalize = word => { // Change the first letter of a given word to upper case.
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalizedWord;
};





const selectPokemon = selectedPokemon => {

    // Function containing a click event that visualises a selected Pokemon and a random Pokemon in the canvas element and initiating a battle between them.

    selectedPokemon.addEventListener('click', () => { 

        // YOUR POKEMON
        const selectedPokemonImg = document.getElementById(selectedPokemon.id).firstElementChild.nextSibling; // Using the selected Pokemon's ID to get it's backwards image.
        const selectedPokemonName = selectedPokemonImg.nextSibling.innerText; // Selecting the element containing the chosen Pokemon's name.

         // Getting the chosen Pokemon's HP and turning them into a number.  
        const selectedPokemonFullHP = Number(document.getElementById(selectedPokemon.id).lastElementChild.innerText.split(" ")[1]);
        let selectedPokemonCurrentHP = selectedPokemonFullHP; // Creating a variable containing the HP that will be decreased and visualised during the battle.

        // Tracing the speed of the selected Pokemon through the DOM and turning it into a number value.
        const selectedPokemonSpeed = Number(selectedPokemonImg.nextSibling.nextSibling.nextSibling.nextSibling.innerText.split(" ")[1]);

        const selectedPokemonAttack = Number(selectedPokemon.lastElementChild.previousSibling.innerText.split(" ")[1]); // Turning pokemon attack value into a number.
        const selectedPokemonDefence = Number(selectedPokemon.lastElementChild.previousSibling.previousSibling.innerText.split(" ")[1]); // Turning pokemon attack value into a number.
        // console.log(selectedPokemonDefence, selectedPokemonAttack)
        
        // OPPONENT
        const randomOpponentId = pickRandomOpponent(selectedPokemon.id); // Generating a random ID to choose an opponent.
        const opponentPokemon = document.getElementById(randomOpponentId); // Getting opponent's template.
        const opponentImg = opponentPokemon.firstElementChild; // Getting opponent's image.
        const opponentName = opponentImg.nextSibling.nextSibling.innerText; // Getting opponent's name.
        const opponentFullHP = Number(opponentPokemon.lastElementChild.innerText.split(" ")[1]); // Getting opponent's HP and turning them into a number.
        let opponentCurrentHP = opponentFullHP; // Creating a variable containing the HP that will be decreased and visualised during the battle.

        const opponentAttack = Number(opponentPokemon.lastElementChild.previousSibling.innerText.split(" ")[1]); // Turning opponent attack value into a number.
        const opponentDefence = Number(opponentPokemon.lastElementChild.previousSibling.innerText.split(" ")[1]); // Turning opponent attack value into a number.

        // Tracing the speed of the opponent through the DOM and turning it into a number value.
        const opponentSpeed = Number(opponentImg.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.split(" ")[1]);



        const draw = () => {
            // OPPONENT POKEMON
            context.drawImage(opponentImg, opponentX, opponentY, imageSize, imageSize);
            context.font = "bold 26px Calibri";
            context.fillText(opponentName, 60, 50);
            context.font = "20px Calibri";
            context.fillText(`HP: ${opponentCurrentHP}/${opponentFullHP}`, 60, 80);
            // YOUR POKEMON
            context.drawImage(selectedPokemonImg, yourX, yourY, imageSize, imageSize);
            context.font = "bold 26px Calibri";
            context.fillText(selectedPokemonName, 260, 275);
            context.font = "20px Calibri";
            context.fillText(`HP: ${selectedPokemonCurrentHP}/${selectedPokemonFullHP}`, 260, 305);
        };

        const moveYourPokemonForwards = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();
            // Change position on condition
            if (yourX < 170 && yourY > 90) {
                yourX += 2.5;
                yourY -= 2.5;
                requestAnimationFrame(moveYourPokemonForwards);
            };
        };

        const moveYourPokemonBackwards = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();
            if (yourX > 30 && yourY < 230) {
                yourX -= 2.5;
                yourY += 2.5;
                requestAnimationFrame(moveYourPokemonBackwards);

            } else if (yourX === 30 && yourY === 230) {
                if (opponentCurrentHP > 0) {
                    yourOpponentAttack();
                } else {
                    context.clearRect(0,0, canvas.width, canvas.height)
                    context.font = "bold 30px Calibri";
                    context.fillText('YOU WIN', 140, 200);
                };
            };

        };

        const moveOpponentForwards = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();
            // Change position on condition
            if (opponentX > 80 && opponentY < 150) {
                opponentX -= 2.5;
                opponentY += 2.5;
                requestAnimationFrame(moveOpponentForwards);
            };
        };

        const moveOpponentBackwards = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();
            if (opponentX < 210 && opponentY > 20) {
                opponentX += 2.5;
                opponentY -= 2.5;
                requestAnimationFrame(moveOpponentBackwards);

            } else if (opponentX === 210 && opponentY === 20) {
                if (selectedPokemonCurrentHP > 0) {
                    yourPokemonAttack();
                } else {
                    context.clearRect(0,0, canvas.width, canvas.height)
                    context.font = "bold 30px Calibri";
                    context.fillText('YOU LOSE', 140, 200);
                };
            };
        };

        const yourPokemonAttack = () => {

            moveYourPokemonForwards();

            setTimeout(() => {
                moveYourPokemonBackwards();
                opponentCurrentHP = inflictDamage(opponentCurrentHP, calculateDamage(selectedPokemonAttack, opponentDefence));
            }, 1500);
        };

        const yourOpponentAttack = () => {
            moveOpponentForwards();

            setTimeout(() => {
                moveOpponentBackwards();
                selectedPokemonCurrentHP = inflictDamage(selectedPokemonCurrentHP, calculateDamage(opponentAttack, selectedPokemonDefence));
            }, 1500);  
        };

        if (selectedPokemonSpeed >= opponentSpeed) {
            yourPokemonAttack();
        }; 
        if (selectedPokemonSpeed < opponentSpeed) {
            yourOpponentAttack();
        };


        scrollTo(0, 0); // Scroll to top of the screen if needed.
    });
};

// Picking a random number to generate for the opponent's ID without repeating the selected Pokemon's ID.
const pickRandomOpponent = yourPokemonId => { 
    let randomOpponentId = Math.floor(Math.random() * 151) + 1; // Random number from 1 to 151.

    if (yourPokemonId == randomOpponentId) { // Checking if it matches the selected Pokemon's ID. (string == number)
        if (randomOpponentId === 151) {
            randomOpponentId -= 1;
        } else {
            randomOpponentId += 1;
        };
    };
    return randomOpponentId;
};

const calculateDamage = (att, def) => {
    const attackValue = (att / def) * Math.floor(Math.random() * 100);
    return attackValue;
};

const inflictDamage = (hp, dmg) => {
    hp = Math.floor(hp - dmg);
    if (hp < 0) {
        hp = 0;  
    };
    return hp;
};

getPokemon(); // Render all Pokemon templates. 
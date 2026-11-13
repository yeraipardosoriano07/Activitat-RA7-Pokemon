const detailCard = document.querySelector("#detail-card");
const backBtn = document.querySelector("#back-btn");

// El que faig és recuperar el paràmetre de la URL (Lo del detail.html?=id=1)
const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get("id");

async function carregarDetallPokemon() {
    try{
        //Demano una petició a la pokeapi amb ID
        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonId);
        
        //Comprovar l'estat de la petició
        if(!resposta.ok) {
            throw new Error('Error en la petició: ' + resposta.status);
        }

        const pokemon = await resposta.json();

        //Creació d'elements
        const imgPoke = document.createElement("img");
        imgPoke.classList.add("detail-img");
        imgPoke.src = pokemon.sprites.front_default;
        imgPoke.alt = pokemon.name;

        const nomPoke = document.createElement("h2");
        nomPoke.classList.add("detail-name");
        nomPoke.textContent = pokemon.name;

        const especifiPoke = document.createElement("p");
        especifiPoke.classList.add("detail-specs");
        especifiPoke.textContent = "Pes: " + pokemon.weight + " | " + "Alçada: " + pokemon.height;

        //Creació de la taula d'habilitats
        const taulaPoke = document.createElement("table");
        taulaPoke.classList.add("skills-table");

        const tHead = document.createElement("thead");
        const trHead = document.createElement("tr");

        const thId = document.createElement("th");
        thId.textContent = "ID";

        const thHabilitat = document.createElement("th");
        thHabilitat.textContent = "Habilitat";

        trHead.appendChild(thId);
        trHead.appendChild(thHabilitat);
        tHead.appendChild(trHead);
        taulaPoke.appendChild(tHead);

        const tBody = document.createElement("tbody");

        for(let i = 0; i < pokemon.abilities.length; i++) {
            const trHabilitat = document.createElement("tr");

            const tdIdHabilitat = document.createElement("td");
            tdIdHabilitat.textContent = i + 1;

            const tdNomHabilitat = document.createElement("td");
            tdNomHabilitat.textContent = pokemon.abilities[i].ability.name;

            trHabilitat.appendChild(tdIdHabilitat);
            trHabilitat.appendChild(tdNomHabilitat);
            tBody.appendChild(trHabilitat);
        }

        taulaPoke.appendChild(tBody);

        //Afegir tot al contenidor principal
        detailCard.appendChild(imgPoke);
        detailCard.appendChild(nomPoke);
        detailCard.appendChild(especifiPoke);
        detailCard.appendChild(taulaPoke);
    }
    catch (error) {
        console.error("Hi ha hagut un error carregant el detall:", error.message)
    }
}

backBtn.addEventListener("click", () => {
    history.back();
});

if(pokemonId) {
    carregarDetallPokemon();
}
const contenidorPoke = document.querySelector("#pokemon-grid");
const selectLimit = document.querySelector("#limit-select");
const btnNext = document.querySelector("#next-btn");
const btnPrev = document.querySelector("#prev-btn");

// Guardem la URL actual i les URLs de següent/anterior que ens dona la API
let urlActual = "https://pokeapi.co/api/v2/pokemon/?limit=" + selectLimit.value;
let urlNext = null;
let urlPrev = null;

async function carregarPokemons() {
  try {
    contenidorPoke.replaceChildren();

    // El que faig es demanar les dades a la pokeapi fent servir la urlActual
    const resposta = await fetch(urlActual);

    // Comprovem si la primera petició ha anat bé
    if (!resposta.ok) {
      throw new Error("Error en la petició: " + resposta.status);
    }

    const dadesPoke = await resposta.json();

    // Guardem les adreces de la pàgina següent i anterior que retorna la API
    urlNext = dadesPoke.next;
    urlPrev = dadesPoke.previous;

    // Activem o desactivem els botons als marges
    btnPrev.disabled = !urlPrev;
    btnNext.disabled = !urlNext;

    // El que faig es recorre els resultats dels pokemons
    dadesPoke.results.forEach(async (pokemon) => {
      try {
        // Demanem les dades detallades
        const respostaPokeDetall = await fetch(pokemon.url);

        // Comprovem que estigui bé
        if (!respostaPokeDetall.ok) {
          throw new Error("Error en el detall: " + respostaPokeDetall.status);
        }

        const dadesPokeDetall = await respostaPokeDetall.json();

        // Creem la targeta del pokemon
        const tarjetaPoke = document.createElement("div");
        tarjetaPoke.classList.add("card");

        const imgPoke = document.createElement("img");
        imgPoke.classList.add("card-img");
        imgPoke.src = dadesPokeDetall.sprites.front_default;
        imgPoke.alt = dadesPokeDetall.name;

        const nomPoke = document.createElement("p");
        nomPoke.classList.add("card-name");
        nomPoke.textContent = dadesPokeDetall.name;

        const botoPoke = document.createElement("button");
        botoPoke.classList.add("detail-btn");
        botoPoke.textContent = "Detall";

        botoPoke.addEventListener("click", () => {
          location.href = "detail.html?id=" + dadesPokeDetall.id;
        });

        tarjetaPoke.appendChild(imgPoke);
        tarjetaPoke.appendChild(nomPoke);
        tarjetaPoke.appendChild(botoPoke);

        contenidorPoke.appendChild(tarjetaPoke);

      } catch (errorDetall) {
        console.error("Error carregant un pokémon:", errorDetall.message);
      }
    });

  } catch (error) {
    console.error("Hi ha hagut un error:", error.message);
  }
}

// Quan canvia el selector, actualitzem el límit des del principi
selectLimit.addEventListener("change", () => {
  urlActual = "https://pokeapi.co/api/v2/pokemon/?limit=" + selectLimit.value;
  carregarPokemons();
});

// Quan és clica al botó next carreguem la URL següent que ens va donar la API
btnNext.addEventListener("click", () => {
  if (urlNext) {
    urlActual = urlNext;
    carregarPokemons();
  }
});

// Quan és clica al botó prev carreguem la URL anterior que ens va donar la API
btnPrev.addEventListener("click", () => {
  if (urlPrev) {
    urlActual = urlPrev;
    carregarPokemons();
  }
});

// Cridem la funció perquè s'executi en obrir la pàgina
carregarPokemons();
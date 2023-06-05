document.addEventListener("DOMContentLoaded", async () => {
  const response = await getCharacter();

  const paragrafoTotalPersonagens = document.querySelector("#totalPersonagens");
  paragrafoTotalPersonagens.innerHTML = `CHARACTERS: ${response.data.info.count}`;

  const paragrafoLocalizacoes = document.querySelector("#totalLocalizacao");
  const respostaLocation = await apiConfig.get("/location");
  const totalLocalizacoes = respostaLocation.data.info.count;
  paragrafoLocalizacoes.innerHTML = `LOCATIONS: ${totalLocalizacoes}`;

  const paragrafoTotalEpisodios = document.querySelector("#totalEps");
  const respostaEpisodes = await apiConfig.get("/episode");
  const totalEpisodios = respostaEpisodes.data.info.count;
  paragrafoTotalEpisodios.innerHTML = `EPISODES: ${totalEpisodios}`;

  renderizarPaginacao(response.data.info.pages);
  updateCharacter(response);
});

async function getCharacter(page) {
  try {
    const response = await apiConfig.get("/character/", {
      params: {
        page: page || 1,
      },
    });

    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
  }
}

async function updateCharacter(response) {
  const main = document.querySelector("main");

  for (let i = 0; i < response.data.results.length; i += 2) {
    const character1 = response.data.results[i];
    const ultimoEpisodio1 = character1.episode[character1.episode.length - 1];
    const respostaLocalizacao1 = await axios.get(`${ultimoEpisodio1}`);
    const ultimaLocalizacao1 = respostaLocalizacao1.data.name;

    const newDiv = document.createElement("div");
    newDiv.classList.add("row");
    let row = main.appendChild(newDiv);

    const card1 = createCard(character1, ultimaLocalizacao1);
    row.innerHTML += card1;

    if (i + 1 < response.data.results.length) {
      const character2 = response.data.results[i + 1];
      const ultimoEpisodio2 = character2.episode[character2.episode.length - 1];
      const respostaLocalizacao2 = await axios.get(`${ultimoEpisodio2}`);
      const ultimaLocalizacao2 = respostaLocalizacao2.data.name;

      const card2 = createCard(character2, ultimaLocalizacao2);
      row.innerHTML += card2;
    }
  }
}

function createCard(character, ultimaLocalizacao) {
  const pStatus = document.createElement("p");
  pStatus.classList.add("status");

  let statusDescription = "";
  if (character.status === "Alive") {
    pStatus.classList.add("status-alive");
    statusDescription = "Vivo";
  } else if (character.status === "Dead") {
    pStatus.classList.add("status-dead");
    statusDescription = "Morto";
  } else {
    pStatus.classList.add("status-unknown");
    statusDescription = "Desconhecido";
  }

  const card = `
      <div class="card">
        <img src="${character.image}" alt="image character">
        <div class="description">
          <div class="title-card">
            <h3>${character.name}</h3>
            <div class="status">${
              pStatus.outerHTML + statusDescription
            } - <span class="race">${character.species}</span></div>
          </div>
          <div class="last-localization">
            <p class="paragrafo-cinza">Última localização conhecida:</p>
            <p>${character.location.name}</p>
          </div>
          <div class="last-location">
            <p class="paragrafo-cinza">Visto a última vez em:</p>
            <p>${ultimaLocalizacao}</p>
          </div>
        </div>
      </div>
    `;

  return card;
}

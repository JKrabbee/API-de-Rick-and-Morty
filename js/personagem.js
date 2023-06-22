const espacoCard = document.getElementById('espaco-card-character')

document.addEventListener("DOMContentLoaded", async () => {
    const dadosRetornados = await buscarPersonagens(paginaAtual);
    const qntdLocalizacao = await buscarLocations();
    const qntdEpisodios = await buscarEPS();
  
    totalPersonagens.innerText = dadosRetornados.totalPersonagens;
    totalLocalizacao.innerText = qntdLocalizacao;
    totalEpisodios.innerText = qntdEpisodios;
    
  const idSession = sessionStorage.getItem("idCharacter");

  const response = await buscarPersonagemExpecifico(idSession);

  montarCard(response);
});

async function buscarPersonagemExpecifico(id) {
  try {
    const response = await api.get(`/character/${id}`);

    const personagem = response.data;
    console.log(response);
    return personagem;
  } catch (error) {
    console.log(error);
  }
}

async function montarCard(personagem) {
  function createDt(text) {
    const dt = document.createElement("dt");
    dt.innerText = text;
    return dt;
  }

  function createDd(text) {
    const dd = document.createElement("dd");
    dd.innerText = text;
    return dd;
  }

  const newCol = document.createElement("div");
  newCol.setAttribute("class", "col g-5 d-flex justify-content-center");

  const newCard = document.createElement("div");
  newCard.setAttribute("class", "card w-50 text-light background-card border border-success opacidadeCard");

  const newImg = document.createElement("img");
  newImg.setAttribute("src", `${personagem.image}`);

  const newCardBody = document.createElement("div");
  newCardBody.setAttribute("class", "card-body");

  const newH1 = document.createElement("h1");
  newH1.setAttribute("class", "fw-bolder");
  newH1.innerText = personagem.name;

  // CRIAR STATUS E SPECIES DO CARD BODY
  const cardText = document.createElement("p");
  cardText.setAttribute("class", "card-text");

  const spanStatus = document.createElement("span");

  const statusFill = document.createElement("i");
  statusFill.setAttribute("class", "bi bi-caret-right-fill");

  if (personagem.status == "Alive") {
    statusFill.setAttribute("class", "bi bi-caret-right-fill text-success");
  }

  if (personagem.status == "Dead") {
    statusFill.setAttribute("class", "bi bi-caret-right-fill text-danger");
  }

  // ULTIMO EPISÓDIO
  const ultimoEP = personagem.episode[personagem.episode.length - 1];
  const responseLocalizacao = await axios.get(ultimoEP);
  const ultimaLocalizacao = responseLocalizacao.data.name;

  const newDl = document.createElement("dl");

  spanStatus.appendChild(statusFill);
  cardText.appendChild(spanStatus);
  cardText.appendChild(
    document.createTextNode(`${personagem.status} - ${personagem.species}`)
  );

  newCardBody.appendChild(newH1);
  newCardBody.appendChild(cardText);

  newDl.appendChild(createDt("Última localização conhecida:"));
  newDl.appendChild(createDd(`${personagem.location.name}`));

  newDl.appendChild(createDt("Visto a última vez em:"));
  newDl.appendChild(createDd(`${ultimaLocalizacao}`));

  newDl.appendChild(createDt("Genero:"));
  newDl.appendChild(createDd(`${personagem.gender}`));

  newDl.appendChild(createDt("Quantidade de episódios:"));
  newDl.appendChild(createDd(`${personagem.episode.length}`));

  newDl.appendChild(createDt("Origem:"));
  newDl.appendChild(createDd(`${personagem.origin.name}`));

  newCardBody.appendChild(newDl);

  newCard.appendChild(newImg);
  newCard.appendChild(newCardBody);

  newCol.appendChild(newCard);

  espacoCard.appendChild(newCol)
}

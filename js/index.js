const cardsRow = document.querySelector("#espaco-cards");

const btnPrev = document.querySelector("#btn-prev");
const btnAtual = document.querySelector("#btn-atual");
const btnNext = document.querySelector("#btn-next");

const totalPersonagens = document.querySelector("#total-personagens");
const totalLocalizacao = document.querySelector("#total-localizacao");
const totalEpisodios = document.querySelector("#total-episodios");

let paginaAtual = 1;
let totalPaginas = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const dadosRetornados = await buscarPersonagens(paginaAtual);
  const qntdLocalizacao = await buscarLocations();
  const qntdEpisodios = await buscarEPS();

  totalPersonagens.innerText = dadosRetornados.totalPersonagens;
  totalLocalizacao.innerText = qntdLocalizacao;
  totalEpisodios.innerText = qntdEpisodios;

  montarColunasCards(dadosRetornados.personagens);

  mudarbotoes(dadosRetornados.prevPagina, dadosRetornados.nextPagina);
  
});

btnNext.addEventListener("click", nextPagina);
btnPrev.addEventListener("click", prevPagina);

async function montarColunasCards(listaPersonagens) {
  cardsRow.innerHTML = "";

  function createDl(text, color) {
    const dl = document.createElement("dl");
    dl.setAttribute("class", `${color}`);
    dl.innerText = text;
    return dl;
  }

  for (const personagem of listaPersonagens) {
    // CRIAR COLUNA
    const divCol = document.createElement("div");
    divCol.setAttribute("class", "col-12 col-md-6 col-lg-4 g-5 diminuirScale");
    cardsRow.appendChild(divCol);

    // CRIAR CARD
    const card = document.createElement("div");
    card.setAttribute(
      "class",
      'card w-100" style="width: 18rem text-light background-card border border-success btn-card'
    );
    divCol.appendChild(card);

    // CRIAR IMAGEM
    const cardImg = document.createElement("img");
    cardImg.setAttribute("src", `${personagem.image}`);
    cardImg.setAttribute("alt", `${personagem.name}`);
    card.appendChild(cardImg);

    // CRIAR CARD BODY
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.appendChild(cardBody);

    // CRIAR TITULO DO CARD BODY
    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerText = personagem.name;
    cardBody.appendChild(cardTitle);

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

    spanStatus.appendChild(statusFill);
    cardText.appendChild(spanStatus);
    cardText.appendChild(
      document.createTextNode(`${personagem.status} - ${personagem.species}`)
    );

    cardBody.appendChild(cardText);

    // CRIAR DESCRIÇÃO
    const Dl = document.createElement("dl");
    cardBody.appendChild(Dl);

    // ULTIMA LOCALIZAÇÃO
    Dl.appendChild(createDl("Última localização conhecida:", "text-secondary"));
    Dl.appendChild(createDl(personagem.location.name));

    // ULTIMO EPISÓDIO
    const ultimoEP = personagem.episode[personagem.episode.length - 1];
    const responseLocalizacao = await axios.get(ultimoEP);
    const ultimaLocalizacao = responseLocalizacao.data.name;
    Dl.appendChild(createDl("Visto a última vez em:", "text-secondary"));
    Dl.appendChild(createDl(ultimaLocalizacao));

    // CARD TRANSPARENTE
    const cardVidro = document.createElement('div');
    cardVidro.setAttribute('class', 'bg-dark w-100 h-100 position-absolute opacity-25')
    cardVidro.setAttribute(
      "id",
      `${personagem.id}`
    )
    card.appendChild(cardVidro)
    card.addEventListener('click',  (event) => {
      const cardClicado = event.target

      if(cardClicado.id){
        sessionStorage.setItem('idCharacter', `${cardClicado.id}`);
        // card.classList.add('diminuirScale')
        setTimeout(()=>{
          window.location.href = "./html/personagem.html";
        },200)
      }
    });
  }
}

function mudarbotoes(prev, next) {
  btnAtual.children[0].innerText = paginaAtual;

  if (prev) {
    btnPrev.classList.add("disabled");
  } else {
    btnPrev.classList.remove("disabled");
  }

  if (next) {
    btnNext.classList.add("disabled");
  } else {
    btnNext.classList.remove("disabled");
  }
}

async function buscarPersonagens(pagina) {
  try {
    const response = await api.get("/character", {
      params: {
        page: pagina,
      },
    });

    const dadosApi = {
      totalPaginas: response.data.info.pages,
      totalPersonagens: response.data.info.count,
      personagens: response.data.results,
      nextPagina: response.data.info.next,
      prevPagina: response.data.info.prev,
    };
    return dadosApi;
  } catch (error) {
    console.log(error);
  }
}

async function buscarLocations() {
  try {
    const response = await api.get("/location");
    const dadosApi = response.data.info.count;

    return dadosApi;
  } catch (error) {
    console.log(error);
  }
}

async function buscarEPS() {
  try {
    const response = await api.get("/episode");
    const dadosApi = response.data.info.count;

    return dadosApi;
  } catch (error) {
    console.log(error);
  }
}

async function nextPagina() {
  if (btnNext.classList.contains("disabled")) {
    ++paginaAtual;

    const dadosApi = await buscarPersonagens(paginaAtual);

    montarColunasCards(dadosApi.personagens);
    mudarbotoes(dadosApi.prevPagina, dadosApi.nextPagina);
  }
}

async function prevPagina() {
  if (btnPrev.classList.contains("disabled")) {
    --paginaAtual;

    const dadosApi = await buscarPersonagens(paginaAtual);

    montarColunasCards(dadosApi.personagens);
    mudarbotoes(dadosApi.prevPagina, dadosApi.nextPagina);
  }
}

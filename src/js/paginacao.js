function renderizarPaginacao(response) {
  const carouselSize = 5;
  const totalPages = Math.ceil(response / carouselSize);
  const pagesContainer = document.getElementById('pages');
  pagesContainer.innerHTML = '';

  const main = document.querySelector("main");

  let currentPage = 1;

  const updateCarousel = async () => {
    const startPage = (currentPage - 1) * carouselSize + 1;
    const endPage = Math.min(startPage + carouselSize - 1, response);

    pagesContainer.innerHTML = '';

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement('li');
      btn.innerText = i;
      btn.addEventListener('click', async () => {
        const reponsePage = await getCharacter(i)

        main.innerHTML = ''

        await updateCharacter(reponsePage);
      });
      pagesContainer.appendChild(btn);
    }
  };

  const previousButton = document.getElementById('previous');
  const nextButton = document.getElementById('next');

  previousButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateCarousel();
    }
  });

  updateCarousel();
}

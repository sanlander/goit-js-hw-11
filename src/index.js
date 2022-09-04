import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createNewCard from './js/addNewCard';
import PixabayApi from './js/pixabay-api';
import { onLoadingOffBtnLoadMore } from './js/visually-hidden';
import { loadingOn } from './js/visually-hidden';
import { loadingOff } from './js/visually-hidden';
import { loadMoreOff } from './js/visually-hidden';

const pixabayApi = new PixabayApi();

export const refs = {
  gallery: document.querySelector('.gallery'),
  inputForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  loading: document.querySelector('.loading'),
};

refs.inputForm.addEventListener('submit', onSearchForm);
refs.loadMoreBtn.addEventListener('click', onClickLoadMore);

async function onClickLoadMore() {
  loadingOn();
  loadMoreOff();

  pixabayApi.incrementPage();

  await pixabayApi.fetchApi().then(r => {
    if (
      pixabayApi.pageApi * pixabayApi.currentPerPage + 1 >
      pixabayApi.currentTotalHits
    ) {
      createCard(r.data.hits);
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreOff();
      loadingOff();
      return;
    }
    createCard(r.data.hits);
    onLoadingOffBtnLoadMore();
  });
}

function onSearchForm(e) {
  e.preventDefault();
  loadingOn();

  pixabayApi.resetPage();

  pixabayApi.query(e.target.elements.searchQuery.value);

  refs.gallery.innerHTML = '';

  pixabayApi.fetchApi().then(r => {
    if (r.data.hits.length === 0) {
      loadingOff();
      loadMoreOff();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    pixabayApi.perPage(r.config.params.per_page);
    pixabayApi.totalHits(r.data.totalHits);

    Notify.success(`Hooray! We found ${r.data.totalHits} images.`);
    createCard(r.data.hits);
    onLoadingOffBtnLoadMore();
  });
}

function createCard(card) {
  const cards = card.map(createNewCard).join('');
  refs.gallery.insertAdjacentHTML('beforeend', cards);
  let gallary = new SimpleLightbox('.gallery a');
}

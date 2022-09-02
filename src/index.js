import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import addNewCard from './js/addNewCard';

const refs = {
  gallery: document.querySelector('.gallery'),
  inputForm: document.querySelector('#search-form'),
};

refs.inputForm.addEventListener('submit', onSearchForm);

function onSearchForm(e) {
  e.preventDefault();
  const inputValue = e.target.elements.searchQuery.value;
  console.log(inputValue);
  refs.gallery.innerHTML = '';
  fetchApi(inputValue);
}
// let gallery = new SimpleLightbox('.gallery a');

async function fetchApi(searchParams) {
  const newCard = await axios
    .get('https://pixabay.com/api/', {
      params: {
        key: '29666264-04a56090f5dead81932f72058',
        q: `${searchParams}`,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
        per_page: 40,
        // page: 1,
      },
    })
    .then(r => r.data.hits);
  if (newCard.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
    createCard(newCard);
    let gallary = new SimpleLightbox('.gallery a');
}


function createCard(card) {
  const cards = card.map(addNewCard).join('');
  refs.gallery.insertAdjacentHTML('beforeend', cards);
}

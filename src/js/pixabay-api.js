import axios from 'axios';
export default class PixabayApi {
  constructor() {
    this.searchValue = '';
    this.pageApi = 1;
    this.currentPerPage = null;
    this.currentTotalHits = null;
  }

  fetchApi() {
    const url = 'https://pixabay.com/api/';
    const options = {
      params: {
        key: '29666264-04a56090f5dead81932f72058',
        q: `${this.searchValue}`,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
        per_page: 4,
        page: `${this.pageApi}`,
      },
    };

    return axios.get(url, options).then(r => {
      return r;
    });
  }

  resetPage() {
    this.pageApi = 1;
  }
  incrementPage() {
    this.pageApi += 1;
  }
  query(newQuery) {
    this.searchValue = newQuery;
  }
  perPage(newPerPage) {
    this.currentPerPage = newPerPage;
  }

  totalHits(newTotal) {
    this.currentTotalHits = newTotal;
  }
}

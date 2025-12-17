import {createElement} from '../framework/render.js';
import MovieCardComponent from './movie-card-component.js';

function createCatalogComponentTemplate() {
  return (
    `<section id="catalog" class="catalog">
      <h2>Каталог фильмов и сериалов</h2>
      <div class="movie-grid" id="movie-grid">
        <!-- Карточки фильмов будут добавляться динамически -->
      </div>
      <div id="no-results" class="no-results" style="display: none;">
        <p>Фильмы не найдены. Попробуйте изменить поисковый запрос.</p>
      </div>
    </section>`
  );
}

export default class CatalogComponent {
  #element = null;
  #movies = [];

  constructor(movies) {
    this.#movies = movies;
  }

  getTemplate() {
    return createCatalogComponentTemplate();
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
      this.renderMovies();
    }
    return this.#element;
  }

  renderMovies() {
    const movieGrid = this.#element.querySelector('#movie-grid');
    this.#movies.forEach(movie => {
      const movieComponent = new MovieCardComponent(movie);
      movieGrid.appendChild(movieComponent.getElement());
    });
  }

  removeElement() {
    this.#element = null;
  }
}
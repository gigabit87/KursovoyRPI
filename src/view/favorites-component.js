import {createElement} from '../framework/render.js';

function createFavoritesComponentTemplate() {
  return (
    `<section id="favorites" class="favorites">
      <h2>Избранное</h2>
      <div class="favorites-grid">
        <p>Ваши избранные фильмы и сериалы.</p>
      </div>
    </section>`
  );
}

export default class FavoritesComponent {
  #element = null;

  getTemplate() {
    return createFavoritesComponentTemplate();
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
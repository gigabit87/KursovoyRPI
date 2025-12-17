import {createElement} from '../framework/render.js';

function createHeaderComponentTemplate() {
  return (
    `<header class="header">
      <div class="logo">FilmCatalog</div>
      <nav>
        <a href="#catalog">Каталог</a>
        <a href="#favorites">Избранное</a>
        <a href="#playlists">Плейлисты</a>
      </nav>
    </header>`
  );
}

export default class HeaderComponent {
  #element = null;

  getTemplate() {
    return createHeaderComponentTemplate();
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
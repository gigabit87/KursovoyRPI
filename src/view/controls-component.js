import {createElement} from '../framework/render.js';

function createControlsComponentTemplate() {
  return (
    `<section class="controls">
      <input type="text" id="search" placeholder="Поиск фильмов или сериалов..." />
      <select id="genre-filter">
        <option value="all">Все жанры</option>
        <option value="action">Боевик</option>
        <option value="drama">Драма</option>
        <option value="comedy">Комедия</option>
        <option value="fantasy">Фантастика</option>
        <option value="thriller">Триллер</option>
      </select>
      <button id="add-movie">Добавить фильм</button>
    </section>`
  );
}

export default class ControlsComponent {
  #element = null;

  getTemplate() {
    return createControlsComponentTemplate();
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
import {createElement} from '../framework/render.js';

function createClearPlaylistsButtonTemplate(isDisabled, isLoading) {
  return (
    `<button class="clear-playlists-btn" ${isDisabled ? 'disabled' : ''}>
      ${isLoading ? 'Очистка...' : (isDisabled ? 'Плейлисты очищены' : 'Очистить все плейлисты')}
    </button>`
  );
}

export default class ClearPlaylistsButtonComponent {
  #element = null;
  #isDisabled = false;
  #isLoading = false;
  #onClick = null;

  constructor({ onClick, initialDisabled = false }) {
    this.#onClick = onClick;
    this.#isDisabled = initialDisabled;
  }

  getTemplate() {
    return createClearPlaylistsButtonTemplate(this.#isDisabled, this.#isLoading);
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
      this.#initEventListeners();
    }
    return this.#element;
  }

  #initEventListeners() {
    if (!this.#isDisabled) {
      this.#element.addEventListener('click', async () => {
        if (confirm('Вы уверены, что хотите удалить все плейлисты?')) {
          this.#isLoading = true;
          this.#updateButton();
          
          try {
            await this.#onClick();
            this.disable();
          } catch (error) {
          } finally {
            this.#isLoading = false;
            this.#updateButton();
          }
        }
      });
    }
  }

  #updateButton() {
    if (this.#element) {
      const newElement = createElement(this.getTemplate());
      this.#element.parentNode.replaceChild(newElement, this.#element);
      this.#element = newElement;
      this.#initEventListeners();
    }
  }

  disable() {
    this.#isDisabled = true;
    this.#updateButton();
  }

  enable() {
    this.#isDisabled = false;
    this.#updateButton();
  }

  removeElement() {
    this.#element = null;
  }
}
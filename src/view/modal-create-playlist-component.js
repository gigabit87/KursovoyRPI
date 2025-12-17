import {createElement} from '../framework/render.js';

function createModalCreatePlaylistTemplate() {
  return (
    `<div class="modal" id="modal-create-playlist">
      <div class="modal-content">
        <h2>Создать плейлист</h2>
        <form id="create-playlist-form">
          <label for="playlist-name">Название плейлиста *</label>
          <input type="text" id="playlist-name" placeholder="Например: Для просмотра вечером" required />
          
          <label for="playlist-description">Описание</label>
          <textarea id="playlist-description" placeholder="Необязательное описание плейлиста" rows="3"></textarea>
          
          <div class="form-buttons">
            <button type="submit" class="save">Создать</button>
            <button type="button" class="cancel">Отмена</button>
          </div>
        </form>
      </div>
    </div>`
  );
}

export default class ModalCreatePlaylistComponent {
  #element = null;
  #onSubmit = null;
  #onCancel = null;

  constructor({ onSubmit, onCancel }) {
    this.#onSubmit = onSubmit;
    this.#onCancel = onCancel;
  }

  getTemplate() {
    return createModalCreatePlaylistTemplate();
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
      this.#initEventListeners();
    }
    return this.#element;
  }

  #initEventListeners() {
    const form = this.#element.querySelector('#create-playlist-form');
    const cancelBtn = this.#element.querySelector('.cancel');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.#handleSubmit();
    });
    
    cancelBtn.addEventListener('click', () => {
      this.#onCancel();
    });
    
    this.#element.addEventListener('click', (e) => {
      if (e.target === this.#element) {
        this.#onCancel();
      }
    });
  }

  #handleSubmit() {
    const name = this.#element.querySelector('#playlist-name').value.trim();
    const description = this.#element.querySelector('#playlist-description').value.trim();
    
    if (!name) {
      alert('Введите название плейлиста');
      return;
    }
    
    this.#onSubmit({ name, description });
    this.#resetForm();
  }

  #resetForm() {
    const form = this.#element.querySelector('#create-playlist-form');
    form.reset();
  }

  show() {
    this.#element.style.display = 'flex';
    this.#element.querySelector('#playlist-name').focus();
  }

  hide() {
    this.#element.style.display = 'none';
    this.#resetForm();
  }

  removeElement() {
    this.#element = null;
  }
}
import {createElement} from '../framework/render.js';
import { MOVIE_GENRES } from '../const.js';
import { validateMovieData } from '../utils.js';

function createModalAddMovieTemplate() {
  const genreOptions = Object.entries(MOVIE_GENRES)
    .filter(([key]) => key !== 'all')
    .map(([key, name]) => `<option value="${key}">${name}</option>`)
    .join('');
    
  return (
    `<div class="modal" id="modal-add-movie">
      <div class="modal-content">
        <h2>Добавить фильм</h2>
        <form id="add-movie-form">
          <label for="movie-image-url">URL постера (рекомендуется)</label>
          <input type="url" id="movie-image-url" placeholder="https://example.com/poster.jpg" />

          <div class="image-upload-container">
            <label class="image-upload-label">
              <input type="file" id="movie-image" accept="image/*" class="image-upload-input" />
              <div class="image-upload-preview">
                <span class="upload-text">Нажмите для загрузки постера</span>
              </div>
            </label>
          </div>
          
          <label for="movie-title">Название *</label>
          <input type="text" id="movie-title" placeholder="Введите название" required />
          
          <label for="movie-genre">Жанр *</label>
          <select id="movie-genre" required>
            <option value="">Выберите жанр</option>
            ${genreOptions}
          </select>
          
          <label for="movie-year">Год выпуска</label>
          <input type="number" id="movie-year" placeholder="2025" min="1888" max="${new Date().getFullYear() + 5}" />
          
          <label for="movie-rating">Рейтинг (0-10)</label>
          <input type="number" id="movie-rating" placeholder="7.5" min="0" max="10" step="0.1" />
          
          <label for="movie-description">Описание *</label>
          <textarea id="movie-description" placeholder="Краткое описание" rows="4" required></textarea>
          
          <div class="form-buttons">
            <button type="submit" class="save">Сохранить</button>
            <button type="button" class="cancel">Отмена</button>
          </div>
        </form>
      </div>
    </div>`
  );
}

export default class ModalAddMovieComponent {
  #element = null;
  #onSubmit = null;
  #onCancel = null;
  #imagePreview = null;
  #imageUrl = null;

  constructor({ onSubmit, onCancel }) {
    this.#onSubmit = onSubmit;
    this.#onCancel = onCancel;
  }

  getTemplate() {
    return createModalAddMovieTemplate();
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
      this.#initEventListeners();
    }
    return this.#element;
  }

  #initEventListeners() {
    const form = this.#element.querySelector('#add-movie-form');
    const cancelBtn = this.#element.querySelector('.cancel');
    const imageInput = this.#element.querySelector('#movie-image');
    const imagePreview = this.#element.querySelector('.image-upload-preview');
    const imageUrlInput = this.#element.querySelector('#movie-image-url');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.#handleSubmit();
    });
    
    cancelBtn.addEventListener('click', () => {
      this.#onCancel();
    });
    
    if (imageInput && imagePreview) {
      imageInput.addEventListener('change', (e) => {
        this.#handleImageUpload(e, imagePreview);
      });
    }

    if (imageUrlInput && imagePreview) {
      imageUrlInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        this.#imageUrl = value || null;

        if (!value) {
          imagePreview.style.backgroundImage = 'none';
          imagePreview.innerHTML = '<span class="upload-text">Нажмите для загрузки постера</span>';
          return;
        }

        imagePreview.style.backgroundImage = `url(${value})`;
        imagePreview.style.backgroundSize = 'cover';
        imagePreview.style.backgroundPosition = 'center';
        imagePreview.innerHTML = '<span class="upload-text">Постер по URL</span>';
      });
    }
    
    this.#element.addEventListener('click', (e) => {
      if (e.target === this.#element) {
        this.#onCancel();
      }
    });
  }

  #handleImageUpload(event, previewElement) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const originalDataUrl = e.target.result;

        const img = new Image();
        img.onload = () => {
          const MAX_W = 360;
          const MAX_H = 540;

          const scale = Math.min(MAX_W / img.width, MAX_H / img.height, 1);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          let compressedDataUrl = '';
          try {
            compressedDataUrl = canvas.toDataURL('image/webp', 0.75);
            if (!compressedDataUrl.startsWith('data:image/webp')) {
              throw new Error('webp not supported');
            }
          } catch {
            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          }

          previewElement.style.backgroundImage = `url(${compressedDataUrl})`;
          previewElement.style.backgroundSize = 'cover';
          previewElement.style.backgroundPosition = 'center';
          previewElement.innerHTML = '<span class="upload-text">Изменить изображение</span>';
          this.#imagePreview = compressedDataUrl;
        };

        img.onerror = () => {
          previewElement.style.backgroundImage = `url(${originalDataUrl})`;
          previewElement.style.backgroundSize = 'cover';
          previewElement.style.backgroundPosition = 'center';
          previewElement.innerHTML = '<span class="upload-text">Изменить изображение</span>';
          this.#imagePreview = originalDataUrl;
        };

        img.src = originalDataUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  #handleSubmit() {
    const imageUrlInput = this.#element.querySelector('#movie-image-url');
    const rawUrl = imageUrlInput ? imageUrlInput.value.trim() : '';
    const finalImage = rawUrl || this.#imagePreview || 'https://via.placeholder.com/300x450?text=No+Image';

    if (rawUrl) {
      try {
        new URL(rawUrl);
      } catch {
        alert('Неверный URL постера. Пример: https://example.com/poster.jpg');
        return;
      }
    }

    const formData = {
      title: this.#element.querySelector('#movie-title').value.trim(),
      genre: this.#element.querySelector('#movie-genre').value,
      year: parseInt(this.#element.querySelector('#movie-year').value) || new Date().getFullYear(),
      rating: parseFloat(this.#element.querySelector('#movie-rating').value) || 0,
      description: this.#element.querySelector('#movie-description').value.trim(),
      image: finalImage
    };
    
    const errors = validateMovieData(formData);
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    
    this.#onSubmit(formData);
    this.#resetForm();
  }

  #resetForm() {
    const form = this.#element.querySelector('#add-movie-form');
    form.reset();
    
    const preview = this.#element.querySelector('.image-upload-preview');
    preview.style.backgroundImage = 'none';
    preview.innerHTML = '<span class="upload-text">Нажмите для загрузки постера</span>';
    
    this.#imagePreview = null;
    this.#imageUrl = null;
  }

  show() {
    this.#element.style.display = 'flex';
    this.#element.querySelector('#movie-title').focus();
  }

  hide() {
    this.#element.style.display = 'none';
    this.#resetForm();
  }

  removeElement() {
    this.#element = null;
  }
}
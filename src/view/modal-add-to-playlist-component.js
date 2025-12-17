import {createElement} from '../framework/render.js';

function createModalAddToPlaylistTemplate() {
  return (
    `<div class="modal" id="modal-add-to-playlist">
      <div class="modal-content">
        <h2>Добавить в плейлист</h2>
        <div class="playlist-selection">
          <p>Выберите плейлист для фильма: <strong id="selected-movie-name"></strong></p>
          <div id="available-playlists">
            <!-- Плейлисты будут добавляться динамически -->
          </div>
          <p id="no-playlists-message" style="display: none; color: #64748b; font-style: italic;">
            У вас пока нет плейлистов. Создайте плейлист сначала.
          </p>
        </div>
        <div class="form-buttons">
          <button type="button" class="cancel">Отмена</button>
        </div>
      </div>
    </div>`
  );
}

export default class ModalAddToPlaylistComponent {
  #element = null;
  #onSelect = null;
  #onCancel = null;
  #currentMovieTitle = '';

  constructor({ playlists, onSelect, onCancel }) {
    this.#onSelect = onSelect;
    this.#onCancel = onCancel;
    this.playlists = playlists;
  }

  getTemplate() {
    return createModalAddToPlaylistTemplate();
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
      this.#initEventListeners();
    }
    return this.#element;
  }

  #initEventListeners() {
    const cancelBtn = this.#element.querySelector('.cancel');
    
    cancelBtn.addEventListener('click', () => {
      this.#onCancel();
    });
    
    this.#element.addEventListener('click', (e) => {
      if (e.target === this.#element) {
        this.#onCancel();
      }
    });
  }

  updatePlaylists(playlists, movieTitle) {
    this.playlists = playlists;
    this.#currentMovieTitle = movieTitle;
    this.#renderPlaylists();
  }

  #renderPlaylists() {
    const movieNameElement = this.#element.querySelector('#selected-movie-name');
    const playlistsContainer = this.#element.querySelector('#available-playlists');
    const noPlaylistsMessage = this.#element.querySelector('#no-playlists-message');
    
    if (movieNameElement) {
      movieNameElement.textContent = this.#currentMovieTitle;
    }
    
    playlistsContainer.innerHTML = '';
    
    if (this.playlists.length === 0) {
      noPlaylistsMessage.style.display = 'block';
      return;
    }
    
    noPlaylistsMessage.style.display = 'none';
    
    this.playlists.forEach(playlist => {
      const isAlreadyAdded = playlist.movies.includes(this.#currentMovieTitle);
      
      const playlistOption = document.createElement('div');
      playlistOption.className = 'playlist-option';
      playlistOption.innerHTML = `
        <label>
          <input type="radio" name="selected-playlist" value="${playlist.id}" 
                 ${isAlreadyAdded ? 'disabled' : ''} />
          ${playlist.name}
          ${isAlreadyAdded ? '<span class="already-added">(уже добавлен)</span>' : ''}
          ${playlist.description ? `<br><small>${playlist.description}</small>` : ''}
        </label>
      `;
      
      const radio = playlistOption.querySelector('input');
      if (radio && !isAlreadyAdded) {
        radio.addEventListener('change', () => {
          this.#onSelect(playlist.id, this.#currentMovieTitle);
        });
      }
      
      playlistsContainer.appendChild(playlistOption);
    });
  }

  show() {
    this.#element.style.display = 'flex';
  }

  hide() {
    this.#element.style.display = 'none';
  }

  removeElement() {
    this.#element = null;
  }
}
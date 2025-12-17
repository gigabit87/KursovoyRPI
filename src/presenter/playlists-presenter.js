import { EMPTY_PLAYLISTS_MESSAGE, UpdateType } from '../const.js';

export default class PlaylistsPresenter {
  #playlistsContainer = null;
  #movieModel = null;

  constructor(playlistsContainer, movieModel) {
    this.#playlistsContainer = playlistsContainer;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelChange.bind(this));
  }

  init() {
    this.#renderPlaylists();
  }

  #handleModelChange(eventType, payload) {
    if (eventType.includes('playlist') || 
        eventType === UpdateType.INIT || 
        eventType === UpdateType.MINOR || 
        eventType === UpdateType.MAJOR) {
      this.updatePlaylists();
    }
  }

  #renderPlaylists() {
    const playlists = this.#movieModel.playlists;
    const playlistContainer = this.#playlistsContainer.querySelector('.playlist-container');
    
    if (!playlistContainer) {
      return;
    }
    
    playlistContainer.innerHTML = '';
    
    if (playlists.length === 0) {
      playlistContainer.innerHTML = `<p style="text-align: center; color: #64748b; font-style: italic;">${EMPTY_PLAYLISTS_MESSAGE}</p>`;
      return;
    }

    playlists.forEach(playlist => {
      const playlistElement = this.#createPlaylistElement(playlist);
      playlistContainer.appendChild(playlistElement);
    });
  }

  #createPlaylistElement(playlist) {
    const element = document.createElement('div');
    element.className = 'playlist';
    element.dataset.id = playlist.id;
    
    element.innerHTML = `
      <div class="playlist-header-row">
        <h3>${playlist.name}</h3>
        <button class="delete-playlist" data-id="${playlist.id}">Удалить плейлист</button>
      </div>
      <p class="playlist-description">${playlist.description || ''}</p>
      <ul>
        ${playlist.movies.map(movie => `
          <li>
            ${movie}
            <button class="remove-item" data-playlist="${playlist.id}" data-movie="${movie}">Удалить</button>
          </li>
        `).join('')}
        ${playlist.movies.length === 0 ? '<li style="color: #64748b; font-style: italic;">Плейлист пуст</li>' : ''}
      </ul>
    `;
    
    this.#addPlaylistEventListeners(element, playlist);
    
    return element;
  }

  #addPlaylistEventListeners(element, playlist) {
    const deleteBtn = element.querySelector('.delete-playlist');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Удалить плейлист "${playlist.name}"?`)) {
          this.#movieModel.deletePlaylist(playlist.id)
            .catch(err => {
              alert('Не удалось удалить плейлист');
            });
        }
      });
    }

    const removeItemBtns = element.querySelectorAll('.remove-item');
    removeItemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const playlistId = btn.dataset.playlist;
        const movieTitle = btn.dataset.movie;

        if (confirm(`Удалить "${movieTitle}" из плейлиста?`)) {
          this.#movieModel.removeMovieFromPlaylist(playlistId, movieTitle)
            .catch(err => {
              alert('Не удалось удалить фильм из плейлиста');
            });
        }
      });
    });
  }

  updatePlaylists() {
    this.init();
  }
}
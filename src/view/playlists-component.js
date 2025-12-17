import {createElement} from '../framework/render.js';

function createPlaylistsComponentTemplate() {
  return (
    `<section id="playlists" class="playlists">
      <div class="playlist-header">
        <h2>Мои плейлисты</h2>
        <button id="create-playlist">Создать плейлист</button>
      </div>
      <div class="playlist-container">
        <!-- Плейлисты будут добавляться динамически -->
      </div>
    </section>`
  );
}

export default class PlaylistsComponent {
  #element = null;

  getTemplate() {
    return createPlaylistsComponentTemplate();
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
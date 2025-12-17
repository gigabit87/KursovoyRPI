import ModalAddMovieComponent from '../view/modal-add-movie-component.js';
import ModalCreatePlaylistComponent from '../view/modal-create-playlist-component.js';
import ModalAddToPlaylistComponent from '../view/modal-add-to-playlist-component.js';
import { render } from '../framework/render.js';

export default class ModalPresenter {
  #movieModel = null;
  #modalAddMovie = null;
  #modalCreatePlaylist = null;
  #modalAddToPlaylist = null;
  #container = null;

  constructor(container, movieModel) {
    this.#container = container;
    this.#movieModel = movieModel;
    
    this.#initModals();
    this.#setupEventListeners();
  }

  #initModals() {
    this.#modalAddMovie = new ModalAddMovieComponent({
      onSubmit: this.#handleAddMovie.bind(this),
      onCancel: this.#hideAddMovieModal.bind(this)
    });
    
    this.#modalCreatePlaylist = new ModalCreatePlaylistComponent({
      onSubmit: this.#handleCreatePlaylist.bind(this),
      onCancel: this.#hideCreatePlaylistModal.bind(this)
    });
    
    this.#modalAddToPlaylist = new ModalAddToPlaylistComponent({
      playlists: this.#movieModel.playlists,
      onSelect: this.#handleAddToPlaylist.bind(this),
      onCancel: this.#hideAddToPlaylistModal.bind(this)
    });
    
    render(this.#modalAddMovie, this.#container);
    render(this.#modalCreatePlaylist, this.#container);
    render(this.#modalAddToPlaylist, this.#container);
    
    this.#modalAddMovie.getElement().style.display = 'none';
    this.#modalCreatePlaylist.getElement().style.display = 'none';
    this.#modalAddToPlaylist.getElement().style.display = 'none';
  }

  #setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'add-movie' || e.target.closest('#add-movie')) {
        e.preventDefault();
        this.#showAddMovieModal();
      }
    });
    
    document.addEventListener('click', (e) => {
      if (e.target.id === 'create-playlist' || e.target.closest('#create-playlist')) {
        e.preventDefault();
        this.#showCreatePlaylistModal();
      }
    });
    
    document.addEventListener('open-add-to-playlist-modal', (e) => {
      const { movieTitle } = e.detail;
      this.#showAddToPlaylistModal(movieTitle);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.#hideAllModals();
      }
    });
  }

  #showAddMovieModal() {
    this.#hideAllModals();
    this.#modalAddMovie.show();
  }

  #hideAddMovieModal() {
    this.#modalAddMovie.hide();
  }

  #showCreatePlaylistModal() {
    this.#hideAllModals();
    this.#modalCreatePlaylist.show();
  }

  #hideCreatePlaylistModal() {
    this.#modalCreatePlaylist.hide();
  }

  #showAddToPlaylistModal(movieTitle) {
    this.#hideAllModals();
    this.#modalAddToPlaylist.updatePlaylists(this.#movieModel.playlists, movieTitle);
    this.#modalAddToPlaylist.show();
  }

  #hideAddToPlaylistModal() {
    this.#modalAddToPlaylist.hide();
  }

  #hideAllModals() {
    this.#modalAddMovie.hide();
    this.#modalCreatePlaylist.hide();
    this.#modalAddToPlaylist.hide();
  }

  #handleAddMovie(movieData) {
    this.#movieModel.addMovie(movieData);
    this.#hideAddMovieModal();
  }

  #handleCreatePlaylist(playlistData) {
    this.#movieModel.createPlaylist(playlistData);
    this.#hideCreatePlaylistModal();
  }

  #handleAddToPlaylist(playlistId, movieTitle) {
    this.#movieModel.addMovieToPlaylist(playlistId, movieTitle);
    this.#hideAddToPlaylistModal();
  }
}
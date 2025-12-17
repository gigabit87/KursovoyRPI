import HeaderComponent from './view/header-component.js';
import ControlsComponent from './view/controls-component.js';
import CatalogComponent from './view/catalog-component.js';
import FavoritesComponent from './view/favorites-component.js';
import PlaylistsComponent from './view/playlists-component.js';
import ClearPlaylistsButtonComponent from './view/clear-playlists-button-component.js';
import { render } from './framework/render.js';

import MovieModel from './model/movie-model.js';
import MoviesApiService from './api/movies-api-service.js';
import CatalogPresenter from './presenter/catalog-presenter.js';
import FavoritesPresenter from './presenter/favorites-presenter.js';
import PlaylistsPresenter from './presenter/playlists-presenter.js';
import ModalPresenter from './presenter/modal-presenter.js';
import NotificationService from './services/notification-service.js';

const MOCK_API_URL = 'https://6933d0d34090fe3bf01e1237.mockapi.io';

const moviesApiService = new MoviesApiService(MOCK_API_URL);

const movieModel = new MovieModel({
  moviesApiService
});

const bodyContainer = document.querySelector('body');
const mainElement = bodyContainer.querySelector('main') || document.createElement('main');
if (!bodyContainer.querySelector('main')) {
  bodyContainer.appendChild(mainElement);
}

const headerComponent = new HeaderComponent();
const controlsComponent = new ControlsComponent();
const catalogComponent = new CatalogComponent([]);
const favoritesComponent = new FavoritesComponent();
const playlistsComponent = new PlaylistsComponent();

render(headerComponent, bodyContainer, 'afterbegin');
render(controlsComponent, headerComponent.getElement(), 'afterend');
render(catalogComponent, mainElement);
render(favoritesComponent, catalogComponent.getElement(), 'afterend');
render(playlistsComponent, favoritesComponent.getElement(), 'afterend');
  
const catalogContainer = document.querySelector('#catalog');
const favoritesContainer = document.querySelector('#favorites');
const playlistsContainer = document.querySelector('#playlists');

const catalogPresenter = new CatalogPresenter(catalogContainer, movieModel);
const favoritesPresenter = new FavoritesPresenter(favoritesContainer, movieModel);
const playlistsPresenter = new PlaylistsPresenter(playlistsContainer, movieModel);
const modalPresenter = new ModalPresenter(bodyContainer, movieModel);
  
const clearPlaylistsButton = new ClearPlaylistsButtonComponent({
  onClick: async () => {
    const playlists = movieModel.playlists;
    for (const playlist of playlists) {
      try {
        await movieModel.deletePlaylist(playlist.id);
      } catch (error) {
      }
    }
  },
  initialDisabled: true
});

const playlistsSection = document.querySelector('#playlists');
if (playlistsSection) {
  const playlistHeader = playlistsSection.querySelector('.playlist-header');
  if (playlistHeader) {
    render(clearPlaylistsButton, playlistHeader, 'beforeend');
  }
}

const loadingElement = document.createElement('div');
loadingElement.className = 'loading';
loadingElement.textContent = 'Загрузка данных...';
mainElement.prepend(loadingElement);

document.addEventListener('show-notification', (e) => {
  const { message, type } = e.detail;
  NotificationService.show(message, type);
});

const initApp = async () => {
  try {
    await movieModel.init();
    
    loadingElement.remove();

    NotificationService.show('Фильмы загружены из MockAPI', 'info', 2500);

    catalogPresenter.init();
    favoritesPresenter.init();
    playlistsPresenter.init();

    if (movieModel.playlists.length === 0) {
      clearPlaylistsButton.disable();
    } else {
      clearPlaylistsButton.enable();
    }
    
  } catch (error) {
    loadingElement.remove();
    
    NotificationService.show(
      `Не удалось загрузить данные из MockAPI: ${error?.message || 'unknown error'}`,
      'error',
      5000
    );
    catalogPresenter.init();
    favoritesPresenter.init();
    playlistsPresenter.init();
  }
};
  
initApp();
window.movieModel = movieModel;
window.moviesApiService = moviesApiService;
import MovieCardComponent from '../view/movie-card-component.js';
import { render, remove } from '../framework/render.js';
import { EMPTY_FAVORITES_MESSAGE, UpdateType } from '../const.js';

export default class FavoritesPresenter {
  #favoritesContainer = null;
  #movieModel = null;
  #favoriteMovies = [];
  #movieComponents = [];

  constructor(favoritesContainer, movieModel) {
    this.#favoritesContainer = favoritesContainer;
    this.#movieModel = movieModel;
    
    this.#movieModel.addObserver(this.#handleModelChange.bind(this));
  }

  init() {
    this.#favoriteMovies = this.#movieModel.getFavorites();
    this.#renderFavorites();
  }

  #handleModelChange(eventType, payload) {    
    if (eventType === 'favorite-toggled' || 
        eventType === UpdateType.INIT || 
        eventType === UpdateType.MINOR || 
        eventType === UpdateType.MAJOR) {
      this.updateFavorites();
    }
  }

  #renderFavorites() {    
    this.#clearFavorites();
    
    if (this.#favoriteMovies.length === 0) {
      this.#renderEmptyMessage();
      return;
    }

    this.#favoriteMovies.forEach(movie => {
      const movieComponent = new MovieCardComponent(movie);
      const movieElement = movieComponent.getElement();
      
      this.#addEventListeners(movieElement, movie);
      
      const favoritesGrid = this.#favoritesContainer.querySelector('.favorites-grid');
      if (favoritesGrid) {
        render(movieComponent, favoritesGrid);
      }
      
      this.#movieComponents.push(movieComponent);
    });
  }

  #addEventListeners(element, movie) {
    const favoriteBtn = element.querySelector('.favorite');
    const removeBtn = element.querySelector('.remove');
    
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => {
        this.#movieModel.toggleFavorite(movie.id);
      });
    }
    
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (confirm(`Удалить фильм "${movie.title}" из избранного?`)) {
          this.#movieModel.toggleFavorite(movie.id);
        }
      });
    }
  }

  #renderEmptyMessage() {
    const favoritesGrid = this.#favoritesContainer.querySelector('.favorites-grid');
    if (favoritesGrid) {
      favoritesGrid.innerHTML = `<p>${EMPTY_FAVORITES_MESSAGE}</p>`;
    }
  }

  #clearFavorites() {
    this.#movieComponents.forEach(component => remove(component));
    this.#movieComponents = [];
    
    const favoritesGrid = this.#favoritesContainer.querySelector('.favorites-grid');
    if (favoritesGrid) {
      favoritesGrid.innerHTML = '';
    }
  }

  updateFavorites() {
    this.init();
  }
}
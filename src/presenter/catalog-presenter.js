import MovieCardComponent from '../view/movie-card-component.js';
import { render, remove } from '../framework/render.js';
import { EMPTY_MOVIE_MESSAGE, UpdateType } from '../const.js';
import { debounce } from '../utils.js';

export default class CatalogPresenter {
  #catalogContainer = null;
  #movieModel = null;
  #movies = [];
  #movieComponents = [];
  #searchInput = null;
  #genreFilter = null;
  #clearButton = null;

  constructor(catalogContainer, movieModel) {
    this.#catalogContainer = catalogContainer;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelChange.bind(this));
    this.#initControls();
  }

  init(searchTerm = '', genre = 'all') {
    this.#movies = this.#movieModel.getFilteredMovies(searchTerm, genre);
    this.#renderCatalog();
  }

  #handleModelChange(eventType, payload) {
    switch (eventType) {
      case UpdateType.INIT:
        this.#updateCatalog();
        break;
        
      case UpdateType.MINOR:
        this.#updateCatalog();
        break;
        
      case UpdateType.MAJOR:
        this.#updateCatalog();
        break;
        
      case UpdateType.PATCH:
        if (payload.movie) {
          this.#updateMovieCard(payload.movie);
        }
        break;
    }
  }

  #updateCatalog() {
    const searchTerm = this.#searchInput ? this.#searchInput.value : '';
    const genre = this.#genreFilter ? this.#genreFilter.value : 'all';
    this.init(searchTerm, genre);
  }

  #updateMovieCard(updatedMovie) {
    const movieComponent = this.#movieComponents.find(comp => {
      const element = comp.getElement();
      return element && element.dataset.id === updatedMovie.id;
    });
    
    if (movieComponent) {
      remove(movieComponent);
      
      const newMovieComponent = new MovieCardComponent(updatedMovie);
      const movieElement = newMovieComponent.getElement();
      this.#addEventListeners(movieElement, updatedMovie);
      
      const oldElement = movieComponent.getElement();
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.replaceChild(movieElement, oldElement);
      }
      
      const index = this.#movieComponents.indexOf(movieComponent);
      if (index !== -1) {
        this.#movieComponents[index] = newMovieComponent;
      }
    }
  }

  #initControls() {
    this.#searchInput = document.getElementById('search');
    this.#genreFilter = document.getElementById('genre-filter');
    this.#clearButton = document.createElement('button');
    this.#clearButton.id = 'clear-search';
    this.#clearButton.textContent = 'Очистить';
    this.#clearButton.className = 'clear-button';
    this.#clearButton.style.display = 'none';
    
    const controls = document.querySelector('.controls');
    if (controls) {
      controls.appendChild(this.#clearButton);
    }
    
    if (this.#searchInput) {
      const debouncedSearch = debounce((e) => {
        this.#handleSearch(e.target.value);
      }, 300);
      
      this.#searchInput.addEventListener('input', debouncedSearch);
      
      this.#searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.#handleSearch(e.target.value);
        }
      });
    }
    
    if (this.#genreFilter) {
      this.#genreFilter.addEventListener('change', (e) => {
        this.#handleFilterChange(e.target.value);
      });
    }
    
    this.#clearButton.addEventListener('click', () => {
      this.#clearSearch();
    });
  }

  #handleSearch(searchTerm) {
    const genre = this.#genreFilter ? this.#genreFilter.value : 'all';
    this.init(searchTerm, genre);
    
    if (searchTerm.trim()) {
      this.#clearButton.style.display = 'inline-block';
    } else {
      this.#clearButton.style.display = 'none';
    }
  }

  #handleFilterChange(genre) {
    const searchTerm = this.#searchInput ? this.#searchInput.value : '';
    this.init(searchTerm, genre);
  }

  #clearSearch() {
    if (this.#searchInput) {
      this.#searchInput.value = '';
      this.#handleSearch('');
      this.#clearButton.style.display = 'none';
    }
  }

  #renderCatalog() {
    this.#clearCatalog();
    
    if (this.#movies.length === 0) {
      this.#renderNoResults();
      return;
    }

    this.#movies.forEach(movie => {
      const movieComponent = new MovieCardComponent(movie);
      const movieElement = movieComponent.getElement();
      
      this.#addEventListeners(movieElement, movie);
      
      const movieGrid = this.#catalogContainer.querySelector('.movie-grid');
      if (movieGrid) {
        render(movieComponent, movieGrid);
      }
      
      this.#movieComponents.push(movieComponent);
    });
  }

  #addEventListeners(element, movie) {
    const favoriteBtn = element.querySelector('.favorite');
    const removeBtn = element.querySelector('.remove');
    const playlistBtn = element.querySelector('.add-to-playlist');
    
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => {
        this.#movieModel.toggleFavorite(movie.id);
      });
    }
    
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (confirm(`Удалить фильм "${movie.title}"?`)) {
          this.#movieModel.deleteMovie(movie.id)
            .catch(err => {
              alert('Не удалось удалить фильм');
            });
        }
      });
    }
    
    if (playlistBtn) {
      playlistBtn.addEventListener('click', () => {
        this.#handleAddToPlaylist(movie.title);
      });
    }
  }

  #handleAddToPlaylist(movieTitle) {
    const event = new CustomEvent('open-add-to-playlist-modal', {
      detail: { movieTitle }
    });
    document.dispatchEvent(event);
  }

  #renderNoResults() {
    const movieGrid = this.#catalogContainer.querySelector('.movie-grid');
    if (movieGrid) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `<p>${EMPTY_MOVIE_MESSAGE}</p>`;
      movieGrid.appendChild(noResults);
    }
  }

  #clearCatalog() {
    this.#movieComponents.forEach(component => remove(component));
    this.#movieComponents = [];
    
    const movieGrid = this.#catalogContainer.querySelector('.movie-grid');
    if (movieGrid) {
      movieGrid.innerHTML = '';
    }
  }
}
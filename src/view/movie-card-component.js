import {createElement} from '../framework/render.js';
import { MOVIE_GENRES } from '../const.js';

function createMovieCardComponentTemplate(movie) {
  const genreName = MOVIE_GENRES[movie.genre] || movie.genre;
  const favoriteClass = movie.isFavorite ? 'favorite-active' : '';
  const favoriteText = movie.isFavorite ? 'В избранном' : 'В избранное';
  
  return (
    `<div class="movie-card" data-id="${movie.id}">
      <img src="${movie.image}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'" />
      <div class="info">
        <h3>${movie.title}</h3>
        <div class="movie-meta">
          <span class="genre">${genreName}</span>
          <span class="year">${movie.year}</span>
          ${movie.rating ? `<span class="rating">⭐ ${movie.rating}</span>` : ''}
        </div>
        <p class="desc">${movie.description}</p>
      </div>
      <div class="actions">
        <button class="favorite ${favoriteClass}" data-id="${movie.id}">${favoriteText}</button>
        <button class="add-to-playlist" data-id="${movie.id}" data-title="${movie.title}">В плейлист</button>
        <button class="remove" data-id="${movie.id}">Удалить</button>
      </div>
    </div>`
  );
}

export default class MovieCardComponent {
  #element = null;
  #movie = null;

  constructor(movie) {
    this.#movie = movie;
  }

  getTemplate() {
    return createMovieCardComponentTemplate(this.#movie);
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
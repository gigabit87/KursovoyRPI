import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getMovie(id) {
    return this._load({url: `movies/${id}`})
      .then(ApiService.parseResponse);
  }

  addMovie(movie) {
    return this._load({
      url: 'movies',
      method: Method.POST,
      body: JSON.stringify(movie),
    })
      .then(ApiService.parseResponse);
  }

  updateMovie(id, movie) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(movie),
    })
      .then(ApiService.parseResponse);
  }

  deleteMovie(id) {
    return this._load({
      url: `movies/${id}`,
      method: Method.DELETE,
    });
  }

  get playlists() {
    return this._load({url: 'playlists'})
      .then(ApiService.parseResponse);
  }

  getPlaylist(id) {
    return this._load({url: `playlists/${id}`})
      .then(ApiService.parseResponse);
  }

  addPlaylist(playlist) {
    return this._load({
      url: 'playlists',
      method: Method.POST,
      body: JSON.stringify(playlist),
    })
      .then(ApiService.parseResponse);
  }

  updatePlaylist(id, playlist) {
    return this._load({
      url: `playlists/${id}`,
      method: Method.PUT,
      body: JSON.stringify(playlist),
    })
      .then(ApiService.parseResponse);
  }

  deletePlaylist(id) {
    return this._load({
      url: `playlists/${id}`,
      method: Method.DELETE,
    });
  }
}
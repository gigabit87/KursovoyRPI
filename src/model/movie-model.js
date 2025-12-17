import Observable from '../framework/observable.js';
import { UpdateType, UserAction } from '../const.js';

export default class MovieModel extends Observable {
  #moviesApiService = null;
  #movies = [];
  #playlists = [];

  constructor({moviesApiService}) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  async init() {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
      
      const playlists = await this.#moviesApiService.playlists;
      this.#playlists = playlists.map(this.#adaptPlaylistToClient);
      
      this._notify(UpdateType.INIT, { movies: this.#movies, playlists: this.#playlists });
      
    } catch(err) {
      this.#movies = [];
      this.#playlists = [];
      this._notify(UpdateType.INIT, { movies: [], playlists: [] });
    }
  }

  async addMovie(movieData) {
    try {
      const movieToSend = this.#adaptToServer({
        ...movieData,
        isFavorite: false,
        rating: movieData.rating || 0,
        year: movieData.year || new Date().getFullYear(),
        createdAt: new Date().toISOString()
      });
      const response = await this.#moviesApiService.addMovie(movieToSend);
      const createdMovie = this.#adaptToClient(response);
      this.#movies.push(createdMovie);
      this._notify(UserAction.ADD_MOVIE, createdMovie);
      this._notify(UpdateType.MINOR, { movies: this.#movies });
      
      return createdMovie;
      
    } catch (err) {
      throw new Error(`Не удалось добавить фильм: ${err.message}`);
    }
  }

  async updateMovie(id, updates) {
    try {
      const movieIndex = this.#movies.findIndex(m => m.id === id);
      if (movieIndex === -1) {
        throw new Error(`Фильм с ID ${id} не найден`);
      }
      
      const updatedMovie = { ...this.#movies[movieIndex], ...updates };
      this.#movies[movieIndex] = updatedMovie;
      
      const movieToSend = this.#adaptToServer(updatedMovie);
      await this.#moviesApiService.updateMovie(id, movieToSend);
      
      this._notify(UserAction.UPDATE_MOVIE, updatedMovie);
      this._notify(UpdateType.PATCH, { movie: updatedMovie });
      
      return updatedMovie;
      
    } catch (err) {
      throw err;
    }
  }

  async deleteMovie(id) {
    try {
      const movieIndex = this.#movies.findIndex(m => m.id === id);
      if (movieIndex === -1) {
        throw new Error(`Фильм с ID ${id} не найден`);
      }
      
      const movieToRemove = this.#movies[movieIndex];
      
      await this.#moviesApiService.deleteMovie(id);
      
      this.#movies.splice(movieIndex, 1);
      
      this.#playlists.forEach(playlist => {
        playlist.movies = playlist.movies.filter(m => m !== movieToRemove.title);
      });
      
      this._notify(UserAction.DELETE_MOVIE, { id });
      this._notify(UpdateType.MINOR, { 
        movies: this.#movies, 
        playlists: this.#playlists 
      });
      
    } catch (err) {
      throw err;
    }
  }

  async toggleFavorite(id) {
    try {
      const movieIndex = this.#movies.findIndex(m => m.id === id);
      if (movieIndex === -1) {
        return;
      }
      
      const newFavoriteStatus = !this.#movies[movieIndex].isFavorite;
      this.#movies[movieIndex].isFavorite = newFavoriteStatus;

      const movie = this.#movies[movieIndex];
      if (!movie.isLocal) {
        const movieToSend = this.#adaptToServer(movie);
        await this.#moviesApiService.updateMovie(id, movieToSend);
      }

      this._notify(UserAction.UPDATE_MOVIE, movie);
      this._notify(UpdateType.PATCH, { movie: movie });
      this._notify('favorite-toggled', { id, isFavorite: newFavoriteStatus });
    } catch (err) {
      const movieIndex = this.#movies.findIndex(m => m.id === id);
      if (movieIndex !== -1) {
        this.#movies[movieIndex].isFavorite = !this.#movies[movieIndex].isFavorite;
      }

      throw err;
    }
  }

  async createPlaylist(playlistData) {
    try {
      const playlistToSend = this.#adaptPlaylistToServer({
        ...playlistData,
        movies: [],
        createdAt: new Date().toISOString()
      });
      const response = await this.#moviesApiService.addPlaylist(playlistToSend);
      
      const createdPlaylist = this.#adaptPlaylistToClient(response);

      this.#playlists.push(createdPlaylist);
      this._notify(UserAction.ADD_PLAYLIST, createdPlaylist);
      this._notify(UpdateType.MINOR, { playlists: this.#playlists });
      
      return createdPlaylist;
      
    } catch (err) {
      throw new Error(`Не удалось создать плейлист: ${err.message}`);
    }
  }

  async deletePlaylist(id) {
    try {
      const playlistIndex = this.#playlists.findIndex(p => p.id === id);
      if (playlistIndex === -1) {
        throw new Error(`Плейлист с ID ${id} не найден`);
      }
      await this.#moviesApiService.deletePlaylist(id);
      
      this.#playlists.splice(playlistIndex, 1);

      this._notify(UserAction.DELETE_PLAYLIST, { id });
      this._notify(UpdateType.MINOR, { playlists: this.#playlists });
      
    } catch (err) {
      throw err;
    }
  }

  async addMovieToPlaylist(playlistId, movieTitle) {
    try {
      const playlistIndex = this.#playlists.findIndex(p => p.id === playlistId);
      if (playlistIndex === -1) {
        throw new Error(`Плейлист с ID ${playlistId} не найден`);
      }
      
      const playlist = this.#playlists[playlistIndex];
      if (playlist.movies.includes(movieTitle)) {
        return;
      }

      const updatedPlaylist = {
        ...playlist,
        movies: [...playlist.movies, movieTitle]
      };
      this.#playlists[playlistIndex] = updatedPlaylist;
      
      const playlistToSend = this.#adaptPlaylistToServer(updatedPlaylist);
      await this.#moviesApiService.updatePlaylist(playlistId, playlistToSend);
      
      this._notify(UserAction.UPDATE_PLAYLIST, updatedPlaylist);
      this._notify(UpdateType.PATCH, { playlist: updatedPlaylist });
      
    } catch (err) {
      throw err;
    }
  }

  async removeMovieFromPlaylist(playlistId, movieTitle) {
    try {
      const playlistIndex = this.#playlists.findIndex(p => p.id === playlistId);
      if (playlistIndex === -1) {
        throw new Error(`Плейлист с ID ${playlistId} не найден`);
      }
      
      const playlist = this.#playlists[playlistIndex];
      
      const updatedPlaylist = {
        ...playlist,
        movies: playlist.movies.filter(m => m !== movieTitle)
      };
      this.#playlists[playlistIndex] = updatedPlaylist;
      
      const playlistToSend = this.#adaptPlaylistToServer(updatedPlaylist);
      await this.#moviesApiService.updatePlaylist(playlistId, playlistToSend);
      
      this._notify(UserAction.UPDATE_PLAYLIST, updatedPlaylist);
      this._notify(UpdateType.PATCH, { playlist: updatedPlaylist });
      
    } catch (err) {
      throw err;
    }
  }

  get movies() {
    return this.#movies;
  }

  get playlists() {
    return this.#playlists;
  }

  getFilteredMovies(searchTerm = '', genre = 'all') {
    let filtered = [...this.#movies];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(term) || 
        movie.description.toLowerCase().includes(term)
      );
    }

    if (genre !== 'all') {
      filtered = filtered.filter(movie => movie.genre === genre);
    }

    return filtered;
  }

  getFavorites() {
    return this.#movies.filter(movie => movie.isFavorite);
  }

  #adaptToClient(movie) {
    const adapted = {
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      description: movie.description,
      image: movie.image,
      year: Number(movie.year) || new Date().getFullYear(),
      rating: Number(movie.rating) || 0,
      isFavorite: Boolean(movie.isFavorite),
      createdAt: movie.createdAt || movie.created_at || new Date().toISOString()
    };
    
    return adapted;
  }

  #adaptToServer(movie) {
    const adapted = {
      title: movie.title,
      genre: movie.genre,
      description: movie.description,
      image: movie.image,
      year: movie.year,
      rating: movie.rating,
      isFavorite: movie.isFavorite,
      created_at: movie.createdAt
    };
    
    return adapted;
  }

  #adaptPlaylistToClient(playlist) {
    const adapted = {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      movies: playlist.movies || [],
      createdAt: playlist.createdAt || playlist.created_at || new Date().toISOString()
    };
    
    return adapted;
  }

  #adaptPlaylistToServer(playlist) {
    const adapted = {
      name: playlist.name,
      description: playlist.description,
      movies: playlist.movies,
      created_at: playlist.createdAt
    };
    
    return adapted;
  }
}
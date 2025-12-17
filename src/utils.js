export const validateMovieData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 2) {
    errors.push('Название должно содержать минимум 2 символа');
  }
  
  if (!data.genre) {
    errors.push('Выберите жанр');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Описание должно содержать минимум 10 символов');
  }
  
  return errors;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};
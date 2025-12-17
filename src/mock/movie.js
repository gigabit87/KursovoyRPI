export const mockMovies = [
  {
    id: '1',
    title: 'Интерстеллар',
    genre: 'fantasy',
    description: 'Космическая одиссея о любви, времени и выживании человечества.',
    image: 'image/int.webp',
    isFavorite: false,
    rating: 8.6,
    year: 2014
  },
  {
    id: '2',
    title: 'Форсаж 1',
    genre: 'action',
    description: 'Полицейский под прикрытием Брайан О\'Коннор внедряется в банду гонщиков.',
    image: 'image/fast.webp',
    isFavorite: true,
    rating: 6.8,
    year: 2001
  },
  {
    id: '3',
    title: 'Джон Уик',
    genre: 'action',
    description: 'Профессиональный убийца мстит за гибель своей собаки и кражу машины.',
    image: 'image/uik.webp',
    isFavorite: false,
    rating: 7.4,
    year: 2014
  },
  {
    id: '4',
    title: 'Начало',
    genre: 'fantasy',
    description: 'Вор, специализирующийся на краже секретов, получает задание внедрить идею.',
    image: 'image/inception.jpg',
    isFavorite: true,
    rating: 8.8,
    year: 2010
  },
  {
    id: '5',
    title: 'Побег из Шоушенка',
    genre: 'drama',
    description: 'Банкир Энди Дюфрейн обвинен в убийстве жены и отправлен в тюрьму.',
    image: 'image/shawshank.jpg',
    isFavorite: true,
    rating: 9.3,
    year: 1994
  },
  {
    id: '6',
    title: 'Крестный отец',
    genre: 'drama',
    description: 'Хроника жизни семьи итальянских иммигрантов, возглавляемых Вито Корлеоне.',
    image: 'image/godfather.jpg',
    isFavorite: false,
    rating: 9.2,
    year: 1972
  },
  {
    id: '7',
    title: 'Темный рыцарь',
    genre: 'action',
    description: 'Бэтмен сталкивается с Джокером, хаотичным преступником, терроризирующим Готэм.',
    image: 'image/darkknight.jpg',
    isFavorite: true,
    rating: 9.0,
    year: 2008
  },
  {
    id: '8',
    title: 'Форрест Гамп',
    genre: 'drama',
    description: 'История жизни Форреста Гампа, простого парня с добрым сердцем.',
    image: 'image/forrest.jpg',
    isFavorite: false,
    rating: 8.8,
    year: 1994
  },
  {
    id: '9',
    title: 'Матрица',
    genre: 'fantasy',
    description: 'Хакер по имени Нео узнает, что его мир - лишь симуляция реальности.',
    image: 'image/matrix.jpg',
    isFavorite: true,
    rating: 8.7,
    year: 1999
  },
  {
    id: '10',
    title: 'Зеленая миля',
    genre: 'fantasy',
    description: 'Надзиратель тюрьмы узнает, что один из заключенных обладает сверхъестественными способностями.',
    image: 'image/greenmile.jpg',
    isFavorite: false,
    rating: 8.6,
    year: 1999
  }
];

export const mockPlaylists = [
  {
    id: 'playlist-1',
    name: 'Смотреть позже',
    movies: ['Очень странные дела', 'Во все тяжкие'],
    description: 'Фильмы и сериалы для просмотра в свободное время'
  },
  {
    id: 'playlist-2',
    name: 'Любимые фильмы',
    movies: ['Властелин Колец: Две Башни', 'Форсаж 1', 'Матрица'],
    description: 'Мои самые любимые фильмы всех времен'
  },
  {
    id: 'playlist-3',
    name: 'Для вечернего просмотра',
    movies: ['Интерстеллар', 'Начало'],
    description: 'Уютные фильмы для вечернего просмотра'
  }
];
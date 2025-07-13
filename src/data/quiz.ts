export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export const quizData: Record<string, QuizQuestion[]> = {
  '8348447': [
    {
      question: 'Кто главный герой фильма?',
      options: ['Энди Дюфрейн', 'Тони Старк', 'Фродо', 'Гарри Поттер'],
      correctIndex: 0,
    },
    {
      question: 'Где разворачиваются события?',
      options: ['В тюрьме', 'В лесу', 'В школе', 'На корабле'],
      correctIndex: 0,
    },
    {
      question: 'Кто режиссёр фильма?',
      options: ['Фрэнк Дарабонт', 'Кристофер Нолан', 'Питер Джексон', 'Стивен Спилберг'],
      correctIndex: 0,
    },
    {
      question: 'В каком году вышел фильм?',
      options: ['1994', '2000', '1987', '2010'],
      correctIndex: 0,
    },
    {
      question: 'Какой жанр у фильма?',
      options: ['Драма', 'Комедия', 'Ужасы', 'Фантастика'],
      correctIndex: 0,
    },
  ],
  // Добавь вопросы для других фильмов по id, например:
  // 'tt0111161': [...],
};

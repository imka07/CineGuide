import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/kinopoisk';

import { quizData } from '../data/quiz';
import type { QuizQuestion } from '../data/quiz';


interface MovieDetailData {
  id: string;
  name: string;
  year: number;
  rating: { kp: number } | null;
  description: string;
  poster: { url: string } | null;
  releaseDate: string;
  genres: string[];
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // Викторина
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/movie/${id}`);
        setMovie({
          id: data.id,
          name: data.name || data.title || 'Unknown',
          year: data.year ?? new Date(data.releaseDate).getFullYear(),
          rating: data.rating ? { kp: data.rating.kp } : null,
          description: data.description || data.descriptionFull || '',
          poster: data.poster || null,
          releaseDate: data.releaseDate,
          genres: data.genres?.map((g: any) => g.name) || [],
        });
      } catch (e) {
        console.error('API error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!movie) return <p>Фильм не найден.</p>;

  // Получаем вопросы викторины по id фильма
  const quiz: QuizQuestion[] = quizData[movie.id] || [];

  const handleStartQuiz = () => {
    setQuizVisible(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswers([...selectedAnswers, index]);
    const next = currentQuestion + 1;
    if (next < quiz.length) {
      setCurrentQuestion(next);
    } else {
      setShowResult(true);
      setQuizVisible(false);
    }
  };

  const correctCount = selectedAnswers.filter(
    (ans, idx) => quiz[idx]?.correctIndex === ans
  ).length;

  return (
    <div className="movie-detail-page">
      <h1>{movie.name}</h1>
      {movie.poster
        ? <img src={movie.poster.url} alt={movie.name} />
        : <div>No Image</div>
      }
      <p>Рейтинг: {movie.rating ? movie.rating.kp.toFixed(1) : '—'}</p>
      <p>Дата: {new Date(movie.releaseDate).toLocaleDateString()}</p>
      <p>Год: {movie.year}</p>
      <div>
        <strong>Жанры:</strong> {movie.genres.join(', ')}
      </div>
      <div className="description">
        <p>{movie.description}</p>
      </div>

      {!quizVisible && !showResult && quiz.length > 0 && (
        <button onClick={handleStartQuiz}>Попробовать себя в викторине</button>
      )}

      {quizVisible && (
        <div className="quiz">
          <h3>Вопрос {currentQuestion + 1} из {quiz.length}</h3>
          <p>{quiz[currentQuestion].question}</p>
          <ul>
            {quiz[currentQuestion].options.map((opt, i) => (
              <li key={i}>
                <button onClick={() => handleAnswer(i)}>{opt}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResult && (
        <div className="quiz-result">
          <h3>Результат викторины</h3>
          <p>Вы ответили правильно на {correctCount} из {quiz.length} вопросов.</p>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;

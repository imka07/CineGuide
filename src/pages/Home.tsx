import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/FiltersPanel';
import InfiniteScroll from '../components/InfiniteScroll';
import { quizData } from '../data/quiz';
import type { QuizQuestion } from '../data/quiz';
import '../styles/Home.css'; // стили модалки и бейджей
import BackToTop from '../components/BackToTop';

const ALL_QUESTIONS: QuizQuestion[] = Object.values(quizData).flat();

function getRandomQuestions(count: number): QuizQuestion[] {
  const copy = [...ALL_QUESTIONS];
  const res: QuizQuestion[] = [];
  while (res.length < count && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
}

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const [runs, setRuns] = useState(0);

  // при загрузке читаем runs
  useEffect(() => {
    const stored = Number(localStorage.getItem('quizRuns') || 0);
    setRuns(stored);
  }, []);

  const openQuiz = () => {
    setQuiz(getRandomQuestions(5));
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setModalOpen(true);
  };

  const answerQuestion = (idx: number) => {
    setAnswers(prev => [...prev, idx]);
    if (currentQ + 1 < quiz.length) {
      setCurrentQ(q => q + 1);
    } else {

      setShowResult(true);

      const newRuns = runs + 1;
      localStorage.setItem('quizRuns', String(newRuns));
      setRuns(newRuns);
    }
  };

  const correctCount = answers.filter(
    (ans, i) => quiz[i]?.correctIndex === ans
  ).length;


  const badge =
    runs >= 9 ? 'gold.png'
      : runs >= 6 ? 'silver.png'
      : runs >= 3 ? 'bronze.png'
      : null;

  return (
    <div className="home-page">
      <h3>Личный гид по фильмам</h3>

      {/* Кнопка викторины и бейдж */}
      <div className="quiz-header">
         <div className="quiz-header-text">
            <h2>Проверь себя!</h2>
            <p>Пройди нашу короткую викторину и узнай, настоящий ли ты киноман 🎬</p>
          </div>
        <button className='quiz-start-btn' onClick={openQuiz}>Начать викторину</button>
        {badge && (
          <img
            src={`/${badge}`}
            alt="Ваш бейдж"
            className="quiz-badge"
          />
        )}
      </div>

      <FiltersPanel />
      <InfiniteScroll />
      <BackToTop />

      {/* Модалка викторины */}
      {modalOpen && (
        <div className="quiz-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="quiz-modal"
            onClick={e => e.stopPropagation()}
          >
            {!showResult && (
              <>
                <h3>Вопрос {currentQ + 1} из {quiz.length}</h3>
                <p>{quiz[currentQ].question}</p>
                <ul className="quiz-options">
                  {quiz[currentQ].options.map((opt, i) => (
                    <li key={i}>
                      <button onClick={() => answerQuestion(i)}>{opt}</button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {showResult && (
              <>
                <h3>Результат: {correctCount} из {quiz.length}</h3>
                <p>
                  {correctCount >= 4
                    ? 'Блестяще! Ты в нашем кино-премиуме!'
                    : correctCount >= 2
                      ? 'Неплохо, но можно лучше!'
                      : 'Похоже, стоит пересмотреть классику.'}
                </p>
                <button className='close-modal-btn' onClick={() => setModalOpen(false)}>Закрыть</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

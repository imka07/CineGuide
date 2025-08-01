// Тестовая функция для проверки работы фильтрации
import { isContentSafe } from './contentFilter';
import { CONTENT_FILTER_CONFIG } from '../config/contentFilterConfig';
import type { ContentFilter } from './contentFilter';

interface TestCase {
  title: string;
  genres: string[];
  rating: number;
  year: number;
  overview?: string;
  expected: boolean;
  description: string;
}

export function testContentFilter(): void {
  const testCases: TestCase[] = [
    // Тест 1: Фильм с эротическим названием (должен быть заблокирован)
    {
      title: "Dirty Ice Cream",
      genres: ["drama"],
      rating: 5.3,
      year: 2024,
      expected: false,
      description: "Фильм с эротическим названием должен быть заблокирован"
    },
    
    // Тест 2: Корейский эротический фильм (должен быть заблокирован)
    {
      title: "새엄마의 욕망",
      genres: ["drama", "melodrama"],
      rating: 7.3,
      year: 2020,
      expected: false,
      description: "Корейский эротический фильм должен быть заблокирован"
    },
    
    // Тест 3: Фильм с подозрительным названием (должен быть заблокирован)
    {
      title: "Belyas",
      genres: ["drama"],
      rating: 7.3,
      year: 2025,
      expected: false,
      description: "Фильм с подозрительным названием должен быть заблокирован"
    },
    
    // Тест 4: Новые проблемные фильмы (должны быть заблокированы)
    {
      title: "Sorority",
      genres: ["drama", "melodrama"],
      rating: 6.5,
      year: 2025,
      expected: false,
      description: "Фильм Sorority должен быть заблокирован"
    },
    
    {
      title: "Ligaw",
      genres: ["drama"],
      rating: 7.5,
      year: 2025,
      expected: false,
      description: "Фильм Ligaw должен быть заблокирован"
    },
    
    {
      title: "Tatsulok: Tatlo Magkasalo",
      genres: ["drama"],
      rating: 6.0,
      year: 2024,
      expected: false,
      description: "Фильм Tatsulok должен быть заблокирован"
    },
    
    {
      title: "Удовольствие",
      genres: ["drama"],
      rating: 6.3,
      year: 2021,
      expected: false,
      description: "Фильм Удовольствие должен быть заблокирован"
    },
    
    {
      title: "我為卿狂",
      genres: ["drama"],
      rating: 5.2,
      year: 1991,
      expected: false,
      description: "Китайский эротический фильм должен быть заблокирован"
    },
    
    {
      title: "Kelas Bintang - Salome",
      genres: ["drama"],
      rating: 10.0,
      year: 2023,
      expected: false,
      description: "Фильм Salome должен быть заблокирован"
    },
    
    {
      title: "扉を閉めた女教師",
      genres: ["drama"],
      rating: 5.6,
      year: 2021,
      expected: false,
      description: "Японский эротический фильм должен быть заблокирован"
    },
    
    {
      title: "Kiskisan",
      genres: ["drama"],
      rating: 6.8,
      year: 2024,
      expected: false,
      description: "Фильм Kiskisan должен быть заблокирован"
    },
    
    {
      title: "Частные уроки",
      genres: ["drama"],
      rating: 7.0,
      year: 2013,
      expected: false,
      description: "Фильм Частные уроки должен быть заблокирован"
    },
    
    {
      title: "Сладкий кнут",
      genres: ["drama"],
      rating: 5.7,
      year: 2013,
      expected: false,
      description: "Фильм Сладкий кнут должен быть заблокирован"
    },
    
    {
      title: "Sweet Whip",
      genres: ["drama"],
      rating: 5.7,
      year: 2013,
      expected: false,
      description: "Фильм Sweet Whip должен быть заблокирован"
    },
    
    // Тест 5: Нормальный фильм (должен пройти)
    {
      title: "The Shawshank Redemption",
      genres: ["drama"],
      rating: 9.3,
      year: 1994,
      expected: true,
      description: "Нормальный фильм должен пройти фильтрацию"
    },
    
    // Тест 6: Фильм с низким рейтингом (должен пройти)
    {
      title: "Some Movie",
      genres: ["drama"],
      rating: 3.5,
      year: 2020,
      expected: true,
      description: "Фильм с низким рейтингом должен пройти фильтрацию"
    },
    
    // Тест 7: Фильм с запрещенным жанром (должен быть заблокирован)
    {
      title: "Horror Movie",
      genres: ["horror"],
      rating: 7.0,
      year: 2020,
      expected: false,
      description: "Фильм с запрещенным жанром должен быть заблокирован"
    },
    
    // Тест 8: Война миров (должен пройти)
    {
      title: "Война миров",
      genres: ["sci-fi", "action"],
      rating: 4.6,
      year: 2025,
      expected: true,
      description: "Фильм Война миров должен пройти фильтрацию"
    },
    
    // Тест 9: Истребитель демонов (должен пройти)
    {
      title: "Истребитель демонов: Бесконечный замок",
      genres: ["animation", "action"],
      rating: 7.0,
      year: 2025,
      expected: true,
      description: "Аниме Истребитель демонов должно пройти фильтрацию"
    }
  ];

  console.log('🧪 Тестирование системы фильтрации контента...\n');

  let passedTests = 0;
  let totalTests = testCases.length;

  testCases.forEach((testCase, index) => {
    const result = isContentSafe(testCase);
    const passed = result === testCase.expected;
    
    if (passed) {
      passedTests++;
      console.log(`✅ Тест ${index + 1}: ${testCase.description}`);
    } else {
      console.log(`❌ Тест ${index + 1}: ${testCase.description}`);
      console.log(`   Ожидалось: ${testCase.expected}, Получено: ${result}`);
      console.log(`   Фильм: "${testCase.title}" (${testCase.year}, рейтинг: ${testCase.rating})`);
    }
  });

  console.log(`\n📊 Результаты: ${passedTests}/${totalTests} тестов прошли`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Все тесты прошли успешно!');
  } else {
    console.log('⚠️  Некоторые тесты не прошли. Проверьте логику фильтрации.');
  }
}

// Функция для тестирования конкретного фильма
export function testSpecificMovie(title: string, genres: string[], rating: number, year: number): void {
  const testCase: ContentFilter = {
    title,
    genres,
    rating,
    year
  };
  
  const isSafe = isContentSafe(testCase);
  console.log(`🎬 Тест фильма "${title}":`);
  console.log(`   Рейтинг: ${rating}, Год: ${year}, Жанры: ${genres.join(', ')}`);
  console.log(`   Результат: ${isSafe ? '✅ ПРОШЕЛ' : '❌ ЗАБЛОКИРОВАН'}`);
  
  // Детальная диагностика
  if (!isSafe) {
    console.log('   🔍 Диагностика блокировки:');
    
    // Проверяем название на запрещенные ключевые слова
    const lowerTitle = title.toLowerCase();
    const forbiddenKeywords = CONTENT_FILTER_CONFIG.FORBIDDEN_KEYWORDS.filter(keyword => 
      lowerTitle.includes(keyword.toLowerCase())
    );
    if (forbiddenKeywords.length > 0) {
      console.log(`   ❌ Запрещенные ключевые слова в названии: ${forbiddenKeywords.join(', ')}`);
    }
    
    // Проверяем жанры
    const lowerGenres = genres.map(g => g.toLowerCase());
    const forbiddenGenres = CONTENT_FILTER_CONFIG.FORBIDDEN_GENRES.filter(genre => 
      lowerGenres.some(g => g.includes(genre.toLowerCase()))
    );
    if (forbiddenGenres.length > 0) {
      console.log(`   ❌ Запрещенные жанры: ${forbiddenGenres.join(', ')}`);
    }
    
    // Проверяем рейтинг
    if (rating < CONTENT_FILTER_CONFIG.MIN_RATING) {
      console.log(`   ❌ Слишком низкий рейтинг: ${rating} < ${CONTENT_FILTER_CONFIG.MIN_RATING}`);
    }
    
    // Проверяем год
    if (year < CONTENT_FILTER_CONFIG.MIN_YEAR) {
      console.log(`   ❌ Слишком старый фильм: ${year} < ${CONTENT_FILTER_CONFIG.MIN_YEAR}`);
    }
  }
  
  console.log('---');
} 
// Фильтрация контента согласно правилам ВК
// Исключаем фильмы, которые могут нарушать правила платформы

import { CONTENT_FILTER_CONFIG, type FilterStats, DEFAULT_FILTER_STATS } from '../config/contentFilterConfig';

export interface ContentFilter {
  title: string;
  genres: string[];
  rating: number;
  year: number;
  overview?: string; // описание фильма
}

// Глобальная статистика фильтрации
let filterStats: FilterStats = { ...DEFAULT_FILTER_STATS };

/**
 * Проверяет, содержит ли текст запрещенные ключевые слова
 */
function containsForbiddenKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  const foundKeywords = CONTENT_FILTER_CONFIG.FORBIDDEN_KEYWORDS.filter((keyword: string) => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  if (foundKeywords.length > 0) {
    console.log('❌ Найдены запрещенные ключевые слова в тексте:', text);
    console.log('   Запрещенные слова:', foundKeywords);
  }
  
  return foundKeywords.length > 0;
}

/**
 * Проверяет, содержит ли название фильма эротические элементы
 */
function containsEroticContent(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  
  // Специальные проверки для эротического контента
  const eroticPatterns = [
    'dirty', 'steamy', 'hot', 'sexy', 'adult', 'mature',
    'грязный', 'горячий', 'сексуальный', 'взрослый',
    'ice cream', 'cream', 'desire', 'lust', 'passion',
    'желание', 'похоть', 'страсть', 'вожделение',
    'sorority', 'ligaw', 'tatsulok', 'udovolstvie', 'удовольствие',
    'pleasure', 'salome', 'kiskisan', 'private', 'lessons',
    'sweet', 'whip', 'кнут', 'сладкий', 'sladkiy', 'knut',
    'частные', 'уроки', 'korean', 'japanese', 'chinese', 'asian',
    'азиатский'
  ];
  
  // Проверка на корейские эротические слова
  const koreanEroticPatterns = [
    '욕망', 'yokmang', 'desire', 'lust', 'passion',
    '새엄마', 'saeeomma', 'stepmother', 'step-mother',
    '개인교수', 'private tutor', '화려한', 'luxurious', 'splendid',
    '은밀함', 'secrets', '무릎사이', 'between knees'
  ];
  
  // Проверка на японские эротические слова
  const japaneseEroticPatterns = [
    '女教師', 'jokyōshi', 'female teacher', '扉', 'door', '閉めた', 'closed',
    '濃厚', 'nōkō', 'rich', '濃密', 'nōmitsu', 'dense'
  ];
  
  // Проверка на китайские эротические слова
  const chineseEroticPatterns = [
    '我為卿狂', 'wo wei qing kuang'
  ];
  
  return eroticPatterns.some(pattern => lowerTitle.includes(pattern)) ||
         koreanEroticPatterns.some(pattern => lowerTitle.includes(pattern)) ||
         japaneseEroticPatterns.some(pattern => lowerTitle.includes(pattern)) ||
         chineseEroticPatterns.some(pattern => lowerTitle.includes(pattern));
}

/**
 * Проверяет, является ли фильм подозрительным (низкий рейтинг + эротические элементы)
 */
function isSuspiciousContent(content: ContentFilter): boolean {
  // Проверяем только фильмы с очень низким рейтингом И эротическими элементами
  if (content.rating < 2.0 && containsEroticContent(content.title)) {
    return true;
  }
  
  // Проверка на фильмы с определенными паттернами (независимо от рейтинга)
  if (hasEroticPatterns(content.title)) {
    return true;
  }
  
  // Дополнительные проверки для азиатских фильмов (только с очень низким рейтингом)
  if (content.year >= 2010 && content.rating < 3.0) {
    const lowerTitle = content.title.toLowerCase();
    const asianEroticWords = [
      'sorority', 'ligaw', 'tatsulok', 'udovolstvie', 'удовольствие',
      'pleasure', 'salome', 'kiskisan', 'private', 'lessons',
      'sweet', 'whip', 'кнут', 'сладкий', 'sladkiy', 'knut',
      'частные', 'уроки', 'korean', 'japanese', 'chinese', 'asian',
      'азиатский', '욕망', 'yokmang', '새엄마', 'saeeomma',
      '개인교수', 'private tutor', '화려한', 'luxurious', 'splendid',
      '은밀함', 'secrets', '무릎사이', 'between knees',
      '女教師', 'jokyōshi', 'female teacher', '扉', 'door', '閉めた', 'closed',
      '濃厚', 'nōkō', 'rich', '濃密', 'nōmitsu', 'dense',
      '我為卿狂', 'wo wei qing kuang'
    ];
    if (asianEroticWords.some(word => lowerTitle.includes(word))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Проверяет наличие эротических паттернов в названии
 */
function hasEroticPatterns(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  
  // Паттерны для эротических фильмов
  const eroticPatterns = [
    // Паттерны с "dirty"
    /dirty.*ice.*cream/i,
    /dirty.*[a-z]+/i,
    
    // Паттерны с "stepmother"
    /step.*mother.*desire/i,
    /step.*mother.*lust/i,
    /saeeomma.*yokmang/i,
    
    // Паттерны с "belyas" и подобными
    /belyas/i,
    
    // Новые паттерны для проблемных фильмов
    /sorority/i,
    /ligaw/i,
    /tatsulok/i,
    /udovolstvie/i,
    /удовольствие/i,
    /pleasure/i,
    /salome/i,
    /kiskisan/i,
    /sweet.*whip/i,
    /сладкий.*кнут/i,
    /sladkiy.*knut/i,
    /private.*lessons/i,
    /частные.*уроки/i,
    
    // Корейские паттерны
    /개인교수/i,
    /private.*tutor/i,
    /화려한.*외출/i,
    /luxurious.*outing/i,
    /splendid.*outing/i,
    /은밀함/i,
    /secrets/i,
    /무릎사이/i,
    /between.*knees/i,
    
    // Японские паттерны
    /女教師/i,
    /female.*teacher/i,
    /扉.*閉めた/i,
    /door.*closed/i,
    /濃厚/i,
    /rich/i,
    /濃密/i,
    /dense/i,
    
    // Китайские паттерны
    /我為卿狂/i,
    /wo.*wei.*qing.*kuang/i,
    
    // Общие эротические паттерны
    /.*desire.*/i,
    /.*lust.*/i,
    /.*passion.*/i
  ];
  
  return eroticPatterns.some(pattern => pattern.test(lowerTitle));
}

/**
 * Проверяет, содержит ли массив жанров запрещенные жанры
 */
function containsForbiddenGenres(genres: string[]): boolean {
  const lowerGenres = genres.map(g => g.toLowerCase());
  const foundGenres = CONTENT_FILTER_CONFIG.FORBIDDEN_GENRES.filter((forbiddenGenre: string) => 
    lowerGenres.some(genre => genre.includes(forbiddenGenre.toLowerCase()))
  );
  
  if (foundGenres.length > 0) {
    console.log('❌ Найдены запрещенные жанры:', genres);
    console.log('   Запрещенные жанры:', foundGenres);
  }
  
  return foundGenres.length > 0;
}

/**
 * Основная функция фильтрации контента
 * Возвращает true, если контент безопасен для показа
 */
export function isContentSafe(content: ContentFilter): boolean {
  // Проверяем название на запрещенные ключевые слова
  if (containsForbiddenKeywords(content.title)) {
    console.log('❌ Заблокирован по названию:', content.title);
    return false;
  }
  
  // Специальная проверка на эротический контент в названии
  if (containsEroticContent(content.title)) {
    console.log('❌ Заблокирован по эротическому контенту в названии:', content.title);
    return false;
  }
  
  // Проверяем описание фильма (если есть)
  if (content.overview && containsForbiddenKeywords(content.overview)) {
    console.log('❌ Заблокирован по описанию:', content.title);
    return false;
  }
  
  // Проверяем жанры
  if (containsForbiddenGenres(content.genres)) {
    console.log('❌ Заблокирован по жанрам:', content.title, content.genres);
    return false;
  }
  
  // Проверяем рейтинг
  if (content.rating < CONTENT_FILTER_CONFIG.MIN_RATING) {
    console.log('❌ Заблокирован по рейтингу:', content.title, content.rating, '<', CONTENT_FILTER_CONFIG.MIN_RATING);
    return false;
  }
  
  // Проверяем год выпуска
  if (content.year < CONTENT_FILTER_CONFIG.MIN_YEAR) {
    console.log('❌ Заблокирован по году:', content.title, content.year, '<', CONTENT_FILTER_CONFIG.MIN_YEAR);
    return false;
  }
  
  // Проверяем на подозрительный контент
  if (isSuspiciousContent(content)) {
    console.log('❌ Заблокирован как подозрительный контент:', content.title);
    return false;
  }
  
  console.log('✅ Фильм прошел все проверки:', content.title);
  return true;
}

/**
 * Фильтрует массив фильмов, исключая небезопасный контент
 */
export function filterSafeContent<T extends ContentFilter>(movies: T[]): T[] {
  return movies.filter(movie => isContentSafe(movie));
}

/**
 * Логирует информацию о заблокированном контенте (для отладки)
 */
export function logBlockedContent(content: ContentFilter, reason: string): void {
  if (CONTENT_FILTER_CONFIG.LOGGING.LOG_BLOCKED_CONTENT) {
    console.warn('Заблокирован контент:', {
      title: content.title,
      genres: content.genres,
      rating: content.rating,
      year: content.year,
      reason
    });
  }
}

/**
 * Получает статистику фильтрации
 */
export function getFilterStats(): FilterStats {
  return { ...filterStats };
}

/**
 * Сбрасывает статистику фильтрации
 */
export function resetFilterStats(): void {
  filterStats = { ...DEFAULT_FILTER_STATS };
} 
// Конфигурация фильтрации контента для соответствия правилам ВК

export const CONTENT_FILTER_CONFIG = {
  // Минимальный рейтинг фильма (снижен для нормальных фильмов)
  MIN_RATING: 1.0,
  
  // Минимальный год выпуска
  MIN_YEAR: 1950,
  
  // Запрещенные ключевые слова (на русском и английском)
  FORBIDDEN_KEYWORDS: [
    // Насилие и жестокость
    'убийство', 'кровь', 'насилие', 'жестокость', 'пытка', 'мучение',
    'massacre', 'murder', 'killing', 'blood', 'violence', 'torture',
    
    // Наркотики и запрещенные вещества
    'наркотик', 'героин', 'кокаин', 'марихуана', 'амфетамин',
    'drug', 'heroin', 'cocaine', 'marijuana', 'amphetamine',
    
    // Экстремизм и ненависть
    'нацизм', 'фашизм', 'расизм', 'ксенофобия', 'экстремизм',
    'nazism', 'fascism', 'racism', 'xenophobia', 'extremism',
    
    // Суицид и самоповреждение
    'суицид', 'самоубийство', 'самоповреждение',
    'suicide', 'self-harm', 'self-injury',
    
    // Порнография и эротика (расширенный список)
    'порно', 'порнография', 'эротика', 'секс', 'похоть', 'вожделение', 'страсть',
    'porn', 'pornography', 'erotic', 'sex', 'lust', 'desire', 'passion',
    'dirty', 'steamy', 'adult', 'mature', 'explicit', 'sensual',
    'грязный', 'грязно', 'взрослый', 'откровенный', 'чувственный',
    
    // Эротические слова на английском
    'nude', 'naked', 'bare', 'lingerie', 'bikini', 'underwear',
    'nudity', 'nakedness', 'bareness', 'intimate', 'intimacy',
    
    // Дополнительные эротические слова
    'sorority', 'ligaw', 'tatsulok', 'udovolstvie', 'удовольствие',
    'pleasure', 'salome', 'kiskisan', 'private', 'lessons', 'частные', 'уроки',
    'sweet', 'whip', 'кнут', 'сладкий', 'sladkiy', 'knut',
    'korean', 'japanese', 'chinese', 'asian', 'азиатский',
    
    // Корейские эротические слова
    '욕망', 'yokmang', '새엄마', 'saeeomma', 'stepmother', 'step-mother',
    '개인교수', 'private tutor', '화려한', 'luxurious', 'splendid',
    '은밀함', 'secrets', '무릎사이', 'between knees',
    
    // Японские эротические слова
    '女教師', 'jokyōshi', 'female teacher', '扉', 'door', '閉めた', 'closed',
    '濃厚', 'nōkō', 'rich', '濃密', 'nōmitsu', 'dense',
    
    // Китайские эротические слова
    '我為卿狂', 'wo wei qing kuang',
    
    // Нецензурная лексика
    'хуй', 'пизда', 'блять', 'ебать', 'говно',
    'fuck', 'shit', 'bitch', 'cock', 'pussy',
    
    // Преступная деятельность
    'терроризм', 'взрыв', 'бомба', 'оружие',
    'terrorism', 'explosion', 'bomb', 'weapon', 'gun', 'rifle'
  ],
  
  // Запрещенные жанры
  FORBIDDEN_GENRES: [
    'криминал', 'эротика', 'взрослый',
    'crime', 'erotic', 'adult', 'mature'
  ],
  
  // Настройки логирования
  LOGGING: {
    ENABLED: true,
    LOG_BLOCKED_CONTENT: true,
    LOG_FILTER_STATS: true
  }
};

// Статистика фильтрации
export interface FilterStats {
  totalChecked: number;
  blockedCount: number;
  blockedByTitle: number;
  blockedByOverview: number;
  blockedByGenres: number;
  blockedByRating: number;
  blockedByYear: number;
}

export const DEFAULT_FILTER_STATS: FilterStats = {
  totalChecked: 0,
  blockedCount: 0,
  blockedByTitle: 0,
  blockedByOverview: 0,
  blockedByGenres: 0,
  blockedByRating: 0,
  blockedByYear: 0
}; 
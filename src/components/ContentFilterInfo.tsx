import React from 'react';

const ContentFilterInfo: React.FC = () => {
  return (
    <div className="content-filter-info">
      <div className="filter-badge">
        <span className="filter-icon">🛡️</span>
        <span className="filter-text">Безопасный контент</span>
      </div>
      <p className="filter-description">
        Мы заботимся о безопасности контента и фильтруем материалы согласно правилам платформы
      </p>
    </div>
  );
};

export default ContentFilterInfo; 
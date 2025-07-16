import React, { useState, useEffect } from 'react';
import '../styles/BackToTop.css';

const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!show) return null;
  return (
    <button className="back-to-top" onClick={scrollTop}>
      ↑ Наверх
    </button>
  );
};

export default BackToTop;

// src/pages/About.jsx
import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import '../styles/about.css';

function About() {
  const [markdown, setMarkdown] = useState('');
  const [showButton, setShowButton] = useState(false);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch('/PROJECT.md')
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(text);
      });

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
      updateButtonPosition();
    };

    const updateButtonPosition = () => {
      const button = buttonRef.current;
      const container = containerRef.current;
      if (button && container) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        if (containerRect.bottom < window.innerHeight) {
          button.style.bottom = `${window.innerHeight - containerRect.bottom}px`;
        } else {
          button.style.bottom = '20px';
        }

        if (containerRect.right < window.innerWidth) {
          button.style.right = `${window.innerWidth - containerRect.right}px`;
        } else {
          button.style.right = '20px';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateButtonPosition);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateButtonPosition);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="about-container" ref={containerRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkSlug, remarkAutolinkHeadings]}
      >
        {markdown}
      </ReactMarkdown>
      {showButton && (
        <button onClick={scrollToTop} className="scroll-to-top" ref={buttonRef}>
          ↑
        </button>
      )}
    </div>
  );
}

export default About;

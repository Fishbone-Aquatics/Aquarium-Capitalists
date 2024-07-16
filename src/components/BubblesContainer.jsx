import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for bubble animation
const rise = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-350px);
    opacity: 0;
  }
`;

// Styled components
const Bubble = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !['left', 'duration', 'delay', 'size'].includes(prop)
})`
  position: absolute;
  bottom: -50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0.7;
  animation: ${rise} 5s infinite ease-in-out;
  left: ${props => props.left || '50%'};
  animation-duration: ${props => props.duration || '5s'};
  animation-delay: ${props => props.delay || '0s'};
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
`;

const BubblesContainer = ({ isActive }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        const newBubble = {
          id: Date.now(),
          left: `${Math.random() * 100}%`,
          duration: `${4 + Math.random() * 2}s`,
          delay: `${Math.random() * 2}s`,
          size: `${10 + Math.random() * 15}px`,
        };
        setBubbles(prevBubbles => [...prevBubbles, newBubble]);
      }, 500);
    } else {
      clearInterval(interval);
      setBubbles([]);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <>
      {bubbles.map(bubble => (
        <Bubble
          key={bubble.id}
          left={bubble.left}
          duration={bubble.duration}
          delay={bubble.delay}
          size={bubble.size}
        />
      ))}
    </>
  );
};

export { BubblesContainer };

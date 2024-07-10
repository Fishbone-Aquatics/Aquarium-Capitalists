import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';


// Example of animated css to use bubbles 
// Perhaps we can use this for battle in progress?
// click to start it

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
const Aquarium = styled.div`
  position: relative;
  width: 600px;
  height: 900px;
  background-color: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #fff;
`;

const Bubble = styled.div`
  position: absolute;
  bottom: -50px;
  width: 20px;
  height: 20px;
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

function Example() {
  const [bubbles, setBubbles] = useState([]);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    let interval;
    if (isPressed) {
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
    }

    return () => clearInterval(interval);
  }, [isPressed]);

  return (
    <Aquarium
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {bubbles.map(bubble => (
        <Bubble
          key={bubble.id}
          left={bubble.left}
          duration={bubble.duration}
          delay={bubble.delay}
          size={bubble.size}
        />
      ))}
    </Aquarium>
  );
}

export default Example;

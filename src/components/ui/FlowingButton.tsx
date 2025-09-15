import React from 'react';
import { gsap } from 'gsap';
import './FlowingButton.css';

interface FlowingButtonProps {
  text: string;
  image: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export function FlowingButton({ text, image, isActive, onClick, className = '' }: FlowingButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const leftEdgeDist = distMetric(mouseX, mouseY, 0, height / 2);
    const rightEdgeDist = distMetric(mouseX, mouseY, width, height / 2);
    return leftEdgeDist < rightEdgeDist ? 'left' : 'right';
  };

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!buttonRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { x: edge === 'left' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { x: edge === 'left' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { x: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!buttonRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { x: edge === 'left' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { x: edge === 'left' ? '101%' : '-101%' }, 0);
  };

  const repeatedMarqueeContent = Array.from({ length: 6 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span>{text}</span>
      <div className="flowing-button__img" style={{ backgroundImage: `url(${image})` }} />
    </React.Fragment>
  ));

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flowing-button ${isActive ? 'flowing-button--active' : ''} ${className}`}
    >
      <span className="flowing-button__text">{text}</span>
      
      <div className="flowing-button__marquee" ref={marqueeRef}>
        <div className="flowing-button__marquee-wrap" ref={marqueeInnerRef}>
          <div className="flowing-button__marquee-inner" aria-hidden="true">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </button>
  );
}

export default FlowingButton;

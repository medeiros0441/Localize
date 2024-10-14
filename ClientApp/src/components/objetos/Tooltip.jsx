import React, { useState, useEffect, useRef } from 'react';

const Tooltip = ({ content, children, position = "top" }) => {
  const [tooltipPosition, setTooltipPosition] = useState(position); // posição inicial recebida como prop
  const tooltipRef = useRef(null);

  useEffect(() => {
    const adjustPosition = () => {
      const tooltipEl = tooltipRef.current;
      if (!tooltipEl) return;

      const rect = tooltipEl.getBoundingClientRect();
      const isOutOfBoundsTop = rect.top < 0;
      const isOutOfBoundsRight = rect.right > window.innerWidth;
      const isOutOfBoundsLeft = rect.left < 0;
      const isOutOfBoundsBottom = rect.bottom > window.innerHeight;

      // Ajuste de posição baseado na disponibilidade de espaço
      if (isOutOfBoundsTop && position === 'top') {
        if (isOutOfBoundsRight) {
          setTooltipPosition('left');
        } else if (isOutOfBoundsLeft) {
          setTooltipPosition('right');
        } else {
          setTooltipPosition('bottom');
        }
      } else if (isOutOfBoundsBottom && position === 'bottom') {
        setTooltipPosition('top');
      }
    };

    adjustPosition(); // Ajustar a posição inicialmente
    window.addEventListener('resize', adjustPosition); // Reajustar em caso de redimensionamento

    return () => window.removeEventListener('resize', adjustPosition);
  }, [position]);

  return (
    <div className="tooltip-container">
      {children}
      <div ref={tooltipRef} className={`tooltip-box ${tooltipPosition}`}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;

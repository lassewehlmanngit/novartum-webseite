import React, { useState, useEffect } from 'react';
import ExitIntentModal from './ExitIntentModal';

/**
 * Exit Intent Detection Component
 * Detects when user is about to leave the page and shows a modal
 */
const ExitIntentHandler: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show once per session
    const hasShownThisSession = sessionStorage.getItem('exitIntentShown');
    if (hasShownThisSession === 'true') {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving the top of the viewport
      // This indicates user is trying to close the tab/window
      if (e.clientY <= 0 && !hasShown && !showModal) {
        setShowModal(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Add event listener
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown, showModal]);

  if (!showModal) return null;

  return (
    <ExitIntentModal 
      onClose={() => setShowModal(false)}
    />
  );
};

export default ExitIntentHandler;


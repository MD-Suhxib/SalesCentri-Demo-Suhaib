'use client';

import { useState } from 'react';
import FloatingButton from './FloatingButton';
import LeadCaptureModal from './LeadCaptureModal';

export default function LetsTalkManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

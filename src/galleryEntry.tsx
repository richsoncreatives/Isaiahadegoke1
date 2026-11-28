import React from 'react';
import { createRoot } from 'react-dom/client';
import { VisualDiaryGallery } from './components/VisualDiaryGallery';

function mountGallery() {
  const container = document.getElementById('visual-diary-gallery-root');
  if (!container) return;

  const modeAttr = container.getAttribute('data-mode');
  const mode: 'section' | 'page' = modeAttr === 'page' ? 'page' : 'section';

  createRoot(container).render(
    <React.StrictMode>
      <VisualDiaryGallery mode={mode} />
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountGallery);
} else {
  mountGallery();
}

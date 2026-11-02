import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'css-001',
    language: 'css',
    title: 'Flexbox Center',
    description: 'Center content using flexbox',
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`,
    difficulty: 'easy',
    tags: ['flexbox', 'layout'],
  },
  {
    id: 'css-002',
    language: 'css',
    title: 'CSS Variables',
    description: 'Define and use custom properties',
    code: `:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --radius: 8px;
}

.btn {
  background: var(--primary);
  border-radius: var(--radius);
}`,
    difficulty: 'easy',
    tags: ['variables', 'custom-properties'],
  },
  {
    id: 'css-003',
    language: 'css',
    title: 'Simple Transition',
    description: 'Smooth hover transition on a button',
    code: `.btn {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #2563eb;
}`,
    difficulty: 'easy',
    tags: ['transitions', 'hover'],
  },
  {
    id: 'css-004',
    language: 'css',
    title: 'Gradient Background',
    description: 'Linear gradient background',
    code: `.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}`,
    difficulty: 'easy',
    tags: ['gradient', 'background'],
  },
  {
    id: 'css-005',
    language: 'css',
    title: 'Grid Auto Layout',
    description: 'Responsive grid with auto-fill',
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}`,
    difficulty: 'medium',
    tags: ['grid', 'responsive'],
  },
  {
    id: 'css-006',
    language: 'css',
    title: 'Media Query',
    description: 'Responsive layout with breakpoints',
    code: `.sidebar {
  display: none;
}

.content {
  width: 100%;
}

@media (min-width: 768px) {
  .layout {
    display: flex;
  }

  .sidebar {
    display: block;
    width: 250px;
  }

  .content {
    flex: 1;
  }
}`,
    difficulty: 'medium',
    tags: ['media-queries', 'responsive'],
  },
  {
    id: 'css-007',
    language: 'css',
    title: 'Pseudo-elements',
    description: 'Decorative elements with ::before and ::after',
    code: `.quote {
  position: relative;
  padding: 1.5rem 2rem;
  font-style: italic;
}

.quote::before {
  content: "\\201C";
  font-size: 3rem;
  position: absolute;
  top: -0.5rem;
  left: 0;
  color: #3b82f6;
}

.quote::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: #3b82f6;
  margin-top: 1rem;
}`,
    difficulty: 'medium',
    tags: ['pseudo-elements', 'decorative'],
  },
  {
    id: 'css-008',
    language: 'css',
    title: 'Keyframe Animation',
    description: 'Pulse animation with keyframes',
    code: `@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}`,
    difficulty: 'medium',
    tags: ['animations', 'keyframes'],
  },
  {
    id: 'css-009',
    language: 'css',
    title: 'Dark Mode Toggle',
    description: 'Dark mode with CSS variables and media query',
    code: `:root {
  --bg: #ffffff;
  --text: #1a1a2e;
  --card-bg: #f8f9fa;
  --border: #e2e8f0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --text: #e2e8f0;
    --card-bg: #1e293b;
    --border: #334155;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}`,
    difficulty: 'hard',
    tags: ['dark-mode', 'variables', 'media-queries'],
  },
  {
    id: 'css-010',
    language: 'css',
    title: 'Custom Scrollbar',
    description: 'Styled scrollbar with webkit properties',
    code: `.scrollable {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f5f9;
}

.scrollable::-webkit-scrollbar {
  width: 8px;
}

.scrollable::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.scrollable::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 4px;
}

.scrollable::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}`,
    difficulty: 'hard',
    tags: ['scrollbar', 'webkit', 'styling'],
  },
  {
    id: 'css-011',
    language: 'css',
    title: 'Container Queries',
    description: 'Responsive component with container queries',
    code: `.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
    gap: 1.5rem;
  }

  .card-image {
    width: 200px;
    flex-shrink: 0;
  }
}`,
    difficulty: 'hard',
    tags: ['container-queries', 'responsive'],
  },
  {
    id: 'css-012',
    language: 'css',
    title: 'Glass Morphism Card',
    description: 'Glassmorphism effect with backdrop filter',
    code: `.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-card h2 {
  color: white;
  margin-bottom: 0.5rem;
}

.glass-card p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}`,
    difficulty: 'hard',
    tags: ['glassmorphism', 'backdrop-filter', 'effects'],
  },
];

export default snippets;

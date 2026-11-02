import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'html-001',
    language: 'html',
    title: 'Basic Nav Bar',
    description: 'Simple navigation bar with links',
    code: `<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>`,
    difficulty: 'easy',
    tags: ['nav', 'links'],
  },
  {
    id: 'html-002',
    language: 'html',
    title: 'Simple Form',
    description: 'Login form with email and password',
    code: `<form action="/login" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <label for="password">Password</label>
  <input type="password" id="password" name="password" required>
  <button type="submit">Log In</button>
</form>`,
    difficulty: 'easy',
    tags: ['form', 'input'],
  },
  {
    id: 'html-003',
    language: 'html',
    title: 'Meta Tags',
    description: 'Common meta tags for SEO and viewport',
    code: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="A sample website">
  <title>My Website</title>
</head>`,
    difficulty: 'easy',
    tags: ['meta', 'seo', 'head'],
  },
  {
    id: 'html-004',
    language: 'html',
    title: 'Unordered List',
    description: 'List of items with nested sublist',
    code: `<ul>
  <li>Item One</li>
  <li>Item Two
    <ul>
      <li>Sub-item A</li>
      <li>Sub-item B</li>
    </ul>
  </li>
  <li>Item Three</li>
</ul>`,
    difficulty: 'easy',
    tags: ['list', 'nested'],
  },
  {
    id: 'html-005',
    language: 'html',
    title: 'Card Component',
    description: 'Product card with image and details',
    code: `<article class="card">
  <img src="/images/product.jpg" alt="Product Name" class="card-image">
  <div class="card-body">
    <h3 class="card-title">Product Name</h3>
    <p class="card-text">A brief description of the product.</p>
    <span class="card-price">$29.99</span>
    <button class="btn btn-primary">Add to Cart</button>
  </div>
</article>`,
    difficulty: 'medium',
    tags: ['card', 'component', 'semantic'],
  },
  {
    id: 'html-006',
    language: 'html',
    title: 'Data Table',
    description: 'Table with header, body, and footer',
    code: `<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>alice@example.com</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>bob@example.com</td>
      <td>User</td>
    </tr>
  </tbody>
</table>`,
    difficulty: 'medium',
    tags: ['table', 'data'],
  },
  {
    id: 'html-007',
    language: 'html',
    title: 'Picture Element',
    description: 'Responsive images with picture and source',
    code: `<picture>
  <source media="(min-width: 1024px)" srcset="/images/hero-lg.webp" type="image/webp">
  <source media="(min-width: 768px)" srcset="/images/hero-md.webp" type="image/webp">
  <source media="(min-width: 768px)" srcset="/images/hero-md.jpg" type="image/jpeg">
  <img src="/images/hero-sm.jpg" alt="Hero banner" loading="lazy">
</picture>`,
    difficulty: 'medium',
    tags: ['picture', 'responsive', 'images'],
  },
  {
    id: 'html-008',
    language: 'html',
    title: 'Dialog Element',
    description: 'Modal dialog with form',
    code: `<dialog id="confirm-dialog">
  <form method="dialog">
    <h2>Confirm Action</h2>
    <p>Are you sure you want to proceed?</p>
    <div class="dialog-actions">
      <button value="cancel">Cancel</button>
      <button value="confirm">Confirm</button>
    </div>
  </form>
</dialog>`,
    difficulty: 'medium',
    tags: ['dialog', 'modal', 'form'],
  },
  {
    id: 'html-009',
    language: 'html',
    title: 'Semantic Page Layout',
    description: 'Full semantic page structure with accessibility',
    code: `<body>
  <header role="banner">
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main role="main">
    <section aria-labelledby="featured-heading">
      <h2 id="featured-heading">Featured Products</h2>
      <div class="grid" role="list"></div>
    </section>
  </main>
  <footer role="contentinfo">
    <p>&copy; 2024 My Company</p>
  </footer>
</body>`,
    difficulty: 'hard',
    tags: ['semantic', 'accessibility', 'structure'],
  },
  {
    id: 'html-010',
    language: 'html',
    title: 'Accessible Form',
    description: 'Form with ARIA attributes and fieldset',
    code: `<form action="/register" method="POST" aria-label="Registration form">
  <fieldset>
    <legend>Personal Information</legend>
    <div class="form-group">
      <label for="fullname">Full Name</label>
      <input type="text" id="fullname" name="fullname"
        aria-required="true" aria-describedby="name-help" required>
      <small id="name-help">Enter your first and last name</small>
    </div>
    <div class="form-group">
      <label for="dob">Date of Birth</label>
      <input type="date" id="dob" name="dob" aria-required="true" required>
    </div>
  </fieldset>
  <button type="submit">Register</button>
</form>`,
    difficulty: 'hard',
    tags: ['form', 'accessibility', 'aria'],
  },
  {
    id: 'html-011',
    language: 'html',
    title: 'Responsive Grid Layout',
    description: 'CSS Grid based responsive layout',
    code: `<div class="page-grid">
  <header class="grid-header">
    <h1>Dashboard</h1>
  </header>
  <aside class="grid-sidebar">
    <nav aria-label="Sidebar navigation">
      <ul>
        <li><a href="/dashboard">Overview</a></li>
        <li><a href="/dashboard/analytics">Analytics</a></li>
        <li><a href="/dashboard/settings">Settings</a></li>
      </ul>
    </nav>
  </aside>
  <main class="grid-content">
    <section class="stats-grid">
      <div class="stat-card">Users: 1,234</div>
      <div class="stat-card">Revenue: $5,678</div>
      <div class="stat-card">Orders: 890</div>
    </section>
  </main>
</div>`,
    difficulty: 'hard',
    tags: ['grid', 'responsive', 'layout'],
  },
  {
    id: 'html-012',
    language: 'html',
    title: 'Video Player with Controls',
    description: 'Video element with multiple sources and tracks',
    code: `<figure class="video-player">
  <video controls preload="metadata" poster="/images/video-poster.jpg"
    width="640" height="360">
    <source src="/videos/intro.webm" type="video/webm">
    <source src="/videos/intro.mp4" type="video/mp4">
    <track kind="subtitles" src="/subs/en.vtt" srclang="en" label="English" default>
    <track kind="subtitles" src="/subs/es.vtt" srclang="es" label="Spanish">
    <p>Your browser does not support HTML5 video.</p>
  </video>
  <figcaption>Introduction to our platform</figcaption>
</figure>`,
    difficulty: 'hard',
    tags: ['video', 'media', 'accessibility'],
  },
];

export default snippets;

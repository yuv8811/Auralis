import { debounce, trapFocus } from './global.js';

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.overlay = this.querySelector('.search-overlay');
    this.input = this.querySelector('input[type="search"]');
    this.resultsContainer = this.querySelector('.search-overlay__results');
    this.closeBtn = this.querySelector('.search-overlay__close');
    this.removeTrap = null;

    this.init();
  }

  init() {
    document.querySelectorAll('[data-open-search]').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });

    this.closeBtn?.addEventListener('click', () => this.close());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('is-open')) {
        this.close();
      }
    });

    this.input?.addEventListener('input', debounce((e) => {
      const query = e.target.value.trim();
      if (query.length > 1) {
        this.fetchSuggestions(query);
      } else {
        this.resultsContainer.innerHTML = '';
      }
    }, 250));
  }

  open() {
    this.overlay.classList.add('is-open');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.removeTrap = trapFocus(this.overlay, this.input);
  }

  close() {
    this.overlay.classList.remove('is-open');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (this.removeTrap) this.removeTrap();
  }

  async fetchSuggestions(query) {
    try {
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,article,page&resources[limit]=6`);
      if (!response.ok) return;

      const data = await response.json();
      this.renderResults(data.resources.results);
    } catch (err) {
      console.error(err);
    }
  }

  renderResults(results) {
    const products = results.products || [];
    if (!products.length) {
      this.resultsContainer.innerHTML = `<p class="caption text-center" style="padding: 2rem 0;">No results found.</p>`;
      return;
    }

    const html = products.map(product => `
      <a href="${product.url}" class="predictive-search__item link">
        ${product.image ? `<img src="${product.image}" class="predictive-search__item-image" alt="${product.title}" loading="lazy">` : ''}
        <div>
          <div class="product-title" style="font-weight: 500;">${product.title}</div>
          <div class="product-price caption" style="opacity: 0.8;">${product.price}</div>
        </div>
      </a>
    `).join('');

    this.resultsContainer.innerHTML = html;
  }
}

if (!customElements.get('predictive-search')) {
  customElements.define('predictive-search', PredictiveSearch);
}

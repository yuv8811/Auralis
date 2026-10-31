/**
 * Auralis Core Global Utilities & Web Components
 * Pure Vanilla JS, zero dependencies, ES Module
 */

// Simple Micro Pub/Sub Event Bus
export const pubsub = {
  events: {},
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  },
  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
};

// Debounce helper
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Accessible Focus Trap for Drawers and Modals
export function trapFocus(container, elementToFocus = null) {
  const focusableEls = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusableEls.length) return null;

  const firstFocusable = focusableEls[0];
  const lastFocusable = focusableEls[focusableEls.length - 1];
  const target = elementToFocus || firstFocusable;
  target.focus();

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  return () => container.removeEventListener('keydown', handleKeyDown);
}

// Quantity Input Web Component
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.buttons = this.querySelectorAll('button');
    this.changeEvent = new Event('change', { bubbles: true });

    this.buttons.forEach(button => {
      button.addEventListener('click', this.onButtonClick.bind(this));
    });
  }

  onButtonClick(event) {
    event.preventDefault();
    const isPlus = event.currentTarget.name === 'plus';
    const currentValue = parseInt(this.input.value, 10) || 1;
    const min = parseInt(this.input.getAttribute('min'), 10) || 1;

    if (isPlus) {
      this.input.value = currentValue + 1;
    } else if (currentValue > min) {
      this.input.value = currentValue - 1;
    }

    this.input.dispatchEvent(this.changeEvent);
  }
}

if (!customElements.get('quantity-input')) {
  customElements.define('quantity-input', QuantityInput);
}

// Back to Top Button Web Component
class BackToTop extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('button');
    if (!this.button) return;

    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > 400) {
        this.classList.add('is-visible');
      } else {
        this.classList.remove('is-visible');
      }
    }, 100));

    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

if (!customElements.get('back-to-top')) {
  customElements.define('back-to-top', BackToTop);
}

// Scroll Reveal Observer
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.scrollReveal === 'true') {
    const revealElements = document.querySelectorAll('.scroll-trigger');
    if (revealElements.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -50px 0px' });

      revealElements.forEach(el => observer.observe(el));
    }
  }
});


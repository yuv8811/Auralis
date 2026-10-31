import { trapFocus, pubsub } from './global.js';

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.drawer = this.querySelector('.cart-drawer');
    this.closeBtn = this.querySelector('.cart-drawer__close');
    this.backdrop = document.querySelector('.drawer-backdrop');
    this.removeTrapFocus = null;

    this.init();
  }

  init() {
    this.closeBtn?.addEventListener('click', () => this.close());
    this.backdrop?.addEventListener('click', () => this.close());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    document.querySelectorAll('[data-open-cart-drawer]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Listen to form submissions across the theme with data-type="add-to-cart-form"
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-type="add-to-cart-form"]');
      if (form) {
        e.preventDefault();
        this.handleAddToCart(form);
      }
    });

    // Handle quantity changes and line item removal inside the drawer
    this.addEventListener('change', (e) => {
      if (e.target.matches('.cart-item__quantity input')) {
        const line = e.target.dataset.line;
        const quantity = parseInt(e.target.value, 10);
        this.updateQuantity(line, quantity);
      }
    });

    this.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-line]');
      if (removeBtn) {
        e.preventDefault();
        const line = removeBtn.dataset.removeLine;
        this.updateQuantity(line, 0);
      }
    });
  }

  isOpen() {
    return this.drawer.classList.contains('is-open');
  }

  open() {
    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    this.backdrop?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    this.removeTrapFocus = trapFocus(this.drawer);
  }

  close() {
    this.drawer.classList.remove('is-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.backdrop?.classList.remove('is-active');
    document.body.style.overflow = '';
    if (this.removeTrapFocus) this.removeTrapFocus();
  }

  async handleAddToCart(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.setAttribute('disabled', 'true');

    try {
      const formData = new FormData(form);
      formData.append('sections', 'cart-drawer,header');

      const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData
      });

      if (!response.ok) throw new Error('Add to cart failed');

      const data = await response.json();
      await this.refreshDrawer();
      this.open();
    } catch (err) {
      console.error(err);
    } finally {
      if (submitBtn) submitBtn.removeAttribute('disabled');
    }
  }

  async updateQuantity(line, quantity) {
    try {
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/change.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          line: parseInt(line, 10),
          quantity: parseInt(quantity, 10),
          sections: 'cart-drawer'
        })
      });

      if (!response.ok) throw new Error('Cart update failed');
      await this.refreshDrawer();
    } catch (err) {
      console.error(err);
    }
  }

  async refreshDrawer() {
    try {
      const res = await fetch(`${window.Shopify?.routes?.root || '/'}?section_id=cart-drawer`);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const newDrawerContent = doc.querySelector('cart-drawer');

      if (newDrawerContent) {
        this.innerHTML = newDrawerContent.innerHTML;
        this.drawer = this.querySelector('.cart-drawer');
        this.closeBtn = this.querySelector('.cart-drawer__close');
        this.init();
      }

      // Update header bubble
      const cartRes = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`);
      const cartData = await cartRes.json();
      document.querySelectorAll('.header__cart-count span').forEach(el => {
        el.textContent = cartData.item_count;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

if (!customElements.get('cart-drawer')) {
  customElements.define('cart-drawer', CartDrawer);
}


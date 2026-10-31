/**
 * Product Variant Selector & Form Handler
 */
class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.variantSelects = this.querySelectorAll('[data-option-input]');
    this.init();
  }

  init() {
    this.variantSelects.forEach(input => {
      input.addEventListener('change', this.onVariantChange.bind(this));
    });
  }

  async onVariantChange() {
    const selectedOptions = Array.from(this.querySelectorAll('[data-option-input]:checked, select[data-option-input]')).map(el => el.value);
    const variantsData = JSON.parse(this.querySelector('[data-product-variants]').textContent);

    const matchedVariant = variantsData.find(variant => {
      return variant.options.every((opt, idx) => opt === selectedOptions[idx]);
    });

    if (!matchedVariant) return;

    // Update variant id input
    const idInput = this.querySelector('input[name="id"]');
    if (idInput) idInput.value = matchedVariant.id;

    // Update URL without full reload
    const url = new URL(window.location);
    url.searchParams.set('variant', matchedVariant.id);
    window.history.replaceState({}, '', url);

    // Update price and buttons
    const priceContainer = document.querySelector(`.price-container-${this.dataset.section}`);
    if (priceContainer) {
      const res = await fetch(`${url.pathname}?variant=${matchedVariant.id}&section_id=${this.dataset.section}`);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const newPrice = doc.querySelector(`.price-container-${this.dataset.section}`);
      if (newPrice) priceContainer.innerHTML = newPrice.innerHTML;
    }

    const submitBtn = this.querySelector('[type="submit"] span');
    if (submitBtn) {
      if (!matchedVariant.available) {
        submitBtn.textContent = 'Sold out';
        this.querySelector('[type="submit"]').disabled = true;
      } else {
        submitBtn.textContent = 'Add to cart';
        this.querySelector('[type="submit"]').disabled = false;
      }
    }
  }
}

if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm);
}


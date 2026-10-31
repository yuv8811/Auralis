# Auralis — Shopify Online Store 2.0 Theme

A complete, original Shopify Online Store 2.0 theme built from scratch with zero framework bloat, zero dependencies, and an obsession with speed, accessibility, and merchant customization.

---

## Highlights & Performance Architecture

- **Pure Shopify OS 2.0:** All templates are JSON (`templates/*.json`) with sections everywhere.
- **Dependency-Free:** Pure Liquid + modular CSS custom properties + vanilla ES module Web Components. Zero jQuery, zero external libraries.
- **Fast:**
  - **Base CSS:** ~12 KB uncompressed.
  - **Global JS:** ~4 KB uncompressed.
  - **Total typical page payload:** Under 40 KB CSS and under 60 KB JS.
  - **CLS < 0.05:** Reserved aspect ratio wrappers on all images and responsive sizing (`srcset`, `sizes`, `image_tag`).
  - Preloaded LCP images with `fetchpriority="high"` and below-the-fold `loading="lazy"`.
- **Accessible (WCAG 2.1 AA):**
  - Semantic HTML5 landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`).
  - Keyboard trap on drawers and modals (`<cart-drawer>`, `<modal-dialog>`, `<predictive-search>`).
  - High-contrast `:focus-visible` outlines.
  - Skip to main content link on line 1 of `<body>`.
  - Live screen-reader updates via `aria-live="polite"` on cart mutations.
- **SEO Ready:**
  - Complete JSON-LD structured data: Organization, WebSite with SearchAction, Product with Offers & Ratings, BreadcrumbList, Article, and FAQPage.
  - Strict single `<h1>` hierarchy per template.
  - Automated OpenGraph & Twitter Cards.
  - Canonical URL and hreflang localization links.

---

## Theme Settings System (`config/settings_schema.json`)

1. **Logo & Favicon:** Primary logo, inverted transparent header logo, mobile logo width controls, favicon.
2. **Color Schemes (5 Pre-Configured Palettes):**
   - *Scheme 1:* Clean Light (Default)
   - *Scheme 2:* Warm Studio
   - *Scheme 3:* Pure Minimal
   - *Scheme 4:* Dramatic Dark
   - *Scheme 5:* Accent Charcoal
3. **Typography:** Font picker integration for Headings & Body with `font_display: swap`, fluid clamp type scaling, letter spacing, and uppercase toggles.
4. **Layout:** Maximum container width (1000px–1600px), grid spacing, section padding (desktop/mobile), and card corner radii.
5. **Buttons:** Shape (square, subtle rounded, pill), borders, hover elevation.
6. **Product & Collection Cards:** Image ratios (4:5 portrait, square, adapt), secondary hover image, vendor toggle, star rating toggle, quick-add button.
7. **Badges:** Percentage off vs text sale badges, sold-out badges, custom badges.
8. **Cart System:** Drawer, standalone page, or popup notification. Free shipping threshold progress bar, order notes, upsells.
9. **Predictive Search:** Live search toggle, show vendors, show prices.
10. **Social Media & Localization:** Direct URLs for Instagram, Facebook, TikTok, Pinterest, YouTube, X; currency & country selector.
11. **Navigation & Utilities:** Breadcrumbs toggle, back-to-top floating button, cookie consent banner, age verification modal.

---

## Directory of Sections & Templates

### Templates
- `index.json` — Homepage
- `product.json`, `product.featured.json`, `product.bundle.json` — Product templates
- `collection.json` — Product grid with filters & sorting
- `list-collections.json` — Collections catalog
- `cart.json` — Standalone cart page
- `search.json` — Search results
- `page.json`, `page.contact.json`, `page.faq.json`, `page.about.json`, `page.landing.json` — Content pages
- `blog.json`, `article.json` — Editorial journal
- `404.json` — Custom not found page
- `password.json`, `gift_card.liquid`, `robots.txt.liquid`
- `customers/*.json` — Full customer account suite (login, register, account, orders, addresses, reset password, activate account)

### Sections
- **Global:** `header`, `announcement-bar`, `footer`, `cart-drawer`, `cart-notification`, `search-overlay`, `cookie-banner`, `popup-newsletter`, `back-to-top`
- **Main Anchors:** `main-product`, `main-collection`, `main-collection-banner`, `main-list-collections`, `main-cart`, `main-search`, `main-page`, `main-page-contact`, `main-page-faq`, `main-blog`, `main-article`, `main-404`, `main-password`
- **Marketing & Commerce:** `slideshow`, `image-banner`, `featured-collection`, `featured-product`, `rich-text`, `image-with-text`, `multi-column`, `marquee`, `testimonials`, `logo-list`, `trust-badges`, `newsletter`, `video`, `blog-posts`, `countdown-timer`, `sticky-add-to-cart`, `quick-view`, `comparison-table`, `timeline`, `stats-counter`, `accordion-faq`, `gallery`, `contact-form`, `collection-list`, `product-recommendations`, `custom-liquid`, `apps`

---

## Local Development & Validation

```bash
# Check theme syntax and linting
shopify theme check

# Start local development server with hot-reload
shopify theme dev --store your-store.myshopify.com
```

---

## License
Created for Shopify Online Store 2.0. All rights reserved.

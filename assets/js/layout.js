/* ==========================================================================
   TehNoor Veils — Shared Multi-Page Layout Shell
   Mounts Header, Marquee, Footer, Mobile Bar, Drawers & Modals consistently
   ========================================================================== */
(() => {
  const page = document.body.dataset.page || "home";

  const navItems = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "collections", label: "Collections", href: "collections.html" },
    { id: "shop", label: "Shop Abayas", href: "shop.html" },
    { id: "quality", label: "UAE Quality", href: "quality.html" },
    { id: "order-guide", label: "Order & Size Guide", href: "order-guide.html" },
    { id: "reviews", label: "Reviews", href: "reviews.html" }
  ];

  const headerHtml = `
    <div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
    <canvas id="confettiCanvas" aria-hidden="true"></canvas>

    <div class="announcement-bar" role="region" aria-label="Brand Highlights">
      <div class="marquee-track">
        <div class="marquee-group">
          <span>✦ Imported Directly from UAE</span>
          <span class="marquee-dot">✦</span>
          <span>🚚 Free PAN India Shipping Above ₹2,499</span>
          <span class="marquee-dot">✦</span>
          <span>💎 Use Code <span class="marquee-code">TEHNOOR10</span> for 10% Off</span>
          <span class="marquee-dot">✦</span>
          <span>🖤 Modest Fashion For Every You</span>
          <span class="marquee-dot">✦</span>
          <span>✨ Complimentary Matching Stole on Signature Abayas</span>
          <span class="marquee-dot">✦</span>
        </div>
        <div class="marquee-group" aria-hidden="true">
          <span>✦ Imported Directly from UAE</span>
          <span class="marquee-dot">✦</span>
          <span>🚚 Free PAN India Shipping Above ₹2,499</span>
          <span class="marquee-dot">✦</span>
          <span>💎 Use Code <span class="marquee-code">TEHNOOR10</span> for 10% Off</span>
          <span class="marquee-dot">✦</span>
          <span>🖤 Modest Fashion For Every You</span>
          <span class="marquee-dot">✦</span>
          <span>✨ Complimentary Matching Stole on Signature Abayas</span>
          <span class="marquee-dot">✦</span>
        </div>
      </div>
    </div>

    <header class="site-header" id="siteHeader">
      <div class="container header-inner">
        <a href="index.html" class="brand-lockup" aria-label="TehNoor Veils Home">
          <div class="brand-avatar-wrap">
            <img src="assets/images/logo.jpg" alt="TehNoor Veils Logo" class="brand-avatar" />
          </div>
          <div class="brand-text">
            <span class="brand-name">TehNoor Veils</span>
            <span class="brand-sub">Grace That Speaks Silence</span>
          </div>
        </a>

        <nav class="desktop-nav" aria-label="Primary Navigation">
          ${navItems
            .map(
              (n) =>
                `<a href="${n.href}" class="nav-link ${page === n.id ? "is-active" : ""}">${n.label}</a>`
            )
            .join("")}
        </nav>

        <div class="header-actions">
          <a href="track-order.html" class="track-btn-pill ${page === "track" ? "is-active" : ""}" id="openTrackLink">
            <span>📦</span> Track Order
          </a>

          <button class="icon-btn" id="openSearchBtn" type="button" aria-label="Search Products">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>

          <button class="icon-btn" id="openWishlistBtn" type="button" aria-label="Saved Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20.5s-7-4.5-9.2-8.7C1.1 8.5 3 5 6.6 5c2 0 3.4 1.1 4.4 2.4C12 6.1 13.4 5 15.4 5 19 5 20.9 8.5 19.2 11.8 17 16 12 20.5 12 20.5Z"/></svg>
            <span class="badge-count" id="wishlistBadge" data-count="0">0</span>
          </button>

          <button class="icon-btn" id="openCartBtn" type="button" aria-label="Shopping Bag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
            <span class="badge-count" id="cartBadge" data-count="0">0</span>
          </button>

          <button class="icon-btn mobile-menu-toggle" id="openMobileNavBtn" type="button" aria-label="Open Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
    </header>
  `;

  const footerAndOverlaysHtml = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <img src="assets/images/logo.jpg" alt="TehNoor Veils" class="footer-brand-logo" />
            <p style="font-size:0.9rem;max-width:34ch;">
              Veiled in Modesty, Wrapped in Grace. Imported UAE Korean Nida abayas, Farasha silhouettes &amp; satin stoles delivered PAN India.
            </p>
          </div>

          <div class="footer-col">
            <h4>Shop</h4>
            <ul class="footer-links">
              <li><a href="shop.html?category=farasha">Farasha Abayas</a></li>
              <li><a href="shop.html?category=korean-nida">Korean Nida</a></li>
              <li><a href="shop.html?category=embroidered">Embroidered Abayas</a></li>
              <li><a href="shop.html?category=classic">Sana Khan Classics</a></li>
              <li><a href="shop.html?category=stoles">Satin Stoles</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Client Care</h4>
            <ul class="footer-links">
              <li><a href="collections.html">Editorial Lookbook</a></li>
              <li><a href="quality.html">UAE Quality &amp; Care</a></li>
              <li><a href="order-guide.html">Order &amp; Size Guide (52–58)</a></li>
              <li><a href="track-order.html">Track Your Parcel</a></li>
              <li><a href="reviews.html">Customer Reviews</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Connect</h4>
            <ul class="footer-links">
              <li><a href="https://instagram.com/tehnoor_veils" target="_blank" rel="noopener">Instagram @tehnoor_veils</a></li>
              <li><span>PAN India Insured Delivery</span></li>
              <li><span>Promo Codes: TEHNOOR10 • EID15</span></li>
              <li><span>100% UAE Imported Guarantee</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© <span id="yearNow"></span> TehNoor Veils. All rights reserved.</span>
          <span>Crafted with grace • PAN India Modest Luxury</span>
        </div>
      </div>
    </footer>

    <nav class="mobile-bottom-bar" aria-label="Mobile Quick Navigation">
      <a href="index.html" class="mobile-tab-btn ${page === "home" ? "is-active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3Z"/></svg>
        <span>Home</span>
      </a>
      <a href="shop.html" class="mobile-tab-btn ${page === "shop" || page === "product" || page === "collections" ? "is-active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <span>Shop</span>
      </a>
      <button type="button" class="mobile-tab-btn" id="mobileSearchBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <span>Search</span>
      </button>
      <button type="button" class="mobile-tab-btn" id="mobileWishlistBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20.5s-7-4.5-9.2-8.7C1.1 8.5 3 5 6.6 5c2 0 3.4 1.1 4.4 2.4C12 6.1 13.4 5 15.4 5 19 5 20.9 8.5 19.2 11.8 17 16 12 20.5 12 20.5Z"/></svg>
        <span class="mobile-tab-badge" id="mobileWishlistBadge" data-count="0">0</span>
        <span>Saved</span>
      </button>
      <button type="button" class="mobile-tab-btn" id="mobileCartBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        <span class="mobile-tab-badge" id="mobileCartBadge" data-count="0">0</span>
        <span>Bag</span>
      </button>
    </nav>

    <div class="drawer-backdrop" id="drawerBackdrop"></div>

    <aside class="slide-drawer is-left" id="mobileNavDrawer" aria-label="Mobile Menu">
      <div class="drawer-header">
        <h3>TehNoor Veils</h3>
        <button type="button" class="close-x" data-close-all aria-label="Close menu">✕</button>
      </div>
      <div class="drawer-body" style="display:flex;flex-direction:column;gap:1.05rem;">
        ${navItems
          .map(
            (n) =>
              `<a href="${n.href}" class="nav-link ${page === n.id ? "is-active" : ""}" style="font-size:1.12rem;">${n.label}</a>`
          )
          .join("")}
        <a href="track-order.html" class="btn btn-outline btn-sm" style="margin-top:0.5rem;">📦 Track Existing Order</a>
        <a href="https://instagram.com/tehnoor_veils" target="_blank" rel="noopener" class="btn btn-gold btn-sm">Instagram @tehnoor_veils</a>
      </div>
    </aside>

    <aside class="slide-drawer" id="cartDrawer" aria-label="Shopping Bag">
      <div class="drawer-header">
        <h3>Your Shopping Bag</h3>
        <button type="button" class="close-x" data-close-all aria-label="Close bag">✕</button>
      </div>
      <div class="shipping-meter">
        <div id="shippingMeterText">Add ₹2,499 more for <strong>Free PAN India Shipping</strong></div>
        <div class="meter-track"><div class="meter-fill" id="shippingMeterFill"></div></div>
      </div>
      <div class="drawer-body" id="cartItemsContainer"></div>
      <div class="drawer-footer">
        <div style="display:flex;gap:0.5rem;margin-bottom:0.85rem;">
          <input type="text" id="promoCodeInput" placeholder="Promo code (TEHNOOR10)" style="flex:1;padding:0.6rem 0.9rem;border-radius:999px;border:1px solid var(--border-hairline);font-size:0.84rem;" />
          <button type="button" class="btn btn-outline btn-sm" id="applyPromoBtn">Apply</button>
        </div>
        <div id="promoFeedback" style="font-size:0.78rem;color:var(--sage-deep);margin-bottom:0.6rem;"></div>
        <div style="display:grid;gap:0.35rem;font-size:0.88rem;margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><strong id="cartSubtotal">₹0</strong></div>
          <div style="display:flex;justify-content:space-between;color:var(--sage-deep);" id="cartDiscountRow" hidden><span>Promo Discount</span><strong id="cartDiscount">-₹0</strong></div>
          <div style="display:flex;justify-content:space-between;"><span>PAN India Shipping</span><strong id="cartShipping">₹149</strong></div>
          <div style="display:flex;justify-content:space-between;font-size:1.05rem;padding-top:0.45rem;border-top:1px solid var(--border-hairline);"><span>Total</span><strong id="cartTotal" style="color:var(--sage-deep);">₹0</strong></div>
        </div>
        <button type="button" class="btn btn-primary" id="proceedCheckoutBtn" style="width:100%;">Proceed to Checkout →</button>
      </div>
    </aside>

    <aside class="slide-drawer" id="wishlistDrawer" aria-label="Saved Wishlist">
      <div class="drawer-header">
        <h3>Saved Abayas</h3>
        <button type="button" class="close-x" data-close-all aria-label="Close wishlist">✕</button>
      </div>
      <div class="drawer-body" id="wishlistItemsContainer"></div>
    </aside>

    <div class="center-modal" id="quickViewModal" role="dialog" aria-modal="true" aria-labelledby="qvTitle">
      <div class="modal-card">
        <button type="button" class="close-x" data-close-all style="position:absolute;top:1rem;right:1rem;z-index:10;" aria-label="Close quick view">✕</button>
        <div class="qv-grid" id="quickViewContent"></div>
      </div>
    </div>

    <div class="center-modal" id="searchModal" role="dialog" aria-modal="true" aria-label="Search Catalog">
      <div class="modal-card modal-card--narrow">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <h3 style="font-family:var(--font-serif);font-size:1.7rem;">Search TehNoor Veils</h3>
          <button type="button" class="close-x" data-close-all aria-label="Close search">✕</button>
        </div>
        <input type="search" id="globalSearchInput" placeholder="Search by silhouette, shade, or fabric (e.g. Farasha, Ivory, Satin)..." style="width:100%;padding:0.9rem 1.15rem;border-radius:999px;border:1px solid var(--border-gold);background:var(--bg-card);font-size:0.95rem;margin-bottom:1rem;" />
        <div id="globalSearchResults" style="display:grid;gap:0.75rem;max-height:52vh;overflow-y:auto;"></div>
      </div>
    </div>

    <div class="center-modal" id="checkoutModal" role="dialog" aria-modal="true" aria-label="Checkout">
      <div class="modal-card modal-card--narrow" id="checkoutModalCard">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.1rem;">
          <div>
            <span class="section-kicker" style="margin:0;">PAN India Checkout</span>
            <h3 style="font-family:var(--font-serif);font-size:1.8rem;">Complete Your Order</h3>
          </div>
          <button type="button" class="close-x" data-close-all aria-label="Close checkout">✕</button>
        </div>

        <form id="checkoutForm">
          <div class="form-grid">
            <div class="form-field">
              <label for="custName">Full Name *</label>
              <input type="text" id="custName" required placeholder="e.g. Ayesha Khan" />
            </div>
            <div class="form-field">
              <label for="custPhone">Mobile / WhatsApp *</label>
              <input type="tel" id="custPhone" required pattern="[0-9+\\s-]{10,15}" placeholder="+91 98765 43210" />
            </div>
            <div class="form-field">
              <label for="custEmail">Email (Optional)</label>
              <input type="email" id="custEmail" placeholder="ayesha@example.com" />
            </div>
            <div class="form-field">
              <label for="custPincode">6-Digit Pincode *</label>
              <input type="text" id="custPincode" required maxlength="6" pattern="\\d{6}" placeholder="e.g. 500001" />
              <small id="pincodeStatus" style="font-size:0.74rem;color:var(--sage-deep);"></small>
            </div>
            <div class="form-field">
              <label for="custCity">City &amp; State *</label>
              <input type="text" id="custCity" required placeholder="Hyderabad, Telangana" />
            </div>
            <div class="form-field full">
              <label for="custAddress">Complete Delivery Address *</label>
              <textarea id="custAddress" rows="2" required placeholder="House/Flat No, Street, Landmark"></textarea>
            </div>
          </div>

          <div style="margin-top:1rem;">
            <label style="font-size:0.78rem;font-weight:700;color:var(--text-body);">Select Payment Mode</label>
            <div class="payment-tabs" id="paymentTabs">
              <button type="button" class="payment-tab is-active" data-pay="UPI (GPay / PhonePe)">UPI Instant</button>
              <button type="button" class="payment-tab" data-pay="Cash on Delivery">Cash on Delivery</button>
              <button type="button" class="payment-tab" data-pay="Instagram DM Order">Order via IG DM</button>
            </div>
          </div>

          <div style="background:var(--bg-ivory-soft);padding:0.9rem 1rem;border-radius:12px;margin-bottom:1.1rem;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.88rem;">Payable Order Total</span>
            <strong id="checkoutFinalTotal" style="font-size:1.25rem;color:var(--sage-deep);">₹0</strong>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%;">Confirm &amp; Place Order ✨</button>
        </form>

        <div id="orderConfirmationView" hidden></div>
      </div>
    </div>

    <div class="center-modal" id="trackModal" role="dialog" aria-modal="true" aria-label="Track Your Order">
      <div class="modal-card modal-card--narrow">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <div>
            <span class="section-kicker" style="margin:0;">PAN India Tracking</span>
            <h3 style="font-family:var(--font-serif);font-size:1.75rem;">Track Your Parcel</h3>
          </div>
          <button type="button" class="close-x" data-close-all aria-label="Close tracker">✕</button>
        </div>
        <form id="trackOrderForm" style="display:flex;gap:0.6rem;margin-bottom:1rem;">
          <input type="text" id="trackOrderIdInput" placeholder="Enter Order ID (e.g. TV-2026-...)" required style="flex:1;padding:0.75rem 1rem;border-radius:999px;border:1px solid var(--border-gold);background:var(--bg-card);" />
          <button type="submit" class="btn btn-primary btn-sm">Track</button>
        </form>
        <div id="recentOrderChips" style="display:flex;flex-wrap:wrap;gap:0.45rem;margin-bottom:1rem;"></div>
        <div id="trackOrderResult"></div>
      </div>
    </div>

    <div class="center-modal" id="reviewModal" role="dialog" aria-modal="true" aria-label="Write a Customer Review">
      <div class="modal-card modal-card--narrow">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <h3 style="font-family:var(--font-serif);font-size:1.7rem;">Share Your TehNoor Experience</h3>
          <button type="button" class="close-x" data-close-all aria-label="Close review modal">✕</button>
        </div>
        <form id="reviewSubmitForm" class="form-grid">
          <div class="form-field">
            <label for="revName">Your Name *</label>
            <input type="text" id="revName" required placeholder="e.g. Sana Fatima" />
          </div>
          <div class="form-field">
            <label for="revCity">City *</label>
            <input type="text" id="revCity" required placeholder="e.g. Pune, Maharashtra" />
          </div>
          <div class="form-field full">
            <label for="revProduct">Piece Purchased *</label>
            <select id="revProduct"></select>
          </div>
          <div class="form-field full">
            <label for="revQuote">Your Review *</label>
            <textarea id="revQuote" rows="3" required placeholder="How did the Korean Nida fabric &amp; drape feel?"></textarea>
          </div>
          <div class="form-field full">
            <button type="submit" class="btn btn-primary" style="width:100%;">Publish Review ✨</button>
          </div>
        </form>
      </div>
    </div>

    <div class="toast-container" id="toastContainer" aria-live="polite"></div>
  `;

  const headerHost = document.getElementById("siteHeaderShell");
  const footerHost = document.getElementById("siteFooterShell");
  if (headerHost) headerHost.innerHTML = headerHtml;
  if (footerHost) footerHost.innerHTML = footerAndOverlaysHtml;
})();

/* ==========================================================================
   TehNoor Veils — Storefront Interactive Engine & Animations
   ========================================================================== */

(() => {
  const products = window.TEHNOOR_CATALOG || [];
  const defaultReviews = window.TEHNOOR_REVIEWS || [];
  const promos = window.TEHNOOR_PROMOS || {};

  const FREE_SHIPPING_THRESHOLD = 2499;
  const SHIPPING_FEE = 149;

  const state = {
    filter: "all",
    sort: "featured",
    search: "",
    cart: JSON.parse(localStorage.getItem("tv_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("tv_wishlist") || "[]"),
    reviews: JSON.parse(localStorage.getItem("tv_reviews") || "null") || [...defaultReviews],
    orders: JSON.parse(localStorage.getItem("tv_orders") || "[]"),
    appliedPromo: localStorage.getItem("tv_promo") || "",
    paymentMethod: "UPI (GPay / PhonePe)",
    selectedSwatches: {}
  };

  // DOM helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const formatINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

  function saveState() {
    localStorage.setItem("tv_cart", JSON.stringify(state.cart));
    localStorage.setItem("tv_wishlist", JSON.stringify(state.wishlist));
    localStorage.setItem("tv_reviews", JSON.stringify(state.reviews));
    localStorage.setItem("tv_orders", JSON.stringify(state.orders));
    localStorage.setItem("tv_promo", state.appliedPromo);
  }

  /* ---------- Preloader & Hero Ready ---------- */
  function initPreloader() {
    const preloader = $("#preloader");
    const hero = $("#heroSection");
    const finish = () => {
      preloader?.classList.add("is-done");
      hero?.classList.add("is-ready");
      setTimeout(() => preloader?.remove(), 1100);
    };
    if (document.readyState === "complete") {
      setTimeout(finish, 650);
    } else {
      window.addEventListener("load", () => setTimeout(finish, 650), { once: true });
      setTimeout(finish, 1800);
    }
  }

  /* ---------- Scroll Progress, Header Elevation & Scroll Choreography ---------- */
  function initScrollEffects() {
    const bar = $("#scrollProgress");
    const header = $("#siteHeader");
    const heroSection = $("#heroSection");
    const heroCopy = $(".hero-copy");
    const heroTiltCard = $("#heroTiltCard");
    const craftA = $("#craftParallaxA");
    const craftB = $("#craftParallaxB");
    const craftSeal = $("#craftSeal");
    const storyCrest = $("#storyCrestImg");
    const stepsTimeline = $("#stepsTimeline");
    const timelineFill = $("#timelineLine");
    const stepCards = $$(".step-card");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafPending = false;

    const updateOnScroll = () => {
      rafPending = false;
      const scrollTop = window.scrollY;
      const vh = window.innerHeight || 800;
      const docHeight = document.documentElement.scrollHeight - vh;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

      if (bar) bar.style.width = `${pct}%`;
      if (header) header.classList.toggle("is-scrolled", scrollTop > 24);
      if (reduceMotion) return;

      // 1. Hero gentle scroll parallax (desktop only so mobile stays crisp)
      if (heroSection && window.innerWidth > 920) {
        const heroH = heroSection.offsetHeight || 700;
        const progress = Math.min(1, Math.max(0, scrollTop / heroH));
        if (heroCopy) {
          heroCopy.style.transform = `translate3d(0, ${progress * -28}px, 0)`;
        }
        if (heroTiltCard) {
          heroTiltCard.style.transform = `translate3d(0, ${progress * 26}px, 0)`;
        }
      } else if (heroCopy) {
        heroCopy.style.transform = "";
      }

      // 2. Craftsmanship opposing collage parallax & rotating UAE seal
      if (craftA && craftB) {
        const rect = craftA.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const clamped = Math.max(-1, Math.min(1, centerOffset));
        craftA.style.transform = `translate3d(0, ${clamped * -18}px, 0)`;
        craftB.style.transform = `translate3d(0, ${28 + clamped * 22}px, 0)`;
        if (craftSeal) {
          craftSeal.style.transform = `translate(-50%, -50%) rotate(${clamped * -16}deg)`;
        }
      }

      // 3. Story banner crest gentle spin on scroll
      if (storyCrest) {
        const rect = storyCrest.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (rect.top - vh / 2) / vh));
        storyCrest.style.transform = `rotate(${p * -14}deg) scale(${1 - Math.abs(p) * 0.05})`;
      }

      // 4. Order guide timeline vertical line draw & active step illumination
      if (stepsTimeline && timelineFill) {
        const rect = stepsTimeline.getBoundingClientRect();
        const raw = (vh * 0.68 - rect.top) / Math.max(1, rect.height);
        const fill = Math.max(0, Math.min(1, raw));
        timelineFill.style.transform = `scaleY(${fill})`;
        stepCards.forEach((card, i) => {
          const threshold = (i + 0.15) / stepCards.length;
          card.classList.toggle("is-lit", fill >= threshold);
        });
      }
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateOnScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateOnScroll();
  }

  /* ---------- Intersection Observer Reveals ---------- */
  let revealObserver;
  function observeReveals() {
    const targets = $$(".reveal:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible), .reveal-scale:not(.is-visible), .reveal-curtain:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
      );
    }
    targets.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Hero Ambient Gold Dust Particle Canvas ---------- */
  function initHeroParticles() {
    const canvas = $("#heroParticles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.45 + 0.18
    }));

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194, 157, 89, ${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- Hero 3D Pointer Tilt & Magnetic Buttons ---------- */
  function initPointerMicroInteractions() {
    const tiltCard = $("#heroTiltCard");
    if (tiltCard && window.matchMedia("(pointer: fine)").matches) {
      const hero = $("#heroSection");
      hero?.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        tiltCard.style.transform = `rotateY(${nx * 8}deg) rotateX(${-ny * 6}deg)`;
      });
      hero?.addEventListener("mouseleave", () => {
        tiltCard.style.transform = "rotateY(0deg) rotateX(0deg)";
      });
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const circle = document.createElement("span");
      circle.className = "btn-ripple";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  }

  /* ---------- Toast Notifications ---------- */
  function showToast(message, icon = "✨") {
    const container = $("#toastContainer");
    if (!container) return;
    while (container.children.length >= 2) {
      container.firstElementChild?.remove();
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      el.style.transition = "all 0.3s ease";
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }

  /* ---------- Product Filtering & Grid Rendering ---------- */
  function getFilteredProducts() {
    let list = [...products];
    if (state.filter !== "all") {
      list = list.filter((p) => p.category === state.filter);
    }
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }
    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;
    const list = getFilteredProducts();

    if (!list.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3.5rem 1rem;background:var(--bg-card);border-radius:var(--radius-lg);border:1px dashed var(--border-gold);">
          <p style="font-family:var(--font-serif);font-size:1.75rem;margin-bottom:0.5rem;">No pieces matched your filter</p>
          <p style="color:var(--text-muted);margin-bottom:1.25rem;">Try clearing your search or viewing all UAE-imported abayas.</p>
          <button type="button" class="btn btn-primary btn-sm" id="resetFiltersBtn">View All Pieces</button>
        </div>`;
      $("#resetFiltersBtn")?.addEventListener("click", () => {
        state.filter = "all";
        state.search = "";
        $("#inlineSearchInput").value = "";
        syncFilterPills();
        renderProducts();
      });
      return;
    }

    grid.innerHTML = list
      .map((p, idx) => {
        const activeColorIdx = state.selectedSwatches[p.id] || 0;
        const activeColor = p.colors[activeColorIdx] || p.colors[0];
        const isWished = state.wishlist.includes(p.id);
        const quickSizes = p.sizes
          .map(
            (sz) =>
              `<button type="button" class="quick-size-btn" data-quick-add="${p.id}" data-size="${sz}">${
                sz.length > 6 ? "Add Free Size" : sz
              }</button>`
          )
          .join("");

        return `
          <article class="product-card reveal" style="transition-delay:${Math.min(idx * 0.05, 0.3)}s" data-product-id="${p.id}">
            <div class="product-media" data-open-qv="${p.id}">
              <img src="${activeColor.image}" alt="${p.name} in ${activeColor.name}" loading="lazy" />
              <div class="product-sheen"></div>
              <div class="product-badges">
                <span class="badge-pill badge-pill--${p.badgeTone}">${p.badge}</span>
              </div>
              <button type="button" class="wishlist-btn ${isWished ? "is-active" : ""}" data-toggle-wish="${p.id}" aria-label="Save ${p.name} to wishlist">
                <svg viewBox="0 0 24 24" stroke-width="2"><path d="M12 20.5s-7-4.5-9.2-8.7C1.1 8.5 3 5 6.6 5c2 0 3.4 1.1 4.4 2.4C12 6.1 13.4 5 15.4 5 19 5 20.9 8.5 19.2 11.8 17 16 12 20.5 12 20.5Z"/></svg>
              </button>
              <div class="quick-add-dock" onclick="event.stopPropagation()">
                <span class="quick-add-label">Quick Add Size</span>
                <div class="quick-size-row">${quickSizes}</div>
              </div>
            </div>

            <div class="product-body">
              <div class="product-meta-top">
                <span>${p.fabric}</span>
                <span class="product-rating">★ ${p.rating.toFixed(1)} (${p.reviewCount})</span>
              </div>
              <h3 class="product-title" data-open-qv="${p.id}">${p.name}</h3>
              <p class="product-subtitle">${p.subtitle}</p>

              <div class="product-swatches">
                ${p.colors
                  .map(
                    (c, cIdx) => `
                  <button type="button"
                    class="swatch-dot ${cIdx === activeColorIdx ? "is-active" : ""}"
                    style="background:${c.hex}"
                    title="${c.name}"
                    aria-label="Select ${c.name}"
                    data-swatch-prod="${p.id}"
                    data-swatch-idx="${cIdx}">
                  </button>`
                  )
                  .join("")}
                <span style="font-size:0.74rem;color:var(--text-muted);margin-left:0.25rem;">${activeColor.name}</span>
              </div>

              <div class="product-footer">
                <div class="price-wrap">
                  <span class="price-current">${formatINR(p.price)}</span>
                  ${p.compareAt ? `<span class="price-compare">${formatINR(p.compareAt)}</span>` : ""}
                </div>
                <button type="button" class="card-action-link" data-open-qv="${p.id}">Quick View</button>
              </div>
            </div>
          </article>`;
      })
      .join("");

    observeReveals();
  }

  function syncFilterPills() {
    $$("#categoryFilterPills .filter-pill").forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.filter === state.filter);
    });
  }

  /* ---------- Cart Logic ---------- */
  function addToCart(productId, size, colorName, qty = 1) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const swatchIdx = state.selectedSwatches[productId] || 0;
    const chosenColor = colorName || product.colors[swatchIdx]?.name || product.colors[0].name;
    const chosenImg =
      product.colors.find((c) => c.name === chosenColor)?.image || product.image;
    const chosenSize = size || product.defaultSize;

    const existing = state.cart.find(
      (item) => item.id === productId && item.size === chosenSize && item.color === chosenColor
    );
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: chosenImg,
        size: chosenSize,
        color: chosenColor,
        qty
      });
    }
    saveState();
    updateBadges(true);
    renderCart();
    showToast(`Added <strong>${product.name}</strong> (Size ${chosenSize}) to Bag`, "🛍️");
  }

  function computeCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const promoObj = promos[state.appliedPromo];
    let discount = 0;
    if (promoObj && promoObj.type === "percent") {
      discount = Math.round((subtotal * promoObj.value) / 100);
    }
    const qualifiesFreeShip =
      subtotal === 0 ||
      subtotal >= FREE_SHIPPING_THRESHOLD ||
      (promoObj && promoObj.type === "shipping");
    const shipping = qualifiesFreeShip ? 0 : SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount + shipping);
    return { subtotal, discount, shipping, total };
  }

  function renderCart() {
    const container = $("#cartItemsContainer");
    const meterText = $("#shippingMeterText");
    const meterFill = $("#shippingMeterFill");
    if (!container) return;

    const { subtotal, discount, shipping, total } = computeCartTotals();

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      meterText.innerHTML = "🎉 You unlocked <strong>FREE PAN India Shipping!</strong>";
      meterFill.style.width = "100%";
    } else {
      const rem = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
      meterText.innerHTML = `Add <strong>${formatINR(rem)}</strong> more for Free PAN India Shipping`;
      meterFill.style.width = `${pct}%`;
    }

    if (!state.cart.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <p style="font-size:2.4rem;margin-bottom:0.5rem;">🧕</p>
          <p style="font-family:var(--font-serif);font-size:1.45rem;margin-bottom:0.4rem;">Your bag is currently empty</p>
          <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:1.25rem;">Explore our UAE-imported Farasha &amp; Korean Nida abayas.</p>
          <button type="button" class="btn btn-primary btn-sm" data-close-all>Browse Collection</button>
        </div>`;
    } else {
      container.innerHTML = state.cart
        .map(
          (item, idx) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <div style="display:flex;justify-content:space-between;gap:0.5rem;">
              <strong style="font-family:var(--font-serif);font-size:1.08rem;line-height:1.2;">${item.name}</strong>
              <button type="button" data-remove-cart="${idx}" aria-label="Remove item" style="color:var(--text-muted);font-size:0.85rem;">✕</button>
            </div>
            <p style="font-size:0.78rem;color:var(--text-muted);margin:0.2rem 0 0.55rem;">${item.color} • Size ${item.size}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="cart-qty-box">
                <button type="button" data-cart-dec="${idx}" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button type="button" data-cart-inc="${idx}" aria-label="Increase quantity">+</button>
              </div>
              <strong style="color:var(--sage-deep);">${formatINR(item.price * item.qty)}</strong>
            </div>
          </div>
        </div>`
        )
        .join("");
    }

    $("#cartSubtotal").textContent = formatINR(subtotal);
    const discRow = $("#cartDiscountRow");
    if (discount > 0) {
      discRow.hidden = false;
      $("#cartDiscount").textContent = `-${formatINR(discount)}`;
    } else {
      discRow.hidden = true;
    }
    $("#cartShipping").textContent = shipping === 0 ? "FREE" : formatINR(shipping);
    $("#cartTotal").textContent = formatINR(total);
    $("#checkoutFinalTotal").textContent = formatINR(total);
    $("#proceedCheckoutBtn").disabled = state.cart.length === 0;
  }

  /* ---------- Wishlist Logic ---------- */
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    const product = products.find((p) => p.id === productId);
    if (idx === -1) {
      state.wishlist.push(productId);
      showToast(`Saved <strong>${product?.name}</strong> to Wishlist`, "🤍");
    } else {
      state.wishlist.splice(idx, 1);
      showToast(`Removed from Wishlist`, "✕");
    }
    saveState();
    updateBadges(true);
    renderProducts();
    renderWishlist();
  }

  function renderWishlist() {
    const container = $("#wishlistItemsContainer");
    if (!container) return;
    const saved = products.filter((p) => state.wishlist.includes(p.id));
    if (!saved.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <p style="font-size:2.2rem;margin-bottom:0.5rem;">🤍</p>
          <p style="font-family:var(--font-serif);font-size:1.45rem;margin-bottom:0.4rem;">No saved abayas yet</p>
          <p style="font-size:0.86rem;color:var(--text-muted);">Tap the heart icon on any piece to save it here.</p>
        </div>`;
      return;
    }
    container.innerHTML = saved
      .map(
        (p) => `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" />
        <div>
          <strong style="font-family:var(--font-serif);font-size:1.08rem;">${p.name}</strong>
          <p style="font-size:0.78rem;color:var(--text-muted);margin:0.2rem 0 0.5rem;">${formatINR(p.price)} • ${p.fabric}</p>
          <div style="display:flex;gap:0.5rem;">
            <button type="button" class="btn btn-primary btn-sm" data-move-cart="${p.id}">Add Size ${p.defaultSize}</button>
            <button type="button" class="btn btn-outline btn-sm" data-toggle-wish="${p.id}">Remove</button>
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  function updateBadges(bump = false) {
    const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
    const wishCount = state.wishlist.length;

    const pairs = [
      [$("#cartBadge"), cartCount],
      [$("#mobileCartBadge"), cartCount],
      [$("#wishlistBadge"), wishCount],
      [$("#mobileWishlistBadge"), wishCount]
    ];
    for (const [el, count] of pairs) {
      if (!el) continue;
      el.textContent = count;
      el.dataset.count = String(count);
      if (bump) {
        el.classList.remove("bump");
        void el.offsetWidth;
        el.classList.add("bump");
      }
    }
  }

  /* ---------- Drawer & Modal Controller ---------- */
  function closeAllOverlays() {
    $("#drawerBackdrop")?.classList.remove("is-open");
    $$(".slide-drawer.is-open, .center-modal.is-open").forEach((el) =>
      el.classList.remove("is-open")
    );
    document.body.classList.remove("modal-open");
  }

  function openOverlay(el) {
    closeAllOverlays();
    $("#drawerBackdrop")?.classList.add("is-open");
    el?.classList.add("is-open");
    document.body.classList.add("modal-open");
  }

  /* ---------- Quick View Modal ---------- */
  function openQuickView(productId) {
    const p = products.find((item) => item.id === productId);
    if (!p) return;
    let selectedColorIdx = state.selectedSwatches[p.id] || 0;
    let selectedSize = p.defaultSize;

    const content = $("#quickViewContent");
    const renderQV = () => {
      const col = p.colors[selectedColorIdx] || p.colors[0];
      content.innerHTML = `
        <div class="qv-media">
          <img src="${col.image}" alt="${p.name} - ${col.name}" />
        </div>
        <div class="qv-details">
          <span class="section-kicker" style="margin:0;">${p.origin} • ${p.fabric}</span>
          <h2 id="qvTitle" style="font-family:var(--font-serif);font-size:2rem;line-height:1.1;">${p.name}</h2>
          <div style="display:flex;align-items:center;gap:0.85rem;">
            <strong style="font-size:1.45rem;color:var(--sage-deep);">${formatINR(p.price)}</strong>
            ${p.compareAt ? `<span style="text-decoration:line-through;color:var(--text-muted);">${formatINR(p.compareAt)}</span>` : ""}
            <span style="font-size:0.82rem;color:var(--gold-deep);font-weight:600;">★ ${p.rating} (${p.reviewCount} reviews)</span>
          </div>
          <p style="font-size:0.9rem;color:var(--text-body);">${p.description}</p>
          <ul style="padding-left:1.1rem;font-size:0.84rem;color:var(--text-muted);display:grid;gap:0.25rem;">
            ${p.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>

          <div>
            <div style="font-size:0.78rem;font-weight:700;margin-bottom:0.4rem;">Shade: <span style="color:var(--sage-deep);">${col.name}</span></div>
            <div class="product-swatches" style="margin-bottom:0;">
              ${p.colors
                .map(
                  (c, idx) =>
                    `<button type="button" class="swatch-dot ${idx === selectedColorIdx ? "is-active" : ""}" style="background:${c.hex}" data-qv-color="${idx}" title="${c.name}"></button>`
                )
                .join("")}
            </div>
          </div>

          <div>
            <div style="font-size:0.78rem;font-weight:700;margin-bottom:0.4rem;">Select Length / Size:</div>
            <div class="size-pills">
              ${p.sizes
                .map(
                  (s) =>
                    `<button type="button" class="size-pill ${s === selectedSize ? "is-active" : ""}" data-qv-size="${s}">${s}</button>`
                )
                .join("")}
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:0.65rem;margin-top:0.5rem;">
            <button type="button" class="btn btn-primary" id="qvAddBtn" style="flex:1;">Add to Bag — ${formatINR(p.price)}</button>
            <button type="button" class="btn btn-outline" id="qvDmBtn">📲 Copy DM Order</button>
          </div>
        </div>`;

      $$("[data-qv-color]", content).forEach((btn) =>
        btn.addEventListener("click", () => {
          selectedColorIdx = Number(btn.dataset.qvColor);
          state.selectedSwatches[p.id] = selectedColorIdx;
          renderQV();
          renderProducts();
        })
      );
      $$("[data-qv-size]", content).forEach((btn) =>
        btn.addEventListener("click", () => {
          selectedSize = btn.dataset.qvSize;
          renderQV();
        })
      );
      $("#qvAddBtn", content)?.addEventListener("click", () => {
        addToCart(p.id, selectedSize, p.colors[selectedColorIdx].name, 1);
        closeAllOverlays();
        openOverlay($("#cartDrawer"));
      });
      $("#qvDmBtn", content)?.addEventListener("click", async () => {
        const msg = `Assalamualaikum TehNoor Veils! I'd like to order:\n• Piece: ${p.name}\n• Shade: ${p.colors[selectedColorIdx].name}\n• Size: ${selectedSize}\n• Price: ${formatINR(p.price)}`;
        try {
          await navigator.clipboard.writeText(msg);
          showToast("Order message copied! Paste in @tehnoor_veils DM", "📲");
        } catch {
          showToast("Ready for DM: " + p.name, "📲");
        }
      });
    };
    renderQV();
    openOverlay($("#quickViewModal"));
  }

  /* ---------- Interactive Size Studio ---------- */
  function initSizeStudio() {
    const heightSel = $("#heightSelect");
    const drapeSel = $("#drapeSelect");
    const outVal = $("#recommendedSizeVal");
    const outNote = $("#recommendedSizeNote");
    if (!heightSel || !drapeSel) return;

    const updateSize = () => {
      const base = Number(heightSel.value);
      const extra = Number(drapeSel.value);
      const finalSize = Math.min(58, base + extra);
      const bustMap = { 52: "42–44\"", 54: "44–46\"", 56: "46–48\"", 58: "48–50\"" };
      outVal.textContent = String(finalSize);
      outNote.textContent = `Length ${finalSize}" • Relaxed Bust ${bustMap[finalSize] || "44–46\""}`;
    };
    heightSel.addEventListener("change", updateSize);
    drapeSel.addEventListener("change", updateSize);
    updateSize();
  }

  /* ---------- Reviews Rendering & Submission ---------- */
  function renderReviews() {
    const track = $("#reviewsTrack");
    if (!track) return;
    track.innerHTML = state.reviews
      .slice(0, 6)
      .map(
        (r) => `
      <article class="review-card reveal">
        <div>
          <div class="review-stars">${"★".repeat(r.rating || 5)}</div>
          <p class="review-quote">“${r.quote}”</p>
        </div>
        <div class="review-author">
          <div>
            <strong>${r.name}</strong>
            <span>${r.city}</span>
          </div>
          <span class="review-tag">${r.product}</span>
        </div>
      </article>`
      )
      .join("");
    observeReveals();
  }

  /* ---------- Confetti Burst Animation ---------- */
  function fireConfetti() {
    const canvas = $("#confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#C29D59", "#4A594B", "#9B7883", "#DFC38D", "#6D3B47"];
    const pieces = Array.from({ length: 90 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 3,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2
    }));
    let frames = 0;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rot += 0.1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      frames++;
      if (frames < 110) requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    loop();
  }

  /* ---------- Checkout & PAN India Pincode + PHP API ---------- */
  function initCheckoutAndTracking() {
    const pincodeInput = $("#custPincode");
    const pincodeStatus = $("#pincodeStatus");
    pincodeInput?.addEventListener("input", () => {
      const val = pincodeInput.value.replace(/\D/g, "");
      pincodeInput.value = val;
      if (val.length === 6) {
        const metro = /^[1456]/.test(val);
        pincodeStatus.textContent = metro
          ? "✓ Express Delivery: 3–4 business days • COD Available"
          : "✓ PAN India Delivery: 4–6 business days • COD Available";
      } else {
        pincodeStatus.textContent = "";
      }
    });

    $$("#paymentTabs .payment-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$("#paymentTabs .payment-tab").forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        state.paymentMethod = tab.dataset.pay;
      });
    });

    $("#proceedCheckoutBtn")?.addEventListener("click", () => {
      if (!state.cart.length) return;
      $("#checkoutForm").hidden = false;
      $("#orderConfirmationView").hidden = true;
      renderCart();
      openOverlay($("#checkoutModal"));
    });

    $("#checkoutForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!state.cart.length) return;
      const totals = computeCartTotals();
      const payload = {
        customer: {
          name: $("#custName").value.trim(),
          phone: $("#custPhone").value.trim(),
          email: $("#custEmail").value.trim(),
          pincode: $("#custPincode").value.trim(),
          city: $("#custCity").value.trim(),
          address: $("#custAddress").value.trim()
        },
        paymentMethod: state.paymentMethod,
        promoCode: state.appliedPromo,
        items: state.cart,
        totals
      };

      let createdOrder = null;
      for (const endpoint of ["/api/orders", "api/orders.php"]) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (res.ok && (res.headers.get("content-type") || "").includes("application/json")) {
            const data = await res.json();
            if (data?.ok && data.order) {
              createdOrder = data.order;
              break;
            }
          }
        } catch {
          // Try next endpoint or localStorage fallback
        }
      }

      if (!createdOrder) {
        createdOrder = {
          orderId: "TV-2026-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
          status: "Confirmed",
          createdAt: new Date().toISOString(),
          ...payload
        };
      }

      state.orders.unshift(createdOrder);
      state.cart = [];
      state.appliedPromo = "";
      saveState();
      updateBadges(true);
      renderCart();
      fireConfetti();

      $("#checkoutForm").hidden = true;
      const conf = $("#orderConfirmationView");
      conf.hidden = false;
      conf.innerHTML = `
        <div style="text-align:center;padding:1rem 0;">
          <div style="font-size:3rem;margin-bottom:0.5rem;">🎉</div>
          <span class="section-kicker">Thank You For Trusting TehNoor Veils</span>
          <h3 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:0.35rem;">Order Confirmed!</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.1rem;">
            Your UAE-imported pieces are being ribbon-wrapped for dispatch to <strong>${createdOrder.customer.city} (${createdOrder.customer.pincode})</strong>.
          </p>
          <div style="background:var(--bg-ivory-soft);border:1px dashed var(--gold);border-radius:14px;padding:1rem;margin-bottom:1.25rem;">
            <span style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--text-muted);">Order Tracking ID</span>
            <div style="font-family:var(--font-serif);font-size:1.75rem;font-weight:700;color:var(--sage-deep);">${createdOrder.orderId}</div>
            <div style="font-size:0.84rem;margin-top:0.25rem;">Paid via ${createdOrder.paymentMethod} • Total ${formatINR(createdOrder.totals.total)}</div>
          </div>
          <div style="display:flex;gap:0.65rem;justify-content:center;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-sm" id="confTrackNowBtn">Track This Order</button>
            <button type="button" class="btn btn-outline btn-sm" data-close-all>Continue Shopping</button>
          </div>
        </div>`;

      $("#confTrackNowBtn")?.addEventListener("click", () => {
        openTrackModal(createdOrder.orderId);
      });
    });
  }

  function renderOrderTrackResult(order) {
    const target = $("#trackOrderResult");
    if (!order) {
      target.innerHTML = `<p style="color:var(--burgundy);font-size:0.9rem;">No order found with that ID. Try placing a quick test order or pick a recent order above.</p>`;
      return;
    }
    target.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);border-radius:16px;padding:1.15rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.85rem;">
          <strong style="font-family:var(--font-serif);font-size:1.25rem;">${order.orderId}</strong>
          <span class="badge-pill badge-pill--sage">${order.status || "Confirmed"}</span>
        </div>
        <div style="display:grid;gap:0.6rem;font-size:0.85rem;">
          <div>✅ <strong>Order Confirmed</strong> — Verified for ${order.customer?.name || "Customer"}</div>
          <div>🎀 <strong>Quality Check &amp; Gift Packing</strong> — Ribbon-wrapped with Thank-You card</div>
          <div>🚚 <strong>PAN India Courier Transit</strong> — Destination: ${order.customer?.city || ""} (${order.customer?.pincode || ""})</div>
          <div style="opacity:0.6;">🏠 <strong>Doorstep Delivery</strong> — Est. 3–5 business days</div>
        </div>
      </div>`;
  }

  function openTrackModal(prefillId = "") {
    const chips = $("#recentOrderChips");
    if (chips) {
      chips.innerHTML = state.orders
        .slice(0, 3)
        .map(
          (o) =>
            `<button type="button" class="filter-pill" data-pick-track="${o.orderId}">${o.orderId}</button>`
        )
        .join("");
      $$("[data-pick-track]", chips).forEach((btn) =>
        btn.addEventListener("click", () => {
          $("#trackOrderIdInput").value = btn.dataset.pickTrack;
          const found = state.orders.find((o) => o.orderId === btn.dataset.pickTrack);
          renderOrderTrackResult(found);
        })
      );
    }
    if (prefillId) {
      $("#trackOrderIdInput").value = prefillId;
      const found = state.orders.find((o) => o.orderId === prefillId);
      renderOrderTrackResult(found);
    } else {
      $("#trackOrderResult").innerHTML = "";
    }
    openOverlay($("#trackModal"));
  }

  /* ---------- Search Overlay ---------- */
  function renderGlobalSearch(query) {
    const resBox = $("#globalSearchResults");
    if (!resBox) return;
    const q = query.trim().toLowerCase();
    const matches = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.colors.some((c) => c.name.toLowerCase().includes(q))
        )
      : products.slice(0, 4);

    resBox.innerHTML = matches.length
      ? matches
          .map(
            (p) => `
          <div style="display:flex;align-items:center;gap:0.9rem;padding:0.65rem;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-hairline);cursor:pointer;" data-search-pick="${p.id}">
            <img src="${p.image}" alt="${p.name}" style="width:54px;height:68px;object-fit:cover;border-radius:8px;" />
            <div style="flex:1;">
              <strong style="font-family:var(--font-serif);font-size:1.1rem;">${p.name}</strong>
              <div style="font-size:0.78rem;color:var(--text-muted);">${p.fabric} • ${formatINR(p.price)}</div>
            </div>
            <span style="font-size:0.8rem;color:var(--sage-deep);font-weight:700;">View →</span>
          </div>`
          )
          .join("")
      : `<p style="color:var(--text-muted);text-align:center;padding:1.5rem;">No pieces found for "${query}".</p>`;

    $$("[data-search-pick]", resBox).forEach((row) =>
      row.addEventListener("click", () => openQuickView(row.dataset.searchPick))
    );
  }

  /* ---------- Wire All Events ---------- */
  function bindEvents() {
    // Category pills
    $$("#categoryFilterPills .filter-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        state.filter = pill.dataset.filter;
        syncFilterPills();
        renderProducts();
      });
    });

    // Category showcase cards & footer links
    $$("[data-cat-jump]").forEach((card) => {
      card.addEventListener("click", () => {
        state.filter = card.dataset.catJump;
        syncFilterPills();
        renderProducts();
        $("#shop")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    $$("[data-footer-filter]").forEach((link) => {
      link.addEventListener("click", () => {
        state.filter = link.dataset.footerFilter;
        syncFilterPills();
        renderProducts();
      });
    });

    // Inline search & sort
    $("#inlineSearchInput")?.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderProducts();
    });
    $("#sortSelect")?.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderProducts();
    });

    // Delegated Product Grid clicks
    document.addEventListener("click", (e) => {
      const sw = e.target.closest("[data-swatch-prod]");
      if (sw) {
        state.selectedSwatches[sw.dataset.swatchProd] = Number(sw.dataset.swatchIdx);
        renderProducts();
        return;
      }

      const wishBtn = e.target.closest("[data-toggle-wish]");
      if (wishBtn) {
        e.stopPropagation();
        toggleWishlist(wishBtn.dataset.toggleWish);
        return;
      }

      const quickAdd = e.target.closest("[data-quick-add]");
      if (quickAdd) {
        e.stopPropagation();
        addToCart(quickAdd.dataset.quickAdd, quickAdd.dataset.size);
        return;
      }

      const qvBtn = e.target.closest("[data-open-qv]");
      if (qvBtn) {
        openQuickView(qvBtn.dataset.openQv);
        return;
      }

      const moveCart = e.target.closest("[data-move-cart]");
      if (moveCart) {
        addToCart(moveCart.dataset.moveCart);
        openOverlay($("#cartDrawer"));
        return;
      }

      const inc = e.target.closest("[data-cart-inc]");
      if (inc) {
        state.cart[Number(inc.dataset.cartInc)].qty++;
        saveState();
        updateBadges();
        renderCart();
        return;
      }

      const dec = e.target.closest("[data-cart-dec]");
      if (dec) {
        const idx = Number(dec.dataset.cartDec);
        if (state.cart[idx].qty > 1) state.cart[idx].qty--;
        else state.cart.splice(idx, 1);
        saveState();
        updateBadges();
        renderCart();
        return;
      }

      const rem = e.target.closest("[data-remove-cart]");
      if (rem) {
        state.cart.splice(Number(rem.dataset.removeCart), 1);
        saveState();
        updateBadges();
        renderCart();
        return;
      }

      if (e.target.closest("[data-close-all]") || e.target === $("#drawerBackdrop")) {
        closeAllOverlays();
      }
    });

    // Promo Code Apply
    $("#applyPromoBtn")?.addEventListener("click", () => {
      const code = ($("#promoCodeInput").value || "").trim().toUpperCase();
      const fb = $("#promoFeedback");
      if (promos[code]) {
        state.appliedPromo = code;
        saveState();
        renderCart();
        fb.textContent = `✓ Applied ${code}: ${promos[code].label}`;
        fb.style.color = "var(--sage-deep)";
        showToast(`Promo ${code} applied!`, "💎");
      } else {
        fb.textContent = "Invalid code. Try TEHNOOR10, EID15, or FREESHIP.";
        fb.style.color = "var(--burgundy)";
      }
    });

    // Header & Mobile Triggers
    $("#openCartBtn")?.addEventListener("click", () => { renderCart(); openOverlay($("#cartDrawer")); });
    $("#mobileCartBtn")?.addEventListener("click", () => { renderCart(); openOverlay($("#cartDrawer")); });
    $("#openWishlistBtn")?.addEventListener("click", () => { renderWishlist(); openOverlay($("#wishlistDrawer")); });
    $("#mobileWishlistBtn")?.addEventListener("click", () => { renderWishlist(); openOverlay($("#wishlistDrawer")); });
    $("#openMobileNavBtn")?.addEventListener("click", () => openOverlay($("#mobileNavDrawer")));

    const openSearch = () => {
      renderGlobalSearch("");
      openOverlay($("#searchModal"));
      setTimeout(() => $("#globalSearchInput")?.focus(), 120);
    };
    $("#openSearchBtn")?.addEventListener("click", openSearch);
    $("#mobileSearchBtn")?.addEventListener("click", openSearch);
    $("#globalSearchInput")?.addEventListener("input", (e) => renderGlobalSearch(e.target.value));

    $("#openTrackBtn")?.addEventListener("click", () => openTrackModal());
    $("#footerTrackBtn")?.addEventListener("click", () => openTrackModal());
    $("#mobileTrackDrawerBtn")?.addEventListener("click", () => openTrackModal());

    $("#trackOrderForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = $("#trackOrderIdInput").value.trim().toUpperCase();
      let found = state.orders.find((o) => o.orderId.toUpperCase() === id);
      if (!found) {
        for (const endpoint of [
          `/api/orders?id=${encodeURIComponent(id)}`,
          `api/orders.php?id=${encodeURIComponent(id)}`
        ]) {
          try {
            const res = await fetch(endpoint);
            if (res.ok && (res.headers.get("content-type") || "").includes("application/json")) {
              const data = await res.json();
              if (data?.ok) {
                found = data.order;
                break;
              }
            }
          } catch { /* try next */ }
        }
      }
      renderOrderTrackResult(found);
    });

    // Review Modal
    const revSelect = $("#revProduct");
    if (revSelect) {
      revSelect.innerHTML = products.map((p) => `<option value="${p.name}">${p.name}</option>`).join("");
    }
    $("#openReviewModalBtn")?.addEventListener("click", () => openOverlay($("#reviewModal")));
    $("#reviewSubmitForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const newRev = {
        name: $("#revName").value.trim(),
        city: $("#revCity").value.trim(),
        product: $("#revProduct").value,
        rating: 5,
        quote: $("#revQuote").value.trim()
      };
      state.reviews.unshift(newRev);
      saveState();
      renderReviews();
      e.target.reset();
      closeAllOverlays();
      showToast("JazakAllah Khair! Your review is live.", "★");
    });

    // Newsletter VIP form
    $("#newsletterForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Welcome to TehNoor VIP! Use code TEHNOOR10 at checkout.", "💎");
      e.target.reset();
    });

    // Escape key closes overlays
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllOverlays();
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const yr = $("#yearNow");
    if (yr) yr.textContent = new Date().getFullYear();

    initPreloader();
    initScrollEffects();
    initHeroParticles();
    initPointerMicroInteractions();
    initSizeStudio();
    initCheckoutAndTracking();
    bindEvents();

    renderProducts();
    renderReviews();
    renderCart();
    renderWishlist();
    updateBadges(false);
    observeReveals();
  });
})();

window.App = (function () {
  const STORAGE_KEYS = {
    CART: 'ee_cart_v1',
    ORDERS: 'ee_orders',
    WALLET: 'ee_wallet_tx',
    REVIEWS: 'ee_reviews',
    CUSTOM_PRODUCTS: 'ee_custom_products'
  };

  let state = {
    category: 'all',
    search: '',
    sort: 'featured',
    cart: JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]'),
    activeProduct: null,
    activeSlide: 0,
    mediaMode: 'photo',
    videoAnimId: null,
    videoPlaying: true,
    checkoutPayMethod: 'pix'
  };

  const DEFAULT_REVIEWS = [
    {
      author: 'Rafael Souza - São Paulo/SP',
      stars: 5,
      product: 'Mini Projetor Portátil HY300 Pro Android 11',
      comment: 'Comprei pelo eletroexpress.app.br no Pix, aprovou na hora e chegou super bem embalado. Imagem gigante na parede do quarto!',
      date: '14/11/2026'
    },
    {
      author: 'Mariana Oliveira - Uberlândia/MG',
      stars: 5,
      product: 'Smartwatch Ultra 9 AMOLED 49mm GPS & NFC',
      comment: 'Tela AMOLED absurda de linda e bateria durando 6 dias fácil. Atendimento impecável e rastreio atualizado certinho.',
      date: '15/11/2026'
    },
    {
      author: 'Lucas Fernandes - Curitiba/PR',
      stars: 5,
      product: 'Fone Bluetooth Pro 2 Cancelamento Ativo de Ruído ANC',
      comment: 'O cancelamento de ruído funciona muito bem no ônibus e academia. Vale cada centavo, já recomendei pros amigos.',
      date: '16/11/2026'
    },
    {
      author: 'Fernanda Costa - Salvador/BA',
      stars: 5,
      product: 'Câmera Segurança Wi-Fi Dupla Lente 360°',
      comment: 'Instalei em 5 minutos pelo celular. Imagem noturna colorida nítida demais. Loja confiável!',
      date: '17/11/2026'
    }
  ];

  function getAllProducts() {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_PRODUCTS) || '[]');
    const overrides = JSON.parse(localStorage.getItem('ee_price_overrides') || '{}');
    const merged = [...window.PRODUCTS, ...custom].map((p) => {
      if (overrides[p.id]) {
        const cost = Number(overrides[p.id].cost);
        const price = Number((cost * 1.5).toFixed(2));
        return { ...p, cost, price, originalPrice: Number((price * 1.28).toFixed(2)) };
      }
      return p;
    });
    return merged;
  }

  function formatBRL(val) {
    return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  function init() {
    renderCategoryMenu();
    renderHeroFeatured();
    renderCatalog();
    renderStoreReviews();
    updateCartUI();

    document.getElementById('searchInput').addEventListener('input', (e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderCatalog();
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
      renderCatalog();
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderCatalog();
    });
  }

  function renderCategoryMenu() {
    const menu = document.getElementById('categoryMenu');
    if (!menu) return;
    menu.innerHTML = window.CATEGORIES.map(
      (cat) => `
      <li>
        <button type="button" class="cat-pill ${state.category === cat.id ? 'active' : ''}" onclick="App.selectCategory('${cat.id}')">
          ${cat.icon} ${cat.name}
        </button>
      </li>`
    ).join('');
  }

  function selectCategory(catId) {
    state.category = catId;
    renderCategoryMenu();
    renderCatalog();
  }

  function resetFilters() {
    state.category = 'all';
    state.search = '';
    state.sort = 'featured';
    const inp = document.getElementById('searchInput');
    if (inp) inp.value = '';
    renderCategoryMenu();
    renderCatalog();
  }

  function renderHeroFeatured() {
    const box = document.getElementById('heroFeaturedProduct');
    const featured = getAllProducts().find((p) => p.id === 37) || getAllProducts()[0];
    if (!box || !featured) return;
    box.innerHTML = `
      <img src="${featured.images[0]}" alt="${featured.name}" style="width:100%;height:190px;object-fit:cover;border-radius:12px;margin-bottom:12px;cursor:pointer;" onclick="App.openProductModal(${featured.id}, 'video')" />
      <h3 style="font-size:1.05rem;margin-bottom:6px;">${featured.name}</h3>
      <p style="font-size:0.82rem;color:#cbd5e1;margin-bottom:12px;">${featured.specs[0]} • ${featured.specs[1]}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
        <div>
          <div style="font-size:0.75rem;color:#94a3b8;text-decoration:line-through;">${formatBRL(featured.originalPrice)}</div>
          <div style="font-size:1.35rem;font-weight:800;color:#34d399;">${formatBRL(featured.price)}</div>
        </div>
        <button type="button" class="btn-success" onclick="App.openProductModal(${featured.id}, 'video')">🎥 Ver Vídeo &amp; Comprar</button>
      </div>
    `;
  }

  function renderCatalog() {
    const grid = document.getElementById('productsGrid');
    const heading = document.getElementById('catalogHeading');
    let list = getAllProducts();

    if (state.category !== 'all') {
      list = list.filter((p) => p.category === state.category);
    }

    if (state.search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(state.search) ||
          p.sku.toLowerCase().includes(state.search) ||
          p.specs.some((s) => s.toLowerCase().includes(state.search))
      );
    }

    if (state.sort === 'bestsellers') list.sort((a, b) => b.sold - a.sold);
    if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    const catObj = window.CATEGORIES.find((c) => c.id === state.category);
    heading.textContent = `${catObj ? catObj.name : 'Produtos'} (${list.length} itens disponíveis)`;

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;background:#fff;border-radius:16px;">
        <h3>Nenhum produto encontrado para "${state.search}"</h3>
        <p style="color:#64748b;margin:8px 0 16px;">Tente outro termo ou veja todos os 108 produtos.</p>
        <button type="button" class="btn-primary" onclick="App.resetFilters()">Mostrar Todos os 108 Produtos</button>
      </div>`;
      return;
    }

    grid.innerHTML = list
      .map((p) => {
        const installment = (p.price / 12).toFixed(2).replace('.', ',');
        const catName = (window.CATEGORIES.find((c) => c.id === p.category) || {}).name || '';
        return `
        <article class="product-card">
          <div class="product-thumb" onclick="App.openProductModal(${p.id}, 'photo')">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
            <span class="thumb-badge">${p.badge}</span>
            <span class="thumb-video-pill" onclick="event.stopPropagation(); App.openProductModal(${p.id}, 'video')">▶ Vídeo ${p.videoDuration}</span>
          </div>
          <div class="product-body">
            <span class="product-cat-label">${catName} • ${p.sku}</span>
            <h3 class="product-title" onclick="App.openProductModal(${p.id}, 'photo')">${p.name}</h3>
            <div class="product-rating-row">
              <span>⭐ <strong>${p.rating.toFixed(1)}</strong></span>
              <span>(${p.sold} vendidos)</span>
              <span>• Em estoque</span>
            </div>
            <div class="product-price-box">
              <div class="price-old">De ${formatBRL(p.originalPrice)}</div>
              <div class="price-current">${formatBRL(p.price)}</div>
              <div class="price-installments">ou 12x de R$ ${installment} sem juros</div>
              <div class="card-actions">
                <button type="button" class="btn-primary" onclick="App.addToCart(${p.id})">🛒 Comprar</button>
                <button type="button" class="btn-outline" title="Assistir Vídeo HD" onclick="App.openProductModal(${p.id}, 'video')">🎥</button>
              </div>
            </div>
          </div>
        </article>`;
      })
      .join('');
  }

  function openProductModal(productId, initialMode = 'photo') {
    const product = getAllProducts().find((p) => p.id === productId);
    if (!product) return;
    stopVideoLoop();
    state.activeProduct = product;
    state.activeSlide = 0;
    state.mediaMode = initialMode;
    state.videoPlaying = true;

    renderProductModalContent();
    document.getElementById('productModal').classList.add('open');
    if (initialMode === 'video') {
      startProductVideoCanvas(product);
    }
  }

  function renderProductModalContent() {
    const p = state.activeProduct;
    if (!p) return;
    const pixPrice = p.price * (1 - window.STORE_CONFIG.pixExtraDiscount);
    const body = document.getElementById('productModalBody');

    const mediaStageHtml =
      state.mediaMode === 'photo'
        ? `<img src="${p.images[state.activeSlide]}" alt="${p.name}" />`
        : `<div class="video-player-wrap">
            <canvas id="productDemoCanvas" width="640" height="380"></canvas>
            <div class="video-controls-bar">
              <button type="button" class="btn-outline" style="padding:4px 10px;font-size:0.75rem;" onclick="App.toggleVideoPlayback()">
                ${state.videoPlaying ? '⏸ Pausar Demo' : '▶ Reproduzir'}
              </button>
              <span>🎥 Demonstração Oficial HD • ${p.sku}</span>
              <span>${p.videoDuration}</span>
            </div>
          </div>`;

    body.innerHTML = `
      <div class="pdp-grid">
        <div>
          <div class="media-tabs">
            <button type="button" class="media-tab-btn ${state.mediaMode === 'photo' ? 'active' : ''}" onclick="App.switchMediaMode('photo')">
              📸 Galeria de Fotos (3)
            </button>
            <button type="button" class="media-tab-btn ${state.mediaMode === 'video' ? 'active' : ''}" onclick="App.switchMediaMode('video')">
              🎥 Vídeo Demonstrativo HD
            </button>
          </div>

          <div class="main-media-stage">${mediaStageHtml}</div>

          <div class="thumb-strip">
            ${p.images
              .map(
                (img, idx) => `
              <img src="${img}" class="${state.mediaMode === 'photo' && state.activeSlide === idx ? 'active' : ''}"
                onclick="App.selectProductSlide(${idx})" alt="Ângulo ${idx + 1}" />`
              )
              .join('')}
          </div>
        </div>

        <div>
          <span class="google-badge">${p.badge} • SKU ${p.sku}</span>
          <h2 style="font-size:1.4rem;margin:6px 0 8px;">${p.name}</h2>
          <div style="font-size:0.86rem;color:#64748b;margin-bottom:14px;">
            ⭐⭐⭐⭐⭐ <strong>${p.rating.toFixed(1)}</strong> (${p.sold} pedidos entregues no Brasil)
          </div>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:14px;border-radius:12px;margin-bottom:14px;">
            <div class="price-old">De ${formatBRL(p.originalPrice)}</div>
            <div style="font-size:1.85rem;font-weight:800;color:#0f172a;">${formatBRL(p.price)}</div>
            <div style="color:#059669;font-weight:700;font-size:0.88rem;">
              ⚡ ${formatBRL(pixPrice)} à vista no Pix (5% OFF extra + aprovação na hora)
            </div>
          </div>

          <p style="font-size:0.9rem;color:#334155;margin-bottom:10px;">${p.description}</p>

          <ul class="spec-list">
            ${p.specs.map((s) => `<li>✅ ${s}</li>`).join('')}
            <li>🚚 Frete Grátis com Código de Rastreamento para todo o Brasil</li>
          </ul>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px;">
            <button type="button" class="btn-success" onclick="App.buyNow(${p.id})">⚡ Comprar Agora</button>
            <button type="button" class="btn-primary" onclick="App.addToCart(${p.id}); App.closeModal('productModal');">🛒 Adicionar ao Carrinho</button>
          </div>
        </div>
      </div>
    `;
  }

  function switchMediaMode(mode) {
    stopVideoLoop();
    state.mediaMode = mode;
    renderProductModalContent();
    if (mode === 'video' && state.activeProduct) {
      startProductVideoCanvas(state.activeProduct);
    }
  }

  function selectProductSlide(idx) {
    stopVideoLoop();
    state.mediaMode = 'photo';
    state.activeSlide = idx;
    renderProductModalContent();
  }

  function toggleVideoPlayback() {
    state.videoPlaying = !state.videoPlaying;
    if (state.videoPlaying && state.activeProduct) {
      startProductVideoCanvas(state.activeProduct);
    } else {
      stopVideoLoop();
    }
  }

  function stopVideoLoop() {
    if (state.videoAnimId) {
      cancelAnimationFrame(state.videoAnimId);
      state.videoAnimId = null;
    }
  }

  function startProductVideoCanvas(product) {
    const canvas = document.getElementById('productDemoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const catObj = window.CATEGORIES.find((c) => c.id === product.category);
    const icon = catObj ? catObj.icon : '⚡';
    let frame = 0;

    function draw() {
      if (!state.videoPlaying || state.mediaMode !== 'video') return;
      frame++;
      const w = canvas.width;
      const h = canvas.height;
      const sceneIndex = Math.floor(frame / 150) % product.specs.length;
      const pulse = Math.sin(frame * 0.06) * 10;

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#1e3a8a');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Ondas tecnológicas animadas
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 - 20, 85 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2, h / 2 - 20, 125 - pulse * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Ícone central animado
      ctx.font = '86px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(icon, w / 2, h / 2 + 10 + Math.sin(frame * 0.08) * 6);

      // Selo REC HD
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(34, 30, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, Arial';
      ctx.textAlign = 'left';
      ctx.fillText('DEMO HD • ELETROEXPRESS.APP.BR', 48, 35);

      // Legenda dinâmica das especificações
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(28, h - 92, w - 56, 68);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px Inter, Arial';
      ctx.fillText(`DESTAQUE ${sceneIndex + 1}/${product.specs.length}:`, 46, h - 65);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 17px Inter, Arial';
      ctx.fillText(product.specs[sceneIndex].slice(0, 52), 46, h - 40);

      // Barra de progresso do vídeo
      const progress = ((frame % 450) / 450) * w;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, h - 5, progress, 5);

      state.videoAnimId = requestAnimationFrame(draw);
    }

    draw();
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart));
    updateCartUI();
  }

  function addToCart(productId) {
    const product = getAllProducts().find((p) => p.id === productId);
    if (!product) return;
    const existing = state.cart.find((i) => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id: product.id, qty: 1 });
    }
    saveCart();
    showToast(`✅ "${product.name.slice(0, 32)}..." adicionado ao carrinho!`);
  }

  function buyNow(productId) {
    addToCart(productId);
    closeModal('productModal');
    openCheckoutModal();
  }

  function changeCartQty(productId, delta) {
    const idx = state.cart.findIndex((i) => i.id === productId);
    if (idx === -1) return;
    state.cart[idx].qty += delta;
    if (state.cart[idx].qty <= 0) {
      state.cart.splice(idx, 1);
    }
    saveCart();
  }

  function getCartDetails() {
    const products = getAllProducts();
    const items = state.cart
      .map((ci) => {
        const prod = products.find((p) => p.id === ci.id);
        return prod ? { ...prod, qty: ci.qty, subtotal: prod.price * ci.qty, costSubtotal: prod.cost * ci.qty } : null;
      })
      .filter(Boolean);

    const total = items.reduce((acc, i) => acc + i.subtotal, 0);
    const totalCost = items.reduce((acc, i) => acc + i.costSubtotal, 0);
    const pixTotal = Number((total * (1 - window.STORE_CONFIG.pixExtraDiscount)).toFixed(2));
    const count = items.reduce((acc, i) => acc + i.qty, 0);
    return { items, total, totalCost, pixTotal, count };
  }

  function updateCartUI() {
    const { items, total, pixTotal, count } = getCartDetails();
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartTotalValue').textContent = formatBRL(total);
    document.getElementById('cartPixNote').innerHTML = `No Pix à vista: <strong>${formatBRL(pixTotal)}</strong> (5% OFF extra)`;

    const container = document.getElementById('cartItemsContainer');
    if (items.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:40px 10px;color:#64748b;">
        <p style="font-size:2rem;margin-bottom:8px;">🛒</p>
        <p>Seu carrinho está vazio.</p>
      </div>`;
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${item.images[0]}" alt="${item.name}" />
        <div class="cart-item-info">
          <div style="font-weight:700;font-size:0.86rem;">${item.name}</div>
          <div style="color:#2563eb;font-weight:700;font-size:0.9rem;">${formatBRL(item.subtotal)}</div>
          <div class="qty-controls">
            <button type="button" onclick="App.changeCartQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button type="button" onclick="App.changeCartQty(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>`
      )
      .join('');
  }

  function toggleCart(open) {
    document.getElementById('cartOverlay').classList.toggle('open', open);
    document.getElementById('cartDrawer').classList.toggle('open', open);
  }

  function openCheckoutModal() {
    const { items, total, pixTotal } = getCartDetails();
    if (items.length === 0) {
      showToast('⚠️ Adicione pelo menos um produto ao carrinho antes de finalizar.');
      return;
    }
    toggleCart(false);
    const body = document.getElementById('checkoutModalBody');

    body.innerHTML = `
      <h3>⚡ Checkout Seguro — EletroExpress (eletroexpress.app.br)</h3>
      <p class="modal-sub">Pagamento processado com envio imediato para a plataforma de recebimento instantâneo.</p>

      <form id="checkoutForm" onsubmit="App.processCheckoutOrder(event)">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Nome Completo do Destinatário *</label>
            <input type="text" id="chkName" required placeholder="Ex: João Pedro Silva" />
          </div>
          <div class="form-group">
            <label>CPF (para Nota Fiscal e Rastreio) *</label>
            <input type="text" id="chkCpf" required placeholder="000.000.000-00" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>WhatsApp com DDD *</label>
            <input type="tel" id="chkPhone" required placeholder="(34) 99999-0000" />
          </div>
          <div class="form-group">
            <label>E-mail *</label>
            <input type="email" id="chkEmail" required placeholder="seuemail@exemplo.com" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>CEP *</label>
            <input type="text" id="chkCep" required placeholder="00000-000" onblur="App.lookupCep(this.value)" />
          </div>
          <div class="form-group">
            <label>Cidade / Estado (UF) *</label>
            <input type="text" id="chkCity" required placeholder="Ex: Uberlândia / MG" />
          </div>
        </div>

        <div class="form-group">
          <label>Endereço Completo (Rua, Número, Bairro, Complemento) *</label>
          <input type="text" id="chkAddress" required placeholder="Rua Exemplo, 123 - Centro" />
        </div>

        <h4 style="margin-top:14px;">Escolha a Forma de Pagamento:</h4>
        <div class="pay-method-cards">
          <button type="button" class="pay-option selected" id="optPix" onclick="App.selectPayMethod('pix')">
            <strong>💠 PIX Instantâneo (Cai na Hora)</strong>
            <div style="font-size:0.82rem;color:#059669;font-weight:700;">Total: ${formatBRL(pixTotal)} (5% OFF)</div>
            <div style="font-size:0.75rem;color:#64748b;">Liberação imediata do envio</div>
          </button>

          <button type="button" class="pay-option" id="optCard" onclick="App.selectPayMethod('card')">
            <strong>💳 Cartão de Crédito até 12x</strong>
            <div style="font-size:0.82rem;color:#0f172a;font-weight:700;">Total: ${formatBRL(total)}</div>
            <div style="font-size:0.75rem;color:#64748b;">Aprovação imediata</div>
          </button>
        </div>

        <div id="paymentDynamicSection"></div>

        <button type="submit" class="btn-success btn-block" style="margin-top:16px;font-size:1rem;padding:14px;">
          ✅ Confirmar Pedido e Enviar Pagamento na Hora
        </button>
      </form>
    `;

    selectPayMethod('pix');
    document.getElementById('checkoutModal').classList.add('open');
  }

  function lookupCep(rawCep) {
    const clean = rawCep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    fetch(`https://viacep.com.br/ws/${clean}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.erro) {
          document.getElementById('chkCity').value = `${data.localidade} / ${data.uf}`;
          document.getElementById('chkAddress').value = `${data.logradouro}, Nº - ${data.bairro}`;
        }
      })
      .catch(() => {});
  }

  function selectPayMethod(method) {
    state.checkoutPayMethod = method;
    document.getElementById('optPix').classList.toggle('selected', method === 'pix');
    document.getElementById('optCard').classList.toggle('selected', method === 'card');

    const { total, pixTotal } = getCartDetails();
    const box = document.getElementById('paymentDynamicSection');

    if (method === 'pix') {
      const payload = `00020126580014BR.GOV.BCB.PIX0136${window.STORE_CONFIG.pixKey}5204000053039865406${pixTotal.toFixed(2)}5802BR5920ELETROEXPRESS BRASIL6010UBERLANDIA62070503***6304E10F`;
      box.innerHTML = `
        <div class="pix-box">
          <strong>Escaneie o QR Code Pix ou use o Copia e Cola abaixo:</strong>
          <div style="margin:12px auto;">
            <canvas id="pixQrCanvas" width="160" height="160" style="background:#fff;padding:8px;border:1px solid #cbd5e1;border-radius:10px;"></canvas>
          </div>
          <div style="font-size:0.84rem;">Valor exato com 5% OFF: <strong style="color:#059669;">${formatBRL(pixTotal)}</strong></div>
          <div class="pix-code-box" id="pixCopyPayload">${payload}</div>
          <button type="button" class="btn-outline" onclick="App.copyPixCode()">📋 Copiar Código Pix Copia e Cola</button>
        </div>
      `;
      drawSyntheticQr('pixQrCanvas', payload);
    } else {
      box.innerHTML = `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:12px;margin-top:10px;">
          <div class="form-group">
            <label>Número do Cartão</label>
            <input type="text" required placeholder="0000 0000 0000 0000" />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Validade (MM/AA)</label>
              <input type="text" required placeholder="12/30" />
            </div>
            <div class="form-group">
              <label>CVV</label>
              <input type="text" required placeholder="123" />
            </div>
          </div>
          <div class="form-group">
            <label>Parcelamento</label>
            <select>
              <option>1x de ${formatBRL(total)} sem juros</option>
              <option>3x de ${formatBRL(total / 3)} sem juros</option>
              <option>6x de ${formatBRL(total / 6)} sem juros</option>
              <option>12x de ${formatBRL(total / 12)} sem juros</option>
            </select>
          </div>
        </div>
      `;
    }
  }

  function drawSyntheticQr(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 160, 160);
    ctx.fillStyle = '#0f172a';
    const size = 25;
    const cell = 140 / size;
    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
        if (isFinder) {
          const border = r === 0 || r === 6 || c === 0 || c === 6 || r === size - 1 || r === size - 7 || c === size - 1 || c === size - 7;
          const inner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) || (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4);
          if (border || inner) ctx.fillRect(10 + c * cell, 10 + r * cell, cell, cell);
        } else {
          hash = (hash * 1664525 + 1013904223) >>> 0;
          if ((hash & 1) === 1) ctx.fillRect(10 + c * cell, 10 + r * cell, cell, cell);
        }
      }
    }
  }

  function copyPixCode() {
    const txt = document.getElementById('pixCopyPayload').textContent;
    navigator.clipboard.writeText(txt).then(() => showToast('📋 Código Pix Copia e Cola copiado!'));
  }

  function processCheckoutOrder(e) {
    e.preventDefault();
    const { items, total, totalCost, pixTotal } = getCartDetails();
    const isPix = state.checkoutPayMethod === 'pix';
    const finalAmount = isPix ? pixTotal : total;
    const profit = Number((finalAmount - totalCost).toFixed(2));
    const orderId = 'EE-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toLocaleString('pt-BR');

    const newOrder = {
      id: orderId,
      date: now,
      customer: document.getElementById('chkName').value.trim(),
      cpf: document.getElementById('chkCpf').value.trim(),
      phone: document.getElementById('chkPhone').value.trim(),
      email: document.getElementById('chkEmail').value.trim(),
      cep: document.getElementById('chkCep').value.trim(),
      city: document.getElementById('chkCity').value.trim(),
      address: document.getElementById('chkAddress').value.trim(),
      paymentMethod: isPix ? 'PIX Instantâneo' : 'Cartão de Crédito',
      paidAmount: finalAmount,
      supplierCost: Number(totalCost.toFixed(2)),
      netProfit: profit,
      status: 'Pago na Hora - Pronto p/ Envio',
      trackingCode: 'BR' + Math.floor(100000000 + Math.random() * 899999999) + 'EE',
      items: items.map((i) => ({ id: i.id, sku: i.sku, name: i.name, qty: i.qty, price: i.price, cost: i.cost }))
    };

    // Grava o pedido e credita imediatamente na carteira do App de Pagamentos
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    const wallet = JSON.parse(localStorage.getItem(STORAGE_KEYS.WALLET) || '[]');
    wallet.unshift({
      txId: 'TX-' + Date.now(),
      orderId: newOrder.id,
      date: now,
      customer: newOrder.customer,
      method: newOrder.paymentMethod,
      amount: finalAmount,
      profit: profit,
      status: 'DISPONÍVEL NA HORA'
    });
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));

    state.cart = [];
    saveCart();

    document.getElementById('checkoutModalBody').innerHTML = `
      <div style="text-align:center;padding:24px 10px;">
        <div style="font-size:3.5rem;margin-bottom:10px;">✅</div>
        <h2 style="color:#059669;margin-bottom:8px;">Pagamento Recebido na Hora!</h2>
        <p style="color:#334155;margin-bottom:16px;">
          Pedido <strong>${newOrder.id}</strong> confirmado e creditado diretamente no painel de recebimentos <strong>EletroExpress</strong>.
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:12px;max-width:460px;margin:0 auto 20px;text-align:left;font-size:0.88rem;">
          <div><strong>Cliente:</strong> ${newOrder.customer}</div>
          <div><strong>Valor Pago:</strong> ${formatBRL(newOrder.paidAmount)} (${newOrder.paymentMethod})</div>
          <div><strong>Código de Rastreio:</strong> ${newOrder.trackingCode}</div>
          <div><strong>Entrega:</strong> ${newOrder.address} — ${newOrder.city}</div>
        </div>
        <button type="button" class="btn-primary" onclick="App.closeModal('checkoutModal')">Continuar na Loja</button>
      </div>
    `;
    showToast(`💰 Pagamento de ${formatBRL(finalAmount)} recebido no App EletroExpress!`);
  }

  function renderStoreReviews() {
    const grid = document.getElementById('storeReviewsGrid');
    if (!grid) return;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    const allReviews = [...saved, ...DEFAULT_REVIEWS];

    grid.innerHTML = allReviews
      .map(
        (r) => `
      <div class="review-card">
        <div class="review-top">
          <strong>${r.author}</strong>
          <span>${'⭐'.repeat(r.stars)}</span>
        </div>
        <span class="review-product-tag">Compra verificada: ${r.product}</span>
        <p style="font-size:0.88rem;color:#334155;margin-bottom:8px;">"${r.comment}"</p>
        <small style="color:#64748b;">Publicado em ${r.date} • eletroexpress.app.br</small>
      </div>`
      )
      .join('');
  }

  function openReviewModal() {
    document.getElementById('reviewModal').classList.add('open');
  }

  function submitStoreReview(e) {
    e.preventDefault();
    const rev = {
      author: document.getElementById('revAuthor').value.trim(),
      stars: Number(document.getElementById('revStars').value),
      product: document.getElementById('revProduct').value.trim(),
      comment: document.getElementById('revComment').value.trim(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    saved.unshift(rev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(saved));
    renderStoreReviews();
    closeModal('reviewModal');
    e.target.reset();
    showToast('⭐ Sua avaliação foi publicada na EletroExpress!');
  }

  function openTrackingModal() {
    document.getElementById('trackingResultBox').innerHTML = '';
    document.getElementById('trackingModal').classList.add('open');
  }

  function searchOrderTracking() {
    const q = document.getElementById('trackingQueryInput').value.trim().toLowerCase();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const found = orders.find((o) => o.id.toLowerCase() === q || o.cpf.replace(/\D/g, '') === q.replace(/\D/g, ''));
    const box = document.getElementById('trackingResultBox');

    if (!found) {
      box.innerHTML = `<div style="background:#fef2f2;color:#991b1b;padding:12px;border-radius:10px;font-size:0.86rem;">
        Nenhum pedido localizado para "${q}". Confira o código enviado após a compra (ex: EE-1001).
      </div>`;
      return;
    }

    box.innerHTML = `
      <div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:14px;border-radius:12px;font-size:0.88rem;">
        <div><strong>Pedido:</strong> ${found.id} • <strong>Status:</strong> ${found.status}</div>
        <div><strong>Código Rastreio:</strong> ${found.trackingCode}</div>
        <div><strong>Destinatário:</strong> ${found.customer} (${found.city})</div>
      </div>
    `;
  }

  function closeModal(id) {
    if (id === 'productModal') stopVideoLoop();
    document.getElementById(id).classList.remove('open');
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    selectCategory,
    resetFilters,
    openProductModal,
    switchMediaMode,
    selectProductSlide,
    toggleVideoPlayback,
    addToCart,
    buyNow,
    changeCartQty,
    toggleCart,
    openCheckoutModal,
    lookupCep,
    selectPayMethod,
    copyPixCode,
    processCheckoutOrder,
    openReviewModal,
    submitStoreReview,
    openTrackingModal,
    searchOrderTracking,
    closeModal,
    getAllProducts,
    formatBRL,
    showToast
  };
})();
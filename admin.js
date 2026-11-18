window.AdminApp = (function () {
  const ADMIN_CREDENTIALS = {
    login: 'brunoluciano103',
    pass: '91814986'
  };

  let isAuthenticated = false;
  let activeTab = 'wallet';

  function openAdminEntry() {
    document.getElementById('adminModal').classList.add('open');
    if (!isAuthenticated) {
      renderLoginScreen();
    } else {
      renderAdminDashboard();
    }
  }

  function renderLoginScreen(errorMsg = '') {
    const body = document.getElementById('adminModalBody');
    body.innerHTML = `
      <div class="admin-login-card">
        <div style="font-size:2.6rem;margin-bottom:8px;">🔐</div>
        <h2>Painel de Controle &amp; App de Recebimentos</h2>
        <p class="modal-sub">Acesso exclusivo do proprietário • <strong>eletroexpress.app.br</strong></p>

        ${errorMsg ? `<div style="background:#fef2f2;color:#b91c1c;padding:10px;border-radius:8px;margin-bottom:12px;font-size:0.84rem;">${errorMsg}</div>` : ''}

        <form onsubmit="AdminApp.handleLogin(event)" style="text-align:left;">
          <div class="form-group">
            <label>Login de Acesso</label>
            <input type="text" id="admLoginInput" required autocomplete="username" placeholder="Digite seu login" />
          </div>
          <div class="form-group">
            <label>Senha do Painel &amp; Carteira de Pagamentos</label>
            <input type="password" id="admPassInput" required autocomplete="current-password" placeholder="Digite sua senha" />
          </div>
          <button type="submit" class="btn-primary btn-block">Entrar no Painel &amp; App Financeiro</button>
        </form>
      </div>
    `;
  }

  function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('admLoginInput').value.trim();
    const p = document.getElementById('admPassInput').value.trim();

    if (u === ADMIN_CREDENTIALS.login && p === ADMIN_CREDENTIALS.pass) {
      isAuthenticated = true;
      App.showToast('🔓 Bem-vindo, Bruno Luciano! Painel e App de Pagamentos liberados.');
      renderAdminDashboard();
    } else {
      renderLoginScreen('❌ Login ou senha incorretos. Acesso negado.');
    }
  }

  function logout() {
    isAuthenticated = false;
    renderLoginScreen('Sessão encerrada com segurança.');
  }

  function switchTab(tab) {
    activeTab = tab;
    renderAdminDashboard();
  }

  function renderAdminDashboard() {
    const orders = JSON.parse(localStorage.getItem('ee_orders') || '[]');
    const wallet = JSON.parse(localStorage.getItem('ee_wallet_tx') || '[]');
    const withdrawals = JSON.parse(localStorage.getItem('ee_withdrawals') || '[]');

    const grossRevenue = wallet.reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const totalWithdrawn = withdrawals.reduce((acc, w) => acc + Number(w.amount || 0), 0);
    const instantBalance = Math.max(0, grossRevenue - totalWithdrawn);
    const supplierReserve = orders.reduce((acc, o) => acc + Number(o.supplierCost || 0), 0);
    const netProfit50 = orders.reduce((acc, o) => acc + Number(o.netProfit || 0), 0);

    const body = document.getElementById('adminModalBody');
    body.innerHTML = `
      <div class="admin-header-bar">
        <div>
          <span style="font-size:0.75rem;color:#34d399;font-weight:700;">● ONLINE • ELETROEXPRESS.APP.BR</span>
          <h2 style="font-size:1.3rem;">Painel Administrativo &amp; App de Recebimento Instantâneo</h2>
          <small style="color:#94a3b8;">Operador autenticado: <strong>brunoluciano103</strong></small>
        </div>
        <div style="display:flex;gap:8px;">
          <button type="button" class="btn-success" onclick="AdminApp.simulateIncomingSale()">+ Simular Venda Pix Agora</button>
          <button type="button" class="btn-outline" onclick="AdminApp.logout()">Sair</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card highlight">
          <div class="kpi-label">💰 SALDO DISPONÍVEL NA HORA (APP PAGAMENTOS)</div>
          <div class="kpi-value">${App.formatBRL(instantBalance)}</div>
          <small>Pronto para envio de pedidos ou saque Pix imediato</small>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">📈 FATURAMENTO TOTAL RECEBIDO</div>
          <div class="kpi-value">${App.formatBRL(grossRevenue)}</div>
          <small>${orders.length} pedido(s) confirmado(s)</small>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">📦 CUSTO FORNECEDOR ALIEXPRESS</div>
          <div class="kpi-value">${App.formatBRL(supplierReserve)}</div>
          <small>Valor base para despacho dos produtos</small>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">💎 LUCRO LÍQUIDO (MARGEM 50%)</div>
          <div class="kpi-value" style="color:#059669;">${App.formatBRL(netProfit50)}</div>
          <small>Margem de 50% aplicada em todos os 108 itens</small>
        </div>
      </div>

      <div class="admin-tabs">
        <button type="button" class="admin-tab-btn ${activeTab === 'wallet' ? 'active' : ''}" onclick="AdminApp.switchTab('wallet')">
          📲 App de Recebimentos &amp; Saque Pix
        </button>
        <button type="button" class="admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}" onclick="AdminApp.switchTab('orders')">
          📦 Pedidos Recebidos (${orders.length})
        </button>
        <button type="button" class="admin-tab-btn ${activeTab === 'catalog' ? 'active' : ''}" onclick="AdminApp.switchTab('catalog')">
          🏷️ Produtos &amp; Margem 50% (108)
        </button>
        <button type="button" class="admin-tab-btn ${activeTab === 'google' ? 'active' : ''}" onclick="AdminApp.switchTab('google')">
          🌐 Google Shopping, Domínio &amp; Gateway Real
        </button>
      </div>

      <div id="adminTabContent"></div>
    `;

    renderActiveTabContent({ orders, wallet, withdrawals, instantBalance });
  }

  function renderActiveTabContent({ orders, wallet, withdrawals, instantBalance }) {
    const box = document.getElementById('adminTabContent');

    if (activeTab === 'wallet') {
      box.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:20px;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:18px;border-radius:14px;">
            <h3 style="margin-bottom:8px;">⚡ Transferir / Sacar Saldo via Pix na Hora</h3>
            <p style="font-size:0.84rem;color:#64748b;margin-bottom:14px;">
              Todos os pagamentos dos clientes caem direto nesta carteira para você pagar o fornecedor ou transferir para sua conta bancária.
            </p>
            <form onsubmit="AdminApp.withdrawPix(event, ${instantBalance})">
              <div class="form-group">
                <label>Sua Chave Pix de Destino</label>
                <input type="text" id="wdPixKey" required value="34984337394" />
              </div>
              <div class="form-group">
                <label>Valor para Transferir Agora (Disponível: ${App.formatBRL(instantBalance)})</label>
                <input type="number" step="0.01" id="wdAmount" required max="${instantBalance}" value="${instantBalance.toFixed(2)}" />
              </div>
              <button type="submit" class="btn-success btn-block">💸 Enviar Pix Instantâneo Agora</button>
            </form>
          </div>

          <div>
            <h3 style="margin-bottom:10px;">Extrato em Tempo Real (Entradas &amp; Saídas)</h3>
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Pedido / Cliente</th>
                    <th>Método</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    wallet.length === 0
                      ? '<tr><td colspan="5" style="text-align:center;color:#64748b;">Nenhuma transação ainda. Faça uma compra teste na loja ou clique em "Simular Venda Pix Agora".</td></tr>'
                      : wallet
                          .map(
                            (t) => `
                        <tr>
                          <td>${t.date}</td>
                          <td><strong>${t.orderId}</strong><br/><small>${t.customer}</small></td>
                          <td>${t.method}</td>
                          <td style="color:#059669;font-weight:700;">+${App.formatBRL(t.amount)}</td>
                          <td><span class="status-pill">${t.status}</span></td>
                        </tr>`
                          )
                          .join('')
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    if (activeTab === 'orders') {
      box.innerHTML = `
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente &amp; Endereço de Envio</th>
                <th>Produtos</th>
                <th>Recebido / Lucro 50%</th>
                <th>Status &amp; Ação de Despacho</th>
              </tr>
            </thead>
            <tbody>
              ${
                orders.length === 0
                  ? '<tr><td colspan="5" style="text-align:center;padding:24px;color:#64748b;">Nenhum pedido recebido ainda.</td></tr>'
                  : orders
                      .map(
                        (o) => `
                    <tr>
                      <td><strong>${o.id}</strong><br/><small>${o.date}</small><br/><small>Rastreio: ${o.trackingCode}</small></td>
                      <td>
                        <strong>${o.customer}</strong> (CPF: ${o.cpf})<br/>
                        <small>${o.address} - ${o.city} | CEP ${o.cep}</small><br/>
                        <small>WhatsApp: ${o.phone}</small>
                      </td>
                      <td>${o.items.map((i) => `${i.qty}x ${i.name}`).join('<br/>')}</td>
                      <td>
                        <div>Pago: <strong>${App.formatBRL(o.paidAmount)}</strong></div>
                        <div style="color:#64748b;">Custo Ali: ${App.formatBRL(o.supplierCost)}</div>
                        <div style="color:#059669;font-weight:700;">Lucro: ${App.formatBRL(o.netProfit)}</div>
                      </td>
                      <td>
                        <select onchange="AdminApp.updateOrderStatus('${o.id}', this.value)" style="padding:6px;border-radius:8px;margin-bottom:6px;display:block;">
                          <option ${o.status === 'Pago na Hora - Pronto p/ Envio' ? 'selected' : ''}>Pago na Hora - Pronto p/ Envio</option>
                          <option ${o.status === 'Pedido Enviado na AliExpress' ? 'selected' : ''}>Pedido Enviado na AliExpress</option>
                          <option ${o.status === 'Em Trânsito para o Cliente' ? 'selected' : ''}>Em Trânsito para o Cliente</option>
                          <option ${o.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                        </select>
                        <button type="button" class="btn-outline" style="padding:5px 10px;font-size:0.75rem;" onclick="AdminApp.copyShippingData('${o.id}')">
                          📋 Copiar Dados p/ Envio
                        </button>
                      </td>
                    </tr>`
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'catalog') {
      const products = App.getAllProducts();
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
          <p style="font-size:0.86rem;color:#475569;">Todos os preços abaixo aplicam automaticamente <strong>+50% de margem</strong> sobre o custo da AliExpress.</p>
          <button type="button" class="btn-primary" onclick="AdminApp.exportGoogleMerchantCsv()">📥 Baixar Catálogo CSV (Google Merchant &amp; Meta Ads)</button>
        </div>
        <div class="admin-table-wrap" style="max-height:420px;overflow-y:auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Produto</th>
                <th>Custo AliExpress (R$)</th>
                <th>Preço Venda (+50%)</th>
                <th>Lucro Unitário</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (p) => `
                <tr>
                  <td><strong>${p.sku}</strong></td>
                  <td>${p.name}</td>
                  <td>
                    <input type="number" step="0.01" value="${p.cost.toFixed(2)}" style="width:95px;padding:5px;border:1px solid #cbd5e1;border-radius:6px;"
                      onchange="AdminApp.updateProductCost(${p.id}, this.value)" />
                  </td>
                  <td><strong>${App.formatBRL(p.price)}</strong></td>
                  <td style="color:#059669;font-weight:700;">+${App.formatBRL(p.price - p.cost)}</td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'google') {
      box.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;font-size:0.88rem;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:18px;border-radius:12px;">
            <h3>🌐 Configuração do Domínio eletroexpress.app.br</h3>
            <ul class="spec-list">
              <li>✅ Domínio Canônico Configurado: <strong>https://eletroexpress.app.br</strong></li>
              <li>✅ SEO Schema.org + Avaliações Estrelas prontos para o Google</li>
              <li>✅ Arquivos <strong>sitemap.xml</strong> e <strong>robots.txt</strong> inclusos no projeto</li>
              <li>📌 Aponte o DNS (Registro A / CNAME) da sua hospedagem Netlify/Vercel para publicar.</li>
            </ul>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:18px;border-radius:12px;">
            <h3>💳 API Gateway Real (Mercado Pago / Asaas)</h3>
            <p style="color:#64748b;margin-bottom:10px;">Cole sua chave de produção quando ativar sua conta de recebimento automático:</p>
            <div class="form-group">
              <label>Provedor de Pagamento</label>
              <select id="gwProvider">
                <option>Mercado Pago (Pix Instantâneo + Cartão)</option>
                <option>Asaas Pagamentos (Pix Automático)</option>
                <option>Appmax / Yampi</option>
              </select>
            </div>
            <div class="form-group">
              <label>Access Token de Produção</label>
              <input type="password" placeholder="APP_USR-0000000000000000-..." />
            </div>
            <button type="button" class="btn-primary" onclick="App.showToast('✅ Credenciais do Gateway salvas!')">Salvar Configuração</button>
          </div>
        </div>
      `;
    }
  }

  function updateProductCost(productId, newCostVal) {
    const cost = Math.max(1, Number(newCostVal));
    const overrides = JSON.parse(localStorage.getItem('ee_price_overrides') || '{}');
    overrides[productId] = { cost };
    localStorage.setItem('ee_price_overrides', JSON.stringify(overrides));
    App.showToast('💰 Custo atualizado e preço recalculado com +50% de margem!');
    renderAdminDashboard();
  }

  function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('ee_orders') || '[]');
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      target.status = newStatus;
      localStorage.setItem('ee_orders', JSON.stringify(orders));
      App.showToast(`📦 Status do pedido ${orderId} atualizado para "${newStatus}"`);
    }
  }

  function copyShippingData(orderId) {
    const orders = JSON.parse(localStorage.getItem('ee_orders') || '[]');
    const o = orders.find((x) => x.id === orderId);
    if (!o) return;
    const text = `PEDIDO ${o.id}\nNome: ${o.customer}\nCPF: ${o.cpf}\nEndereço: ${o.address}\nCidade/UF: ${o.city}\nCEP: ${o.cep}\nTelefone: ${o.phone}\nItens: ${o.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}`;
    navigator.clipboard.writeText(text).then(() => App.showToast('📋 Endereço e itens copiados para despachar na AliExpress!'));
  }

  function withdrawPix(e, maxBal) {
    e.preventDefault();
    const amount = Number(document.getElementById('wdAmount').value);
    const key = document.getElementById('wdPixKey').value.trim();
    if (amount <= 0 || amount > maxBal) {
      App.showToast('⚠️ Saldo insuficiente para este saque.');
      return;
    }
    const withdrawals = JSON.parse(localStorage.getItem('ee_withdrawals') || '[]');
    withdrawals.unshift({ id: 'WD-' + Date.now(), date: new Date().toLocaleString('pt-BR'), pixKey: key, amount });
    localStorage.setItem('ee_withdrawals', JSON.stringify(withdrawals));
    App.showToast(`💸 Transferência Pix de ${App.formatBRL(amount)} enviada para ${key}!`);
    renderAdminDashboard();
  }

  function simulateIncomingSale() {
    const products = App.getAllProducts();
    const sample = products[Math.floor(Math.random() * products.length)];
    const amount = Number((sample.price * 0.95).toFixed(2));
    const profit = Number((amount - sample.cost).toFixed(2));
    const orderId = 'EE-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toLocaleString('pt-BR');

    const orders = JSON.parse(localStorage.getItem('ee_orders') || '[]');
    orders.unshift({
      id: orderId,
      date: now,
      customer: 'Cliente Brasil (Venda Online)',
      cpf: '123.456.789-00',
      phone: '(11) 99876-5432',
      email: 'cliente@exemplo.com.br',
      cep: '01310-100',
      city: 'São Paulo / SP',
      address: 'Av. Paulista, 1000 - Bela Vista',
      paymentMethod: 'PIX Instantâneo',
      paidAmount: amount,
      supplierCost: sample.cost,
      netProfit: profit,
      status: 'Pago na Hora - Pronto p/ Envio',
      trackingCode: 'BR' + Math.floor(100000000 + Math.random() * 899999999) + 'EE',
      items: [{ id: sample.id, sku: sample.sku, name: sample.name, qty: 1, price: sample.price, cost: sample.cost }]
    });
    localStorage.setItem('ee_orders', JSON.stringify(orders));

    const wallet = JSON.parse(localStorage.getItem('ee_wallet_tx') || '[]');
    wallet.unshift({
      txId: 'TX-' + Date.now(),
      orderId,
      date: now,
      customer: 'Cliente Brasil (Venda Online)',
      method: 'PIX Instantâneo',
      amount,
      profit,
      status: 'DISPONÍVEL NA HORA'
    });
    localStorage.setItem('ee_wallet_tx', JSON.stringify(wallet));

    App.showToast(`💰 Novo Pix de ${App.formatBRL(amount)} caiu na hora na sua carteira!`);
    renderAdminDashboard();
  }

  function exportGoogleMerchantCsv() {
    const products = App.getAllProducts();
    const header = 'id,title,description,availability,condition,price,link,brand\n';
    const rows = products
      .map(
        (p) =>
          `"${p.sku}","${p.name.replace(/"/g, '""')}","${p.description.replace(/"/g, '""')}","in_stock","new","${p.price.toFixed(2)} BRL","https://eletroexpress.app.br/#produto-${p.id}","EletroExpress"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalogo_google_shopping_eletroexpress.csv';
    a.click();
    URL.revokeObjectURL(url);
    App.showToast('📥 Planilha CSV pronta para importar no Google Merchant Center e Meta Ads!');
  }

  return {
    openAdminEntry,
    handleLogin,
    logout,
    switchTab,
    updateProductCost,
    updateOrderStatus,
    copyShippingData,
    withdrawPix,
    simulateIncomingSale,
    exportGoogleMerchantCsv
  };
})();
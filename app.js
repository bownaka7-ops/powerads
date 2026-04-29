const products = [
  { id: 1, name: "AI Campaign Booster", description: "แพ็กเกจสร้างโฆษณาฉลาด ช่วยกำหนดข้อความและภาพเพื่อเพิ่ม conversion", price: 14900, tag: "Starter" },
  { id: 2, name: "Ad Automation Kit", description: "จัดการยิงแอดได้ข้ามแพลตฟอร์ม พร้อมตารางสรุปผลและ optimization อัตโนมัติ", price: 27900, tag: "Professional" },
  { id: 3, name: "Managed Ads Concierge", description: "ทีมช่วยตั้งค่าแคมเปญและเชื่อม API กับแพลตฟอร์มโฆษณาให้ครบทุกช่องทาง", price: 49900, tag: "Enterprise" }
];

const state = {
  cart: JSON.parse(localStorage.getItem('poweradsCart') || '[]'),
  integration: {
    endpoint: 'https://example.com/api/send-ad',
    apiKey: '',
    platform: 'facebook',
    adMessage: 'เพิ่มยอดขายสินค้าใหม่ของคุณด้วย AI Campaign Boost',
    budget: 1500
  }
};

const formatCurrency = (value) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);

const productsContainer = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const endpointInput = document.getElementById('api-endpoint');
const apiKeyInput = document.getElementById('api-key');
const platformSelect = document.getElementById('ad-platform');
const messageTextarea = document.getElementById('ad-message');
const budgetInput = document.getElementById('ad-budget');
const sendButton = document.getElementById('send-ad');
const responseStatus = document.getElementById('response-status');
const saveConfigButton = document.getElementById('save-config');
const clearCartButton = document.getElementById('clear-cart');

function persistCart() {
  localStorage.setItem('poweradsCart', JSON.stringify(state.cart));
}

function renderProducts() {
  productsContainer.innerHTML = products.map(product => `
    <article class="card product-card">
      <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80" alt="${product.name}" />
      <div>
        <h4>${product.name}</h4>
        <div class="product-meta"><span>${product.tag}</span><strong>${formatCurrency(product.price)}</strong></div>
        <p>${product.description}</p>
        <button type="button" onclick="addToCart(${product.id})">เพิ่มไปยังตะกร้า</button>
      </div>
    </article>
  `).join('');
}

function addToCart(id) {
  const existing = state.cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    const product = products.find(item => item.id === id);
    state.cart.push({ ...product, quantity: 1 });
  }
  persistCart();
  renderCart();
}

function updateQuantity(id, delta) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  state.cart = state.cart.filter(entry => entry.quantity > 0);
  persistCart();
  renderCart();
}

function removeCartItem(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  persistCart();
  renderCart();
}

function renderCart() {
  const items = state.cart;
  let total = 0;
  cartItemsContainer.innerHTML = items.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>${formatCurrency(item.price)} x ${item.quantity}</p>
        </div>
        <div class="qty-control">
          <button onclick="updateQuantity(${item.id}, -1)">–</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button onclick="removeCartItem(${item.id})">ลบ</button>
      </div>
    `;
  }).join('');
  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = items.length.toString();
  if (items.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color:#94a3b8;">ตะกร้าว่างอยู่ เติมแพ็กเกจและเริ่มต้นสร้างแคมเปญได้เลย</p>`;
  }
}

function loadIntegrationConfig() {
  const saved = JSON.parse(localStorage.getItem('poweradsIntegration') || 'null');
  if (saved) {
    state.integration = { ...state.integration, ...saved };
  }
  endpointInput.value = state.integration.endpoint;
  apiKeyInput.value = state.integration.apiKey;
  platformSelect.value = state.integration.platform;
  messageTextarea.value = state.integration.adMessage;
  budgetInput.value = state.integration.budget;
}

function saveIntegrationConfig() {
  state.integration.endpoint = endpointInput.value.trim();
  state.integration.apiKey = apiKeyInput.value.trim();
  state.integration.platform = platformSelect.value;
  state.integration.adMessage = messageTextarea.value.trim();
  state.integration.budget = Number(budgetInput.value) || 0;
  localStorage.setItem('poweradsIntegration', JSON.stringify(state.integration));
  showStatus('บันทึกการเชื่อมต่อ API สำเร็จ', 'success');
}

async function sendAdRequest() {
  saveIntegrationConfig();
  if (!state.integration.endpoint) {
    showStatus('กรุณาใส่ API endpoint ก่อนส่งคำขอ', 'error');
    return;
  }
  const payload = {
    platform: state.integration.platform,
    apiKey: state.integration.apiKey,
    message: state.integration.adMessage,
    budget: state.integration.budget,
    cart: state.cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
    timestamp: new Date().toISOString()
  };
  try {
    responseStatus.textContent = 'กำลังส่งคำขอไปยัง API...';
    const response = await fetch(state.integration.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(state.integration.apiKey ? { 'x-api-key': state.integration.apiKey } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await response.text();
    showStatus(`ตอบกลับจาก API: ${response.status} ${response.statusText}\n${data}`, response.ok ? 'success' : 'error');
  } catch (error) {
    showStatus(`ไม่สามารถเชื่อมต่อ API ได้: ${error.message}`, 'error');
  }
}

function showStatus(message, type) {
  responseStatus.textContent = message;
  responseStatus.style.color = type === 'success' ? '#a3e635' : '#f87171';
}

clearCartButton?.addEventListener('click', () => {
  state.cart = [];
  persistCart();
  renderCart();
});
saveConfigButton?.addEventListener('click', saveIntegrationConfig);
sendButton?.addEventListener('click', sendAdRequest);

window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeCartItem = removeCartItem;

renderProducts();
loadIntegrationConfig();
renderCart();

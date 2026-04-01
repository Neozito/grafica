const WHATSAPP_NUMBER = "5511999999999";
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "123456";
const CUSTOM_PRODUCTS_KEY = 'grafica_custom_products';

const BASE_PRODUCTS = [
  {
    id:"cartao-visita",
    slug:"produto-cartao-visita.html",
    nome:"Cartão de Visita",
    categoria:"Cartões",
    imagem:"assets/images/produtos/cartao-visita-real.jpg",
    descricao:"Cause uma ótima primeira impressão.",
    preco:45.90,
    configuracoes:{
      papel:["Couché 300g (fosco)","Couché 300g (brilho)","Supremo 300g"],
      quantidade:["250 un.","500 un.","1.000 un.","2.500 un."],
      cores:["4x0","4x4"],
      prazo:["Padrão","Express"]
    }
  },
  {
    id:"panfleto",
    slug:"produto-panfleto.html",
    nome:"Panfletos",
    categoria:"Panfletos",
    imagem:"assets/images/produtos/panfleto-real.jpg",
    descricao:"Divulgue sua marca com eficiência.",
    preco:89.90,
    configuracoes:{
      papel:["Couché 115g","Couché 150g","Offset 90g"],
      quantidade:["500 un.","1.000 un.","2.500 un.","5.000 un."],
      tamanho:["A6","A5","A4"],
      prazo:["Padrão","Express"]
    }
  },
  {
    id:"adesivo",
    slug:"produto-adesivo.html",
    nome:"Adesivos",
    categoria:"Adesivos",
    imagem:"assets/images/produtos/adesivo-real.jpg",
    descricao:"Personalize kits e embalagens.",
    preco:69.90,
    configuracoes:{
      material:["Vinil branco","Vinil transparente","Papel adesivo"],
      quantidade:["100 un.","250 un.","500 un.","1.000 un."],
      corte:["Redondo","Quadrado","Recortado"],
      prazo:["Padrão","Express"]
    }
  },
  {
    id:"caderno",
    slug:"produto-caderno.html",
    nome:"Cadernetas",
    categoria:"Cadernetas",
    imagem:"assets/images/produtos/caderno-real.jpg",
    descricao:"Brindes para eventos e empresas.",
    preco:49.90,
    configuracoes:{
      miolo:["Sem pauta","Pautado","Pontilhado"],
      quantidade:["10 un.","25 un.","50 un.","100 un."],
      tamanho:["A6","A5"],
      cores:["Azul","Preto","Personalizado"],
      prazo:["Padrão","Express"]
    }
  },
  {
    id:"bloco",
    slug:"produto-bloco.html",
    nome:"Blocos",
    categoria:"Blocos",
    imagem:"assets/images/produtos/bloco-real.jpg",
    descricao:"Talonários e blocos personalizados.",
    preco:59.90,
    configuracoes:{
      vias:["1 via","2 vias","3 vias"],
      quantidade:["10 un.","25 un.","50 un.","100 un."],
      tamanho:["A6","A5","A4"],
      prazo:["Padrão","Express"]
    }
  },
  {
    id:"etiquetas",
    slug:"produto-etiquetas.html",
    nome:"Etiquetas",
    categoria:"Etiquetas",
    imagem:"assets/images/produtos/etiquetas-real.jpg",
    descricao:"Etiquetas em rolo e folhas.",
    preco:39.90,
    configuracoes:{
      material:["Bopp branco","Bopp transparente","Papel couche"],
      quantidade:["100 un.","250 un.","500 un.","1.000 un."],
      formato:["Redonda","Quadrada","Retangular"],
      prazo:["Padrão","Express"]
    }
  }
];

function brl(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function getCart(){ try{return JSON.parse(localStorage.getItem('grafica_cart')||'[]')}catch(e){return[]} }
function saveCart(cart){ localStorage.setItem('grafica_cart', JSON.stringify(cart)); updateCartBubble(); }
function addToCart(item){ const cart = getCart(); cart.push(item); saveCart(cart); }
function removeFromCart(index){ const cart = getCart(); cart.splice(index,1); saveCart(cart); }
function cartCount(){ return getCart().length; }
function cartTotal(){ return getCart().reduce((a,b)=>a + Number(b.total||0), 0); }
function updateCartBubble(){
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent = cartCount());
  document.querySelectorAll('[data-cart-total]').forEach(el=>el.textContent = brl(cartTotal()));
}

function slugify(text){
  return String(text||'produto').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function getCustomProducts(){
  try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]'); }
  catch(e){ return []; }
}
function saveCustomProducts(items){ localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(items)); }
function normalizeProduct(product){
  const normalized = {...product};
  normalized.preco = Number(product.preco || 0);
  normalized.configuracoes = normalized.configuracoes || {};
  normalized.slug = normalized.slug || `produto.html?id=${encodeURIComponent(normalized.id)}`;
  return normalized;
}
function getProducts(){ return [...BASE_PRODUCTS, ...getCustomProducts()].map(normalizeProduct); }
function productById(id){ return getProducts().find(p=>p.id===id); }
function productLink(product){ return BASE_PRODUCTS.some(p=>p.id===product.id) ? product.slug : `produto.html?id=${encodeURIComponent(product.id)}`; }
function addCustomProduct(product){
  const list = getCustomProducts();
  list.push(normalizeProduct(product));
  saveCustomProducts(list);
}
function deleteCustomProduct(productId){
  const list = getCustomProducts().filter(p=>p.id!==productId);
  saveCustomProducts(list);
}

function createHeader(){
  return `
  <header class="topbar">
    <div class="container topbar-inner">
      <a href="index.html" class="brand">
        <img src="assets/images/ui/logo-icon.png" alt="Logo">
        <div>
          <div class="brand-name">Gráfica do Zoinho</div>
          <div class="brand-sub">Impressos com qualidade</div>
        </div>
      </a>
      <nav class="top-nav">
        <a href="index.html">Início</a>
        <a href="loja.html">Loja</a>
        <a href="sac.html">SAC</a>
      </nav>
      <div class="searchbar">
        <input type="text" placeholder="Busque por produto..." onkeydown="if(event.key==='Enter'){ location.href='loja.html?q='+encodeURIComponent(this.value) }">
        <span class="icon">⌕</span>
      </div>
      <div class="top-icons">
        <a class="cart-link" href="carrinho.html" title="Carrinho">🛒 <span data-cart-count>0</span></a>
      </div>
    </div>
  </header>`;
}
function createFooter(){
  return `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <div class="brand" style="margin-bottom:10px">
          <img src="assets/images/ui/logo-icon.png" alt="Logo">
          <div><div class="brand-name">Gráfica do Zoinho</div></div>
        </div>
        <p>Qualidade gráfica sob demanda. Monte seu pedido, calcule e envie pelo WhatsApp com praticidade.</p>
      </div>
      <div>
        <h4>Navegação</h4>
        <ul>
          <li><a href="index.html">Início</a></li>
          <li><a href="loja.html">Loja</a></li>
          <li><a href="sac.html">SAC</a></li>
        </ul>
      </div>
      <div>
        <h4>Categorias</h4>
        <ul>
          <li>Cartões</li>
          <li>Panfletos</li>
          <li>Adesivos</li>
          <li>Cadernetas</li>
        </ul>
      </div>
    </div>
    <div class="container copy">© 2025 Gráfica do Zoinho. Todos os direitos reservados.</div>
  </footer>`;
}
function createFloatWhatsapp(){
  return `<a class="float-whats" target="_blank" href="https://wa.me/${WHATSAPP_NUMBER}"><span class="wa-icon">✆</span><span><small>Atendimento</small>via WhatsApp</span></a>`;
}
function renderLayout(){
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  const whats = document.querySelector('[data-float-whats]');
  if(header) header.innerHTML = createHeader();
  if(footer) footer.innerHTML = createFooter();
  if(whats) whats.innerHTML = createFloatWhatsapp();
  updateCartBubble();
}

function renderHomeCards(){
  const holder = document.querySelector('[data-home-cards]');
  if(!holder) return;
  holder.innerHTML = getProducts().slice(0,4).map(p=>`
    <a href="${productLink(p)}" class="card">
      <div class="card-media"><img src="${p.imagem}" alt="${p.nome}"></div>
      <div class="card-body">
        <div class="card-title">${p.nome}</div>
        <div class="card-desc">${p.descricao}</div>
      </div>
    </a>
  `).join('');
}

function buildShopCategories(){
  const base = ['Todos'];
  getProducts().forEach(p=>{ if(!base.includes(p.categoria)) base.push(p.categoria); });
  return base;
}
function renderShopSidebar(){
  const holder = document.querySelector('[data-shop-categories]');
  if(!holder) return;
  holder.innerHTML = buildShopCategories().map(cat=>{
    if(cat === 'Todos') return `<li><a href="loja.html">Todos</a></li>`;
    return `<li><a href="loja.html?cat=${encodeURIComponent(cat.toLowerCase())}">${cat}</a></li>`;
  }).join('');
}
function renderShop(){
  renderShopSidebar();
  const holder = document.querySelector('[data-shop-grid]');
  if(!holder) return;
  const params = new URLSearchParams(location.search);
  const q = (params.get('q')||'').toLowerCase().trim();
  const cat = (params.get('cat')||'').toLowerCase().trim();
  const filtered = getProducts().filter(p=>{
    const okQ = !q || p.nome.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q);
    const okC = !cat || p.categoria.toLowerCase()===cat;
    return okQ && okC;
  });
  holder.innerHTML = filtered.map(p=>`
    <div class="product-mini">
      <div class="card-media"><img src="${p.imagem}" alt="${p.nome}"></div>
      <div class="card-body">
        <div class="row-between">
          <div class="badge">${p.categoria}</div>
          <div style="font-size:13px;color:#9aa3b2">a partir de</div>
        </div>
        <h3 class="card-title" style="margin-top:10px">${p.nome}</h3>
        <div class="card-desc">${p.descricao}</div>
        <div class="price">${brl(p.preco)}</div>
        <a class="btn btn-dark" href="${productLink(p)}" style="width:100%">Ver opções</a>
      </div>
    </div>
  `).join('') || `<div class="empty" style="grid-column:1/-1">Nenhum produto encontrado.</div>`;
}

function parseConfigText(text){
  const result = {};
  (text || '').split('\n').map(line=>line.trim()).filter(Boolean).forEach(line=>{
    const parts = line.split(':');
    if(parts.length < 2) return;
    const key = parts.shift().trim().toLowerCase();
    const values = parts.join(':').split(',').map(v=>v.trim()).filter(Boolean);
    if(key && values.length) result[key] = values;
  });
  return result;
}

function setupProductPage(productId){
  const queryId = new URLSearchParams(location.search).get('id');
  const product = productById(productId || queryId);
  const root = document.querySelector('[data-product-root]');
  if(!root || !product) return;
  const fields = Object.keys(product.configuracoes || {});
  root.innerHTML = `
    <div class="product-image">
      <div class="main-img"><img src="${product.imagem}" alt="${product.nome}"></div>
    </div>
    <div class="product-config">
      <h1>${product.nome}</h1>
      <p class="desc">${product.descricao} Veja e personalize o impresso que vai deixar sua marca mais impressionante.</p>
      <div id="product-config-fields"></div>
      <div class="config-group">
        <label>Código de desconto</label>
        <div class="row-between">
          <input id="discount-code" class="input" value="ZOINHO10" style="flex:1">
          <button class="btn btn-dark" id="apply-discount" type="button">Aplicar</button>
        </div>
      </div>
      <div class="price-box">
        <div class="price-row"><span>Preço do produto</span><strong id="base-price">${brl(product.preco)}</strong></div>
        <div class="price-row"><span>Entrega</span><strong id="delivery-value">—</strong></div>
        <div class="price-row total"><span>Total</span><strong id="total-value">${brl(product.preco)}</strong></div>
      </div>
      <div class="stack" style="margin-top:14px">
        <button class="btn btn-green" id="add-cart-btn" type="button">Adicionar ao carrinho</button>
        <a class="btn btn-light" href="loja.html">Continuar comprando</a>
      </div>
    </div>
  `;
  const fieldsHolder = document.getElementById('product-config-fields');
  if(!fields.length){
    fieldsHolder.innerHTML = `<div class="notice">Este produto foi cadastrado pelo painel e ainda não possui variações avançadas.</div>`;
  } else {
    fieldsHolder.innerHTML = fields.map(f=>`
      <div class="config-group">
        <label>${f.charAt(0).toUpperCase()+f.slice(1)}</label>
        <div class="options" data-field="${f}">
          ${product.configuracoes[f].map((opt,j)=>`<button class="option-btn ${j===0?'active':''}" type="button" data-option="${opt}">${opt}</button>`).join('')}
        </div>
      </div>
    `).join('');
    fieldsHolder.querySelectorAll('.options').forEach(group=>{
      group.addEventListener('click', e=>{
        const btn = e.target.closest('.option-btn');
        if(!btn) return;
        group.querySelectorAll('.option-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        recalc();
      });
    });
  }
  let discount = 0;
  document.getElementById('apply-discount').addEventListener('click', ()=>{
    const code = document.getElementById('discount-code').value.trim().toUpperCase();
    discount = code === 'ZOINHO10' ? 0.10 : 0;
    recalc();
  });
  function currentSelection(){
    const selected = {};
    fields.forEach(f=>{
      selected[f] = document.querySelector(`[data-field="${f}"] .option-btn.active`)?.dataset.option || '';
    });
    return selected;
  }
  function recalc(){
    let total = Number(product.preco || 0);
    const sel = currentSelection();
    Object.values(sel).forEach(v=>{
      if(/500/.test(v) || /A4/.test(v) || /4x4/.test(v) || /Express/.test(v) || /100 un/.test(v) || /2 vias|3 vias/.test(v)) total += 10;
      if(/1000|2500|5000/.test(v)) total += 20;
      if(/Personalizado|transparente|recortado/.test(v)) total += 15;
    });
    if(discount) total = total * (1-discount);
    document.getElementById('total-value').textContent = brl(total);
    return {total, selecao: sel};
  }
  recalc();
  document.getElementById('add-cart-btn').addEventListener('click', ()=>{
    const data = recalc();
    addToCart({
      id: product.id,
      nome: product.nome,
      imagem: product.imagem,
      total: Number(data.total.toFixed(2)),
      preco: product.preco,
      selecao: data.selecao
    });
    location.href = 'carrinho.html';
  });
}

function renderCart(){
  const holder = document.querySelector('[data-cart-items]');
  const summary = document.querySelector('[data-cart-summary]');
  if(!holder || !summary) return;
  const cart = getCart();
  if(!cart.length){
    holder.innerHTML = `<div class="empty">Seu carrinho está vazio. Escolha um produto na loja para montar seu orçamento.</div>`;
  } else {
    holder.innerHTML = cart.map((item,idx)=>`
      <div class="cart-item">
        <img src="${item.imagem}" alt="${item.nome}">
        <div>
          <h4>${item.nome}</h4>
          <div class="cart-meta">${Object.entries(item.selecao||{}).map(([k,v])=>`<div><strong>${k}:</strong> ${v}</div>`).join('')}</div>
        </div>
        <div>
          <div style="font-weight:900;font-size:22px;margin-bottom:10px">${brl(item.total)}</div>
          <button class="btn btn-light" onclick="handleRemove(${idx})">Remover</button>
        </div>
      </div>
    `).join('');
  }
  summary.innerHTML = `
    <h3 style="margin:0 0 14px;font-size:26px">Resumo do pedido</h3>
    <div class="price-row"><span>Itens</span><strong>${cart.length}</strong></div>
    <div class="price-row"><span>Subtotal</span><strong>${brl(cartTotal())}</strong></div>
    <div class="price-row"><span>Entrega</span><strong>A combinar</strong></div>
    <div class="price-row total"><span>Total</span><strong>${brl(cartTotal())}</strong></div>
    <div class="stack" style="margin-top:16px">
      <button class="btn btn-green" onclick="sendCartToWhatsapp()">Enviar para WhatsApp</button>
      <a class="btn btn-light" href="loja.html">Continuar comprando</a>
    </div>
  `;
}
function handleRemove(index){ removeFromCart(index); renderCart(); }
function sendCartToWhatsapp(){
  const cart = getCart();
  if(!cart.length){ alert('Seu carrinho está vazio.'); return; }
  let msg = 'Olá! Quero solicitar este orçamento:%0A%0A';
  cart.forEach((item,i)=>{
    msg += `*${i+1}. ${item.nome}*%0A`;
    Object.entries(item.selecao||{}).forEach(([k,v])=>{ msg += `- ${k}: ${v}%0A`; });
    msg += `- Total do item: ${brl(item.total)}%0A%0A`;
  });
  msg += `*Total geral:* ${brl(cartTotal())}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,'_blank');
}

function requireAdmin(){
  if(sessionStorage.getItem('grafica_admin_auth') === '1') return true;
  location.href = 'login.html';
  return false;
}
function setupAdminLogin(){
  const form = document.querySelector('[data-admin-login-form]');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const user = form.querySelector('[name="usuario"]').value.trim();
    const pass = form.querySelector('[name="senha"]').value.trim();
    const status = document.querySelector('[data-login-status]');
    if(user === ADMIN_USER && pass === ADMIN_PASSWORD){
      sessionStorage.setItem('grafica_admin_auth', '1');
      location.href = 'painel.html';
    } else {
      status.textContent = 'Login inválido.';
    }
  });
}
function renderAdminList(){
  const holder = document.querySelector('[data-admin-product-list]');
  if(!holder) return;
  const items = getCustomProducts();
  holder.innerHTML = items.length ? items.map(item=>`
    <div class="admin-item">
      <img src="${item.imagem}" alt="${item.nome}">
      <div>
        <strong>${item.nome}</strong>
        <span>${item.categoria} • ${brl(item.preco)}</span>
        <span>${Object.keys(item.configuracoes || {}).join(', ') || 'Sem variáveis cadastradas'}</span>
      </div>
      <button class="btn btn-danger" type="button" onclick="handleDeleteProduct('${item.id}')">Excluir</button>
    </div>
  `).join('') : `<div class="empty">Nenhum produto cadastrado pelo painel ainda.</div>`;
}
function handleDeleteProduct(id){
  if(!confirm('Deseja excluir este produto?')) return;
  deleteCustomProduct(id);
  renderAdminList();
  renderShop();
}
function setupAdminPanel(){
  const form = document.querySelector('[data-admin-form]');
  if(!form) return;
  if(!requireAdmin()) return;
  renderAdminList();
  const logout = document.querySelector('[data-admin-logout]');
  if(logout){
    logout.addEventListener('click', ()=>{
      sessionStorage.removeItem('grafica_admin_auth');
      location.href = 'login.html';
    });
  }
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(form);
    const nome = String(fd.get('nome') || '').trim();
    const categoria = String(fd.get('categoria') || '').trim();
    const descricao = String(fd.get('descricao') || '').trim();
    const preco = Number(fd.get('preco') || 0);
    const imagem = String(fd.get('imagem') || '').trim();
    const configuracoes = parseConfigText(String(fd.get('variaveis') || ''));
    if(!nome || !categoria || !imagem || !preco){
      alert('Preencha nome, categoria, imagem e preço.');
      return;
    }
    const id = `${slugify(nome)}-${Date.now().toString().slice(-6)}`;
    addCustomProduct({ id, nome, categoria, descricao, preco, imagem, configuracoes, slug:`produto.html?id=${id}` });
    form.reset();
    renderAdminList();
    alert('Produto adicionado com sucesso.');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderLayout();
  renderHomeCards();
  renderShop();
  renderCart();
  setupAdminLogin();
  setupAdminPanel();
});

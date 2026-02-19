// ----------------- داده‌های موقت (Mock Data) -----------------
const MOCK_PRODUCTS = [
    { id: 'sngk1', name: 'سنگک ', price: 5000, img: 'assets/sangak.jpg', desc: '' },
    { id: 'brbr2', name: 'بربری ', price: 6500, img: 'assets/barbari.jpg', desc: '' },
    { id: 'tftn3', name: 'تافتون ', price: 4500, img: 'assets/taftoon.jpg', desc: '' },
    { id: 'lva4', name: 'لواش', price: 2500, img: 'assets/lavash.jpg', desc: '' }
];

const BAKERY_DATA = {
    Tehran: [{id: 't1', name: 'نانوایی آزادی'}, {id: 't2', name: 'نانوایی ولیعصر'}],
    Mashhad: [{id: 'm1', name: 'نانوایی حرم'}, {id: 'm2', name: 'نانوایی احمدآباد'}],
    Isfahan: [{id: 'i1', name: 'نانوایی چهارباغ'}],
    Shiraz: [{id: 's1', name: 'نانوایی قصردشت'}],
    Tabriz: [{id: 'tb1', name: 'نانوایی سردرود'}],
    Zahedan: [{id: 'z1', name: 'نزدیک‌ترین نانوایی به شما (GPS)'}, {id: 'z2', name: 'نانوایی کوروش'}]
};

let userCart = [];
let userAuth = { step: 0, name: '', phone: '' };
let userNotifications = [{ id: 1, text: 'سفارش شما در حال آماده‌سازی است.', time: 'همین الان' }];

// ----------------- توابع عمومی و تعاملات UI -----------------

/** تابع هوشمند تغییر تم و ایموجی */
function toggleTheme() {
    // انتخاب بدنه سایت
    const body = document.body;
    // انتخاب المان آیکون با استفاده از آی‌دی که ساختیم
    const themeIcon = document.getElementById('theme-icon');

    // جابجایی کلاس light (اگر هست حذف کن، اگر نیست اضافه کن)
    body.classList.toggle("light");

    // بررسی وضعیت جدید برای تغییر ایموجی
    if (body.classList.contains("light")) {
        // اگر سایت روشن شد، آیکون را ماه کن (برای برگشت به تاریکی)
        themeIcon.innerText = "🌙";
    } else {
        // اگر سایت تاریک شد، آیکون را خورشید کن (برای برگشت به روشنایی)
        themeIcon.innerText = "☀️";
    }
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 25) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero *').forEach(el => {
        el.style.opacity = 1;
        el.style.transform = 'none';
    });
    updateBakeryList();
    renderProducts();
});

// ----------------- مدیریت شهر و نانوایی -----------------

function updateBakeryList() {
    const city = document.getElementById('citySelect').value;
    const bakerySelect = document.getElementById('bakerySelect');
    bakerySelect.innerHTML = '';
    const bakeries = BAKERY_DATA[city] || [];
    bakeries.forEach(bakery => {
        const option = document.createElement('option');
        option.value = bakery.id;
        option.textContent = bakery.name;
        bakerySelect.appendChild(option);
    });
}

// ----------------- مدیریت محصولات و سبد خرید -----------------

function renderProducts() {
    const cardsContainer = document.getElementById('productSection');
    cardsContainer.innerHTML = '';
    MOCK_PRODUCTS.forEach(product => {
        const cardHtml = `
            <div class="card fadeIn" style="animation-delay: ${Math.random() * 0.5}s;">
                <img src="${product.img}" onerror="this.src='assets/logo.png'" alt="${product.name}">
                <h3>${product.name}</h3>
                <p style="color: var(--orange); font-weight: bold;">${product.price.toLocaleString()} تومان</p>
                <p style="font-size: 0.8rem; opacity: 0.8;">${product.desc}</p>
                <button class="add-btn" onclick="addToCart('${product.id}')">افزودن به سبد</button>
            </div>
        `;
        cardsContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function addToCart(productId) {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existingItem = userCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        userCart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    toggleCart(true);
}

function updateCartUI() {
    const cartList = document.querySelector('#cartModal .cart-list');
    const totalSpan = document.getElementById('cartTotal');
    const emptyMsg = document.getElementById('emptyCartMsg');
    const headerCartIcon = document.querySelector('#mainHeader .icon[onclick="toggleCart()"]');
    
    cartList.innerHTML = '';
    let total = 0;

    if (userCart.length === 0) {
        emptyMsg.style.display = 'block';
        const headerCartIcon = document.getElementById('cartIcon');

    } else {
        emptyMsg.style.display = 'none';
        userCart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            const itemHtml = `
                <div class="cart-item">
                    ${item.name} (${item.qty} عدد) - ${itemTotal.toLocaleString()} تومان
                    <button onclick="removeFromCart('${item.id}')" style="float:left; border:none; background:none; color:red; cursor:pointer;">✖</button>
                </div>
            `;
            cartList.insertAdjacentHTML('beforeend', itemHtml);
        });
        headerCartIcon.textContent = `🛒 (${userCart.reduce((sum, item) => sum + item.qty, 0)})`;
    }
    totalSpan.textContent = total.toLocaleString() + ' تومان';
}

function removeFromCart(productId) {
    userCart = userCart.filter(item => item.id !== productId);
    updateCartUI();
}

function toggleCart(forceOpen = null) {
    const modal = document.getElementById('cartModal');
    if (forceOpen === true || modal.style.display !== 'flex') {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    } else {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
    updateCartUI();
}

function checkout() {
    alert("✅ سفارش شما با موفقیت به نانوایی ارسال شد! (شبیه‌سازی)");
    userCart = [];
    toggleCart();
    userNotifications.push({ id: Date.now(), text: 'سفارش جدید شما ثبت شد و در انتظار تأیید نانوایی است.', time: 'چند لحظه پیش' });
    const notifIcon = document.querySelector('#mainHeader .icon[onclick="toggleNotifications()"]');
    notifIcon.textContent = `🔔 (${userNotifications.length})`;
}

// ----------------- مدیریت ثبت نام/احراز هویت -----------------

function toggleAuthModal(step = 0) {
    const modal = document.getElementById('authModal');
    const body = document.getElementById('authBody');
    const title = document.getElementById('authTitle');

    if (step === 'close') {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        return;
    }

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);

    if (step === 'register' || userAuth.step === 0) {
        userAuth.step = 1;
        title.textContent = 'ثبت نام / ورود';
        renderRegisterForm(body);
    } else if (step === 'code') {
        title.textContent = 'تأیید کد ورود';
        renderCodeForm(body);
    }
}

function renderRegisterForm(body) {
    body.innerHTML = `
        <form id="registerForm">
            <input type="text" id="regName" placeholder="نام و نام خانوادگی" required>
            <input type="tel" id="regPhone" placeholder="شماره تلفن" maxlength="11" required>
            <button type="submit">دریافت کد ورود</button>
        </form>
    `;
    document.getElementById('registerForm').onsubmit = (e) => {
        e.preventDefault();
        userAuth.name = document.getElementById('regName').value;
        userAuth.phone = document.getElementById('regPhone').value;
        userAuth.step = 2;
        toggleAuthModal('code');
    };
}

function renderCodeForm(body) {
    body.innerHTML = `
        <p style="text-align:center;">کد تایید به ${userAuth.phone} ارسال شد. )</p>
        <form id="codeForm">
            <input type="number" id="codeInput" placeholder="کد ورود 4 رقمی" maxlength="4" required>
            <button type="submit">تأیید و ورود</button>
        </form>
        <p style="text-align:center; font-size:0.9rem;"><a href="#" onclick="userAuth.step=1; renderRegisterForm(document.getElementById('authBody')); return false;">تغییر شماره تلفن</a></p>
    `;
    document.getElementById('codeForm').onsubmit = (e) => {
        e.preventDefault();
        const code = document.getElementById('codeInput').value;
        if (code === '1234') {
            alert(`✅ خوش آمدید، ${userAuth.name} عزیز!`);
            userAuth.step = 3;
            toggleAuthModal('close');
            document.getElementById('profileIcon').textContent = `👤 ${userAuth.name.split(' ')[0]}`;
        } else {
            alert('❌ کد اشتباه است.');
        }
    };
}

// ----------------- مدیریت اعلان‌ها -----------------

function toggleNotifications() {
    const modal = document.getElementById('notificationModal');
    const body = document.getElementById('notificationBody');
    const icon = document.querySelector('#mainHeader .icon[onclick="toggleNotifications()"]');

    if (modal.style.display !== 'flex') {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        renderNotifications(body);
    } else {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        userNotifications = [];
        icon.textContent = '🔔';
    }
}

function renderNotifications(body) {
    body.innerHTML = '';
    if (userNotifications.length === 0) {
        body.innerHTML = '<p style="text-align:center; opacity:.7;">موردی برای نمایش نیست.</p>';
        return;
    }
    [...userNotifications].reverse().forEach(note => {
        const noteHtml = `
            <div class="notification-item">
                ${note.text} 
                <span style="float:left; font-size:0.8rem; opacity:0.6;">${note.time}</span>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', noteHtml);
    });
}
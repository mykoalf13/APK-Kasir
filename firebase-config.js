// ============================================================
// WarungKita v2 — Firebase Config
// ⚠️ Ganti nilai GANTI_... dengan config Firebase proyekmu!
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, doc,
  getDocs, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp,
  query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ── GANTI DENGAN CONFIG FIREBASE PROYEKMU ─────────────────
const firebaseConfig = {
  apiKey:            "GANTI_API_KEY",
  authDomain:        "GANTI_PROJECT_ID.firebaseapp.com",
  projectId:         "GANTI_PROJECT_ID",
  storageBucket:     "GANTI_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_MESSAGING_SENDER_ID",
  appId:             "GANTI_APP_ID"
};

// ── INIT ───────────────────────────────────────────────────
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ── DEFAULT MENU (seed otomatis jika Firestore kosong) ─────
const DEFAULT_MENU = [
  { nama:"Nasi Goreng Spesial",    kategori:"Makanan", harga:25000, img:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", deskripsi:"Nasi goreng telur, ayam suwir, dan bumbu rahasia" },
  { nama:"Mie Goreng Jawa",        kategori:"Makanan", harga:22000, img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80", deskripsi:"Mie goreng khas Jawa dengan kecap dan sayuran segar" },
  { nama:"Ayam Bakar Madu",        kategori:"Makanan", harga:32000, img:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80", deskripsi:"Ayam bakar marinasi madu, sambal lalapan" },
  { nama:"Soto Ayam",              kategori:"Makanan", harga:18000, img:"https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80", deskripsi:"Soto bening gurih dengan soun dan telur rebus" },
  { nama:"Gado-Gado",              kategori:"Makanan", harga:20000, img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80", deskripsi:"Sayuran segar dengan saus kacang istimewa" },
  { nama:"Nasi Uduk",              kategori:"Makanan", harga:15000, img:"https://images.unsplash.com/photo-1516901121982-4ba484dc3b8f?w=400&q=80", deskripsi:"Nasi gurih dimasak santan dengan lauk lengkap" },
  { nama:"Es Teh Manis",           kategori:"Minuman", harga:5000,  img:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80", deskripsi:"Teh segar dengan es batu, manis pas" },
  { nama:"Es Jeruk Peras",         kategori:"Minuman", harga:8000,  img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80", deskripsi:"Perasan jeruk segar langsung dari buah pilihan" },
  { nama:"Jus Alpukat",            kategori:"Minuman", harga:15000, img:"https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&q=80", deskripsi:"Alpukat creamy blend susu dan cokelat" },
  { nama:"Kopi Tubruk",            kategori:"Minuman", harga:7000,  img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80", deskripsi:"Kopi robusta kuat harum asli Indonesia" },
  { nama:"Es Kelapa Muda",         kategori:"Minuman", harga:12000, img:"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80", deskripsi:"Kelapa muda segar langsung dibelah untuk Anda" },
  { nama:"Pisang Goreng Cokelat",  kategori:"Snack",   harga:13000, img:"https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400&q=80", deskripsi:"Pisang goreng crispy topping cokelat cair lumer" },
  { nama:"Tempe Mendoan",          kategori:"Snack",   harga:9000,  img:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80", deskripsi:"Tempe goreng tepung tipis, gurih renyah" },
  { nama:"Bakwan Sayur",           kategori:"Snack",   harga:8000,  img:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", deskripsi:"Bakwan sayur goreng renyah, enak hangat-hangat" },
];

// ── MENU ───────────────────────────────────────────────────
async function fbSeedIfEmpty() {
  const snap = await getDocs(collection(db, "menu"));
  if (snap.empty) {
    for (const item of DEFAULT_MENU) {
      await addDoc(collection(db, "menu"), { ...item, createdAt: serverTimestamp() });
    }
  }
}

function fbListenMenu(cb) {
  return onSnapshot(collection(db, "menu"), snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

async function fbAddMenu(data)       { return addDoc(collection(db,"menu"), { ...data, createdAt: serverTimestamp() }); }
async function fbUpdateMenu(id,data) { return updateDoc(doc(db,"menu",id), { ...data, updatedAt: serverTimestamp() }); }
async function fbDeleteMenu(id)      { return deleteDoc(doc(db,"menu",id)); }

// ── TRANSACTIONS ───────────────────────────────────────────
async function fbSaveTrx(trx) {
  return addDoc(collection(db,"transactions"), { ...trx, createdAt: serverTimestamp() });
}

async function fbGetTrx() {
  const q = query(collection(db,"transactions"), orderBy("createdAt","desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── AUTH ───────────────────────────────────────────────────
async function fbLogin(email, pass) { return signInWithEmailAndPassword(auth, email, pass); }
async function fbLogout()           { await signOut(auth); window.location.href = "login.html"; }

function requireFbAuth() {
  return new Promise(resolve => {
    onAuthStateChanged(auth, user => {
      if (!user) window.location.href = "login.html";
      else resolve(user);
    });
  });
}

// ── CART (localStorage — cepat & per-device OK) ────────────
function getCart()      { return JSON.parse(localStorage.getItem('wk2_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('wk2_cart', JSON.stringify(cart)); updateBadge(); }

// ── UI HELPERS ─────────────────────────────────────────────
function rp(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }

function updateBadge() {
  const qty = getCart().reduce((s,i) => s+i.qty, 0);
  document.querySelectorAll('.cart-pill').forEach(el => {
    el.textContent = qty;
    el.style.display = qty > 0 ? 'inline-flex' : 'none';
  });
}

function toast(msg, type='') {
  const icons = { '':'🛒', success:'✅', error:'❌' };
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap'; wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]||'🔔'}</span><span class="toast-msg">${msg}</span><button class="toast-x" onclick="this.parentElement.remove()">×</button>`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function openModal(id)  { document.getElementById(id)?.classList.add('show'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }

function setActive() {
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navlinks a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === pg)
  );
}

function renderNavbar(showAdmin=false) {
  return `
  <nav class="navbar">
    <a href="index.html" class="nav-brand">
      <div class="brand-mark">🍽️</div>
      Warung<em>Kita</em>
    </a>
    <ul class="nav-links mob" id="navlinks">
      <li><a href="index.html">🏠 Menu</a></li>
      <li>
        <a href="cart.html" style="position:relative">
          🛒 Keranjang
          <span class="cart-pill" style="display:none">0</span>
        </a>
      </li>
      ${showAdmin ? `<li><a href="admin.html">⚙️ Admin</a></li>` : ''}
      <li><a href="#" onclick="fbLogout()">👋 Logout</a></li>
    </ul>
    <a href="cart.html" class="nav-cart-btn" title="Keranjang">
      🛒<span class="cart-pill" style="display:none;position:absolute;top:-6px;right:-6px">0</span>
    </a>
  </nav>`;
}

export {
  db, auth,
  fbSeedIfEmpty, fbListenMenu, fbAddMenu, fbUpdateMenu, fbDeleteMenu,
  fbSaveTrx, fbGetTrx,
  fbLogin, fbLogout, requireFbAuth, onAuthStateChanged,
  getCart, saveCart,
  rp, updateBadge, toast, openModal, closeModal, setActive, renderNavbar
};

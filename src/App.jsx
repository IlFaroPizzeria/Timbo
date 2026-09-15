import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy, Users, Clock, Shield, Plus, X, Check,
  ChevronRight, LogOut, BarChart3, History, Lock, Mail,
  User as UserIcon, Search, ArrowUpDown, Trash2, Pencil, Crown, Flame,
  Target, Wallet, Loader2, CircleAlert, ArrowLeft, Menu, Medal, Sparkles,
  HelpCircle, ChevronDown, TrendingUp, Award
} from 'lucide-react';

/* ============================================================================
   CONFIGURACIÓN GENERAL
   Todo lo que probablemente quieras tocar en el futuro vive aquí arriba:
   nombre de la app, moneda, límites de apuesta y la paleta de la marca.
   ============================================================================ */
const CONFIG = {
  appName: 'La Timba',
  tagline: 'Apuestas privadas del grupo',
  currencySymbol: '€',
  minBet: 1,
  maxBet: 10000,
  seedAdmin: { name: 'Organizador', email: 'admin@latimba.com', password: 'admin123' },
};

const THEME = {
  bg: '#0E1013',
  bgElevated: '#15181F',
  bgCard: '#1A1E26',
  bgCardHover: '#1F232C',
  border: '#272C36',
  borderStrong: '#383F4D',
  textPrimary: '#F1EFE7',
  textSecondary: '#9298AA',
  textMuted: '#5B6274',
  gold: '#E3B24C',
  goldSoft: 'rgba(227,178,76,0.13)',
  teal: '#4FA9AE',
  tealSoft: 'rgba(79,169,174,0.14)',
  danger: '#D3706A',
  dangerSoft: 'rgba(211,112,106,0.14)',
  success: '#6FAE84',
  successSoft: 'rgba(111,174,132,0.14)',
};

const OPTION_COLORS = ['#E3B24C', '#4FA9AE', '#B389C9', '#7FA0D6', '#D08A5B', '#7FBF8F', '#D67FA6', '#8F9FE3'];

/* ============================================================================
   DATOS DE DEMOSTRACIÓN — se cargan una única vez. Editables o eliminables
   por completo desde el panel del organizador.
   ============================================================================ */
const SEED_VERSION = 4; // sube este número si vuelves a cambiar los eventos de ejemplo y quieres que se recarguen

function atTime(base, hour, minute) {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  if (d.getTime() <= base) d.setDate(d.getDate() + 1); // si esa hora ya pasó hoy, lo dejamos para mañana
  return d.getTime();
}
function nextWeekday(base, targetDow, hour, minute) {
  const d = new Date(base);
  let diff = (targetDow - d.getDay() + 7) % 7;
  const candidate = new Date(d);
  candidate.setDate(d.getDate() + diff);
  candidate.setHours(hour, minute, 0, 0);
  if (candidate.getTime() <= base) candidate.setDate(candidate.getDate() + 7);
  return candidate.getTime();
}

function buildSeedData() {
  const now = Date.now();
  const hour = 3600000;
  const events = [
    {
      id: 'evt_tarde', title: '¿Cuánta gente llega tarde hoy a primera hora?',
      description: 'Cuenta de gente que entra después de que empiece la primera clase.',
      status: 'open', deadline: atTime(now, 8, 0), createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_pantalon_negro', title: '¿Cuántas chicas llevan hoy la parte de abajo negra?',
      description: 'Cuenta total en clase durante todo el día.',
      status: 'open', deadline: atTime(now, 8, 0), createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_homann', title: '¿Lleva hoy Frau Homann pantalón blanco?',
      description: 'Sí o no, sin trampa.',
      status: 'open', deadline: atTime(now, 8, 0), createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_sara', title: '¿Cuántas veces participa Sara en las dos horas de alemán?',
      description: 'Se cuentan las veces que habla o responde en las dos horas de alemán de hoy.',
      status: 'open', deadline: now + 5 * hour, createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_fleckinger', title: '¿Cuántas veces dice hoy Herr Fleckinger "Does this seem okay to you?"',
      description: 'Se cuenta durante toda la jornada de hoy.',
      status: 'open', deadline: atTime(now, 10, 10), createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_charla_mathe', title: '¿Hasta qué hora dura hoy la hora de Mathe?',
      description: 'A qué hora exacta se corta y pasa a otra cosa.',
      status: 'open', deadline: atTime(now, 12, 0), createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_ciencias', title: '¿A qué hora empieza hoy realmente la clase de ciencias?',
      description: 'La hora oficial es las 13:40. ¿Cuánto se retrasa?',
      status: 'open', deadline: atTime(now, 13, 35), createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_adidas', title: '¿Cuánta gente lleva hoy zapatillas Adidas?',
      description: 'Cuenta total en clase durante todo el día.',
      status: 'open', deadline: atTime(now, 8, 15), createdAt: now, closedAt: null, winningOptionId: null,
    },
    {
      id: 'evt_chinos', title: '¿Cuántos chicos van el miércoles en chinos blancos o beige claro?',
      description: 'Cuenta del miércoles que viene, en clase durante todo el día.',
      status: 'open', deadline: nextWeekday(now, 3, 8, 15), createdAt: now, closedAt: null, winningOptionId: null,
    },
  ];
  const options = [
    { id: 'opt_tarde_0', eventId: 'evt_tarde', name: 'Nadie', description: '', createdAt: now },
    { id: 'opt_tarde_1', eventId: 'evt_tarde', name: '1 persona', description: '', createdAt: now },
    { id: 'opt_tarde_2', eventId: 'evt_tarde', name: '2 personas', description: '', createdAt: now },
    { id: 'opt_tarde_3', eventId: 'evt_tarde', name: '3 personas', description: '', createdAt: now },
    { id: 'opt_tarde_4', eventId: 'evt_tarde', name: '4 o más', description: '', createdAt: now },

    { id: 'opt_pn_01', eventId: 'evt_pantalon_negro', name: 'Menos de 2', description: '', createdAt: now },
    { id: 'opt_pn_23', eventId: 'evt_pantalon_negro', name: '2 a 3', description: '', createdAt: now },
    { id: 'opt_pn_45', eventId: 'evt_pantalon_negro', name: '4 a 5', description: '', createdAt: now },
    { id: 'opt_pn_67', eventId: 'evt_pantalon_negro', name: '6 a 7', description: '', createdAt: now },
    { id: 'opt_pn_8', eventId: 'evt_pantalon_negro', name: '8 o más', description: '', createdAt: now },

    { id: 'opt_homann_si', eventId: 'evt_homann', name: 'Sí', description: '', createdAt: now },
    { id: 'opt_homann_no', eventId: 'evt_homann', name: 'No', description: '', createdAt: now },

    { id: 'opt_sara_01', eventId: 'evt_sara', name: '0 a 1 veces', description: '', createdAt: now },
    { id: 'opt_sara_23', eventId: 'evt_sara', name: '2 a 3 veces', description: '', createdAt: now },
    { id: 'opt_sara_4', eventId: 'evt_sara', name: '4 o más', description: '', createdAt: now },

    { id: 'opt_fleck_0', eventId: 'evt_fleckinger', name: 'Ninguna vez', description: '', createdAt: now },
    { id: 'opt_fleck_1', eventId: 'evt_fleckinger', name: '1 vez', description: '', createdAt: now },
    { id: 'opt_fleck_23', eventId: 'evt_fleckinger', name: '2 a 3 veces', description: '', createdAt: now },
    { id: 'opt_fleck_4', eventId: 'evt_fleckinger', name: '4 o más', description: '', createdAt: now },

    { id: 'opt_charla_1', eventId: 'evt_charla_mathe', name: '12:00 a 12:05', description: '', createdAt: now },
    { id: 'opt_charla_2', eventId: 'evt_charla_mathe', name: '12:05 a 12:10', description: '', createdAt: now },
    { id: 'opt_charla_3', eventId: 'evt_charla_mathe', name: '12:10 a 12:15', description: '', createdAt: now },
    { id: 'opt_charla_4', eventId: 'evt_charla_mathe', name: 'Más de 12:15', description: '', createdAt: now },

    { id: 'opt_ciencias_1', eventId: 'evt_ciencias', name: '13:40 en punto', description: '', createdAt: now },
    { id: 'opt_ciencias_2', eventId: 'evt_ciencias', name: '13:40 a 13:45', description: '', createdAt: now },
    { id: 'opt_ciencias_3', eventId: 'evt_ciencias', name: '13:45 a 13:50', description: '', createdAt: now },
    { id: 'opt_ciencias_4', eventId: 'evt_ciencias', name: 'Más tarde de 13:50', description: '', createdAt: now },

    { id: 'opt_adidas_1', eventId: 'evt_adidas', name: '0 a 2', description: '', createdAt: now },
    { id: 'opt_adidas_2', eventId: 'evt_adidas', name: '3 a 5', description: '', createdAt: now },
    { id: 'opt_adidas_3', eventId: 'evt_adidas', name: '6 a 8', description: '', createdAt: now },
    { id: 'opt_adidas_4', eventId: 'evt_adidas', name: '9 o más', description: '', createdAt: now },

    { id: 'opt_chinos_1', eventId: 'evt_chinos', name: '0 a 1', description: '', createdAt: now },
    { id: 'opt_chinos_2', eventId: 'evt_chinos', name: '2 a 3', description: '', createdAt: now },
    { id: 'opt_chinos_3', eventId: 'evt_chinos', name: '4 a 5', description: '', createdAt: now },
    { id: 'opt_chinos_4', eventId: 'evt_chinos', name: '6 o más', description: '', createdAt: now },
  ];
  const users = [
    { id: 'usr_admin', name: CONFIG.seedAdmin.name, email: CONFIG.seedAdmin.email, passwordHash: hashPassword(CONFIG.seedAdmin.password), role: 'ADMIN', createdAt: now },
  ];
  const wagers = [];
  const combos = [];
  const grants = [];
  return { events, options, users, wagers, combos, grants, config: { minBet: CONFIG.minBet, maxBet: CONFIG.maxBet, seeded: true, version: SEED_VERSION } };
}

/* ============================================================================
   UTILIDADES
   ============================================================================ */
function uid(prefix) { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`; }
function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
function hashPassword(pw) {
  // Hash simple no criptográfico. Suficiente para un grupo privado de confianza,
  // NO apto para producción con datos sensibles reales (ver nota de seguridad).
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) | 0;
  return 'h' + Math.abs(h).toString(36) + pw.length;
}
function formatMoney(n) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' ' + CONFIG.currencySymbol;
}
function formatOdds(n) { return n == null ? '—' : n.toFixed(2) + 'x'; }
function calcOdds(optionAmount, totalAmount) {
  if (!optionAmount || optionAmount <= 0) return null;
  return totalAmount / optionAmount;
}
function timeLeft(deadline) {
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
function colorForOption(index) { return OPTION_COLORS[index % OPTION_COLORS.length]; }

/* ============================================================================
   CAPA DE DATOS — /api/storage hace de "backend", respaldado por Vercel KV.
   Todo el mundo que entra en la web comparte el mismo estado (usuarios,
   eventos, apuestas, tokens). La sesión (quién ha iniciado sesión en este
   dispositivo) se guarda en localStorage, solo en el propio navegador.
   ============================================================================ */
const KEYS = { users: 'latimba:users', events: 'latimba:events', options: 'latimba:options', wagers: 'latimba:wagers', combos: 'latimba:combos', grants: 'latimba:grants', config: 'latimba:config' };

async function storageGet(key) {
  try {
    const res = await fetch('/api/storage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get', key }) });
    if (!res.ok) return null;
    const data = await res.json();
    return data.value ?? null;
  } catch (e) { return null; }
}
async function storageSet(key, value) {
  try {
    const res = await fetch('/api/storage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'set', key, value }) });
    return res.ok;
  } catch (e) { return false; }
}

/* ============================================================================
   CONTEXTO DE NOTIFICACIONES (Toasts)
   ============================================================================ */
const ToastCtx = React.createContext(() => {});
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, kind = 'info') => {
    const id = uid('toast');
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 340 }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast-item" style={{
            background: THEME.bgElevated, border: `1px solid ${t.kind === 'error' ? THEME.danger : t.kind === 'success' ? THEME.success : THEME.borderStrong}`,
            color: THEME.textPrimary, padding: '12px 14px', borderRadius: 10, fontSize: 13.5, boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast() { return React.useContext(ToastCtx); }

/* ============================================================================
   PRIMITIVOS DE UI
   ============================================================================ */
function Modal({ open, onClose, title, children, width = 460 }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{title}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Badge({ children, tone = 'neutral', icon: Icon }) {
  const tones = {
    neutral: { bg: THEME.bgElevated, color: THEME.textSecondary, border: THEME.border },
    gold: { bg: THEME.goldSoft, color: THEME.gold, border: 'transparent' },
    teal: { bg: THEME.tealSoft, color: THEME.teal, border: 'transparent' },
    success: { bg: THEME.successSoft, color: THEME.success, border: 'transparent' },
    danger: { bg: THEME.dangerSoft, color: THEME.danger, border: 'transparent' },
  };
  const t = tones[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: t.bg, color: t.color, border: `1px solid ${t.border}`, padding: '4px 9px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {Icon && <Icon size={12} />}{children}
    </span>
  );
}

function Spinner({ size = 22 }) {
  return <Loader2 size={size} className="spin" style={{ color: THEME.gold }} />;
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: THEME.textMuted }}>
      <Icon size={30} style={{ marginBottom: 10, opacity: 0.6 }} />
      <div style={{ fontSize: 15, color: THEME.textSecondary, fontWeight: 600 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

/* ============================================================================
   NAVBAR
   ============================================================================ */
function Navbar({ user, onNavigate, onLogout, screen, balance }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = [
    { key: 'home', label: 'Eventos', always: true },
    { key: 'combo', label: 'Combinada', requiresAuth: true },
    { key: 'ranking', label: 'Ranking', always: true },
    { key: 'help', label: 'Cómo funciona', always: true },
    { key: 'mybets', label: 'Mis apuestas', requiresAuth: true },
    { key: 'admin', label: 'Organizador', adminOnly: true },
  ];
  const visible = navItems.filter((n) => (n.adminOnly ? user?.role === 'ADMIN' : n.requiresAuth ? !!user : true));

  function go(key) { setDrawerOpen(false); onNavigate(key); }

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(14,16,19,0.86)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${THEME.border}` }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(150deg, ${THEME.gold}, #a97d29)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={16} color="#141414" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '-0.01em' }}>{CONFIG.appName}</span>
        </div>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {visible.map((n) => <NavLink key={n.key} active={screen === n.key} onClick={() => go(n.key)}>{n.label}</NavLink>)}
          <div style={{ width: 1, height: 20, background: THEME.border, margin: '0 4px' }} />
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.role !== 'ADMIN' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: THEME.goldSoft, color: THEME.gold, padding: '5px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 700 }}>
                  <Wallet size={12} /> {formatMoney(balance ?? 0)}
                </span>
              )}
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: THEME.bgElevated, border: `1px solid ${THEME.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: THEME.gold }}>
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <span style={{ fontSize: 13.5, color: THEME.textSecondary, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
              <button className="icon-btn" title="Cerrar sesión" onClick={onLogout}><LogOut size={16} /></button>
            </div>
          ) : (
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13.5 }} onClick={() => go('auth')}>Entrar</button>
          )}
        </div>

        <button className="nav-burger icon-btn" onClick={() => setDrawerOpen(true)} aria-label="Abrir menú">
          <Menu size={20} />
        </button>
      </div>

      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{CONFIG.appName}</span>
              <button className="icon-btn" onClick={() => setDrawerOpen(false)}><X size={18} /></button>
            </div>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: THEME.bgElevated, borderRadius: 12, marginBottom: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: THEME.bgCard, border: `1px solid ${THEME.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: THEME.gold, flexShrink: 0 }}>
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                  {user.role !== 'ADMIN' && <div style={{ fontSize: 12, color: THEME.gold, fontWeight: 700 }}>{formatMoney(balance ?? 0)} en tokens</div>}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {visible.map((n) => (
                <button key={n.key} className={`drawer-link ${screen === n.key ? 'drawer-link-active' : ''}`} onClick={() => go(n.key)}>{n.label}</button>
              ))}
            </div>

            <div className="divider" style={{ margin: '18px 0' }} />

            {user ? (
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setDrawerOpen(false); onLogout(); }}><LogOut size={15} /> Cerrar sesión</button>
            ) : (
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => go('auth')}>Entrar</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
function NavLink({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? THEME.bgElevated : 'transparent', border: 'none', color: active ? THEME.textPrimary : THEME.textSecondary,
      padding: '7px 12px', borderRadius: 8, fontSize: 13.5, cursor: 'pointer', fontWeight: active ? 600 : 500, transition: 'all .15s', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

/* ============================================================================
   AUTENTICACIÓN
   ============================================================================ */
function AuthScreen({ users, onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (mode === 'register') {
      if (!name.trim()) return setError('Escribe tu nombre.');
      if (!email.trim() || !email.includes('@')) return setError('Escribe un email válido.');
      if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return setError('Ya existe una cuenta con ese email.');
      setBusy(true);
      await onRegister({ name: name.trim(), email: email.trim().toLowerCase(), password });
      setBusy(false);
      toast('Cuenta creada. ¡Bienvenido!', 'success');
    } else {
      const u = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!u || u.passwordHash !== hashPassword(password)) return setError('Email o contraseña incorrectos.');
      setBusy(true);
      await onLogin(u);
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(150deg, ${THEME.gold}, #a97d29)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Trophy size={22} color="#141414" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1>
          <p style={{ color: THEME.textSecondary, fontSize: 13.5, margin: 0 }}>{CONFIG.tagline}</p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', background: THEME.bgElevated, borderRadius: 10, padding: 3, marginBottom: 20 }}>
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                background: mode === m ? THEME.bgCard : 'transparent', color: mode === m ? THEME.textPrimary : THEME.textMuted, transition: 'all .15s',
              }}>{m === 'login' ? 'Iniciar sesión' : 'Registrarse'}</button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'register' && (
              <Field icon={UserIcon} label="Nombre">
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
              </Field>
            )}
            <Field icon={Mail} label="Email">
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
            </Field>
            <Field icon={Lock} label="Contraseña">
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>

            {error && (
              <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', background: THEME.dangerSoft, color: THEME.danger, padding: '9px 11px', borderRadius: 8, fontSize: 12.5 }}>
                <CircleAlert size={14} style={{ marginTop: 1, flexShrink: 0 }} /> {error}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={busy} style={{ marginTop: 4, justifyContent: 'center' }}>
              {busy ? <Spinner size={16} /> : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: THEME.textMuted, fontSize: 11.5, marginTop: 16, lineHeight: 1.5 }}>
          Cuenta de organizador de prueba: {CONFIG.seedAdmin.email} / {CONFIG.seedAdmin.password}
        </p>
      </div>
    </div>
  );
}
function Field({ icon: Icon, label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, color: THEME.textSecondary, fontWeight: 600 }}>{label}</span>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: THEME.textMuted }} />
        {React.cloneElement(children, { style: { ...children.props.style, paddingLeft: 34 } })}
      </div>
    </label>
  );
}

/* ============================================================================
   COMPONENTES DE APUESTA (odds, tarjetas)
   ============================================================================ */
function OddsBadge({ odds, size = 'md' }) {
  if (odds == null) return <span style={{ color: THEME.textMuted, fontSize: size === 'lg' ? 15 : 13, fontFamily: 'var(--font-display)' }}>Sin apuestas</span>;
  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums', color: THEME.gold, fontWeight: 600,
      fontSize: size === 'lg' ? 22 : size === 'sm' ? 13 : 16,
    }}>{formatOdds(odds)}</span>
  );
}

function PoolBar({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div style={{ display: 'flex', width: '100%', height: 7, borderRadius: 4, overflow: 'hidden', background: THEME.bgElevated }}>
      {segments.map((s, i) => (
        <div key={i} className="pool-seg" style={{ width: total > 0 ? `${(s.value / total) * 100}%` : `${100 / segments.length}%`, background: total > 0 ? s.color : THEME.border, transition: 'width .5s ease' }} />
      ))}
    </div>
  );
}

function computeEventStats(event, options, wagers) {
  const evOptions = options.filter((o) => o.eventId === event.id);
  const evWagers = wagers.filter((w) => w.eventId === event.id);
  const totalPool = round2(evWagers.reduce((s, w) => s + w.amount, 0));
  const participants = new Set(evWagers.map((w) => w.userId)).size;
  const optionStats = evOptions.map((o, i) => {
    const wOnOption = evWagers.filter((w) => w.optionId === o.id);
    const amount = round2(wOnOption.reduce((s, w) => s + w.amount, 0));
    const odds = calcOdds(amount, totalPool);
    const pct = totalPool > 0 ? (amount / totalPool) * 100 : 0;
    return { option: o, amount, odds, pct, color: colorForOption(i), bettors: new Set(wOnOption.map((w) => w.userId)).size };
  });
  const topByAmount = optionStats.reduce((a, b) => (b.amount > (a?.amount ?? -1) ? b : a), null);
  const topByOdds = optionStats.filter((s) => s.odds != null).reduce((a, b) => (b.odds > (a?.odds ?? -1) ? b : a), null);
  return { evOptions, evWagers, totalPool, participants, optionStats, topByAmount, topByOdds };
}

function computeBalance(userId, grants, wagers, combos) {
  const granted = round2((grants || []).filter((g) => g.userId === userId).reduce((s, g) => s + g.amount, 0));
  const staked = round2(
    (wagers || []).filter((w) => w.userId === userId).reduce((s, w) => s + w.amount, 0) +
    (combos || []).filter((c) => c.userId === userId).reduce((s, c) => s + c.amount, 0)
  );
  return { granted, staked, balance: round2(granted - staked) };
}

function computeComboStatus(combo, events) {
  let anyPending = false;
  for (const leg of combo.legs) {
    const ev = events.find((e) => e.id === leg.eventId);
    if (!ev || ev.status !== 'finished') { anyPending = true; continue; }
    if (ev.winningOptionId !== leg.optionId) return 'perdida';
  }
  return anyPending ? 'pendiente' : 'ganada';
}

function EventCard({ event, options, wagers, onOpen, featured }) {
  const stats = computeEventStats(event, options, wagers);
  const remaining = event.status === 'open' ? timeLeft(event.deadline) : null;
  const statusInfo = event.status === 'finished'
    ? { label: 'Finalizada', tone: 'success' }
    : event.status === 'closed' || !remaining
      ? { label: 'Cerrada', tone: 'danger' }
      : { label: 'Abierta', tone: 'teal' };

  return (
    <div className={`card event-card ${featured ? 'event-card-featured' : ''}`} onClick={onOpen}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: featured ? 22 : 17, lineHeight: 1.25, letterSpacing: '-0.01em' }}>{event.title}</h3>
        <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
      </div>
      <p style={{ color: THEME.textSecondary, fontSize: 13.5, margin: '0 0 16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>

      <div style={{ display: 'flex', gap: 18, marginBottom: 14, fontSize: 12.5, color: THEME.textSecondary }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Wallet size={13} /> {formatMoney(stats.totalPool)}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={13} /> {stats.participants} participantes</span>
        {remaining && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} /> {remaining}</span>}
      </div>

      <PoolBar segments={stats.optionStats.map((s) => ({ value: s.amount, color: s.color }))} />

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {stats.optionStats.slice(0, featured ? 6 : 3).map((s) => (
          <div key={s.option.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13.5 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: THEME.textPrimary }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              {s.option.name}
              {stats.topByAmount?.option.id === s.option.id && stats.totalPool > 0 && <Flame size={12} color={THEME.gold} />}
            </span>
            <OddsBadge odds={s.odds} size="sm" />
          </div>
        ))}
        {stats.optionStats.length > (featured ? 6 : 3) && (
          <span style={{ fontSize: 12, color: THEME.textMuted }}>+{stats.optionStats.length - (featured ? 6 : 3)} opciones más</span>
        )}
      </div>

      <div className="btn-ghost" style={{ marginTop: 16, justifyContent: 'center' }}>Ver apuesta <ChevronRight size={15} /></div>
    </div>
  );
}

/* ============================================================================
   PANTALLA: HOME
   ============================================================================ */
function HomeScreen({ events, options, wagers, combos, onOpenEvent }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = events
    .filter((e) => filter === 'all' || e.status === filter)
    .filter((e) => !query || e.title.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    const rank = (e) => (e.status === 'open' ? 0 : e.status === 'closed' ? 1 : 2);
    return rank(a) - rank(b) || b.createdAt - a.createdAt;
  });

  const activity = [
    ...wagers.map((w) => ({ ...w, kind: 'single' })),
    ...(combos || []).map((c) => ({ ...c, kind: 'combo' })),
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);

  const counts = {
    all: events.length,
    open: events.filter((e) => e.status === 'open').length,
    closed: events.filter((e) => e.status === 'closed').length,
    finished: events.filter((e) => e.status === 'finished').length,
  };

  const [featuredEvent, ...rest] = sorted;

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 20px 80px' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, margin: '0 0 6px', letterSpacing: '-0.015em' }}>Eventos activos</h1>
        <p style={{ color: THEME.textSecondary, fontSize: 14, margin: 0 }}>Elige un evento, mira las cuotas del grupo y lanza tu apuesta.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4, background: THEME.bgElevated, borderRadius: 10, padding: 3 }}>
          {[['all', 'Todas'], ['open', 'Abiertas'], ['closed', 'Cerradas'], ['finished', 'Finalizadas']].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`filter-pill ${filter === k ? 'filter-pill-active' : ''}`}>
              {label} <span style={{ opacity: 0.6 }}>{counts[k]}</span>
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: THEME.textMuted }} />
          <input className="input" placeholder="Buscar evento…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activity.length ? 'minmax(0,1fr) 280px' : '1fr', gap: 24, alignItems: 'flex-start' }} className="home-grid">
        <div>
          {sorted.length === 0 ? (
            <EmptyState icon={Trophy} title="No hay eventos con ese filtro" subtitle="Prueba a cambiar de pestaña o borrar la búsqueda." />
          ) : (
            <>
              <EventCard event={featuredEvent} options={options} wagers={wagers} onOpen={() => onOpenEvent(featuredEvent.id)} featured />
              {rest.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 20 }}>
                  {rest.map((ev) => <EventCard key={ev.id} event={ev} options={options} wagers={wagers} onOpen={() => onOpenEvent(ev.id)} />)}
                </div>
              )}
            </>
          )}
        </div>

        {activity.length > 0 && (
          <div className="card home-activity" style={{ padding: 16, position: 'sticky', top: 82 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              <TrendingUp size={14} color={THEME.gold} /> Actividad reciente
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activity.map((a) => (
                <div key={a.id} style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700 }}>{a.userName}</span>{' '}
                  {a.kind === 'combo' ? (
                    <span style={{ color: THEME.textSecondary }}>lanzó {a.isMega ? <span style={{ color: THEME.gold, fontWeight: 700 }}>una mega soñadora</span> : `una combinada de ${a.legs.length}`} · {formatMoney(a.amount)}</span>
                  ) : (
                    <span style={{ color: THEME.textSecondary }}>apostó {formatMoney(a.amount)} en {events.find((e) => e.id === a.eventId)?.title}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   PANTALLA: DETALLE DE EVENTO + PANEL DE APUESTA
   ============================================================================ */
function EventDetailScreen({ event, options, wagers, currentUser, balance, onBack, onPlaceBet, onRequireAuth }) {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const stats = computeEventStats(event, options, wagers);
  const remaining = event.status === 'open' ? timeLeft(event.deadline) : null;
  const canBet = event.status === 'open' && !!remaining;
  const selectedStat = stats.optionStats.find((s) => s.option.id === selected);
  const numAmount = parseFloat(amount.replace(',', '.'));
  const validAmount = Number.isFinite(numAmount) && numAmount >= CONFIG.minBet && numAmount <= CONFIG.maxBet && (balance == null || numAmount <= balance);
  const potentialReturn = validAmount && selectedStat?.odds ? round2(numAmount * selectedStat.odds) : null;
  const profit = potentialReturn != null ? round2(potentialReturn - numAmount) : null;

  const myWagersHere = currentUser ? stats.evWagers.filter((w) => w.userId === currentUser.id) : [];

  function chooseOption(id) {
    if (!currentUser) return onRequireAuth();
    if (!canBet) return;
    setSelected(id); setAmount(''); setError('');
  }

  async function confirmBet() {
    setError('');
    if (!validAmount) {
      if (balance != null && numAmount > balance) return setError(`No tienes suficiente saldo. Te quedan ${formatMoney(balance)} en tokens.`);
      return setError(`Introduce una cantidad entre ${formatMoney(CONFIG.minBet)} y ${formatMoney(CONFIG.maxBet)}.`);
    }
    setConfirming(true);
    const res = await onPlaceBet(event.id, selected, round2(numAmount), selectedStat.odds);
    setConfirming(false);
    if (res?.error) return setError(res.error);
    toast(`Apuesta de ${formatMoney(numAmount)} confirmada en "${selectedStat.option.name}"`, 'success');
    setSelected(null); setAmount('');
  }

  const winnerStat = event.status === 'finished' ? stats.optionStats.find((s) => s.option.id === event.winningOptionId) : null;

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 20px 100px' }}>
      <button className="icon-btn" onClick={onBack} style={{ marginBottom: 18, display: 'inline-flex', alignItems: 'center', gap: 6, width: 'auto', padding: '7px 12px', fontSize: 13 }}>
        <ArrowLeft size={15} /> Volver a eventos
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', marginBottom: 8 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0, letterSpacing: '-0.015em', maxWidth: 620 }}>{event.title}</h1>
        <Badge tone={event.status === 'finished' ? 'success' : canBet ? 'teal' : 'danger'}>{event.status === 'finished' ? 'Finalizada' : canBet ? 'Abierta' : 'Cerrada'}</Badge>
      </div>
      <p style={{ color: THEME.textSecondary, fontSize: 14.5, lineHeight: 1.6, maxWidth: 640, margin: '6px 0 20px' }}>{event.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
        <StatsPill icon={Wallet} label="Pool total" value={formatMoney(stats.totalPool)} />
        <StatsPill icon={Users} label="Participantes" value={stats.participants} />
        {remaining && <StatsPill icon={Clock} label="Cierra en" value={remaining} />}
        {stats.topByAmount && stats.totalPool > 0 && <StatsPill icon={Flame} label="Más apostada" value={stats.topByAmount.option.name} />}
        {currentUser && currentUser.role !== 'ADMIN' && balance != null && <StatsPill icon={Wallet} label="Tu saldo" value={formatMoney(balance)} />}
      </div>

      {winnerStat && (
        <div className="card" style={{ padding: 18, marginBottom: 22, background: THEME.goldSoft, border: `1px solid ${THEME.gold}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: THEME.gold, fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 17 }}>
            <Crown size={18} /> {winnerStat.option.name} ha ganado
          </div>
          {myWagersHere.length > 0 && (
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: THEME.textSecondary }}>
              Tu resultado: {myWagersHere.map((w) => w.optionId === event.winningOptionId
                ? `cobras ${formatMoney(w.potentialReturn)} (apostaste ${formatMoney(w.amount)} a ${options.find(o=>o.id===w.optionId)?.name})`
                : `pierdes ${formatMoney(w.amount)} (apostado a ${options.find(o=>o.id===w.optionId)?.name})`).join(' · ')}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected && canBet ? '1fr 320px' : '1fr', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.optionStats.map((s) => (
            <OptionRow
              key={s.option.id}
              stat={s}
              selected={selected === s.option.id}
              disabled={!canBet}
              isWinner={event.status === 'finished' && event.winningOptionId === s.option.id}
              onSelect={() => chooseOption(s.option.id)}
            />
          ))}
        </div>

        {selected && canBet && selectedStat && (
          <div className="card bet-panel" style={{ padding: 20, position: 'sticky', top: 82 }}>
            <div style={{ fontSize: 12, color: THEME.textMuted, fontWeight: 600, marginBottom: 4 }}>Has seleccionado</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 18 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: selectedStat.color }} />
              {selectedStat.option.name}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 12.5, color: THEME.textSecondary }}>Cuota actual</span>
              <OddsBadge odds={selectedStat.odds} />
            </div>

            <label style={{ display: 'block', fontSize: 12, color: THEME.textSecondary, fontWeight: 600, marginBottom: 6 }}>Tu apuesta</label>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <input className="input" inputMode="decimal" placeholder="0,00" value={amount}
                onChange={(e) => setAmount(e.target.value)} style={{ paddingRight: 32, fontSize: 17, fontFamily: 'var(--font-display)' }} />
              <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: THEME.textMuted, fontSize: 14 }}>{CONFIG.currencySymbol}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[10, 25, 50, 100].map((v) => (
                <button key={v} type="button" onClick={() => setAmount(String(v))} className="chip-btn">{v}{CONFIG.currencySymbol}</button>
              ))}
            </div>

            <div className="divider" />

            <Row label="Retorno potencial" value={potentialReturn != null ? formatMoney(potentialReturn) : '—'} big />
            <Row label="Beneficio" value={profit != null ? formatMoney(profit) : '—'} tone={profit > 0 ? 'success' : undefined} />

            {error && <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', background: THEME.dangerSoft, color: THEME.danger, padding: '9px 10px', borderRadius: 8, fontSize: 12.5, marginTop: 12 }}><CircleAlert size={13} style={{ marginTop: 1, flexShrink: 0 }} />{error}</div>}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} disabled={confirming} onClick={confirmBet}>
              {confirming ? <Spinner size={16} /> : 'Confirmar apuesta'}
            </button>
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={() => setSelected(null)}>Cancelar</button>
          </div>
        )}
      </div>

      {myWagersHere.length > 0 && event.status !== 'finished' && (
        <div style={{ marginTop: 36 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 10 }}>Tus apuestas en este evento</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {myWagersHere.map((w, i) => (
              <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: i ? `1px solid ${THEME.border}` : 'none', fontSize: 13.5 }}>
                <span>{options.find((o) => o.id === w.optionId)?.name}</span>
                <span style={{ color: THEME.textSecondary }}>{formatMoney(w.amount)} · cuota {formatOdds(w.oddsAtBet)}</span>
                <span style={{ color: THEME.gold, fontWeight: 600 }}>→ {formatMoney(w.potentialReturn)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsPill({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 10, padding: '9px 13px' }}>
      <Icon size={15} color={THEME.gold} />
      <div>
        <div style={{ fontSize: 10.5, color: THEME.textMuted, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{value}</div>
      </div>
    </div>
  );
}
function Row({ label, value, big, tone }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0' }}>
      <span style={{ fontSize: 12.5, color: THEME.textSecondary }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: big ? 19 : 15, fontWeight: 600, color: tone === 'success' ? THEME.success : THEME.textPrimary }}>{value}</span>
    </div>
  );
}

function OptionRow({ stat, selected, disabled, isWinner, onSelect }) {
  return (
    <div className={`card option-row ${selected ? 'option-row-selected' : ''} ${disabled ? 'option-row-disabled' : ''}`} onClick={disabled ? undefined : onSelect}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: stat.color, flexShrink: 0 }} />
            <span style={{ fontSize: 15.5, fontWeight: 600 }}>{stat.option.name}</span>
            {isWinner && <Badge tone="success" icon={Crown}>Ganadora</Badge>}
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: THEME.textSecondary, marginBottom: 8, flexWrap: 'wrap' }}>
            <span>{formatMoney(stat.amount)} apostados</span>
            <span>{stat.pct.toFixed(1)}% del pool</span>
            <span>{stat.bettors} apostantes</span>
          </div>
          <PoolBar segments={[{ value: stat.pct || 0.0001, color: stat.color }, { value: 100 - (stat.pct || 0), color: THEME.bgElevated }]} />
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 10.5, color: THEME.textMuted, marginBottom: 2 }}>retorno por 1{CONFIG.currencySymbol}</div>
          <OddsBadge odds={stat.odds} size="lg" />
        </div>
      </div>
      {!disabled && (
        <button className={`btn-select ${selected ? 'btn-select-active' : ''}`} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          {selected ? <><Check size={14} /> Seleccionada</> : 'Apostar'}
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   PANTALLA: MIS APUESTAS
   ============================================================================ */
function MyBetsScreen({ currentUser, events, options, wagers, combos, grants }) {
  const myWagers = wagers.filter((w) => w.userId === currentUser.id).sort((a, b) => b.createdAt - a.createdAt);
  const myCombos = (combos || []).filter((c) => c.userId === currentUser.id).sort((a, b) => b.createdAt - a.createdAt);
  const totalStaked = round2(myWagers.reduce((s, w) => s + w.amount, 0));
  const settled = myWagers.filter((w) => events.find((e) => e.id === w.eventId)?.status === 'finished');
  const totalWon = round2(settled.filter((w) => events.find((e) => e.id === w.eventId)?.winningOptionId === w.optionId).reduce((s, w) => s + w.potentialReturn, 0));
  const { granted, balance } = computeBalance(currentUser.id, grants, wagers, combos);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 20px', letterSpacing: '-0.015em' }}>Mis apuestas</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}>
        <StatsPill icon={Wallet} label="Tu saldo disponible" value={formatMoney(balance)} />
        <StatsPill icon={Wallet} label="Tokens recibidos" value={formatMoney(granted)} />
        <StatsPill icon={Wallet} label="Total apostado" value={formatMoney(totalStaked)} />
        <StatsPill icon={History} label="Apuestas realizadas" value={myWagers.length} />
        <StatsPill icon={Trophy} label="Cobrado en finalizadas" value={formatMoney(totalWon)} />
      </div>

      {myWagers.length === 0 ? (
        <EmptyState icon={History} title="Aún no has apostado" subtitle="Explora los eventos activos y lanza tu primera apuesta." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {myWagers.map((w, i) => {
            const ev = events.find((e) => e.id === w.eventId);
            const opt = options.find((o) => o.id === w.optionId);
            const finished = ev?.status === 'finished';
            const won = finished && ev.winningOptionId === w.optionId;
            return (
              <div key={w.id} style={{ padding: '14px 18px', borderTop: i ? `1px solid ${THEME.border}` : 'none', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{ev?.title}</div>
                  <div style={{ fontSize: 12.5, color: THEME.textSecondary }}>Opción: {opt?.name} · cuota {formatOdds(w.oddsAtBet)} · {new Date(w.createdAt).toLocaleDateString('es-ES')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: THEME.textMuted }}>apostado</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{formatMoney(w.amount)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: THEME.textMuted }}>{finished ? (won ? 'cobrado' : 'perdido') : 'retorno potencial'}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: finished ? (won ? THEME.success : THEME.danger) : THEME.gold }}>
                      {finished ? (won ? formatMoney(w.potentialReturn) : formatMoney(0)) : formatMoney(w.potentialReturn)}
                    </div>
                  </div>
                  {finished && <Badge tone={won ? 'success' : 'danger'}>{won ? 'Ganada' : 'Perdida'}</Badge>}
                  {!finished && <Badge tone="teal">En juego</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {myCombos.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '0 0 12px' }}>Tus combinadas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myCombos.map((c) => {
              const status = computeComboStatus(c, events);
              return (
                <div key={c.id} className="card" style={{ padding: 16, borderColor: c.isMega ? THEME.gold : THEME.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.isMega ? <><Flame size={14} color={THEME.gold} /> Mega soñadora</> : `Combinada · ${c.legs.length} apuestas`}
                    </span>
                    <Badge tone={status === 'ganada' ? 'success' : status === 'perdida' ? 'danger' : 'teal'}>
                      {status === 'ganada' ? 'Ganada' : status === 'perdida' ? 'Perdida' : 'Pendiente'}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                    {c.legs.map((l, i) => (
                      <div key={i} style={{ fontSize: 12.5, color: THEME.textSecondary, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{l.eventTitle} → <strong style={{ color: THEME.textPrimary }}>{l.optionName}</strong></span>
                        <span>{formatOdds(l.oddsAtBet)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="divider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: THEME.textSecondary }}>Apostado {formatMoney(c.amount)} · cuota combinada {formatOdds(c.combinedOdds)}</span>
                    <span style={{ fontWeight: 700, color: status === 'ganada' ? THEME.success : status === 'perdida' ? THEME.danger : THEME.gold }}>
                      {status === 'perdida' ? formatMoney(0) : formatMoney(c.potentialReturn)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   PANTALLA: APUESTA COMBINADA
   ============================================================================ */
function ComboScreen({ events, options, wagers, onPlaceCombo, balance }) {
  const [picks, setPicks] = useState({}); // eventId -> optionId
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const openEvents = events.filter((e) => e.status === 'open' && e.deadline > Date.now());
  const legs = Object.entries(picks).filter(([, optId]) => optId);
  const legStats = legs.map(([eventId, optionId]) => {
    const ev = events.find((e) => e.id === eventId);
    const stats = computeEventStats(ev, options, wagers);
    const s = stats.optionStats.find((x) => x.option.id === optionId);
    return { event: ev, stat: s };
  });
  const allOddsKnown = legStats.length >= 2 && legStats.every((l) => l.stat?.odds != null);
  const combinedOdds = allOddsKnown ? round2(legStats.reduce((acc, l) => acc * l.stat.odds, 1)) : null;
  const numAmount = parseFloat(amount.replace(',', '.'));
  const validAmount = Number.isFinite(numAmount) && numAmount >= CONFIG.minBet && numAmount <= CONFIG.maxBet && (balance == null || numAmount <= balance);
  const potentialReturn = validAmount && combinedOdds ? round2(numAmount * combinedOdds) : null;
  const isMega = openEvents.length >= 2 && legs.length === openEvents.length;

  function togglePick(eventId, optionId) {
    setPicks((p) => ({ ...p, [eventId]: p[eventId] === optionId ? null : optionId }));
  }

  async function confirm() {
    setError('');
    if (legs.length < 2) return setError('Elige al menos una opción en 2 eventos distintos.');
    if (!validAmount) {
      if (balance != null && numAmount > balance) return setError(`No tienes suficiente saldo. Te quedan ${formatMoney(balance)} en tokens.`);
      return setError(`Introduce una cantidad entre ${formatMoney(CONFIG.minBet)} y ${formatMoney(CONFIG.maxBet)}.`);
    }
    setBusy(true);
    const res = await onPlaceCombo(legs.map(([eventId, optionId]) => ({ eventId, optionId })), round2(numAmount));
    setBusy(false);
    if (res?.error) return setError(res.error);
    toast(res.isMega ? '🌠 ¡Combinada mega soñadora confirmada!' : 'Combinada confirmada', 'success');
    setPicks({}); setAmount('');
  }

  if (openEvents.length < 2) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 20px' }}>
        <EmptyState icon={Flame} title="Necesitas al menos 2 eventos abiertos" subtitle="Vuelve cuando haya más de una apuesta activa para poder combinarlas." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 100px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 6px', letterSpacing: '-0.015em' }}>Apuesta combinada</h1>
      <p style={{ color: THEME.textSecondary, fontSize: 14, margin: '0 0 6px' }}>Elige una opción en 2 o más eventos abiertos. Las cuotas se multiplican: si aciertas todos, cobras más; si falla uno solo, pierdes la combinada entera.</p>
      <p style={{ color: THEME.textMuted, fontSize: 12.5, margin: '0 0 16px' }}>Si combinas literalmente todos los eventos abiertos, se convierte en la <strong style={{ color: THEME.gold }}>mega soñadora</strong> 🌠</p>
      {balance != null && <div style={{ marginBottom: 20 }}><StatsPill icon={Wallet} label="Tu saldo" value={formatMoney(balance)} /></div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
        {openEvents.map((ev) => {
          const stats = computeEventStats(ev, options, wagers);
          return (
            <div key={ev.id} className="card" style={{ padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 10 }}>{ev.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {stats.optionStats.map((s) => {
                  const active = picks[ev.id] === s.option.id;
                  return (
                    <button key={s.option.id} type="button" onClick={() => togglePick(ev.id, s.option.id)} className={`combo-pill ${active ? 'combo-pill-active' : ''}`}>
                      {s.option.name} <span style={{ opacity: 0.75, marginLeft: 4 }}>{formatOdds(s.odds)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {legs.length > 0 && (
        <div className="card" style={{ padding: 20, borderColor: isMega ? THEME.gold : THEME.border, background: isMega ? THEME.goldSoft : THEME.bgCard }}>
          {isMega && <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: THEME.gold, fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12 }}><Flame size={16} /> Mega soñadora</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
            {legStats.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: THEME.textSecondary }}>{l.event.title}</span>
                <OddsBadge odds={l.stat?.odds} size="sm" />
              </div>
            ))}
          </div>
          <div className="divider" />
          <Row label="Cuota combinada" value={combinedOdds ? formatOdds(combinedOdds) : '—'} big />

          <label style={{ display: 'block', fontSize: 12, color: THEME.textSecondary, fontWeight: 600, margin: '14px 0 6px' }}>Tu apuesta</label>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input className="input" inputMode="decimal" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ paddingRight: 32, fontSize: 17, fontFamily: 'var(--font-display)' }} />
            <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: THEME.textMuted, fontSize: 14 }}>{CONFIG.currencySymbol}</span>
          </div>
          <Row label="Retorno potencial" value={potentialReturn != null ? formatMoney(potentialReturn) : '—'} tone={potentialReturn ? 'success' : undefined} />

          {error && <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', background: THEME.dangerSoft, color: THEME.danger, padding: '9px 10px', borderRadius: 8, fontSize: 12.5, marginTop: 10 }}><CircleAlert size={13} style={{ marginTop: 1, flexShrink: 0 }} />{error}</div>}

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} disabled={busy} onClick={confirm}>
            {busy ? <Spinner size={16} /> : 'Confirmar combinada'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   PANTALLA: RANKING
   ============================================================================ */
function RankingScreen({ users, wagers, combos, events }) {
  const bettors = users.filter((u) => u.role !== 'ADMIN');

  const rows = bettors.map((u) => {
    const myWagers = wagers.filter((w) => w.userId === u.id);
    const myCombos = (combos || []).filter((c) => c.userId === u.id);
    const totalStaked = round2(myWagers.reduce((s, w) => s + w.amount, 0) + myCombos.reduce((s, c) => s + c.amount, 0));

    let netProfit = 0;
    let settledCount = 0;
    myWagers.forEach((w) => {
      const ev = events.find((e) => e.id === w.eventId);
      if (ev?.status === 'finished') {
        settledCount++;
        netProfit += (ev.winningOptionId === w.optionId ? w.potentialReturn : 0) - w.amount;
      }
    });
    myCombos.forEach((c) => {
      const status = computeComboStatus(c, events);
      if (status !== 'pendiente') {
        settledCount++;
        netProfit += (status === 'ganada' ? c.potentialReturn : 0) - c.amount;
      }
    });

    const biggestBet = [...myWagers, ...myCombos].reduce((max, b) => (b.amount > (max?.amount ?? -1) ? b : max), null);
    return { user: u, totalStaked, netProfit: round2(netProfit), settledCount, betCount: myWagers.length + myCombos.length, biggestBet };
  }).filter((r) => r.betCount > 0);

  const byProfit = [...rows].sort((a, b) => b.netProfit - a.netProfit);
  const byActivity = [...rows].sort((a, b) => b.totalStaked - a.totalStaked);
  const riskiest = [...rows].filter((r) => r.biggestBet).sort((a, b) => b.biggestBet.amount - a.biggestBet.amount)[0];
  const megaCount = (combos || []).filter((c) => c.isMega).length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 90px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 6px', letterSpacing: '-0.015em' }}>Ranking del grupo</h1>
      <p style={{ color: THEME.textSecondary, fontSize: 14, margin: '0 0 26px' }}>Quién va ganando (y quién se está jugando más de lo que debería).</p>

      {rows.length === 0 ? (
        <EmptyState icon={Medal} title="Todavía no hay suficientes apuestas" subtitle="El ranking aparecerá en cuanto la gente empiece a apostar." />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 30 }}>
            {riskiest && <StatCard icon={Flame} label={`Apuesta más arriesgada (${riskiest.user.name})`} value={formatMoney(riskiest.biggestBet.amount)} />}
            <StatCard icon={Sparkles} label="Mega soñadoras lanzadas" value={megaCount} />
            <StatCard icon={TrendingUp} label="Apostadores activos" value={rows.length} />
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: THEME.textSecondary, marginBottom: 10 }}>Beneficio neto (eventos ya resueltos)</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 28 }}>
            {byProfit.map((r, i) => (
              <div key={r.user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i ? `1px solid ${THEME.border}` : 'none' }}>
                <RankBadge place={i + 1} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.user.name}</div>
                  <div style={{ fontSize: 12, color: THEME.textMuted }}>{r.settledCount} resueltas de {r.betCount} apuestas</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: r.netProfit > 0 ? THEME.success : r.netProfit < 0 ? THEME.danger : THEME.textSecondary }}>
                  {r.netProfit > 0 ? '+' : ''}{formatMoney(r.netProfit)}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: THEME.textSecondary, marginBottom: 10 }}>Más activos (dinero total en juego)</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {byActivity.map((r, i) => (
              <div key={r.user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i ? `1px solid ${THEME.border}` : 'none' }}>
                <span style={{ width: 22, textAlign: 'center', color: THEME.textMuted, fontSize: 12.5, fontWeight: 700 }}>{i + 1}</span>
                <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{r.user.name}</div>
                <div style={{ fontSize: 13, color: THEME.gold, fontWeight: 700 }}>{formatMoney(r.totalStaked)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function RankBadge({ place }) {
  const styles = {
    1: { bg: 'linear-gradient(150deg,#F0CB68,#B9862B)', color: '#141414', icon: Crown },
    2: { bg: 'linear-gradient(150deg,#D7DBE3,#9AA1AE)', color: '#141414', icon: Medal },
    3: { bg: 'linear-gradient(150deg,#D8A06B,#9C6636)', color: '#141414', icon: Award },
  };
  const s = styles[place];
  if (!s) return <span style={{ width: 26, textAlign: 'center', color: THEME.textMuted, fontSize: 12.5, fontWeight: 700 }}>{place}</span>;
  const Icon = s.icon;
  return (
    <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={13} color={s.color} />
    </div>
  );
}

/* ============================================================================
   PANTALLA: CÓMO FUNCIONA (AYUDA)
   ============================================================================ */
const HELP_ITEMS = [
  { q: '¿Cómo se calcula la cuota de cada opción?', a: 'Se reparte todo el dinero apostado en un evento entre quienes acierten. La cuota de una opción es el dinero total del evento dividido entre el dinero apostado en esa opción. Cuanto menos dinero tenga una opción, más alta es su cuota (y más se cobra si gana). Se recalcula sola cada vez que alguien apuesta.' },
  { q: '¿Qué son los tokens y de dónde salen?', a: 'Son el saldo con el que apuestas dentro de la web. El organizador te los da después de que le pagues en efectivo, y ese dinero va a un bote común que luego se reparte entre quienes acierten.' },
  { q: '¿Qué pasa si intento apostar más tokens de los que tengo?', a: 'La apuesta se bloquea automáticamente y te avisa de cuánto saldo te queda. No puedes apostar por encima de lo que el organizador te haya dado.' },
  { q: '¿Cómo funciona una combinada?', a: 'Eliges una opción en 2 o más eventos abiertos. Las cuotas de cada una se multiplican entre sí. Si aciertas todas, cobras el resultado; si falla una sola, pierdes el boleto entero.' },
  { q: '¿Qué es la mega soñadora?', a: 'Es una combinada que incluye absolutamente todos los eventos abiertos en ese momento. Al ser la combinación más difícil de acertar, también es la que más paga si sale bien.' },
  { q: '¿Cuándo se cierra una apuesta?', a: 'En cuanto llega la fecha límite del evento, o si el organizador la cierra manualmente antes. Pasado ese momento ya no se puede apostar más en ella.' },
  { q: '¿Cómo se decide quién gana?', a: 'El organizador marca a mano la opción ganadora en cuanto se confirma el resultado real. En ese momento el evento pasa a "Finalizada" y se calcula automáticamente cuánto le toca cobrar a cada participante.' },
];
function HelpScreen() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <HelpCircle size={22} color={THEME.gold} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0, letterSpacing: '-0.015em' }}>Cómo funciona</h1>
      </div>
      <p style={{ color: THEME.textSecondary, fontSize: 14, margin: '0 0 26px' }}>Lo esencial para apostar sin sorpresas.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {HELP_ITEMS.map((item, i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button className="accordion-head" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{item.q}</span>
              <ChevronDown size={16} style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform .18s', flexShrink: 0 }} />
            </button>
            {open === i && <div style={{ padding: '0 18px 16px', color: THEME.textSecondary, fontSize: 13.5, lineHeight: 1.6 }}>{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   PANEL DE ORGANIZADOR (ADMIN)
   ============================================================================ */
function AdminDashboard(props) {
  const { events, options, wagers, users, combos, grants, onSaveEvent, onDeleteEvent, onCloseEvent, onDeclareWinner } = props;
  const [tab, setTab] = useState('resumen');
  const [editingEvent, setEditingEvent] = useState(null); // null | 'new' | event object
  const [viewEventId, setViewEventId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmWinner, setConfirmWinner] = useState(null);

  const totalPool = round2(wagers.reduce((s, w) => s + w.amount, 0));
  const activeEvents = events.filter((e) => e.status === 'open').length;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Shield size={20} color={THEME.gold} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: 0, letterSpacing: '-0.015em' }}>Panel del organizador</h1>
      </div>
      <p style={{ color: THEME.textSecondary, fontSize: 13.5, margin: '0 0 22px' }}>Gestiona eventos, revisa apuestas y declara ganadores.</p>

      <div style={{ display: 'flex', gap: 6, borderBottom: `1px solid ${THEME.border}`, marginBottom: 22 }}>
        {[['resumen', 'Resumen'], ['eventos', 'Eventos'], ['apuestas', 'Apuestas'], ['combinadas', 'Combinadas'], ['tokens', 'Usuarios y tokens']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px', marginRight: 18, fontSize: 14,
            fontWeight: 600, color: tab === k ? THEME.textPrimary : THEME.textMuted, borderBottom: tab === k ? `2px solid ${THEME.gold}` : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'resumen' && (
        <ResumenTab events={events} wagers={wagers} users={users} options={options} totalPool={totalPool} activeEvents={activeEvents} />
      )}

      {tab === 'eventos' && !viewEventId && (
        <EventosTab
          events={events} options={options} wagers={wagers}
          onCreate={() => setEditingEvent('new')}
          onEdit={(ev) => setEditingEvent(ev)}
          onDelete={(ev) => setConfirmDelete(ev)}
          onClose={onCloseEvent}
          onView={(id) => setViewEventId(id)}
          onDeclareWinner={(ev, optId) => setConfirmWinner({ ev, optId })}
        />
      )}

      {tab === 'eventos' && viewEventId && (
        <EventVistaDetalle
          event={events.find((e) => e.id === viewEventId)}
          options={options} wagers={wagers} users={users}
          onBack={() => setViewEventId(null)}
        />
      )}

      {tab === 'apuestas' && <ApuestasTab wagers={wagers} events={events} options={options} />}

      {tab === 'combinadas' && <CombinadasTab combos={combos} events={events} />}

      {tab === 'tokens' && (
        <TokensTab
          users={users} grants={grants} wagers={wagers} combos={combos}
          onGrantTokens={props.onGrantTokens} onDistributeToAll={props.onDistributeToAll}
          onDeductTokens={props.onDeductTokens} onDeleteUser={props.onDeleteUser}
        />
      )}

      <Modal open={!!editingEvent} onClose={() => setEditingEvent(null)} title={editingEvent === 'new' ? 'Nuevo evento' : `Editar "${editingEvent?.title ?? ''}"`} width={560}>
        {editingEvent && (
          <EventEditor
            initial={editingEvent === 'new' ? null : editingEvent}
            initialOptions={editingEvent === 'new' ? [] : options.filter((o) => o.eventId === editingEvent.id)}
            onCancel={() => setEditingEvent(null)}
            onSave={async (payload) => { await onSaveEvent(payload); setEditingEvent(null); }}
          />
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar evento" width={380}>
        <p style={{ color: THEME.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
          ¿Seguro que quieres eliminar <strong style={{ color: THEME.textPrimary }}>{confirmDelete?.title}</strong>? Se eliminarán también sus opciones y el historial de apuestas asociado. Esta acción no se puede deshacer.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>Cancelar</button>
          <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={async () => { await onDeleteEvent(confirmDelete.id); setConfirmDelete(null); }}>Eliminar</button>
        </div>
      </Modal>

      <Modal open={!!confirmWinner} onClose={() => setConfirmWinner(null)} title="Declarar ganadora" width={380}>
        <p style={{ color: THEME.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
          Esto finalizará el evento, bloqueará nuevas apuestas y calculará los cobros de cada participante. ¿Confirmar como opción ganadora?
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmWinner(null)}>Cancelar</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={async () => { await onDeclareWinner(confirmWinner.ev.id, confirmWinner.optId); setConfirmWinner(null); }}>Confirmar</button>
        </div>
      </Modal>
    </div>
  );
}

function ResumenTab({ events, wagers, users, totalPool, activeEvents }) {
  const recent = [...wagers].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 26 }}>
        <StatCard icon={Wallet} label="Dinero total apostado" value={formatMoney(totalPool)} />
        <StatCard icon={Users} label="Usuarios registrados" value={users.length} />
        <StatCard icon={Trophy} label="Eventos totales" value={events.length} />
        <StatCard icon={Target} label="Eventos activos" value={activeEvents} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 10 }}>Últimas apuestas</h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {recent.length === 0 ? <EmptyState icon={History} title="Todavía no hay apuestas" /> : recent.map((w, i) => (
          <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, padding: '12px 16px', borderTop: i ? `1px solid ${THEME.border}` : 'none', fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{w.userName}</span>
            <span style={{ color: THEME.textSecondary }}>{events.find((e) => e.id === w.eventId)?.title}</span>
            <span style={{ color: THEME.gold, fontWeight: 600 }}>{formatMoney(w.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <Icon size={16} color={THEME.gold} style={{ marginBottom: 10 }} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginBottom: 2, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 12, color: THEME.textMuted }}>{label}</div>
    </div>
  );
}

function EventosTab({ events, options, wagers, onCreate, onEdit, onDelete, onClose, onView, onDeclareWinner }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button className="btn-primary" onClick={onCreate}><Plus size={15} /> Nuevo evento</button>
      </div>
      {events.length === 0 ? <EmptyState icon={Trophy} title="No hay eventos todavía" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {events.map((ev) => {
            const stats = computeEventStats(ev, options, wagers);
            return (
              <div key={ev.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 220, cursor: 'pointer' }} onClick={() => onView(ev.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{ev.title}</span>
                      <Badge tone={ev.status === 'finished' ? 'success' : ev.status === 'open' ? 'teal' : 'danger'}>
                        {ev.status === 'finished' ? 'Finalizada' : ev.status === 'open' ? 'Abierta' : 'Cerrada'}
                      </Badge>
                    </div>
                    <div style={{ fontSize: 12.5, color: THEME.textSecondary }}>{formatMoney(stats.totalPool)} · {stats.participants} participantes · {stats.evOptions.length} opciones</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {ev.status !== 'finished' && (
                      <>
                        <button className="btn-small" onClick={() => onEdit(ev)}><Pencil size={13} /> Editar</button>
                        {ev.status === 'open' && <button className="btn-small" onClick={() => onClose(ev.id)}>Cerrar apuestas</button>}
                        <WinnerPicker options={stats.evOptions} onPick={(optId) => onDeclareWinner(ev, optId)} />
                      </>
                    )}
                    <button className="btn-small btn-small-danger" onClick={() => onDelete(ev)}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
function WinnerPicker({ options, onPick }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button className="btn-small btn-small-gold" onClick={() => setOpen((o) => !o)}><Crown size={13} /> Marcar ganadora</button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '110%', zIndex: 20, background: THEME.bgElevated, border: `1px solid ${THEME.borderStrong}`, borderRadius: 10, minWidth: 160, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
          {options.map((o) => (
            <div key={o.id} onClick={() => { setOpen(false); onPick(o.id); }} style={{ padding: '9px 12px', fontSize: 13, cursor: 'pointer' }} className="dropdown-item">{o.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventVistaDetalle({ event, options, wagers, users, onBack }) {
  if (!event) return null;
  const stats = computeEventStats(event, options, wagers);
  return (
    <div>
      <button className="icon-btn" onClick={onBack} style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, width: 'auto', padding: '7px 12px', fontSize: 13 }}>
        <ArrowLeft size={15} /> Volver a eventos
      </button>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>{event.title}</h2>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatsPill icon={Wallet} label="Pool total" value={formatMoney(stats.totalPool)} />
        <StatsPill icon={Users} label="Participantes" value={stats.participants} />
        <StatsPill icon={BarChart3} label="Opciones" value={stats.evOptions.length} />
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: THEME.textSecondary }}>Distribución del pool</h3>
      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        {stats.optionStats.map((s) => (
          <div key={s.option.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />{s.option.name}</span>
              <span style={{ color: THEME.textSecondary }}>{formatMoney(s.amount)} · {s.pct.toFixed(1)}% · <OddsBadge odds={s.odds} size="sm" /></span>
            </div>
            <PoolBar segments={[{ value: s.pct || 0.0001, color: s.color }, { value: 100 - (s.pct || 0), color: THEME.bgElevated }]} />
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: THEME.textSecondary }}>Participantes</h3>
      <ParticipantsTable event={event} wagers={stats.evWagers} options={options} />
    </div>
  );
}

function ParticipantsTable({ event, wagers, options }) {
  const byUser = {};
  wagers.forEach((w) => {
    if (!byUser[w.userId]) byUser[w.userId] = { userName: w.userName, total: 0, bets: [] };
    byUser[w.userId].total = round2(byUser[w.userId].total + w.amount);
    byUser[w.userId].bets.push(w);
  });
  const rows = Object.values(byUser).sort((a, b) => b.total - a.total);
  if (rows.length === 0) return <EmptyState icon={Users} title="Sin participantes todavía" />;
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-head">
        <span>Participante</span><span>Opción(es)</span><span>Total apostado</span><span>Retorno potencial</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="table-row">
          <span style={{ fontWeight: 600 }}>{r.userName}</span>
          <span style={{ color: THEME.textSecondary }}>{r.bets.map((b) => options.find((o) => o.id === b.optionId)?.name).join(', ')}</span>
          <span>{formatMoney(r.total)}</span>
          <span style={{ color: THEME.gold, fontWeight: 600 }}>{formatMoney(round2(r.bets.reduce((s, b) => s + b.potentialReturn, 0)))}</span>
        </div>
      ))}
    </div>
  );
}

function ApuestasTab({ wagers, events, options }) {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [query, setQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  const filtered = wagers.filter((w) => {
    if (eventFilter !== 'all' && w.eventId !== eventFilter) return false;
    if (query && !w.userName.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'amount') return (a.amount - b.amount) * dir;
    if (sortBy === 'userName') return a.userName.localeCompare(b.userName) * dir;
    return (a.createdAt - b.createdAt) * dir;
  });

  function toggleSort(key) {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(key); setSortDir('desc'); }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: THEME.textMuted }} />
          <input className="input" placeholder="Buscar por usuario…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <select className="input" style={{ maxWidth: 220 }} value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="all">Todos los eventos</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      {sorted.length === 0 ? <EmptyState icon={History} title="No se encontraron apuestas" /> : (
        <div className="card" style={{ padding: 0, overflow: 'auto' }}>
          <div className="table-head" style={{ gridTemplateColumns: '1.2fr 1.6fr 1fr 0.8fr 0.8fr 0.9fr 1fr', minWidth: 720 }}>
            <span className="sortable" onClick={() => toggleSort('userName')}>Usuario <ArrowUpDown size={11} /></span>
            <span>Evento</span><span>Opción</span>
            <span className="sortable" onClick={() => toggleSort('amount')}>Cantidad <ArrowUpDown size={11} /></span>
            <span>Cuota</span><span>Retorno pot.</span>
            <span className="sortable" onClick={() => toggleSort('createdAt')}>Fecha <ArrowUpDown size={11} /></span>
          </div>
          {sorted.map((w) => (
            <div key={w.id} className="table-row" style={{ gridTemplateColumns: '1.2fr 1.6fr 1fr 0.8fr 0.8fr 0.9fr 1fr', minWidth: 720 }}>
              <span style={{ fontWeight: 600 }}>{w.userName}</span>
              <span style={{ color: THEME.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{events.find((e) => e.id === w.eventId)?.title}</span>
              <span>{options.find((o) => o.id === w.optionId)?.name}</span>
              <span>{formatMoney(w.amount)}</span>
              <span>{formatOdds(w.oddsAtBet)}</span>
              <span style={{ color: THEME.gold, fontWeight: 600 }}>{formatMoney(w.potentialReturn)}</span>
              <span style={{ color: THEME.textMuted, fontSize: 12 }}>{new Date(w.createdAt).toLocaleDateString('es-ES')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CombinadasTab({ combos, events }) {
  const sorted = [...(combos || [])].sort((a, b) => b.createdAt - a.createdAt);
  if (sorted.length === 0) return <EmptyState icon={Flame} title="Todavía no hay combinadas" subtitle="Aparecerán aquí en cuanto alguien combine dos o más apuestas." />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sorted.map((c) => {
        const status = computeComboStatus(c, events);
        return (
          <div key={c.id} className="card" style={{ padding: 16, borderColor: c.isMega ? THEME.gold : THEME.border }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                {c.isMega && <Flame size={14} color={THEME.gold} />} {c.userName} · {c.isMega ? 'Mega soñadora' : `Combinada (${c.legs.length})`}
              </span>
              <Badge tone={status === 'ganada' ? 'success' : status === 'perdida' ? 'danger' : 'teal'}>
                {status === 'ganada' ? 'Ganada' : status === 'perdida' ? 'Perdida' : 'Pendiente'}
              </Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
              {c.legs.map((l, i) => (
                <div key={i} style={{ fontSize: 12.5, color: THEME.textSecondary, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{l.eventTitle} → <strong style={{ color: THEME.textPrimary }}>{l.optionName}</strong></span>
                  <span>{formatOdds(l.oddsAtBet)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingTop: 8 }}>
              <span style={{ color: THEME.textSecondary }}>Apostado {formatMoney(c.amount)} · cuota combinada {formatOdds(c.combinedOdds)}</span>
              <span style={{ fontWeight: 700, color: THEME.gold }}>→ {formatMoney(c.potentialReturn)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TokensTab({ users, grants, wagers, combos, onGrantTokens, onDistributeToAll, onDeductTokens, onDeleteUser }) {
  const [grantUserId, setGrantUserId] = useState(users[0]?.id ?? '');
  const [grantAmount, setGrantAmount] = useState('');
  const [grantNote, setGrantNote] = useState('');
  const [grantMode, setGrantMode] = useState('add'); // 'add' | 'remove'
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkNote, setBulkNote] = useState('');
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const bote = round2((grants || []).reduce((s, g) => s + g.amount, 0));
  const repartidoEnApuestas = round2(
    (wagers || []).reduce((s, w) => s + w.amount, 0) + (combos || []).reduce((s, c) => s + c.amount, 0)
  );

  async function submitGrant(e) {
    e.preventDefault();
    setError('');
    const amt = parseFloat(String(grantAmount).replace(',', '.'));
    if (!grantUserId) return setError('Elige un participante.');
    if (!Number.isFinite(amt) || amt <= 0) return setError('Cantidad no válida.');
    setBusy(true);
    const res = grantMode === 'add' ? await onGrantTokens(grantUserId, round2(amt), grantNote.trim()) : await onDeductTokens(grantUserId, round2(amt), grantNote.trim());
    setBusy(false);
    if (res?.error) return setError(res.error);
    const name = users.find((u) => u.id === grantUserId)?.name;
    toast(grantMode === 'add' ? `Tokens añadidos a ${name}` : `Tokens retirados a ${name}`, 'success');
    setGrantAmount(''); setGrantNote('');
  }

  async function quickDeduct(userId, amount) {
    setError('');
    const res = await onDeductTokens(userId, amount, 'Ajuste rápido');
    if (res?.error) return setError(res.error);
    toast('Saldo actualizado', 'success');
  }

  async function submitBulk() {
    const amt = parseFloat(String(bulkAmount).replace(',', '.'));
    if (!Number.isFinite(amt) || amt <= 0) return setError('Cantidad no válida.');
    setBusy(true);
    const res = await onDistributeToAll(round2(amt), bulkNote.trim());
    setBusy(false);
    setConfirmBulk(false);
    if (res?.error) return setError(res.error);
    toast(`${formatMoney(amt)} repartidos a ${res.count} participantes`, 'success');
    setBulkAmount(''); setBulkNote('');
  }

  async function confirmDelete() {
    setBusy(true);
    const res = await onDeleteUser(confirmDeleteUser.id);
    setBusy(false);
    setConfirmDeleteUser(null);
    if (res?.error) return setError(res.error);
    toast(`Cuenta de ${confirmDeleteUser.name} eliminada`, 'success');
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard icon={Wallet} label="Bote total (cobrado en efectivo)" value={formatMoney(bote)} />
        <StatCard icon={Target} label="Repartido en apuestas" value={formatMoney(repartidoEnApuestas)} />
        <StatCard icon={History} label="Sin usar todavía" value={formatMoney(round2(bote - repartidoEnApuestas))} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 26 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{grantMode === 'add' ? 'Dar tokens' : 'Quitar tokens'}</h3>
            <div style={{ display: 'flex', background: THEME.bgElevated, borderRadius: 8, padding: 2 }}>
              <button type="button" onClick={() => setGrantMode('add')} className={`mode-pill ${grantMode === 'add' ? 'mode-pill-active' : ''}`}>+ Dar</button>
              <button type="button" onClick={() => setGrantMode('remove')} className={`mode-pill ${grantMode === 'remove' ? 'mode-pill-active-danger' : ''}`}>− Quitar</button>
            </div>
          </div>
          <form onSubmit={submitGrant} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select className="input" value={grantUserId} onChange={(e) => setGrantUserId(e.target.value)}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}{u.role === 'ADMIN' ? ' (organizador)' : ''}</option>)}
            </select>
            <input className="input" inputMode="decimal" placeholder={grantMode === 'add' ? 'Cantidad recibida en efectivo (€)' : 'Cantidad a quitar (€)'} value={grantAmount} onChange={(e) => setGrantAmount(e.target.value)} />
            <input className="input" placeholder="Nota (opcional)" value={grantNote} onChange={(e) => setGrantNote(e.target.value)} />
            <button className={grantMode === 'add' ? 'btn-primary' : 'btn-danger'} type="submit" disabled={busy} style={{ justifyContent: 'center' }}>
              {busy ? <Spinner size={16} /> : grantMode === 'add' ? 'Dar tokens' : 'Quitar tokens'}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>Repartir a todo el mundo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="input" inputMode="decimal" placeholder="Cantidad por persona (€)" value={bulkAmount} onChange={(e) => setBulkAmount(e.target.value)} />
            <input className="input" placeholder="Nota (opcional)" value={bulkNote} onChange={(e) => setBulkNote(e.target.value)} />
            <button className="btn-primary" type="button" disabled={busy || !bulkAmount} style={{ justifyContent: 'center' }} onClick={() => setConfirmBulk(true)}>
              Repartir a los {users.length} participantes
            </button>
            <p style={{ fontSize: 11.5, color: THEME.textMuted, margin: 0 }}>Se añaden tokens a todas las cuentas registradas, incluida la tuya.</p>
          </div>
        </div>
      </div>

      {error && <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', background: THEME.dangerSoft, color: THEME.danger, padding: '9px 10px', borderRadius: 8, fontSize: 12.5, marginBottom: 16 }}><CircleAlert size={13} style={{ marginTop: 1, flexShrink: 0 }} />{error}</div>}

      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: THEME.textSecondary }}>Todos los participantes</h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-head" style={{ gridTemplateColumns: '1.2fr 0.9fr 0.9fr 0.9fr 1.1fr' }}>
          <span>Participante</span><span>Recibido</span><span>Apostado</span><span>Saldo</span><span>Acciones</span>
        </div>
        {users.map((u) => {
          const b = computeBalance(u.id, grants, wagers, combos);
          return (
            <div key={u.id} className="table-row" style={{ gridTemplateColumns: '1.2fr 0.9fr 0.9fr 0.9fr 1.1fr' }}>
              <span style={{ fontWeight: 600 }}>{u.name}{u.role === 'ADMIN' && <span style={{ color: THEME.textMuted, fontWeight: 400 }}> · organizador</span>}</span>
              <span>{formatMoney(b.granted)}</span>
              <span>{formatMoney(b.staked)}</span>
              <span style={{ color: b.balance >= 0 ? THEME.textPrimary : THEME.danger, fontWeight: 600 }}>{formatMoney(b.balance)}</span>
              <span style={{ display: 'flex', gap: 6 }}>
                <button className="btn-small" title="Quitar 5€" onClick={() => quickDeduct(u.id, 5)} disabled={b.balance < 5}>−5€</button>
                {u.role !== 'ADMIN' && (
                  <button className="btn-small btn-small-danger" title="Eliminar cuenta" onClick={() => setConfirmDeleteUser(u)}><Trash2 size={13} /></button>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <Modal open={confirmBulk} onClose={() => setConfirmBulk(false)} title="Repartir tokens a todos" width={380}>
        <p style={{ color: THEME.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
          Vas a dar <strong style={{ color: THEME.textPrimary }}>{formatMoney(parseFloat(String(bulkAmount).replace(',', '.')) || 0)}</strong> en tokens a cada uno de los {users.length} participantes registrados. Recuerda cobrar ese dinero en efectivo antes de confirmar: va al bote común.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmBulk(false)}>Cancelar</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={busy} onClick={submitBulk}>{busy ? <Spinner size={16} /> : 'Confirmar reparto'}</button>
        </div>
      </Modal>

      <Modal open={!!confirmDeleteUser} onClose={() => setConfirmDeleteUser(null)} title="Eliminar cuenta" width={380}>
        <p style={{ color: THEME.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
          ¿Seguro que quieres eliminar a <strong style={{ color: THEME.textPrimary }}>{confirmDeleteUser?.name}</strong>? Se borran también todas sus apuestas, combinadas y tokens. No se puede deshacer.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDeleteUser(null)}>Cancelar</button>
          <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} disabled={busy} onClick={confirmDelete}>{busy ? <Spinner size={16} /> : 'Eliminar'}</button>
        </div>
      </Modal>
    </div>
  );
}

/* ============================================================================
   EDITOR DE EVENTOS (crear / editar evento + opciones)
   ============================================================================ */
function EventEditor({ initial, initialOptions, onCancel, onSave }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [deadline, setDeadline] = useState(initial ? toLocalInput(initial.deadline) : toLocalInput(Date.now() + 86400000 * 2));
  const [opts, setOpts] = useState(initialOptions.length ? initialOptions.map((o) => ({ ...o })) : [{ id: uid('opt'), name: '', description: '' }, { id: uid('opt'), name: '', description: '' }]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function toLocalInput(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function updateOpt(id, field, value) { setOpts((os) => os.map((o) => (o.id === id ? { ...o, [field]: value } : o))); }
  function addOpt() { setOpts((os) => [...os, { id: uid('opt'), name: '', description: '' }]); }
  function removeOpt(id) { setOpts((os) => os.filter((o) => o.id !== id)); }

  async function save() {
    setError('');
    if (!title.trim()) return setError('El evento necesita un título.');
    const cleanOpts = opts.map((o) => ({ ...o, name: o.name.trim() })).filter((o) => o.name);
    if (cleanOpts.length < 2) return setError('Añade al menos 2 opciones con nombre.');
    const deadlineTs = new Date(deadline).getTime();
    if (!deadlineTs || isNaN(deadlineTs)) return setError('Fecha límite no válida.');
    setBusy(true);
    await onSave({ event: { id: initial?.id, title: title.trim(), description: description.trim(), deadline: deadlineTs }, options: cleanOpts });
    setBusy(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field icon={Trophy} label="Título del evento">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="¿Quién ganará...?" />
      </Field>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 12, color: THEME.textSecondary, fontWeight: 600 }}>Descripción</span>
        <textarea className="input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve contexto para los participantes" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
      </label>
      <Field icon={Clock} label="Fecha límite">
        <input className="input" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </Field>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: THEME.textSecondary, fontWeight: 600 }}>Opciones</span>
          <button className="btn-small" onClick={addOpt}><Plus size={13} /> Añadir opción</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {opts.map((o) => (
            <div key={o.id} style={{ display: 'flex', gap: 8 }}>
              <input className="input" value={o.name} onChange={(e) => updateOpt(o.id, 'name', e.target.value)} placeholder="Nombre de la opción" />
              <button className="icon-btn" onClick={() => removeOpt(o.id)}><X size={15} /></button>
            </div>
          ))}
        </div>
      </div>

      {error && <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', background: THEME.dangerSoft, color: THEME.danger, padding: '9px 10px', borderRadius: 8, fontSize: 12.5 }}><CircleAlert size={13} style={{ marginTop: 1, flexShrink: 0 }} />{error}</div>}

      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={busy} onClick={save}>{busy ? <Spinner size={16} /> : 'Guardar evento'}</button>
      </div>
    </div>
  );
}

/* ============================================================================
   APP PRINCIPAL
   ============================================================================ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [options, setOptions] = useState([]);
  const [wagers, setWagers] = useState([]);
  const [combos, setCombos] = useState([]);
  const [grants, setGrants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState('home');
  const [activeEventId, setActiveEventId] = useState(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => { init(); }, []);

  async function init() {
    let cfg = await storageGet(KEYS.config);
    let u = await storageGet(KEYS.users);
    let e = await storageGet(KEYS.events);
    let o = await storageGet(KEYS.options);
    let w = await storageGet(KEYS.wagers);
    let c = await storageGet(KEYS.combos);
    let g = await storageGet(KEYS.grants);

    if (!cfg?.seeded || cfg.version !== SEED_VERSION) {
      const seed = buildSeedData();
      // Si ya había usuarios reales registrados, los conservamos; solo se
      // renuevan los eventos/opciones/apuestas de ejemplo.
      const keepUsers = u && u.length ? u : seed.users;
      await storageSet(KEYS.config, seed.config);
      await storageSet(KEYS.users, keepUsers);
      await storageSet(KEYS.events, seed.events);
      await storageSet(KEYS.options, seed.options);
      await storageSet(KEYS.wagers, seed.wagers);
      await storageSet(KEYS.combos, seed.combos);
      u = keepUsers; e = seed.events; o = seed.options; w = seed.wagers; c = seed.combos;
      // Los tokens ya repartidos por el organizador NO se tocan al recargar eventos.
      if (!g) { await storageSet(KEYS.grants, seed.grants); g = seed.grants; }
    }
    setUsers(u || []); setEvents(e || []); setOptions(o || []); setWagers(w || []); setCombos(c || []); setGrants(g || []);

    const sessionUserId = localStorage.getItem('latimba:session');
    if (sessionUserId) {
      const found = (u || []).find((usr) => usr.id === sessionUserId);
      if (found) setCurrentUser(found);
    }
    setLoading(false);
  }

  async function refreshWagers() { const w = await storageGet(KEYS.wagers); setWagers(w || []); return w || []; }
  async function refreshEvents() { const e = await storageGet(KEYS.events); setEvents(e || []); return e || []; }
  async function refreshGrants() { const g = await storageGet(KEYS.grants); setGrants(g || []); return g || []; }

  async function handleLogin(user) {
    setCurrentUser(user);
    localStorage.setItem('latimba:session', user.id);
    setScreen('home');
  }
  async function handleRegister({ name, email, password }) {
    const newUser = { id: uid('usr'), name, email, passwordHash: hashPassword(password), role: 'USER', createdAt: Date.now() };
    const latest = (await storageGet(KEYS.users)) || users;
    const updated = [...latest, newUser];
    await storageSet(KEYS.users, updated);
    setUsers(updated);
    await handleLogin(newUser);
  }
  async function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem('latimba:session');
    setScreen('home');
  }

  function openEvent(id) { setActiveEventId(id); setScreen('event'); }

  async function placeBet(eventId, optionId, amount, oddsAtBet) {
    // Verificación de permisos y de estado, no solo en la interfaz.
    if (!currentUser) return { error: 'Debes iniciar sesión.' };
    const latestEvents = await refreshEvents();
    const ev = latestEvents.find((e) => e.id === eventId);
    if (!ev || ev.status !== 'open' || ev.deadline <= Date.now()) return { error: 'Este evento ya no admite apuestas.' };
    if (!amount || amount < CONFIG.minBet || amount > CONFIG.maxBet) return { error: 'Cantidad no válida.' };

    const latestGrants = await refreshGrants();
    const latestWagersForBalance = await refreshWagers();
    const latestCombosForBalance = (await storageGet(KEYS.combos)) || combos;
    const { balance } = computeBalance(currentUser.id, latestGrants, latestWagersForBalance, latestCombosForBalance);
    if (amount > balance) return { error: `No tienes suficiente saldo. Te quedan ${formatMoney(balance)} en tokens.` };

    const latestWagers = latestWagersForBalance;
    const wager = {
      id: uid('wag'), userId: currentUser.id, userName: currentUser.name, eventId, optionId,
      amount: round2(amount), oddsAtBet: round2(oddsAtBet), potentialReturn: round2(amount * oddsAtBet), createdAt: Date.now(),
    };
    const updated = [...latestWagers, wager];
    const ok = await storageSet(KEYS.wagers, updated);
    if (!ok) return { error: 'No se pudo guardar la apuesta. Inténtalo de nuevo.' };
    setWagers(updated);
    return { ok: true };
  }

  async function placeCombo(legs, amount) {
    // legs: [{ eventId, optionId }]. Se recalcula todo contra el estado más
    // reciente para no fiarnos de cuotas ya obsoletas en pantalla.
    if (!currentUser) return { error: 'Debes iniciar sesión.' };
    if (!legs || legs.length < 2) return { error: 'Una combinada necesita al menos 2 apuestas.' };
    if (!amount || amount < CONFIG.minBet || amount > CONFIG.maxBet) return { error: 'Cantidad no válida.' };

    const latestGrants = await refreshGrants();
    const latestEvents = await refreshEvents();
    const latestWagers = await refreshWagers();
    const latestCombos = (await storageGet(KEYS.combos)) || combos;
    const { balance } = computeBalance(currentUser.id, latestGrants, latestWagers, latestCombos);
    if (amount > balance) return { error: `No tienes suficiente saldo. Te quedan ${formatMoney(balance)} en tokens.` };

    const openEvents = latestEvents.filter((e) => e.status === 'open' && e.deadline > Date.now());

    const resolvedLegs = [];
    for (const leg of legs) {
      const ev = latestEvents.find((e) => e.id === leg.eventId);
      if (!ev || ev.status !== 'open' || ev.deadline <= Date.now()) return { error: `El evento "${ev?.title ?? ''}" ya no admite apuestas.` };
      const opt = options.find((o) => o.id === leg.optionId && o.eventId === leg.eventId);
      if (!opt) return { error: 'Una de las opciones seleccionadas ya no existe.' };
      const stats = computeEventStats(ev, options, latestWagers);
      const s = stats.optionStats.find((x) => x.option.id === opt.id);
      if (!s || s.odds == null) return { error: `"${opt.name}" no tiene cuota todavía (sin apuestas en esa opción).` };
      resolvedLegs.push({ eventId: ev.id, eventTitle: ev.title, optionId: opt.id, optionName: opt.name, oddsAtBet: round2(s.odds) });
    }

    const combinedOdds = round2(resolvedLegs.reduce((acc, l) => acc * l.oddsAtBet, 1));
    const isMega = openEvents.length >= 2 && resolvedLegs.length === openEvents.length;
    const combo = {
      id: uid('combo'), userId: currentUser.id, userName: currentUser.name, legs: resolvedLegs,
      amount: round2(amount), combinedOdds, potentialReturn: round2(amount * combinedOdds), isMega, createdAt: Date.now(),
    };
    const latestCombosUpdated = [...latestCombos, combo];
    const ok = await storageSet(KEYS.combos, latestCombosUpdated);
    if (!ok) return { error: 'No se pudo guardar la combinada. Inténtalo de nuevo.' };
    setCombos(latestCombosUpdated);
    return { ok: true, isMega };
  }

  function requireAdmin() { return currentUser?.role === 'ADMIN'; }

  async function grantTokens(userId, amount, note) {
    if (!requireAdmin()) return { error: 'No autorizado.' };
    if (!amount || amount <= 0) return { error: 'Cantidad no válida.' };
    const target = users.find((u) => u.id === userId);
    if (!target) return { error: 'Usuario no encontrado.' };
    const latestGrants = (await storageGet(KEYS.grants)) || grants;
    const grant = { id: uid('grant'), userId, userName: target.name, amount: round2(amount), note: note || '', createdAt: Date.now() };
    const updated = [...latestGrants, grant];
    await storageSet(KEYS.grants, updated);
    setGrants(updated);
    return { ok: true };
  }

  async function distributeTokensToAll(amount, note) {
    if (!requireAdmin()) return { error: 'No autorizado.' };
    if (!amount || amount <= 0) return { error: 'Cantidad no válida.' };
    const latestUsers = (await storageGet(KEYS.users)) || users;
    const latestGrants = (await storageGet(KEYS.grants)) || grants;
    const newGrants = latestUsers.map((u) => ({ id: uid('grant'), userId: u.id, userName: u.name, amount: round2(amount), note: note || 'Reparto general', createdAt: Date.now() }));
    const updated = [...latestGrants, ...newGrants];
    await storageSet(KEYS.grants, updated);
    setGrants(updated);
    return { ok: true, count: newGrants.length };
  }

  async function deductTokens(userId, amount, note) {
    if (!requireAdmin()) return { error: 'No autorizado.' };
    if (!amount || amount <= 0) return { error: 'Cantidad no válida.' };
    const target = users.find((u) => u.id === userId);
    if (!target) return { error: 'Usuario no encontrado.' };
    const latestGrants = (await storageGet(KEYS.grants)) || grants;
    const latestWagers = (await storageGet(KEYS.wagers)) || wagers;
    const latestCombos = (await storageGet(KEYS.combos)) || combos;
    const { balance } = computeBalance(userId, latestGrants, latestWagers, latestCombos);
    if (amount > balance) return { error: `Solo tiene ${formatMoney(balance)} de saldo sin usar; no puedes quitarle más que eso.` };
    const grant = { id: uid('grant'), userId, userName: target.name, amount: -round2(amount), note: note || 'Ajuste', createdAt: Date.now() };
    const updated = [...latestGrants, grant];
    await storageSet(KEYS.grants, updated);
    setGrants(updated);
    return { ok: true };
  }

  async function deleteUser(userId) {
    if (!requireAdmin()) return { error: 'No autorizado.' };
    const target = users.find((u) => u.id === userId);
    if (!target) return { error: 'Usuario no encontrado.' };
    if (target.role === 'ADMIN') return { error: 'No se puede eliminar una cuenta de organizador.' };
    const latestUsers = (await storageGet(KEYS.users)) || users;
    const latestWagers = (await storageGet(KEYS.wagers)) || wagers;
    const latestCombos = (await storageGet(KEYS.combos)) || combos;
    const latestGrants = (await storageGet(KEYS.grants)) || grants;
    const updatedUsers = latestUsers.filter((u) => u.id !== userId);
    const updatedWagers = latestWagers.filter((w) => w.userId !== userId);
    const updatedCombos = latestCombos.filter((c) => c.userId !== userId);
    const updatedGrants = latestGrants.filter((g) => g.userId !== userId);
    await storageSet(KEYS.users, updatedUsers);
    await storageSet(KEYS.wagers, updatedWagers);
    await storageSet(KEYS.combos, updatedCombos);
    await storageSet(KEYS.grants, updatedGrants);
    setUsers(updatedUsers); setWagers(updatedWagers); setCombos(updatedCombos); setGrants(updatedGrants);
    return { ok: true };
  }

  async function saveEvent({ event, options: opts }) {
    if (!requireAdmin()) return;
    const latestEvents = (await storageGet(KEYS.events)) || events;
    const latestOptions = (await storageGet(KEYS.options)) || options;
    let updatedEvents, updatedOptions;

    if (event.id) {
      updatedEvents = latestEvents.map((e) => (e.id === event.id ? { ...e, title: event.title, description: event.description, deadline: event.deadline } : e));
      const keepIds = new Set(opts.map((o) => o.id));
      const withoutOld = latestOptions.filter((o) => o.eventId !== event.id);
      const merged = opts.map((o) => ({ id: o.id, eventId: event.id, name: o.name, description: o.description || '', createdAt: o.createdAt || Date.now() }));
      updatedOptions = [...withoutOld, ...merged];
    } else {
      const newId = uid('evt');
      const newEvent = { id: newId, title: event.title, description: event.description, deadline: event.deadline, status: 'open', createdAt: Date.now(), closedAt: null, winningOptionId: null };
      updatedEvents = [...latestEvents, newEvent];
      const newOpts = opts.map((o) => ({ id: uid('opt'), eventId: newId, name: o.name, description: '', createdAt: Date.now() }));
      updatedOptions = [...latestOptions, ...newOpts];
    }
    await storageSet(KEYS.events, updatedEvents);
    await storageSet(KEYS.options, updatedOptions);
    setEvents(updatedEvents); setOptions(updatedOptions);
  }

  async function deleteEvent(eventId) {
    if (!requireAdmin()) return;
    const latestEvents = (await storageGet(KEYS.events)) || events;
    const latestOptions = (await storageGet(KEYS.options)) || options;
    const latestWagers = (await storageGet(KEYS.wagers)) || wagers;
    const updatedEvents = latestEvents.filter((e) => e.id !== eventId);
    const updatedOptions = latestOptions.filter((o) => o.eventId !== eventId);
    const updatedWagers = latestWagers.filter((w) => w.eventId !== eventId);
    await storageSet(KEYS.events, updatedEvents);
    await storageSet(KEYS.options, updatedOptions);
    await storageSet(KEYS.wagers, updatedWagers);
    setEvents(updatedEvents); setOptions(updatedOptions); setWagers(updatedWagers);
  }

  async function closeEvent(eventId) {
    if (!requireAdmin()) return;
    const latestEvents = (await storageGet(KEYS.events)) || events;
    const updated = latestEvents.map((e) => (e.id === eventId ? { ...e, status: 'closed', closedAt: Date.now() } : e));
    await storageSet(KEYS.events, updated);
    setEvents(updated);
  }

  async function declareWinner(eventId, optionId) {
    if (!requireAdmin()) return;
    const latestEvents = (await storageGet(KEYS.events)) || events;
    const updated = latestEvents.map((e) => (e.id === eventId ? { ...e, status: 'finished', winningOptionId: optionId, closedAt: e.closedAt || Date.now() } : e));
    await storageSet(KEYS.events, updated);
    setEvents(updated);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: THEME.bg }}>
        <Spinner size={28} />
      </div>
    );
  }

  if (!introDone) {
    return <IntroSplash onDone={() => setIntroDone(true)} />;
  }

  const activeEvent = events.find((e) => e.id === activeEventId);
  const bote = round2((grants || []).reduce((s, g) => s + g.amount, 0));

  return (
    <ToastProvider>
      <AppShell
        currentUser={currentUser} screen={screen} setScreen={setScreen} onLogout={handleLogout}
        balance={currentUser ? computeBalance(currentUser.id, grants, wagers, combos).balance : null}
        footerStats={{ events: events.filter((e) => e.status === 'open').length, bote, users: users.length }}
      >
        {screen === 'auth' && <AuthScreen users={users} onLogin={handleLogin} onRegister={handleRegister} />}
        {screen === 'home' && <HomeScreen events={events} options={options} wagers={wagers} combos={combos} onOpenEvent={openEvent} />}
        {screen === 'event' && activeEvent && (
          <EventDetailScreen
            event={activeEvent} options={options} wagers={wagers} currentUser={currentUser}
            balance={currentUser ? computeBalance(currentUser.id, grants, wagers, combos).balance : null}
            onBack={() => setScreen('home')} onPlaceBet={placeBet} onRequireAuth={() => setScreen('auth')}
          />
        )}
        {screen === 'mybets' && currentUser && <MyBetsScreen currentUser={currentUser} events={events} options={options} wagers={wagers} combos={combos} grants={grants} />}
        {screen === 'mybets' && !currentUser && <AuthScreen users={users} onLogin={handleLogin} onRegister={handleRegister} />}
        {screen === 'combo' && currentUser && (
          <ComboScreen
            events={events} options={options} wagers={wagers} onPlaceCombo={placeCombo}
            balance={computeBalance(currentUser.id, grants, wagers, combos).balance}
          />
        )}
        {screen === 'combo' && !currentUser && <AuthScreen users={users} onLogin={handleLogin} onRegister={handleRegister} />}
        {screen === 'ranking' && <RankingScreen users={users} wagers={wagers} combos={combos} events={events} />}
        {screen === 'help' && <HelpScreen />}
        {screen === 'admin' && currentUser?.role === 'ADMIN' && (
          <AdminDashboard
            events={events} options={options} wagers={wagers} users={users} combos={combos} grants={grants}
            onSaveEvent={saveEvent} onDeleteEvent={deleteEvent} onCloseEvent={closeEvent} onDeclareWinner={declareWinner}
            onGrantTokens={grantTokens} onDistributeToAll={distributeTokensToAll}
            onDeductTokens={deductTokens} onDeleteUser={deleteUser}
          />
        )}
        {screen === 'admin' && currentUser?.role !== 'ADMIN' && (
          <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center' }}>
            <EmptyState icon={Lock} title="Acceso restringido" subtitle="Solo el organizador puede entrar al panel de administración." />
          </div>
        )}
      </AppShell>
    </ToastProvider>
  );
}

function IntroSplash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="intro-screen" onClick={onDone}>
      <GlobalStyles />
      <div className="intro-content">
        <div className="intro-badge">
          <Trophy size={26} color="#141414" />
        </div>
        <h1 className="intro-title">
          {CONFIG.appName.split('').map((ch, i) => (
            <span key={i} style={{ animationDelay: `${0.55 + i * 0.045}s` }}>{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </h1>
        <p className="intro-tagline">{CONFIG.tagline}</p>
        <div className="intro-rule" />
      </div>
      <span className="intro-skip">Toca para entrar</span>
    </div>
  );
}

function Footer({ stats }) {
  return (
    <footer style={{ borderTop: `1px solid ${THEME.border}`, marginTop: 48 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ maxWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(150deg, ${THEME.gold}, #a97d29)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={12} color="#141414" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>{CONFIG.appName}</span>
          </div>
          <p style={{ fontSize: 12.5, color: THEME.textMuted, lineHeight: 1.6, margin: 0 }}>Apuestas privadas entre amigos, sin dinero real dentro de la app: solo tokens que reparte el organizador a cambio de efectivo, que luego vuelve como premio.</p>
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: 26 }}>
            <FooterStat label="Eventos abiertos" value={stats.events} />
            <FooterStat label="Bote total" value={formatMoney(stats.bote)} />
            <FooterStat label="Participantes" value={stats.users} />
          </div>
        )}
      </div>
    </footer>
  );
}
function FooterStat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 11, color: THEME.textMuted }}>{label}</div>
    </div>
  );
}

function AppShell({ currentUser, screen, setScreen, onLogout, balance, footerStats, children }) {
  return (
    <div style={{ minHeight: '100vh', background: THEME.bg, color: THEME.textPrimary, fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>
      <GlobalStyles />
      <Navbar user={currentUser} screen={screen} onNavigate={setScreen} onLogout={onLogout} balance={balance} />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer stats={footerStats} />
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
      :root {
        --font-display: 'Fraunces', Georgia, serif;
        --font-body: 'Inter', -apple-system, sans-serif;
      }
      * { box-sizing: border-box; }
      body, input, textarea, select, button { font-family: var(--font-body); }
      ::selection { background: ${THEME.gold}; color: #141414; }

      .card { background: ${THEME.bgCard}; border: 1px solid ${THEME.border}; border-radius: 14px; padding: 20px; }
      .event-card { cursor: pointer; transition: border-color .18s ease, transform .18s ease, background .18s ease; }
      .event-card:hover { border-color: ${THEME.borderStrong}; background: ${THEME.bgCardHover}; transform: translateY(-2px); }
      .event-card-featured { padding: 28px; background: linear-gradient(160deg, ${THEME.bgCard}, ${THEME.bgElevated}); border-color: ${THEME.borderStrong}; }

      .option-row { cursor: pointer; transition: border-color .15s ease, background .15s ease; }
      .option-row:hover { border-color: ${THEME.borderStrong}; }
      .option-row-selected { border-color: ${THEME.gold}; background: ${THEME.goldSoft}; }
      .option-row-disabled { cursor: default; opacity: .72; }

      .btn-select { margin-top: 12px; width: 100%; padding: 9px 0; border-radius: 9px; border: 1px solid ${THEME.borderStrong}; background: transparent; color: ${THEME.textPrimary}; font-size: 13; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all .15s; }
      .btn-select:hover { border-color: ${THEME.gold}; color: ${THEME.gold}; }
      .btn-select-active { background: ${THEME.gold}; color: #141414; border-color: ${THEME.gold}; }

      .btn-primary { background: ${THEME.gold}; color: #141414; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: filter .15s, transform .1s; }
      .btn-primary:hover { filter: brightness(1.08); }
      .btn-primary:active { transform: scale(0.98); }
      .btn-primary:disabled { opacity: .6; cursor: default; }

      .btn-ghost { background: transparent; color: ${THEME.textSecondary}; border: 1px solid ${THEME.border}; padding: 9px 16px; border-radius: 10px; font-weight: 600; font-size: 13.5px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all .15s; }
      .btn-ghost:hover { border-color: ${THEME.borderStrong}; color: ${THEME.textPrimary}; }

      .btn-danger { background: ${THEME.danger}; color: #1a0f0f; border: none; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 13.5px; cursor: pointer; }
      .btn-danger:hover { filter: brightness(1.08); }

      .btn-small { background: ${THEME.bgElevated}; border: 1px solid ${THEME.border}; color: ${THEME.textSecondary}; padding: 6px 11px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all .15s; }
      .btn-small:hover { color: ${THEME.textPrimary}; border-color: ${THEME.borderStrong}; }
      .btn-small-gold:hover { color: ${THEME.gold}; border-color: ${THEME.gold}; }
      .btn-small-danger:hover { color: ${THEME.danger}; border-color: ${THEME.danger}; }

      .chip-btn { background: ${THEME.bgElevated}; border: 1px solid ${THEME.border}; color: ${THEME.textSecondary}; padding: 6px 0; flex: 1; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all .15s; }
      .chip-btn:hover { border-color: ${THEME.gold}; color: ${THEME.gold}; }

      .combo-pill { background: ${THEME.bgElevated}; border: 1px solid ${THEME.border}; color: ${THEME.textSecondary}; padding: 7px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all .15s; }
      .combo-pill:hover { border-color: ${THEME.borderStrong}; color: ${THEME.textPrimary}; }
      .combo-pill-active { background: ${THEME.gold}; color: #141414; border-color: ${THEME.gold}; }

      .icon-btn { background: transparent; border: 1px solid transparent; color: ${THEME.textSecondary}; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
      .icon-btn:hover { background: ${THEME.bgElevated}; color: ${THEME.textPrimary}; }

      .input { width: 100%; background: ${THEME.bgElevated}; border: 1px solid ${THEME.border}; color: ${THEME.textPrimary}; padding: 10px 12px; border-radius: 9px; font-size: 14px; outline: none; transition: border-color .15s; }
      .input:focus { border-color: ${THEME.gold}; }
      .input::placeholder { color: ${THEME.textMuted}; }

      .divider { height: 1px; background: ${THEME.border}; margin: 6px 0; }

      .modal-overlay { position: fixed; inset: 0; background: rgba(6,7,9,0.72); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; animation: fadeIn .15s ease; }
      .modal-panel { background: ${THEME.bgCard}; border: 1px solid ${THEME.borderStrong}; border-radius: 16px; padding: 24px; width: 100%; max-height: 88vh; overflow: auto; animation: slideUp .18s ease; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      .toast-item { animation: slideUp .2s ease; }
      .spin { animation: spin 0.9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      .table-head { display: grid; grid-template-columns: 1.4fr 1.6fr 1fr 1fr; padding: 11px 16px; font-size: 11px; text-transform: none; color: ${THEME.textMuted}; font-weight: 700; border-bottom: 1px solid ${THEME.border}; gap: 8px; }
      .table-row { display: grid; grid-template-columns: 1.4fr 1.6fr 1fr 1fr; padding: 12px 16px; font-size: 13px; border-top: 1px solid ${THEME.border}; align-items: center; gap: 8px; }
      .sortable { cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
      .sortable:hover { color: ${THEME.textPrimary}; }

      .dropdown-item:hover { background: ${THEME.bgCard}; color: ${THEME.gold}; }

      .pool-seg:first-child { border-top-left-radius: 4px; border-bottom-left-radius: 4px; }
      .pool-seg:last-child { border-top-right-radius: 4px; border-bottom-right-radius: 4px; }

      .nav-burger { display: none; }

      .filter-pill { background: transparent; border: none; color: ${THEME.textSecondary}; padding: 7px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all .15s; white-space: nowrap; }
      .filter-pill:hover { color: ${THEME.textPrimary}; }
      .filter-pill-active { background: ${THEME.bgCard}; color: ${THEME.textPrimary}; }

      .mode-pill { background: transparent; border: none; color: ${THEME.textSecondary}; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; }
      .mode-pill-active { background: ${THEME.gold}; color: #141414; }
      .mode-pill-active-danger { background: ${THEME.danger}; color: #1a0f0f; }

      .drawer-overlay { position: fixed; inset: 0; background: rgba(6,7,9,0.72); backdrop-filter: blur(3px); z-index: 90; animation: fadeIn .15s ease; }
      .drawer-panel { position: absolute; top: 0; right: 0; height: 100%; width: min(300px, 86vw); background: ${THEME.bgCard}; border-left: 1px solid ${THEME.borderStrong}; padding: 20px; box-shadow: -12px 0 32px rgba(0,0,0,0.4); animation: slideInRight .2s ease; overflow-y: auto; }
      @keyframes slideInRight { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .drawer-link { text-align: left; background: transparent; border: none; color: ${THEME.textSecondary}; padding: 11px 12px; border-radius: 9px; font-size: 14.5px; font-weight: 600; cursor: pointer; }
      .drawer-link:hover { background: ${THEME.bgElevated}; color: ${THEME.textPrimary}; }
      .drawer-link-active { background: ${THEME.goldSoft}; color: ${THEME.gold}; }

      .accordion-head { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 10px; background: transparent; border: none; color: ${THEME.textPrimary}; padding: 16px 18px; font-size: 14px; font-weight: 600; text-align: left; cursor: pointer; }
      .accordion-head:hover { color: ${THEME.gold}; }

      .intro-screen { position: fixed; inset: 0; z-index: 200; background: radial-gradient(circle at 50% 38%, #1A1E26 0%, ${THEME.bg} 72%); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; animation: introOut .5s ease 2.15s forwards; }
      .intro-content { display: flex; flex-direction: column; align-items: center; }
      .intro-badge { width: 64px; height: 64px; border-radius: 18px; background: linear-gradient(150deg, ${THEME.gold}, #a97d29); display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0.4) rotate(-14deg); animation: introBadge .6s cubic-bezier(.2,.9,.25,1.3) .1s forwards; box-shadow: 0 0 60px rgba(227,178,76,0.25); }
      @keyframes introBadge { to { opacity: 1; transform: scale(1) rotate(0deg); } }
      .intro-title { font-family: var(--font-display); font-size: 40px; letter-spacing: -0.01em; margin: 22px 0 8px; display: flex; }
      .intro-title span { display: inline-block; opacity: 0; transform: translateY(14px); animation: introLetter .5s ease forwards; }
      @keyframes introLetter { to { opacity: 1; transform: translateY(0); } }
      .intro-tagline { font-size: 14px; color: ${THEME.textSecondary}; opacity: 0; animation: introFade .6s ease 1.15s forwards; margin: 0; }
      @keyframes introFade { to { opacity: 1; } }
      .intro-rule { width: 0; height: 1px; background: ${THEME.gold}; margin-top: 22px; animation: introRule .7s ease 1.5s forwards; }
      @keyframes introRule { to { width: 120px; } }
      .intro-skip { position: absolute; bottom: 34px; font-size: 11.5px; color: ${THEME.textMuted}; opacity: 0; animation: introFade .5s ease 1.9s forwards; letter-spacing: 0.02em; }
      @keyframes introOut { to { opacity: 0; visibility: hidden; } }

      @media (max-width: 760px) {
        .nav-desktop { display: none; }
        .nav-burger { display: flex; }
        .intro-title { font-size: 30px; }
        .home-grid { grid-template-columns: 1fr !important; }
        .home-activity { position: static !important; }
      }

      @media (max-width: 640px) {
        .table-head, .table-row { grid-template-columns: 1fr 1fr; }
        .table-head span:nth-child(n+3), .table-row span:nth-child(n+3) { display: none; }
      }
    `}</style>
  );
}
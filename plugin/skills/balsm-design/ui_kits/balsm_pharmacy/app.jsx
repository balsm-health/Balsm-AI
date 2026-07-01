/* app.jsx — top-level Balsm Pharmacy App
   Tweaks here are Balsm-Pro *suite* settings — language, connection, brand
   accent, sync chrome and landing module — shared across every module
   (POS · Inventory · Customers …), not POS-only. Mirrors the props the
   Balsm Pharmacy POS design component exposes. */

// Persisted shared-suite settings. Edited live via the Tweaks panel.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "language": "en",
  "connection": "online",
  "accent": "#1283FF",
  "syncBadges": true,
  "landingModule": "pos"
}/*EDITMODE-END*/;

// Brand accent → the petal it maps to (primary / hover / soft wash surface).
// Switching this re-skins active nav, primary CTAs and selected states across
// every module at once, because they all read --balsm-primary / its wash.
const BALSM_ACCENTS = {
  '#1283FF': { primary: '#1283FF', hover: '#0F6BCC', wash: '#E4F0FF', name: 'Petal blue' },
  '#02BBB5': { primary: '#02BBB5', hover: '#029E99', wash: '#E2F8F6', name: 'Petal aqua' },
  '#01C4A2': { primary: '#01C4A2', hover: '#019A7F', wash: '#E1F8F1', name: 'Petal emerald' },
  '#724DD0': { primary: '#724DD0', hover: '#5C3AB0', wash: '#ECE6FA', name: 'Petal violet' },
};

function PlaceholderView({ icon, title, sub }) {
  return (
    <div className="page">
      <div style={{ background: '#fff', border: '1px solid var(--balsm-border)', borderRadius: 14, padding: 64, textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 999, background: 'var(--petal-aqua-50)', color: 'var(--petal-aqua-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={28} />
        </div>
        <h2 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--balsm-ink-900)' }}>{title}</h2>
        <p style={{ margin: 0, color: 'var(--fg3)', fontSize: 14 }}>{sub}</p>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Derive shared state from tweaks (single source of truth).
  const dir = t.language === 'ar' ? 'rtl' : 'ltr';
  const online = t.connection !== 'offline';
  const showBadges = t.syncBadges !== false;
  const accent = BALSM_ACCENTS[t.accent] || BALSM_ACCENTS['#1283FF'];

  const [screen, setScreen] = useState(t.landingModule || 'pos');

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
  }, [dir]);

  // Landing-module tweak routes the whole app to its starting screen.
  useEffect(() => {
    if (t.landingModule) setScreen(t.landingModule);
  }, [t.landingModule]);

  // Re-init lucide on every screen / dir change
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // Suite-wide accent re-skin — custom props cascade into every child module.
  const accentVars = {
    '--balsm-primary': accent.primary,
    '--balsm-primary-hover': accent.hover,
    '--petal-blue': accent.primary,
    '--petal-blue-50': accent.wash,
  };

  function renderScreen() {
    switch (screen) {
      case 'pos':       return <POSView dir={dir} />;
      case 'inventory': return <InventoryView dir={dir} />;
      case 'customers': return <CustomersView dir={dir} />;
      case 'sales':     return <PlaceholderView icon="receipt" title={dir==='rtl'?'سجل المبيعات':'Sales history'} sub={dir==='rtl'?'الفواتير ومرتجعات المبيعات. ساكن في الـ Slice 1 — تم التركيز هنا على نقطة البيع.':'Invoices and returns. Slice 1 stub — focus was on POS.'} />;
      case 'reports':   return <PlaceholderView icon="bar-chart-3" title={dir==='rtl'?'التقارير':'Reports'} sub={dir==='rtl'?'تقارير يومية / أسبوعية / شهرية. ساكن في الـ Slice 1.':'Daily / weekly / monthly reports. Slice 1 stub.'} />;
      case 'cash':      return <PlaceholderView icon="wallet" title={dir==='rtl'?'الصندوق':'Cash drawer'} sub={dir==='rtl'?'مفتاح / غلق اليوم وتسوية النقدية.':'Open & close-of-day cash reconciliation.'} />;
      case 'sync':      return <PlaceholderView icon="cloud-upload" title={dir==='rtl'?'طابور المزامنة':'Sync queue'} sub={dir==='rtl'?'٣ معاملات في انتظار الاتصال.':'3 transactions waiting to flush.'} />;
      case 'staff':     return <PlaceholderView icon="shield-check" title={dir==='rtl'?'الموظفون والأدوار':'Staff & roles'} sub={dir==='rtl'?'٣ أدوار في الـ Slice 1: مدير، صيدلي، مساعد.':'3 roles in Slice 1: Admin, Pharmacist, Assistant.'} />;
      case 'settings':  return <PlaceholderView icon="settings-2" title={dir==='rtl'?'الإعدادات':'Settings'} sub={dir==='rtl'?'إعدادات الصيدلية والخادم المحلي.':'Pharmacy entity and local-server settings.'} />;
      default:          return <POSView dir={dir} />;
    }
  }

  return (
    <div className="app" style={accentVars}>
      <Sidebar screen={screen} onScreen={setScreen} dir={dir} />
      <TopBar
        screen={screen}
        dir={dir}
        online={online}
        showBadges={showBadges}
        onLang={(d) => setTweak('language', d === 'rtl' ? 'ar' : 'en')}
        onToggleOnline={() => setTweak('connection', online ? 'offline' : 'online')}
      />
      <main className="main">
        {!online && showBadges && <OfflineBanner dir={dir} />}
        {renderScreen()}
      </main>

      <BottomNav screen={screen} onScreen={setScreen} dir={dir} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Balsm-Pro · shared" />
        <TweakRadio
          label="Language"
          value={t.language}
          options={[{ value: 'en', label: 'EN' }, { value: 'ar', label: 'العربية' }]}
          onChange={(v) => setTweak('language', v)}
        />
        <TweakRadio
          label="Connection"
          value={t.connection}
          options={[{ value: 'online', label: 'Online' }, { value: 'offline', label: 'Offline' }]}
          onChange={(v) => setTweak('connection', v)}
        />
        <TweakColor
          label="Brand accent"
          value={t.accent}
          options={['#1283FF', '#02BBB5', '#01C4A2', '#724DD0']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakToggle
          label="Sync badges"
          value={showBadges}
          onChange={(v) => setTweak('syncBadges', v)}
        />
        <TweakSection label="Workspace" />
        <TweakSelect
          label="Landing module"
          value={t.landingModule}
          options={[
            { value: 'pos', label: 'Point of sale' },
            { value: 'inventory', label: 'Inventory' },
            { value: 'customers', label: 'Customers' },
          ]}
          onChange={(v) => setTweak('landingModule', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

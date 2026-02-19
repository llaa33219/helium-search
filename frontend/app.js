const TRANSLATIONS = {
  en: {
    tagline: 'A lightweight and clean AI search engine.',
    searchPlaceholder: 'Search anything...',
    searchPlaceholderResults: 'Enter search query...',
    clear: 'Clear',
    searching: 'Searching...',
    errorGeneric: 'An error occurred while searching.',
    errorUnknown: 'Unknown response format.',
    errorNetwork: 'Network error. Please check your internet connection.',
    viewSources: 'View sources',
    sourcesCount: (n) => `View sources (${n})`,
    alsoSearch: 'People also search for',
    ad: 'Ad',
    statusSearching: 'Searching the web...',
    statusAnalyzing: 'Analyzing results...',
    statusGenerating: 'Generating answer...',
  },
  ko: {
    tagline: '가볍고 깔끔한 AI 검색엔진',
    searchPlaceholder: '무엇이든 검색하세요...',
    searchPlaceholderResults: '검색어 입력...',
    clear: '지우기',
    searching: '검색 중...',
    errorGeneric: '검색 중 오류가 발생했습니다.',
    errorUnknown: '알 수 없는 응답 형식입니다.',
    errorNetwork: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.',
    viewSources: '출처 보기',
    sourcesCount: (n) => `출처 보기 (${n}개)`,
    alsoSearch: '이것도 검색해 보세요',
    ad: '광고',
    statusSearching: '웹 검색 중...',
    statusAnalyzing: '결과 분석 중...',
    statusGenerating: '답변 생성 중...',
  },
  ja: {
    tagline: '軽量でクリーンなAI検索エンジン',
    searchPlaceholder: '何でも検索...',
    searchPlaceholderResults: '検索キーワードを入力...',
    clear: 'クリア',
    searching: '検索中...',
    errorGeneric: '検索中にエラーが発生しました。',
    errorUnknown: '不明なレスポンス形式です。',
    errorNetwork: 'ネットワークエラーです。インターネット接続を確認してください。',
    viewSources: '出典を見る',
    sourcesCount: (n) => `出典を見る (${n}件)`,
    alsoSearch: 'こちらも検索',
    ad: '広告',
    statusSearching: 'ウェブを検索中...',
    statusAnalyzing: '結果を分析中...',
    statusGenerating: '回答を生成中...',
  },
  zh: {
    tagline: '轻量简洁的AI搜索引擎',
    searchPlaceholder: '搜索任何内容...',
    searchPlaceholderResults: '输入搜索词...',
    clear: '清除',
    searching: '搜索中...',
    errorGeneric: '搜索时发生错误。',
    errorUnknown: '未知的响应格式。',
    errorNetwork: '网络错误，请检查您的网络连接。',
    viewSources: '查看来源',
    sourcesCount: (n) => `查看来源 (${n}个)`,
    alsoSearch: '相关搜索',
    ad: '广告',
    statusSearching: '正在搜索网络...',
    statusAnalyzing: '正在分析结果...',
    statusGenerating: '正在生成回答...',
  },
  es: {
    tagline: 'Un motor de búsqueda IA ligero y limpio.',
    searchPlaceholder: 'Buscar cualquier cosa...',
    searchPlaceholderResults: 'Ingrese su búsqueda...',
    clear: 'Borrar',
    searching: 'Buscando...',
    errorGeneric: 'Se produjo un error durante la búsqueda.',
    errorUnknown: 'Formato de respuesta desconocido.',
    errorNetwork: 'Error de red. Compruebe su conexión a Internet.',
    viewSources: 'Ver fuentes',
    sourcesCount: (n) => `Ver fuentes (${n})`,
    alsoSearch: 'Búsquedas relacionadas',
    ad: 'Anuncio',
    statusSearching: 'Buscando en la web...',
    statusAnalyzing: 'Analizando resultados...',
    statusGenerating: 'Generando respuesta...',
  },
  fr: {
    tagline: 'Un moteur de recherche IA léger et épuré.',
    searchPlaceholder: 'Rechercher...',
    searchPlaceholderResults: 'Saisir une recherche...',
    clear: 'Effacer',
    searching: 'Recherche en cours...',
    errorGeneric: 'Une erreur est survenue lors de la recherche.',
    errorUnknown: 'Format de réponse inconnu.',
    errorNetwork: 'Erreur réseau. Vérifiez votre connexion Internet.',
    viewSources: 'Voir les sources',
    sourcesCount: (n) => `Voir les sources (${n})`,
    alsoSearch: 'Recherches associées',
    ad: 'Annonce',
    statusSearching: 'Recherche sur le web...',
    statusAnalyzing: 'Analyse des résultats...',
    statusGenerating: 'Génération de la réponse...',
  },
  de: {
    tagline: 'Eine leichte und saubere KI-Suchmaschine.',
    searchPlaceholder: 'Suche...',
    searchPlaceholderResults: 'Suchbegriff eingeben...',
    clear: 'Löschen',
    searching: 'Suche läuft...',
    errorGeneric: 'Bei der Suche ist ein Fehler aufgetreten.',
    errorUnknown: 'Unbekanntes Antwortformat.',
    errorNetwork: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
    viewSources: 'Quellen anzeigen',
    sourcesCount: (n) => `Quellen anzeigen (${n})`,
    alsoSearch: 'Ähnliche Suchanfragen',
    ad: 'Anzeige',
    statusSearching: 'Suche im Web...',
    statusAnalyzing: 'Ergebnisse werden analysiert...',
    statusGenerating: 'Antwort wird generiert...',
  },
  ru: {
    tagline: 'Лёгкий и чистый ИИ поисковик.',
    searchPlaceholder: 'Искать что угодно...',
    searchPlaceholderResults: 'Введите запрос...',
    clear: 'Очистить',
    searching: 'Поиск...',
    errorGeneric: 'Произошла ошибка при поиске.',
    errorUnknown: 'Неизвестный формат ответа.',
    errorNetwork: 'Ошибка сети. Проверьте подключение к Интернету.',
    viewSources: 'Показать источники',
    sourcesCount: (n) => `Показать источники (${n})`,
    alsoSearch: 'Похожие запросы',
    ad: 'Реклама',
    statusSearching: 'Поиск в сети...',
    statusAnalyzing: 'Анализ результатов...',
    statusGenerating: 'Генерация ответа...',
  },
  pt: {
    tagline: 'Um mecanismo de busca IA leve e limpo.',
    searchPlaceholder: 'Pesquisar qualquer coisa...',
    searchPlaceholderResults: 'Digite sua pesquisa...',
    clear: 'Limpar',
    searching: 'Pesquisando...',
    errorGeneric: 'Ocorreu um erro durante a pesquisa.',
    errorUnknown: 'Formato de resposta desconhecido.',
    errorNetwork: 'Erro de rede. Verifique sua conexão com a Internet.',
    viewSources: 'Ver fontes',
    sourcesCount: (n) => `Ver fontes (${n})`,
    alsoSearch: 'Pesquisas relacionadas',
    ad: 'Anúncio',
    statusSearching: 'Pesquisando na web...',
    statusAnalyzing: 'Analisando resultados...',
    statusGenerating: 'Gerando resposta...',
  },
  ar: {
    tagline: 'محرك بحث ذكي خفيف ونظيف',
    searchPlaceholder: 'ابحث عن أي شيء...',
    searchPlaceholderResults: 'أدخل كلمة البحث...',
    clear: 'مسح',
    searching: 'جاري البحث...',
    errorGeneric: 'حدث خطأ أثناء البحث.',
    errorUnknown: 'تنسيق استجابة غير معروف.',
    errorNetwork: 'خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت.',
    viewSources: 'عرض المصادر',
    sourcesCount: (n) => `عرض المصادر (${n})`,
    alsoSearch: 'عمليات بحث ذات صلة',
    ad: 'إعلان',
    statusSearching: 'جاري البحث في الويب...',
    statusAnalyzing: 'جاري تحليل النتائج...',
    statusGenerating: 'جاري إنشاء الإجابة...',
  },
  vi: {
    tagline: 'Công cụ tìm kiếm AI nhẹ và sạch.',
    searchPlaceholder: 'Tìm kiếm bất kỳ...',
    searchPlaceholderResults: 'Nhập từ khóa...',
    clear: 'Xóa',
    searching: 'Đang tìm kiếm...',
    errorGeneric: 'Đã xảy ra lỗi khi tìm kiếm.',
    errorUnknown: 'Định dạng phản hồi không xác định.',
    errorNetwork: 'Lỗi mạng. Vui lòng kiểm tra kết nối Internet.',
    viewSources: 'Xem nguồn',
    sourcesCount: (n) => `Xem nguồn (${n})`,
    alsoSearch: 'Tìm kiếm liên quan',
    ad: 'Quảng cáo',
    statusSearching: 'Đang tìm kiếm trên web...',
    statusAnalyzing: 'Đang phân tích kết quả...',
    statusGenerating: 'Đang tạo câu trả lời...',
  },
  th: {
    tagline: 'เครื่องมือค้นหา AI ที่เบาและสะอาด',
    searchPlaceholder: 'ค้นหาอะไรก็ได้...',
    searchPlaceholderResults: 'ป้อนคำค้นหา...',
    clear: 'ล้าง',
    searching: 'กำลังค้นหา...',
    errorGeneric: 'เกิดข้อผิดพลาดระหว่างการค้นหา',
    errorUnknown: 'รูปแบบการตอบกลับที่ไม่รู้จัก',
    errorNetwork: 'ข้อผิดพลาดเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
    viewSources: 'ดูแหล่งที่มา',
    sourcesCount: (n) => `ดูแหล่งที่มา (${n})`,
    alsoSearch: 'การค้นหาที่เกี่ยวข้อง',
    ad: 'โฆษณา',
    statusSearching: 'กำลังค้นหาในเว็บ...',
    statusAnalyzing: 'กำลังวิเคราะห์ผลลัพธ์...',
    statusGenerating: 'กำลังสร้างคำตอบ...',
  },
  hi: {
    tagline: 'एक हल्का और साफ AI खोज इंजन',
    searchPlaceholder: 'कुछ भी खोजें...',
    searchPlaceholderResults: 'खोज शब्द दर्ज करें...',
    clear: 'मिटाएं',
    searching: 'खोज रहा है...',
    errorGeneric: 'खोज के दौरान एक त्रुटि हुई।',
    errorUnknown: 'अज्ञात प्रतिक्रिया प्रारूप।',
    errorNetwork: 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।',
    viewSources: 'स्रोत देखें',
    sourcesCount: (n) => `स्रोत देखें (${n})`,
    alsoSearch: 'संबंधित खोजें',
    ad: 'विज्ञापन',
    statusSearching: 'वेब पर खोज रहा है...',
    statusAnalyzing: 'परिणामों का विश्लेषण कर रहा है...',
    statusGenerating: 'उत्तर तैयार कर रहा है...',
  },
  it: {
    tagline: 'Un motore di ricerca IA leggero e pulito.',
    searchPlaceholder: 'Cerca qualsiasi cosa...',
    searchPlaceholderResults: 'Inserisci la ricerca...',
    clear: 'Cancella',
    searching: 'Ricerca in corso...',
    errorGeneric: 'Si è verificato un errore durante la ricerca.',
    errorUnknown: 'Formato di risposta sconosciuto.',
    errorNetwork: 'Errore di rete. Controlla la tua connessione Internet.',
    viewSources: 'Vedi fonti',
    sourcesCount: (n) => `Vedi fonti (${n})`,
    alsoSearch: 'Ricerche correlate',
    ad: 'Annuncio',
    statusSearching: 'Ricerca nel web...',
    statusAnalyzing: 'Analisi dei risultati...',
    statusGenerating: 'Generazione della risposta...',
  },
  tr: {
    tagline: 'Hafif ve temiz bir AI arama motoru.',
    searchPlaceholder: 'Herhangi bir şey arayın...',
    searchPlaceholderResults: 'Arama terimi girin...',
    clear: 'Temizle',
    searching: 'Aranıyor...',
    errorGeneric: 'Arama sırasında bir hata oluştu.',
    errorUnknown: 'Bilinmeyen yanıt biçimi.',
    errorNetwork: 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin.',
    viewSources: 'Kaynakları görüntüle',
    sourcesCount: (n) => `Kaynakları görüntüle (${n})`,
    alsoSearch: 'İlgili aramalar',
    ad: 'Reklam',
    statusSearching: "Web'de aranıyor...",
    statusAnalyzing: 'Sonuçlar analiz ediliyor...',
    statusGenerating: 'Yanıt oluşturuluyor...',
  },
  nl: {
    tagline: 'Een lichte en schone AI-zoekmachine.',
    searchPlaceholder: 'Zoek iets...',
    searchPlaceholderResults: 'Voer een zoekopdracht in...',
    clear: 'Wissen',
    searching: 'Zoeken...',
    errorGeneric: 'Er is een fout opgetreden bij het zoeken.',
    errorUnknown: 'Onbekend antwoordformaat.',
    errorNetwork: 'Netwerkfout. Controleer uw internetverbinding.',
    viewSources: 'Bronnen bekijken',
    sourcesCount: (n) => `Bronnen bekijken (${n})`,
    alsoSearch: 'Gerelateerde zoekopdrachten',
    ad: 'Advertentie',
    statusSearching: 'Zoeken op het web...',
    statusAnalyzing: 'Resultaten analyseren...',
    statusGenerating: 'Antwoord genereren...',
  },
  pl: {
    tagline: 'Lekka i czysta wyszukiwarka AI.',
    searchPlaceholder: 'Szukaj czegokolwiek...',
    searchPlaceholderResults: 'Wpisz zapytanie...',
    clear: 'Wyczyść',
    searching: 'Szukanie...',
    errorGeneric: 'Wystąpił błąd podczas wyszukiwania.',
    errorUnknown: 'Nieznany format odpowiedzi.',
    errorNetwork: 'Błąd sieci. Sprawdź połączenie internetowe.',
    viewSources: 'Pokaż źródła',
    sourcesCount: (n) => `Pokaż źródła (${n})`,
    alsoSearch: 'Powiązane wyszukiwania',
    ad: 'Reklama',
    statusSearching: 'Wyszukiwanie w sieci...',
    statusAnalyzing: 'Analiza wyników...',
    statusGenerating: 'Generowanie odpowiedzi...',
  },
  id: {
    tagline: 'Mesin pencari AI yang ringan dan bersih.',
    searchPlaceholder: 'Cari apa saja...',
    searchPlaceholderResults: 'Masukkan kata kunci...',
    clear: 'Hapus',
    searching: 'Mencari...',
    errorGeneric: 'Terjadi kesalahan saat mencari.',
    errorUnknown: 'Format respons tidak dikenal.',
    errorNetwork: 'Kesalahan jaringan. Periksa koneksi internet Anda.',
    viewSources: 'Lihat sumber',
    sourcesCount: (n) => `Lihat sumber (${n})`,
    alsoSearch: 'Pencarian terkait',
    ad: 'Iklan',
    statusSearching: 'Mencari di web...',
    statusAnalyzing: 'Menganalisis hasil...',
    statusGenerating: 'Membuat jawaban...',
  },
};

const LANGUAGE_NAMES = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  pt: 'Português',
  ar: 'العربية',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  hi: 'हिन्दी',
  it: 'Italiano',
  tr: 'Türkçe',
  nl: 'Nederlands',
  pl: 'Polski',
  id: 'Bahasa Indonesia',
};

function detectBrowserLanguage() {
  const stored = localStorage.getItem('helium-lang');
  if (stored && TRANSLATIONS[stored]) return stored;
  const navLang = (navigator.language || 'en').toLowerCase();
  const primary = navLang.split('-')[0];
  if (TRANSLATIONS[primary]) return primary;
  return 'en';
}

let currentLang = detectBrowserLanguage();

function t(key) {
  const translations = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return translations[key] || TRANSLATIONS.en[key] || key;
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('helium-lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  applyTranslations();
}

function applyTranslations() {
  const taglineEl = document.querySelector('.tagline');
  if (taglineEl) taglineEl.textContent = t('tagline');

  const homeInput = document.getElementById('home-search-input');
  if (homeInput) homeInput.placeholder = t('searchPlaceholder');

  const resultsInput = document.getElementById('results-search-input');
  if (resultsInput) resultsInput.placeholder = t('searchPlaceholderResults');

  document.querySelectorAll('.search-clear').forEach((btn) => {
    btn.setAttribute('aria-label', t('clear'));
  });

  const loadingText = document.querySelector('.loading-text');
  if (loadingText && !statusTimer) loadingText.textContent = t('statusSearching');

  const adLabel = document.querySelector('.ad-label');
  if (adLabel) adLabel.textContent = t('ad');

  document.querySelectorAll('.lang-btn-text').forEach((el) => {
    el.textContent = LANGUAGE_NAMES[currentLang] || currentLang;
  });

  document.querySelectorAll('.lang-option').forEach((el) => {
    el.classList.toggle('active', el.dataset.lang === currentLang);
  });
}

function initLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const switcher = btn.closest('.lang-switcher');
    const dropdown = switcher.querySelector('.lang-dropdown');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.lang-dropdown.open').forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove('open');
          d.closest('.lang-switcher').querySelector('.lang-btn').setAttribute('aria-expanded', 'false');
        }
      });
      const isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.querySelectorAll('.lang-dropdown').forEach((dropdown) => {
    dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.lang-option');
      if (option) {
        setLanguage(option.dataset.lang);
        document.querySelectorAll('.lang-dropdown.open').forEach((d) => d.classList.remove('open'));
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-dropdown.open').forEach((d) => {
      d.classList.remove('open');
      d.closest('.lang-switcher').querySelector('.lang-btn').setAttribute('aria-expanded', 'false');
    });
  });
}

const API_BASE = '/api';

const $ = (sel) => document.querySelector(sel);

const els = {
  homeView: $('#home-view'),
  resultsView: $('#results-view'),
  homeForm: $('#home-search-form'),
  resultsForm: $('#results-search-form'),
  homeInput: $('#home-search-input'),
  resultsInput: $('#results-search-input'),
  homeClear: $('#home-clear'),
  resultsClear: $('#results-clear'),
  logoLink: $('#logo-link'),
  loading: $('#loading'),
  error: $('#error'),
  answerSection: $('#answer-section'),
  sitesSection: $('#sites-section'),
  sourcesSection: $('#sources-section'),
  adSlot: $('#ad-slot'),
  relatedSection: $('#related-section'),
};

function showView(name) {
  els.homeView.classList.toggle('active', name === 'home');
  els.resultsView.classList.toggle('active', name === 'results');
}

function setLoading(on) {
  els.loading.classList.toggle('hidden', !on);
  if (on) {
    clearResults();
    startStatusMessages();
  } else {
    stopStatusMessages();
  }
}

function startStatusMessages() {
  stopStatusMessages();
  const loadingText = document.querySelector('.loading-text');
  if (!loadingText) return;
  loadingText.textContent = t('statusSearching');
  loadingText.classList.remove('fade');

  let step = 0;
  const steps = ['statusSearching', 'statusAnalyzing', 'statusGenerating'];

  statusTimer = setInterval(() => {
    step++;
    if (step >= steps.length) {
      clearInterval(statusTimer);
      statusTimer = null;
      return;
    }
    loadingText.classList.add('fade');
    setTimeout(() => {
      loadingText.textContent = t(steps[step]);
      loadingText.classList.remove('fade');
    }, 200);
  }, 2500);
}

function stopStatusMessages() {
  if (statusTimer) {
    clearInterval(statusTimer);
    statusTimer = null;
  }
}

function clearResults() {
  els.error.classList.add('hidden');
  els.answerSection.classList.add('hidden');
  els.sitesSection.classList.add('hidden');
  els.sourcesSection.classList.add('hidden');
  els.adSlot.classList.add('hidden');
  els.relatedSection.classList.add('hidden');

  els.answerSection.innerHTML = '';
  els.sitesSection.innerHTML = '';
  els.sourcesSection.innerHTML = '';
  els.relatedSection.innerHTML = '';
}

function showError(message) {
  els.error.textContent = message;
  els.error.classList.remove('hidden');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function displayUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname === '/' ? '' : parsed.pathname;
    return host + path;
  } catch {
    return url;
  }
}

function safeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : '#';
  } catch {
    return '#';
  }
}

let currentSearchId = 0;
let statusTimer = null;

async function searchQuery(query) {
  const searchId = ++currentSearchId;

  showView('results');
  els.resultsInput.value = query;
  updateClearButton(els.resultsInput, els.resultsClear);
  document.title = `${query} — Helium Search`;
  setLoading(true);

  const url = new URL(window.location.href);
  url.searchParams.set('q', query);
  history.pushState(null, '', url.toString());

  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&lang=${currentLang}`);
    if (searchId !== currentSearchId) return;
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      showError(data.error || t('errorGeneric'));
      return;
    }

    if (data.type === 'info') {
      renderInfoResult(data);
    } else if (data.type === 'site') {
      renderSiteResult(data);
    } else {
      showError(t('errorUnknown'));
      return;
    }

    if (data.related && data.related.length > 0) {
      renderRelated(data.related);
    }

    showAd();
  } catch {
    setLoading(false);
    showError(t('errorNetwork'));
  }
}

function renderInfoResult(data) {
  els.answerSection.innerHTML = `<div class="answer-text">${escapeHtml(data.answer)}</div>`;
  els.answerSection.classList.remove('hidden');

  if (data.sources && data.sources.length > 0) {
    renderSources(data.sources);
  }
}

function renderSiteResult(data) {
  const sites = data.sites || [];
  if (sites.length === 0) return;

  const html = `<div class="sites-list">${sites.map((site, i) => `
    <a href="${escapeHtml(safeUrl(site.url))}" class="site-card" target="_blank" rel="noopener noreferrer">
      <div class="site-rank">${i + 1}</div>
      <div class="site-info">
        <div class="site-name">${escapeHtml(site.name)}</div>
        <div class="site-url">${escapeHtml(displayUrl(site.url))}</div>
        <div class="site-description">${escapeHtml(site.description)}</div>
      </div>
    </a>`).join('')}
  </div>`;

  els.sitesSection.innerHTML = html;
  els.sitesSection.classList.remove('hidden');
}

function renderSources(sources) {
  const count = sources.length;
  const html = `
    <button class="sources-toggle" id="sources-toggle-btn">
      <span class="sources-toggle-icon">▸</span>
      ${typeof t('sourcesCount') === 'function' ? t('sourcesCount')(count) : `${t('viewSources')} (${count})`}
    </button>
    <div class="sources-list" id="sources-list">
      ${sources.map((s) => `
        <a href="${escapeHtml(safeUrl(s.url))}" class="source-card" target="_blank" rel="noopener noreferrer">
          <div class="source-title">${escapeHtml(s.title)}</div>
          <div class="source-url">${escapeHtml(displayUrl(s.url))}</div>
          ${s.snippet ? `<div class="source-snippet">${escapeHtml(s.snippet)}</div>` : ''}
        </a>
      `).join('')}
    </div>`;

  els.sourcesSection.innerHTML = html;
  els.sourcesSection.classList.remove('hidden');

  const toggleBtn = $('#sources-toggle-btn');
  const sourcesList = $('#sources-list');
  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.classList.toggle('expanded');
    sourcesList.classList.toggle('expanded', expanded);
  });
}

function showAd() {
  const adContent = els.adSlot.querySelector('.ad-content');
  adContent.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8053045122194729" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  els.adSlot.classList.remove('hidden');
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    // AdSense not loaded or blocked
  }
}

function renderRelated(items) {
  const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  const html = `
    <div class="related-header">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      ${t('alsoSearch')}
    </div>
    <div class="related-chips">
      ${items.map((item) => `
        <a href="?q=${encodeURIComponent(item)}" class="related-chip" data-query="${escapeHtml(item)}">
          ${searchIcon}
          ${escapeHtml(item)}
        </a>
      `).join('')}
    </div>`;

  els.relatedSection.innerHTML = html;
  els.relatedSection.classList.remove('hidden');
}

function updateClearButton(input, clearBtn) {
  clearBtn.classList.toggle('hidden', !input.value);
}

function goHome() {
  showView('home');
  clearResults();
  els.homeInput.value = '';
  els.resultsInput.value = '';
  updateClearButton(els.homeInput, els.homeClear);
  document.title = 'Helium Search';
  history.pushState(null, '', '/');
  els.homeInput.focus();
}

function handleSubmit(input) {
  const query = input.value.trim();
  if (query) searchQuery(query);
}

els.homeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit(els.homeInput);
});

els.resultsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit(els.resultsInput);
});

els.homeInput.addEventListener('input', () => {
  updateClearButton(els.homeInput, els.homeClear);
});

els.resultsInput.addEventListener('input', () => {
  updateClearButton(els.resultsInput, els.resultsClear);
});

els.homeClear.addEventListener('click', () => {
  els.homeInput.value = '';
  updateClearButton(els.homeInput, els.homeClear);
  els.homeInput.focus();
});

els.resultsClear.addEventListener('click', () => {
  els.resultsInput.value = '';
  updateClearButton(els.resultsInput, els.resultsClear);
  els.resultsInput.focus();
});

els.logoLink.addEventListener('click', (e) => {
  e.preventDefault();
  goHome();
});

document.addEventListener('click', (e) => {
  const chip = e.target.closest('.related-chip');
  if (chip) {
    e.preventDefault();
    const query = chip.dataset.query;
    if (query) searchQuery(query);
  }
});

window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchQuery(q);
  } else {
    goHome();
  }
});

(function init() {
  initLanguageSwitcher();
  setLanguage(currentLang);
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchQuery(q);
  } else {
    showView('home');
  }
})();

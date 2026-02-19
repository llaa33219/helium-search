const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const QWEN_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';

const BOT_USER_AGENT = 'HeliumSearch/1.0 (https://github.com/llaa33219/helium-search)';

const SYSTEM_PROMPT = `You are Helium Search AI. Analyze search results and respond in JSON only.

Rules:
1. Classify intent: "info" (wants knowledge) or "site" (wants a tool/website)
2. info → Summarize in 3-4 lines using search results. Include source URLs.
3. site → Pick 5 best sites. Name, URL, one-line description each.
4. Generate 3 related search suggestions.
5. Respond in the same language as the query.
6. JSON only. No markdown, no explanation.

For "info" type, respond with:
{"type":"info","query":"...","answer":"...","sources":[{"title":"...","url":"...","snippet":"..."}],"related":["...","...","..."]}

For "site" type, respond with:
{"type":"site","query":"...","sites":[{"name":"...","url":"...","description":"..."}],"related":["...","...","..."]}`;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/search' && request.method === 'GET') {
      const query = url.searchParams.get('q');
      if (!query || !query.trim()) {
        return jsonResponse({ error: 'Missing query parameter "q"' }, 400);
      }
      const lang = url.searchParams.get('lang') || '';
      return handleSearch(query.trim(), env, lang);
    }

    if (url.pathname === '/api/debug' && request.method === 'GET') {
      const query = url.searchParams.get('q') || 'hello';
      return handleDebug(query, env);
    }

    try {
      if (env.ASSETS) return await env.ASSETS.fetch(request);
    } catch {
      // fall through to 404
    }

    return new Response('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Not Found</title></head><body><h1>404 — Not Found</h1></body></html>', {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

const MAX_QUERY_LENGTH = 500;

async function handleDebug(query, env) {
  const encodedQuery = encodeURIComponent(query);
  const timeoutMs = parseInt(env.SEARCH_TIMEOUT_MS) || 15000;
  const detected = detectLanguage(query);
  const wikiLang = WIKI_LANGS[detected.lang] || 'en';

  const engines = [
    { name: 'google', skip: !(env.GOOGLE_API_KEY && env.GOOGLE_CX), fn: () => fetchGoogle(encodedQuery, env) },
    { name: 'bing', skip: !env.BING_API_KEY, fn: () => fetchBing(encodedQuery, env) },
    { name: 'duckduckgo', skip: false, fn: () => fetchDuckDuckGo(encodedQuery, detected.lang) },
    { name: 'brave', skip: !env.BRAVE_API_KEY, fn: () => fetchBrave(encodedQuery, env) },
    { name: 'yandex', skip: !(env.YANDEX_USER && env.YANDEX_KEY), fn: () => fetchYandex(encodedQuery, env) },
    { name: 'searxng', skip: !env.SEARXNG_URL, fn: () => fetchSearXNG(encodedQuery, env) },
    { name: `wikipedia-${wikiLang}`, skip: false, fn: () => fetchWikipedia(encodedQuery, wikiLang) },
    ...(wikiLang !== 'en' ? [{ name: 'wikipedia-en', skip: false, fn: () => fetchWikipedia(encodedQuery, 'en') }] : []),
    { name: 'wiby', skip: false, fn: () => fetchWiby(encodedQuery) },
    { name: 'marginalia', skip: false, fn: () => fetchMarginalia(encodedQuery, env) },
    { name: 'mojeek', skip: !env.MOJEEK_API_KEY, fn: () => fetchMojeek(encodedQuery, env) },
  ];

  const results = await Promise.allSettled(
    engines.map(async (engine) => {
      if (engine.skip) return { name: engine.name, status: 'skipped', reason: 'API key not configured' };
      const start = Date.now();
      try {
        const data = await fetchWithTimeout(engine.fn, timeoutMs);
        const ms = Date.now() - start;
        return {
          name: engine.name,
          status: 'ok',
          count: Array.isArray(data) ? data.length : 0,
          ms,
          sample: Array.isArray(data) && data.length > 0 ? data[0] : null,
        };
      } catch (err) {
        return {
          name: engine.name,
          status: 'error',
          ms: Date.now() - start,
          error: err.message || String(err),
        };
      }
    }),
  );

  const engineResults = results.map((r) => r.status === 'fulfilled' ? r.value : { status: 'error', error: r.reason?.message || String(r.reason) });

  const keys = {
    QWEN_API_KEY: !!env.QWEN_API_KEY,
    GOOGLE_API_KEY: !!env.GOOGLE_API_KEY,
    GOOGLE_CX: !!env.GOOGLE_CX,
    BING_API_KEY: !!env.BING_API_KEY,
    BRAVE_API_KEY: !!env.BRAVE_API_KEY,
    YANDEX_USER: !!env.YANDEX_USER,
    YANDEX_KEY: !!env.YANDEX_KEY,
    MOJEEK_API_KEY: !!env.MOJEEK_API_KEY,
    MARGINALIA_KEY: !!env.MARGINALIA_KEY,
    SEARXNG_URL: env.SEARXNG_URL || null,
  };

  return jsonResponse({
    query,
    detectedLanguage: detected,
    timeoutMs,
    configuredKeys: keys,
    engines: engineResults,
    summary: {
      total: engineResults.length,
      ok: engineResults.filter((e) => e.status === 'ok').length,
      skipped: engineResults.filter((e) => e.status === 'skipped').length,
      errored: engineResults.filter((e) => e.status === 'error').length,
      totalResults: engineResults.reduce((sum, e) => sum + (e.count || 0), 0),
    },
  });
}

async function handleSearch(query, env, lang) {
  if (query.length > MAX_QUERY_LENGTH) {
    return jsonResponse({ error: `Query too long (max ${MAX_QUERY_LENGTH} characters)` }, 400);
  }

  try {
    const rawResults = await fetchAllSources(query, env);

    if (rawResults.length === 0) {
      const detected = detectLanguage(query);
      return jsonResponse({
        type: 'info',
        query,
        answer: NO_RESULTS_MSG[detected.lang] || NO_RESULTS_MSG.en,
        sources: [],
        related: [],
      });
    }

    const deduplicated = deduplicateResults(rawResults, parseInt(env.MAX_RESULTS) || 15);
    const aiResponse = await callQwen(query, deduplicated, env, lang);

    return jsonResponse(aiResponse);
  } catch (err) {
    return jsonResponse({ error: 'Internal server error', message: err.message }, 500);
  }
}

async function fetchAllSources(query, env) {
  const encodedQuery = encodeURIComponent(query);
  const timeoutMs = parseInt(env.SEARCH_TIMEOUT_MS) || 15000;
  const detected = detectLanguage(query);
  const fetchers = [];

  if (env.GOOGLE_API_KEY && env.GOOGLE_CX) {
    fetchers.push(fetchWithTimeout(() => fetchGoogle(encodedQuery, env), timeoutMs));
  }
  if (env.BING_API_KEY) {
    fetchers.push(fetchWithTimeout(() => fetchBing(encodedQuery, env), timeoutMs));
  }
  fetchers.push(fetchWithTimeout(() => fetchDuckDuckGo(encodedQuery, detected.lang), timeoutMs));
  if (env.BRAVE_API_KEY) {
    fetchers.push(fetchWithTimeout(() => fetchBrave(encodedQuery, env), timeoutMs));
  }
  if (env.YANDEX_USER && env.YANDEX_KEY) {
    fetchers.push(fetchWithTimeout(() => fetchYandex(encodedQuery, env), timeoutMs));
  }
  if (env.SEARXNG_URL) {
    fetchers.push(fetchWithTimeout(() => fetchSearXNG(encodedQuery, env), timeoutMs));
  }
  const wikiLang = WIKI_LANGS[detected.lang] || 'en';
  fetchers.push(fetchWithTimeout(() => fetchWikipedia(encodedQuery, wikiLang), timeoutMs));
  if (wikiLang !== 'en') {
    fetchers.push(fetchWithTimeout(() => fetchWikipedia(encodedQuery, 'en'), timeoutMs));
  }
  fetchers.push(fetchWithTimeout(() => fetchWiby(encodedQuery), timeoutMs));
  fetchers.push(fetchWithTimeout(() => fetchMarginalia(encodedQuery, env), timeoutMs));
  if (env.MOJEEK_API_KEY) {
    fetchers.push(fetchWithTimeout(() => fetchMojeek(encodedQuery, env), timeoutMs));
  }

  const settled = await Promise.allSettled(fetchers);
  const results = [];

  for (const result of settled) {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      results.push(...result.value);
    }
  }

  return results;
}

function fetchWithTimeout(fn, ms) {
  return Promise.race([
    fn(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

async function fetchGoogle(encodedQuery, env) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(env.GOOGLE_API_KEY)}&cx=${encodeURIComponent(env.GOOGLE_CX)}&q=${encodedQuery}&num=10`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((item) => ({
    title: item.title || '',
    url: item.link || '',
    snippet: item.snippet || '',
    source: 'google',
  }));
}

async function fetchBing(encodedQuery, env) {
  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodedQuery}&count=10`;
  const res = await fetch(url, {
    headers: { 'Ocp-Apim-Subscription-Key': env.BING_API_KEY },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.webPages?.value || []).map((item) => ({
    title: item.name || '',
    url: item.url || '',
    snippet: item.snippet || '',
    source: 'bing',
  }));
}

async function fetchDuckDuckGo(encodedQuery, lang) {
  const region = DDG_REGIONS[lang] || 'wt-wt';
  const res = await fetch('https://html.duckduckgo.com/html/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    body: `q=${encodedQuery}&kl=${region}`,
  });
  if (res.status !== 200) return [];
  const html = await res.text();
  const results = [];
  const blocks = html.split('class="result__body"');
  for (let i = 1; i < blocks.length && results.length < 10; i++) {
    const block = blocks[i];
    const titleMatch = block.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/);
    const hrefMatch = block.match(/class="result__a"[^>]*href="([^"]*)"/);
    const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
    if (!titleMatch || !hrefMatch) continue;
    const href = hrefMatch[1].replace(/&amp;/g, '&');
    const uddgMatch = href.match(/[?&]uddg=([^&]+)/);
    const url = uddgMatch ? decodeURIComponent(uddgMatch[1]) : '';
    if (!url || !url.startsWith('http')) continue;
    results.push({
      title: decodeEntities(stripTags(titleMatch[1])).trim(),
      url,
      snippet: snippetMatch ? decodeEntities(stripTags(snippetMatch[1])).trim() : '',
      source: 'duckduckgo',
    });
  }
  return results;
}

async function fetchBrave(encodedQuery, env) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodedQuery}&count=10`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': env.BRAVE_API_KEY,
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.web?.results || []).map((item) => ({
    title: item.title || '',
    url: item.url || '',
    snippet: item.description || '',
    source: 'brave',
  }));
}

async function fetchYandex(encodedQuery, env) {
  const url = `https://yandex.com/search/xml?user=${encodeURIComponent(env.YANDEX_USER)}&key=${encodeURIComponent(env.YANDEX_KEY)}&query=${encodedQuery}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const xml = await res.text();
  return parseYandexXml(xml);
}

function parseYandexXml(xml) {
  const results = [];
  const docRegex = /<doc>([\s\S]*?)<\/doc>/g;
  let match;

  while ((match = docRegex.exec(xml)) !== null) {
    const block = match[1];
    const urlMatch = block.match(/<url>(.*?)<\/url>/);
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    const snippetMatch = block.match(/<headline>([\s\S]*?)<\/headline>/) ||
                         block.match(/<passage>([\s\S]*?)<\/passage>/);

    if (urlMatch) {
      results.push({
        title: stripTags(titleMatch?.[1] || ''),
        url: urlMatch[1],
        snippet: stripTags(snippetMatch?.[1] || ''),
        source: 'yandex',
      });
    }
  }

  return results;
}

function stripTags(str) {
  return str.replace(/<[^>]*>/g, '').trim();
}

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function detectLanguage(query) {
  const cleaned = query.replace(/[\s\d\p{P}]/gu, '');
  if (!cleaned) return { lang: 'en', script: 'latin' };

  const scripts = [
    { lang: 'ko', script: 'hangul', regex: /\p{Script=Hangul}/u },
    { lang: 'ja', script: 'japanese', regex: /[\p{Script=Hiragana}\p{Script=Katakana}]/u },
    { lang: 'zh', script: 'chinese', regex: /\p{Script=Han}/u },
    { lang: 'th', script: 'thai', regex: /\p{Script=Thai}/u },
    { lang: 'ar', script: 'arabic', regex: /\p{Script=Arabic}/u },
    { lang: 'hi', script: 'devanagari', regex: /\p{Script=Devanagari}/u },
    { lang: 'ru', script: 'cyrillic', regex: /\p{Script=Cyrillic}/u },
  ];

  for (const s of scripts) {
    if (s.regex.test(cleaned)) return { lang: s.lang, script: s.script };
  }
  return { lang: 'en', script: 'latin' };
}

const DDG_REGIONS = {
  ko: 'kr-kr', ja: 'jp-jp', zh: 'cn-zh', th: 'th-en',
  ar: 'xa-ar', hi: 'in-en', ru: 'ru-ru', en: 'wt-wt',
  de: 'de-de', fr: 'fr-fr', es: 'es-es', pt: 'br-pt',
  it: 'it-it', nl: 'nl-nl', pl: 'pl-pl', tr: 'tr-tr',
  vi: 'vn-vi', id: 'id-id',
};

const WIKI_LANGS = {
  ko: 'ko', ja: 'ja', zh: 'zh', th: 'th', ar: 'ar',
  hi: 'hi', ru: 'ru', en: 'en', de: 'de', fr: 'fr',
  es: 'es', pt: 'pt', it: 'it', nl: 'nl', pl: 'pl',
  tr: 'tr', vi: 'vi', id: 'id',
};

const RESPONSE_LANG_NAMES = {
  ko: 'Korean', ja: 'Japanese', zh: 'Chinese', es: 'Spanish',
  fr: 'French', de: 'German', ru: 'Russian', pt: 'Portuguese',
  ar: 'Arabic', vi: 'Vietnamese', th: 'Thai', hi: 'Hindi',
  it: 'Italian', tr: 'Turkish', nl: 'Dutch', pl: 'Polish', id: 'Indonesian',
};

const NO_RESULTS_MSG = {
  ko: '검색 결과를 찾을 수 없습니다.',
  ja: '検索結果が見つかりませんでした。',
  zh: '未找到搜索结果。',
  th: 'ไม่พบผลการค้นหา',
  ar: 'لم يتم العثور على نتائج بحث.',
  hi: 'खोज परिणाम नहीं मिले।',
  ru: 'Результаты поиска не найдены.',
  en: 'No search results found.',
};

async function fetchSearXNG(encodedQuery, env) {
  const base = (env.SEARXNG_URL || 'https://search.ononoki.org').replace(/\/+$/, '');
  const url = `${base}/search?q=${encodedQuery}&format=json&categories=general`;
  const res = await fetch(url, { headers: { 'User-Agent': BOT_USER_AGENT } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).slice(0, 10).map((item) => ({
    title: item.title || '',
    url: item.url || '',
    snippet: item.content || '',
    source: 'searxng',
  }));
}

async function fetchWikipedia(encodedQuery, lang) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedQuery}&srlimit=5&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': BOT_USER_AGENT, 'Api-User-Agent': BOT_USER_AGENT } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.query?.search || []).map((item) => ({
    title: item.title || '',
    url: `https://${lang}.wikipedia.org/?curid=${item.pageid}`,
    snippet: stripTags(item.snippet || ''),
    source: `wikipedia-${lang}`,
  }));
}

async function fetchWiby(encodedQuery) {
  const url = `https://wiby.me/json/?q=${encodedQuery}`;
  const res = await fetch(url, { headers: { 'User-Agent': BOT_USER_AGENT } });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.slice(0, 10).map((item) => ({
    title: item.Title || '',
    url: item.URL || '',
    snippet: item.Snippet || '',
    source: 'wiby',
  }));
}

async function fetchMarginalia(encodedQuery, env) {
  const key = env.MARGINALIA_KEY || 'public';
  const url = `https://api.marginalia.nu/${encodeURIComponent(key)}/search/${encodedQuery}`;
  const res = await fetch(url, { headers: { 'User-Agent': BOT_USER_AGENT } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).slice(0, 10).map((item) => ({
    title: item.title || '',
    url: item.url || '',
    snippet: item.description || '',
    source: 'marginalia',
  }));
}

async function fetchMojeek(encodedQuery, env) {
  const url = `https://api.mojeek.com/search?q=${encodedQuery}&api_key=${encodeURIComponent(env.MOJEEK_API_KEY)}&fmt=json`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.response?.results || []).slice(0, 10).map((item) => ({
    title: item.title || '',
    url: item.url || '',
    snippet: item.desc || '',
    source: 'mojeek',
  }));
}

function deduplicateResults(results, maxResults) {
  const seen = new Set();
  const deduped = [];

  for (const item of results) {
    if (!item.url) continue;
    const key = normalizeUrl(item.url);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
    if (deduped.length >= maxResults) break;
  }

  return deduped;
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    return (parsed.hostname + parsed.pathname).replace(/\/+$/, '').toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

async function callQwen(query, results, env, lang) {
  if (!env.QWEN_API_KEY) {
    return buildFallbackResponse(query, results);
  }

  const searchContext = results
    .map((r, i) => `[${i + 1}] ${r.title}\n    URL: ${r.url}\n    ${r.snippet}`)
    .join('\n\n');

  const userPrompt = `Query: ${query}\n\nSearch Results:\n${searchContext}`;

  let systemPrompt = SYSTEM_PROMPT;
  if (lang && lang !== 'en' && RESPONSE_LANG_NAMES[lang]) {
    systemPrompt = SYSTEM_PROMPT.replace(
      'Respond in the same language as the query.',
      `Always respond in ${RESPONSE_LANG_NAMES[lang]}, regardless of the query language.`,
    );
  }

  try {
    const res = await fetchWithTimeout(
      () => fetch(QWEN_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.QWEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: env.QWEN_MODEL || 'qwen3.5-plus',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      }),
      15000,
    );

    if (!res.ok) {
      return buildFallbackResponse(query, results);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return buildFallbackResponse(query, results);
    }

    const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.type || !parsed.query) {
      return buildFallbackResponse(query, results);
    }

    return parsed;
  } catch {
    return buildFallbackResponse(query, results);
  }
}

function buildFallbackResponse(query, results) {
  return {
    type: 'site',
    query,
    sites: results.slice(0, 5).map((r) => ({
      name: r.title,
      url: r.url,
      description: r.snippet,
    })),
    related: [],
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

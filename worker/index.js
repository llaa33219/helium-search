const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const QWEN_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';

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
      return handleSearch(query.trim(), env);
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

const MAX_QUERY_LENGTH = 500;

async function handleSearch(query, env) {
  if (query.length > MAX_QUERY_LENGTH) {
    return jsonResponse({ error: `Query too long (max ${MAX_QUERY_LENGTH} characters)` }, 400);
  }

  try {
    const rawResults = await fetchAllSources(query, env);

    if (rawResults.length === 0) {
      return jsonResponse({
        type: 'info',
        query,
        answer: '검색 결과를 찾을 수 없습니다.',
        sources: [],
        related: [],
      });
    }

    const deduplicated = deduplicateResults(rawResults, parseInt(env.MAX_RESULTS) || 15);
    const aiResponse = await callQwen(query, deduplicated, env);

    return jsonResponse(aiResponse);
  } catch (err) {
    return jsonResponse({ error: 'Internal server error', message: err.message }, 500);
  }
}

async function fetchAllSources(query, env) {
  const encodedQuery = encodeURIComponent(query);
  const timeoutMs = parseInt(env.SEARCH_TIMEOUT_MS) || 3000;
  const fetchers = [];

  if (env.GOOGLE_API_KEY && env.GOOGLE_CX) {
    fetchers.push(fetchWithTimeout(() => fetchGoogle(encodedQuery, env), timeoutMs));
  }
  if (env.BING_API_KEY) {
    fetchers.push(fetchWithTimeout(() => fetchBing(encodedQuery, env), timeoutMs));
  }
  fetchers.push(fetchWithTimeout(() => fetchDuckDuckGo(encodedQuery), timeoutMs));
  if (env.BRAVE_API_KEY) {
    fetchers.push(fetchWithTimeout(() => fetchBrave(encodedQuery, env), timeoutMs));
  }
  if (env.YANDEX_USER && env.YANDEX_KEY) {
    fetchers.push(fetchWithTimeout(() => fetchYandex(encodedQuery, env), timeoutMs));
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

async function fetchDuckDuckGo(encodedQuery) {
  const url = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&no_redirect=1`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const results = [];

  if (data.AbstractText && data.AbstractURL) {
    results.push({
      title: data.AbstractSource || 'DuckDuckGo',
      url: data.AbstractURL,
      snippet: data.AbstractText,
      source: 'duckduckgo',
    });
  }

  for (const topic of data.RelatedTopics || []) {
    if (topic.FirstURL && topic.Text) {
      results.push({
        title: topic.Text.split(' - ')[0] || topic.Text,
        url: topic.FirstURL,
        snippet: topic.Text,
        source: 'duckduckgo',
      });
    }
    for (const sub of topic.Topics || []) {
      if (sub.FirstURL && sub.Text) {
        results.push({
          title: sub.Text.split(' - ')[0] || sub.Text,
          url: sub.FirstURL,
          snippet: sub.Text,
          source: 'duckduckgo',
        });
      }
    }
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

async function callQwen(query, results, env) {
  if (!env.QWEN_API_KEY) {
    return buildFallbackResponse(query, results);
  }

  const searchContext = results
    .map((r, i) => `[${i + 1}] ${r.title}\n    URL: ${r.url}\n    ${r.snippet}`)
    .join('\n\n');

  const userPrompt = `Query: ${query}\n\nSearch Results:\n${searchContext}`;

  try {
    const res = await fetchWithTimeout(
      () => fetch(QWEN_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.QWEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: env.QWEN_MODEL || 'qwen-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      }),
      10000,
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

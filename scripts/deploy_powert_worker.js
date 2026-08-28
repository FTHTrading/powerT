const fs = require('fs');
const path = require('path');

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '07bcc4a189ef176261b818409c95891f';
const zoneId = process.env.CLOUDFLARE_ZONE_ID || '40ce3ca38991756ee115a650cfea0d14'; // unykorn.ai

if (!token) {
  console.error('Error: CLOUDFLARE_API_TOKEN environment variable is required.');
  process.exit(1);
}

async function deploy() {
  const html = fs.readFileSync(path.join(__dirname, '../apps/portal/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../apps/portal/styles.css'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, '../apps/portal/app.js'), 'utf8');

  // Create standalone worker bundling HTML, CSS, JS with direct media streaming proxy
  const workerScript = `
const HTML_CONTENT = ${JSON.stringify(html)};
const CSS_CONTENT = ${JSON.stringify(css)};
const JS_CONTENT = ${JSON.stringify(js)};

const RAW_BASE = "https://raw.githubusercontent.com/FTHTrading/powerT/main/apps/portal/assets";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Direct matchers for video & image media assets
    const mediaMap = {
      '/assets/miami_flamingos.mp4': { file: 'miami_flamingos.mp4', type: 'video/mp4' },
      '/assets/video_hero.mp4': { file: 'video_hero.mp4', type: 'video/mp4' },
      '/assets/hero_bg.jpg': { file: 'hero_bg.jpg', type: 'image/jpeg' },
      '/assets/bill_walsh.jpg': { file: 'bill_walsh.jpg', type: 'image/jpeg' },
      '/assets/kevin_harrington.jpg': { file: 'kevin_harrington.jpg', type: 'image/jpeg' },
      '/assets/les_brown.jpg': { file: 'les_brown.jpg', type: 'image/jpeg' },
      '/assets/brian_tracy.jpg': { file: 'brian_tracy.jpg', type: 'image/jpeg' },
      '/assets/mark_victor_hansen.jpg': { file: 'mark_victor_hansen.jpg', type: 'image/jpeg' },
      '/assets/sharon_lechter.jpg': { file: 'sharon_lechter.jpg', type: 'image/jpeg' },
      '/assets/forbes_riley.jpg': { file: 'forbes_riley.jpg', type: 'image/jpeg' },
      '/assets/austin_walsh.jpg': { file: 'austin_walsh.jpg', type: 'image/jpeg' },
      '/assets/book_unykorn_sovereign.jpg': { file: 'book_unykorn_sovereign.jpg', type: 'image/jpeg' },
      '/assets/book_the_obvious.jpg': { file: 'book_the_obvious.jpg', type: 'image/jpeg' },
      '/assets/book_act_now.jpg': { file: 'book_act_now.jpg', type: 'image/jpeg' },
      '/assets/book_chicken_soup.jpg': { file: 'book_chicken_soup.jpg', type: 'image/jpeg' },
      '/assets/book_eat_that_frog.jpg': { file: 'book_eat_that_frog.jpg', type: 'image/jpeg' },
      '/assets/book_sharon_lechter.jpg': { file: 'book_sharon_lechter.jpg', type: 'image/jpeg' },
      '/assets/book_pitch_perfection.jpg': { file: 'book_pitch_perfection.jpg', type: 'image/jpeg' },
      '/assets/unykorn_logo.png': { file: 'unykorn_logo.png', type: 'image/png' },
      '/assets/fth_logo.png': { file: 'fth_logo.png', type: 'image/png' }
    };

    if (mediaMap[pathname]) {
      const { file, type } = mediaMap[pathname];
      const upstream = await fetch(RAW_BASE + '/' + file, {
        headers: {
          'User-Agent': 'Mozilla/5.0 Cloudflare-Worker',
          ...(request.headers.has('range') ? { 'Range': request.headers.get('range') } : {})
        }
      });

      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set('Content-Type', type);
      responseHeaders.set('Cache-Control', 'public, max-age=86400');
      responseHeaders.set('Access-Control-Allow-Origin', '*');

      return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders
      });
    }

    // Generic assets handler
    if (pathname.startsWith('/assets/')) {
      const cleanName = pathname.replace('/assets/', '');
      const upstream = await fetch(RAW_BASE + '/' + encodeURIComponent(cleanName), {
        headers: { 'User-Agent': 'Mozilla/5.0 Cloudflare-Worker' }
      });
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          'Content-Type': cleanName.endsWith('.mp4') ? 'video/mp4' : (cleanName.endsWith('.png') ? 'image/png' : 'image/jpeg'),
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 2. CSS stylesheet
    if (pathname === '/styles.css') {
      return new Response(CSS_CONTENT, {
        headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // 3. Client JS
    if (pathname === '/app.js') {
      return new Response(JS_CONTENT, {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // 4. Health endpoint
    if (pathname === '/health' || pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', domain: 'powert.unykorn.ai', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Default HTML page
    return new Response(HTML_CONTENT, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' }
    });
  }
};
`;

  console.log('1. Uploading Worker script: powert-portal with Speaker Headshots & Convergence...');
  const formData = new FormData();
  const metadata = {
    main_module: 'worker.js',
    compatibility_date: '2026-08-28'
  };
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('worker.js', new Blob([workerScript], { type: 'application/javascript+module' }), 'worker.js');

  const uploadRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/powert-portal`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const uploadData = await uploadRes.json();
  console.log('Upload Result:', uploadData.success ? 'SUCCESS' : uploadData.errors);
}

deploy().catch(console.error);

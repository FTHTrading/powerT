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

  // Create standalone worker bundling HTML, CSS, JS with asset fallback
  const workerScript = `
const HTML_CONTENT = ${JSON.stringify(html)};
const CSS_CONTENT = ${JSON.stringify(css)};
const JS_CONTENT = ${JSON.stringify(js)};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/styles.css') {
      return new Response(CSS_CONTENT, {
        headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    if (pathname === '/app.js') {
      return new Response(JS_CONTENT, {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    if (pathname === '/health' || pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', domain: 'powert.unykorn.ai', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default HTML page
    return new Response(HTML_CONTENT, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' }
    });
  }
};
`;

  console.log('1. Uploading Worker script: powert-portal...');
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

  console.log('2. Attaching Worker Custom Domain: powert.unykorn.ai...');
  const domainRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/domains`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      zone_id: zoneId,
      hostname: 'powert.unykorn.ai',
      service: 'powert-portal',
      environment: 'production'
    })
  });
  const domainData = await domainRes.json();
  console.log('Domain Result:', domainData.success ? 'SUCCESS' : domainData.errors);
  console.log(JSON.stringify(domainData, null, 2));
}

deploy().catch(console.error);

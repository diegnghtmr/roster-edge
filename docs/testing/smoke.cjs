const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const { once } = require('node:events');
const { mkdir, stat } = require('node:fs/promises');
const net = require('node:net');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '../..');
const frontend = path.join(root, 'frontend');
const jar = path.join(root, 'backend/target/backend-0.0.1-SNAPSHOT.jar');
const host = '127.0.0.1';
const web = `http://${host}:5173`;
const api = `http://${host}:8074/api`;
const pgPort = process.env.POSTGRES_PORT ?? '5431';
const database = process.env.POSTGRES_DB;
const schema = `roster_smoke_${randomBytes(6).toString('hex')}`;
const shots = process.env.ROSTER_SHOTS_DIR;
const email = 'roster@example.invalid';
const demoPassword = 'RosterDemo-only!21';
const errors = [];
const abort = new AbortController();
let passed = 0;
let failed = 0;

function psql(args, searchPath) {
  const result = spawnSync('psql', ['-X', '-w', '-h', host, '-p', pgPort, '-d', database,
    '-U', process.env.POSTGRES_USER, '-v', 'ON_ERROR_STOP=1', ...args], {
    env: { ...process.env, PGPASSWORD: process.env.POSTGRES_PASSWORD ?? '', PGPASSFILE: path.join(frontend, 'dist', schema),
      PGOPTIONS: searchPath ? `-c search_path=${searchPath}` : '' },
    stdio: 'inherit', timeout: 10000,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, 'psql failed');
}

async function requireFreePort(port) {
  const socket = net.createServer();
  socket.listen(port, host);
  await once(socket, 'listening');
  await new Promise((resolve, reject) => socket.close(error => error ? reject(error) : resolve()));
}

async function waitForBackend(backend) {
  for (let attempt = 0; attempt < 60; attempt++) {
    abort.signal.throwIfAborted();
    assert.equal(backend.exitCode, null, 'Packaged backend exited before becoming healthy');
    const response = await fetch(`${api}/health/`, { signal: AbortSignal.timeout(800) }).catch(() => null);
    if (response?.ok && (await response.json()).status === 'UP') return;
    await delay(500);
  }
  throw new Error('Packaged backend did not become healthy');
}

async function stopBackend(backend) {
  if (!backend?.pid || backend.exitCode !== null || backend.signalCode !== null) return;
  const closed = once(backend, 'exit');
  backend.kill('SIGTERM');
  const killTimer = setTimeout(() => backend.kill('SIGKILL'), 5000);
  try { await closed; } finally { clearTimeout(killTimer); }
}

async function step(name, run) {
  abort.signal.throwIfAborted();
  try {
    const value = await run();
    passed++;
    console.log(`PASS ${name}`);
    return value;
  } catch (error) {
    failed++;
    console.error(`FAIL ${name}`);
    throw error;
  }
}

async function newPage(browser, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, timezoneId: 'America/Bogota', serviceWorkers: 'block' });
  await context.route('**/*', route => {
    const origin = new URL(route.request().url()).origin;
    return origin === web || origin === new URL(api).origin ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  page.on('pageerror', error => errors.push(error.message));
  return page;
}

async function shot(page, name, charts = false) {
  if (!shots) return;
  await page.evaluate(() => document.fonts.ready);
  if (charts) {
    await page.locator('svg.recharts-surface .recharts-rectangle').first().waitFor();
    await delay(1600); // Recharts animates the SVG geometry in JavaScript.
  }
  const output = path.resolve(shots, `${name}.png`);
  await page.screenshot({ path: output, animations: 'disabled' });
  console.log(`CAPTURE ${output}`);
}

const go = (page, route) => page.goto(`${web}${route}`, { waitUntil: 'domcontentloaded' });
const heading = (page, name) => page.getByRole('heading', { name, exact: true }).waitFor();
const visible = (page, text) => page.getByText(text, { exact: true }).first().waitFor();

function browserResponse(page, endpoint, method = 'GET') {
  const wait = page.waitForResponse(response =>
    new URL(response.url()).pathname === `/api/${endpoint}/` && response.request().method() === method);
  // Avoid an unhandled rejection if an earlier click or navigation fails.
  wait.catch(() => {});
  return wait;
}

async function data(response, expected = 200) {
  const status = typeof response.status === 'function' ? response.status() : response.status;
  assert.equal(status, expected, `${typeof response.url === 'function' ? response.url() : response.url}: HTTP ${status}`);
  const payload = await response.json();
  assert.equal(payload.success, true);
  return payload.data;
}

function request(resource, token, method = 'GET', payload) {
  return fetch(`${api}/${resource}`, {
    method,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...(payload && { 'Content-Type': 'application/json' }) },
    ...(payload && { body: JSON.stringify(payload) }),
    signal: AbortSignal.timeout(6000),
  });
}

async function signIn(page, destination) {
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(demoPassword);
  const login = browserResponse(page, 'roster/login', 'POST');
  const me = browserResponse(page, 'roster/me');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  const session = await data(await login);
  const profile = await data(await me);
  assert.equal(profile.email, email);
  await page.waitForURL(`${web}${destination}`);
  return { token: session.token, profile };
}

async function select(page, id, label) {
  await page.locator(`#${id}`).click();
  await page.getByRole('option', { name: label, exact: typeof label === 'string' }).click();
}

function dateOnly(value) {
  if (!Array.isArray(value)) return value;
  const [year, month, day] = value;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function report(page, slug, title) {
  const needsTeam = slug === 'schedule-density';
  const endpoint = `analytics/reports/${slug}`;
  const response = needsTeam ? undefined : browserResponse(page, endpoint);
  await go(page, `/reports/${slug}`);
  await heading(page, title);
  await page.getByRole('img', { name: 'roster' }).evaluate(image => image.decode());
  if (!needsTeam) return data(await response);

  await page.getByRole('button', { name: 'Mostrar' }).click();
  const teamSelect = page.getByRole('combobox').filter({ has: page.locator('option', { hasText: 'Seleccionar equipo' }) });
  const teamOption = teamSelect.locator('option', { hasText: /^Mirador FC\b/ });
  await teamOption.waitFor({ state: 'attached' });
  await teamSelect.selectOption(await teamOption.getAttribute('value'));
  const filtered = browserResponse(page, endpoint);
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();
  await visible(page, 'Evolucion del Descanso y Densidad');
  return data(await filtered);
}

const standings = token => request('analytics/reports/season-standings/', token).then(response => data(response));

async function flows(browser) {
  const page = await newPage(browser, 1440, 900);
  const { token, profile } = await step('login rejects invalid credentials and returns to the dashboard', async () => {
    await go(page, '/login');
    await page.locator('#email').fill(email);
    await shot(page, 'login');
    await page.locator('#password').fill('invalid-demo-password');
    const denied = browserResponse(page, 'roster/login', 'POST');
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    assert.equal((await denied).status(), 401);
    await visible(page, 'Credenciales incorrectas');
    const signedIn = await signIn(page, '/dashboard');
    await visible(page, 'Mirador FC');
    if (shots) await page.getByText(/Credenciales incorrectas/).first().waitFor({ state: 'hidden' });
    await shot(page, 'dashboard');
    return signedIn;
  });

  await step('signed-out deep link survives login with query and fragment', async () => {
    const deepLink = '/teams?demo=return#catalog';
    const anonymous = await newPage(browser, 1440, 900);
    try {
      await go(anonymous, deepLink);
      await anonymous.waitForURL(`${web}/login`);
      const isolated = await signIn(anonymous, deepLink);
      await visible(anonymous, 'Mirador FC');
      assert.equal((await request('roster/logout/', isolated.token, 'POST')).status, 200);
    } finally {
      await anonymous.context().close();
    }
  });

  const team = await step('creates a team from live catalogs and sees it in the scoped list', async () => {
    await go(page, '/teams-create');
    await page.locator('#name').fill('Bambú City FC');
    await page.locator('#mascot').fill('Colibrí');
    await page.locator('#foundation').fill('2023-08-17');
    await select(page, 'genderId', 'Mixto');
    await select(page, 'categoryId', 'Senior');
    await select(page, 'clubId', 'Guadua Athletic');
    const response = browserResponse(page, 'teams', 'POST');
    await page.locator('form button[type=submit]').click();
    const created = await data(await response, 201);
    assert.equal(created.clubId, profile.clubId);
    await page.waitForURL(`${web}/teams`);
    await visible(page, 'Bambú City FC');
    assert.equal(await page.getByText('Sierra Norte', { exact: true }).count(), 0);
    await shot(page, 'teams');
    return created;
  });

  const before = await standings(token);
  assert.equal(before.length, 4);
  const match = await step('schedules a fixture with an America/Bogota date-only round trip', async () => {
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
      .format(new Date(Date.now() + 8 * 86400000));
    await go(page, '/matches-create');
    assert.equal(await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone), 'America/Bogota');
    await page.locator('#date').fill(date);
    assert.equal(await page.locator('#date').inputValue(), date);
    await page.locator('#startTime').fill('14:00');
    await page.locator('#endTime').fill('16:00');
    await select(page, 'stadiumId', /Césped natural/);
    await select(page, 'matchdayId', 'Jornada de liga');
    await select(page, 'eventId', 'Liga Guadua · Jornada');
    await select(page, 'homeTeamId', /^Bambú City FC/);
    await select(page, 'awayTeamId', /^Mirador FC/);
    await shot(page, 'match-create');
    const response = browserResponse(page, 'matches', 'POST');
    await page.locator('form button[type=submit]').click();
    const created = await data(await response, 201);
    assert.equal(dateOnly(created.date), date);
    await page.waitForURL(`${web}/matches`);
    const saved = await data(await request(`matches/${created.id}/`, token));
    assert.equal(dateOnly(saved.date), date);
    await page.getByRole('row').filter({ hasText: 'Bambú City FC' }).waitFor();
    return created;
  });

  await step('records a result from the match list and refreshes fixtures and standings', async () => {
    assert.deepEqual(await standings(token), before);
    const row = page.getByRole('row').filter({ hasText: 'Bambú City FC' });
    assert.ok(await row.getByRole('cell', { name: 'Sin resultado' }).isVisible());
    await row.getByRole('button', { name: 'Registrar resultado' }).click();
    const form = page.getByRole('dialog', { name: 'Registrar resultado' });
    await form.getByRole('spinbutton', { name: 'Goles local' }).fill('2');
    await form.getByRole('spinbutton', { name: 'Goles visitante' }).fill('1');
    await shot(page, 'match-result-desktop');
    const saved = browserResponse(page, `matches/${match.id}/result`, 'PUT');
    await form.getByRole('button', { name: 'Guardar resultado' }).click();
    assert.deepEqual(await data(await saved), { homeScore: 2, awayScore: 1 });
    await form.waitFor({ state: 'hidden' });
    await row.getByRole('cell', { name: '2-1', exact: true }).waitFor();
    const after = await report(page, 'season-standings', 'Tabla de Posiciones');
    assert.equal(after.length, before.length + 1);
    const added = after.find(row => row.teamId === team.id);
    assert.deepEqual([added.played, added.points, added.goalsFor], [1, 3, 2]);
    assert.equal(after.reduce((sum, row) => sum + row.played, 0), before.reduce((sum, row) => sum + row.played, 0) + 2);
    await page.getByRole('row').filter({ hasText: 'Bambú City FC' }).waitFor();
    await page.locator('svg.recharts-surface .recharts-rectangle').first().waitFor();
    await shot(page, 'standings', true);
  });

  await step('downloads a standings PDF generated by the packaged API', async () => {
    const response = browserResponse(page, 'analytics/reports/season-standings/pdf');
    const download = page.waitForEvent('download');
    download.catch(() => {});
    await page.getByRole('button', { name: 'Exportar PDF' }).click();
    const [exported, pdf] = await Promise.all([response, download]);
    assert.equal(exported.status(), 200);
    assert.equal(await exported.headerValue('content-type'), 'application/pdf');
    assert.equal(await exported.headerValue('content-disposition'), 'attachment; filename="season-standings.pdf"');
    assert.equal(pdf.suggestedFilename(), 'season-standings.pdf');
    assert.equal(await pdf.failure(), null);
    const stream = await pdf.createReadStream();
    const { value: firstChunk } = await stream[Symbol.asyncIterator]().next();
    stream.destroy();
    assert.equal(firstChunk?.subarray(0, 5).toString(), '%PDF-');
  });

  const foreign = await data(await request('roster/login/', null, 'POST', { email: 'sierra@example.invalid', password: demoPassword }));
  const foreignClub = (await data(await request('roster/me/', foreign.token))).clubId;
  for (const [slug, title, local, remote] of [
    ['schedule-density', 'Reporte de Densidad del Calendario', 'Mirador FC', 'Sierra Norte'],
    ['payment-method-performance', 'Rendimiento por Metodo de Pago', 'Transferencia', '700000'],
    ['subscription-plan-performance', 'Salud de Planes de Suscripcion', 'Plan Temporada', 'Plan Sierra'],
  ]) {
    await step(`renders ${slug} and scopes it to the authenticated club`, async () => {
      const rows = await report(page, slug, title);
      assert.ok(JSON.stringify(rows).includes(local), `missing fixture ${local}`);
      assert.ok(!JSON.stringify(rows).includes(remote), `unexpected foreign fixture ${remote}`);
      if (slug !== 'schedule-density') await visible(page, local);
      const endpoint = `analytics/reports/${slug}/`;
      const teamFilter = slug === 'schedule-density' ? `&teamId=${rows[0].teamId}` : '';
      assert.deepEqual(await data(await request(`${endpoint}?clubId=${foreignClub}${teamFilter}`, token)), rows);
      const foreignRows = await data(await request(endpoint, foreign.token));
      assert.ok(JSON.stringify(foreignRows).includes(remote), `missing second-club fixture ${remote}`);
      if (slug === 'payment-method-performance') await shot(page, 'payment-report', true);
    });
  }

  await step('staff-role catalog is readable and legacy write routes return to the catalog', async () => {
    const response = browserResponse(page, 'staff-roles');
    await go(page, '/staff-roles');
    const roles = await data(await response);
    await heading(page, 'Roles de Personal');
    await visible(page, 'Entrenador');
    assert.equal(await page.getByRole('link', { name: 'Nuevo Rol' }).count(), 0);
    assert.equal(await page.getByRole('columnheader', { name: 'Acciones' }).count(), 0);
    for (const route of ['/staff-roles-create', `/staff-roles/${roles[0].id}/edit`]) {
      await go(page, route);
      await page.waitForURL(`${web}/staff-roles`);
      await heading(page, 'Roles de Personal');
    }
  });

  async function openProfile() {
    await page.getByRole('button', { name: 'Menú de perfil' }).click();
    await page.getByRole('button', { name: 'Ver perfil' }).click();
    return page.getByRole('dialog', { name: 'Mi Perfil' });
  }

  await step('profile edit persists after a full browser reload', async () => {
    const dialog = await openProfile();
    await dialog.locator('#name').fill('Lucía Demo');
    const update = browserResponse(page, `rosters/${profile.id}`, 'PUT');
    await dialog.getByRole('button', { name: 'Guardar Cambios' }).click();
    assert.equal((await data(await update)).name, 'Lucía Demo');
    await dialog.waitFor({ state: 'hidden' });
    const me = browserResponse(page, 'roster/me');
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal((await data(await me)).name, 'Lucía Demo');
    const persisted = await openProfile();
    assert.equal(await persisted.locator('#name').inputValue(), 'Lucía Demo');
    await persisted.getByRole('button', { name: 'Cancelar' }).click();
  });

  await step('browser logout revokes the previous bearer token', async () => {
    await page.getByRole('button', { name: 'Menú de perfil' }).click();
    const response = browserResponse(page, 'roster/logout', 'POST');
    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
    assert.equal((await response).status(), 200);
    await page.waitForURL(`${web}/login`);
    assert.equal(await page.evaluate(() => localStorage.getItem('token')), null);
    assert.equal((await request('roster/me/', token)).status, 401);
  });

  await step('mobile match schedule, result form and report catalog render at 390 × 844', async () => {
    const mobile = await newPage(browser, 390, 844);
    try {
      await go(mobile, '/matches');
      await mobile.waitForURL(`${web}/login`);
      const session = await signIn(mobile, '/matches');
      const row = mobile.getByRole('row').filter({ hasText: 'Bambú City FC' });
      await row.waitFor();
      await shot(mobile, 'matches-mobile');
      await row.getByRole('button', { name: 'Editar resultado' }).click();
      const form = mobile.getByRole('dialog', { name: 'Editar resultado' });
      assert.equal(await form.getByRole('spinbutton', { name: 'Goles local' }).inputValue(), '2');
      assert.equal(await form.getByRole('spinbutton', { name: 'Goles visitante' }).inputValue(), '1');
      assert.ok(await form.evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
      await shot(mobile, 'match-result-mobile');
      await form.getByRole('button', { name: 'Cancelar' }).click();
      await go(mobile, '/reports');
      await heading(mobile, 'Reportes y Análiticas');
      await shot(mobile, 'reports-mobile');
      assert.equal((await request('roster/logout/', session.token, 'POST')).status, 200);
    } finally {
      await mobile.context().close();
    }
  });
  await step('no uncaught browser exceptions', () => assert.deepEqual(errors, []));
}

async function main() {
  assert.match(database ?? '', /^rosteredge_(int|smoke)$/,
    'Use a disposable local POSTGRES_DB named rosteredge_smoke or rosteredge_int');
  assert.ok(process.env.POSTGRES_USER, 'POSTGRES_USER is required');
  assert.match(pgPort, /^[0-9]+$/);
  await Promise.all([stat(jar), stat(path.join(frontend, 'dist/index.html')), requireFreePort(8074), requireFreePort(5173)]);
  if (shots) await mkdir(shots, { recursive: true });
  const { chromium } = require(process.env.PW || 'playwright');
  const { preview } = await import(pathToFileURL(path.join(frontend, 'node_modules/vite/dist/node/index.js')));
  const java = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin/java') : 'java';
  let backend;
  let server;
  let browser;
  const terminate = () => abort.abort(new Error('Smoke interrupted'));
  process.once('SIGINT', terminate);
  process.once('SIGTERM', terminate);
  try {
    psql(['-c', `CREATE SCHEMA ${schema}`]);
    console.log(`Smoke fixture schema: ${database}.${schema}`);
    backend = spawn(java, ['-jar', jar, '--server.address=127.0.0.1', '--server.port=8074',
      '--spring.profiles.active=dev', `--spring.datasource.url=jdbc:postgresql://${host}:${pgPort}/${database}?currentSchema=${schema}`,
      '--logging.level.org.springframework.jdbc.core=WARN', '--logging.level.co.edu.uniquindio.rosteredge=INFO'],
    { cwd: root, stdio: 'inherit' });
    backend.on('error', error => abort.abort(error));
    await waitForBackend(backend);
    psql(['-f', path.join(__dirname, 'demo.sql')], schema);
    server = await preview({ root: frontend, envFile: false, preview: { host, port: 5173, strictPort: true } });
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE, headless: true });
    await flows(browser);
  } finally {
    try { await browser?.close(); } finally {
      try { await server?.close(); } finally { await stopBackend(backend); }
    }
    process.removeListener('SIGINT', terminate);
    process.removeListener('SIGTERM', terminate);
    console.log(`Smoke checks: ${passed} passed, ${failed} failed`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

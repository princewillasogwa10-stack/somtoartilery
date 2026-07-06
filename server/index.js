import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

// On Vercel, the filesystem is read-only, so we use /tmp for data writes.
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : join(__dirname, 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const SUBMISSIONS_FILE = join(DATA_DIR, 'submissions.json');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Copy seed files from repository to /tmp on Vercel startup
if (process.env.VERCEL) {
  const seedUsers = join(process.cwd(), 'server', 'data', 'users.json');
  const seedSubmissions = join(process.cwd(), 'server', 'data', 'submissions.json');

  if (!existsSync(USERS_FILE) && existsSync(seedUsers)) {
    try {
      const data = readFileSync(seedUsers, 'utf-8');
      writeFileSync(USERS_FILE, data, 'utf-8');
    } catch (e) {
      console.error('Failed to seed users:', e);
    }
  }
  if (!existsSync(SUBMISSIONS_FILE) && existsSync(seedSubmissions)) {
    try {
      const data = readFileSync(seedSubmissions, 'utf-8');
      writeFileSync(SUBMISSIONS_FILE, data, 'utf-8');
    } catch (e) {
      console.error('Failed to seed submissions:', e);
    }
  }
}

for (const file of [USERS_FILE, SUBMISSIONS_FILE]) {
  if (!existsSync(file)) {
    writeFileSync(file, '[]', 'utf-8');
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'galleria-nazareth-secret-key';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO_EMAIL = process.env.TO_EMAIL || 'princewillasogwa10@gmail.com';
console.log('[EMAIL] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
console.log('[EMAIL] resend client initialized:', !!resend);
console.log('[EMAIL] TO_EMAIL:', TO_EMAIL);

const app = express();
app.use(cors());
app.use(express.json());

function readJSON(file) {
  return JSON.parse(readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.email !== 'somtoasogwa10@gmail.com') {
    return res.status(403).json({ error: 'Access denied: Admin only' });
  }
  next();
}

function migrateSubmissions(submissions) {
  let changed = false;
  for (const sub of submissions) {
    if (!sub.status) { sub.status = 'new'; changed = true; }
    if (!sub.notes) { sub.notes = ''; changed = true; }
  }
  return changed;
}

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, password: hash, createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);
  const token = jwt.sign({ id: user.id, name, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name, email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, name: user.name, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email } });
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.patch('/api/user/profile', authMiddleware, async (req, res) => {
  const { profilePicture } = req.body;
  const users = readJSON(USERS_FILE);
  const idx = users.findIndex(u => String(u.id) === String(req.user.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users[idx].profilePicture = profilePicture || '';
  writeJSON(USERS_FILE, users);
  const newToken = jwt.sign({ id: users[idx].id, name: users[idx].name, email: users[idx].email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token: newToken, user: { id: users[idx].id, name: users[idx].name, email: users[idx].email, profilePicture: users[idx].profilePicture } });
});

app.post('/api/inquiry', authMiddleware, async (req, res) => {
  const { interest, works } = req.body;
  const { name, email } = req.user;
  const submissions = readJSON(SUBMISSIONS_FILE);
  const entry = {
    id: Date.now(),
    type: 'inquiry',
    name,
    email,
    interest: interest || '',
    works: works || '',
    createdAt: new Date().toISOString()
  };
  submissions.push(entry);
  writeJSON(SUBMISSIONS_FILE, submissions);
  await sendEmailNotification(entry);
  res.json({ message: 'Your interest has been sent.', entry });
});

app.get('/api/submissions', authMiddleware, adminMiddleware, (req, res) => {
  const submissions = readJSON(SUBMISSIONS_FILE);
  if (migrateSubmissions(submissions)) {
    writeJSON(SUBMISSIONS_FILE, submissions);
  }
  res.json(submissions);
});

app.patch('/api/submissions/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const submissions = readJSON(SUBMISSIONS_FILE);
  const idx = submissions.findIndex(s => String(s.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });
  if (status !== undefined) submissions[idx].status = status;
  if (notes !== undefined) submissions[idx].notes = notes;
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json(submissions[idx]);
});

app.delete('/api/submissions/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  let submissions = readJSON(SUBMISSIONS_FILE);
  const idx = submissions.findIndex(s => String(s.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });
  submissions.splice(idx, 1);
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ message: 'Deleted' });
});

app.post('/api/submissions/bulk-delete', authMiddleware, adminMiddleware, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array required' });
  }
  const idSet = new Set(ids.map(String));
  let submissions = readJSON(SUBMISSIONS_FILE);
  submissions = submissions.filter(s => !idSet.has(String(s.id)));
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ message: `Deleted ${ids.length} inquiries` });
});

app.patch('/api/submissions/bulk-status', authMiddleware, adminMiddleware, (req, res) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0 || !status) {
    return res.status(400).json({ error: 'ids array and status required' });
  }
  const idSet = new Set(ids.map(String));
  const submissions = readJSON(SUBMISSIONS_FILE);
  for (const sub of submissions) {
    if (idSet.has(String(sub.id))) sub.status = status;
  }
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ message: `Updated ${ids.length} inquiries to ${status}` });
});

app.get('/api/users', authMiddleware, adminMiddleware, (req, res) => {
  const users = readJSON(USERS_FILE).map(({ password, ...u }) => u);
  res.json(users);
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  const users = readJSON(USERS_FILE);
  const idx = users.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  writeJSON(USERS_FILE, users);
  res.json({ message: 'User deleted' });
});

async function sendEmailNotification(entry) {
  console.log('[EMAIL] sendEmailNotification called for:', entry.name);
  if (!resend) {
    console.error('[EMAIL] Resend client is NULL — RESEND_API_KEY missing');
    return;
  }
  try {
    const result = await resend.emails.send({
      from: 'SOMTO ATELIER <onboarding@resend.dev>',
      to: TO_EMAIL,
      subject: `New inquiry from ${entry.name}`,
      text: `Name: ${entry.name}\nEmail: ${entry.email}\nInterest: ${entry.interest}\nWorks: ${entry.works}\n\nSubmitted: ${entry.createdAt}`,
      reply_to: entry.email
    });
    console.log('[EMAIL] Send result:', JSON.stringify(result));
  } catch (err) {
    console.error('[EMAIL] Send failed:', err.message);
    console.error('[EMAIL] Full error:', JSON.stringify(err));
  }
}
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`SOMTO ATELIER API running on http://localhost:${PORT}`);
  });
}

export default app;

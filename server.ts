import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { initializeSeedData } from './server/dataStore';
import authRoutes from './server/routes/auth.routes';
import publicRoutes from './server/routes/public.routes';
import adminRoutes from './server/routes/admin.routes';

// Synchronously/Async initialize data store seeds
initializeSeedData().catch(err => console.error('Seed error:', err));

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middlewares
app.use(cors());
// Express body parser with 20MB limit for image uploads (base64)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// API Routes FIRST
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', college: 'Jamal College of Sciences, Mayar' });
});

// Vite development middleware vs production static serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupViteOrStatic().catch(err => console.error('Vite/Static setup error:', err));

// Start server if NOT running on Vercel serverless platform
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🎓 Jamal College of Sciences, Mayar Server Running!`);
    console.log(`📍 Host: http://0.0.0.0:${PORT}`);
    console.log(`====================================================`);
  });
}

export default app;


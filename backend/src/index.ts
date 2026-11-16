import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sample portfolio project endpoint
app.get('/api/projects', (_req: Request, res: Response) => {
  res.json([
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'Personal portfolio built with Next.js and Express.',
      tags: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'TailwindCSS'],
      link: 'https://github.com/kavindusd/porfolio'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

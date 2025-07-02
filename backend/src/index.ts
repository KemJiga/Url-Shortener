import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/db';
import rateLimit from 'express-rate-limit';

import urlRoutes from './routes/urlRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // max 100 requests per window per IP
  })
);

app.use('/', urlRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));

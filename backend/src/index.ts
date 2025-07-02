import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/db';

import urlRoutes from './routes/urlRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));

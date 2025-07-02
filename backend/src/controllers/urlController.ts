import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import db from '../db/db';

export const shortenUrl = (req: Request, res: Response): void => {
  const { longUrl } = req.body;
  if (!longUrl) {
    res.status(400).json({ error: 'Missing longUrl' });
    return;
  }

  const shortCode = nanoid(6);

  db.run(
    `INSERT INTO urls (short_code, long_url) VALUES (?, ?)`,
    [shortCode, longUrl],
    err => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to shorten URL' });
        return;
      }
      res.json({
        shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      });
    }
  );
};

export const redirectUrl = (req: Request, res: Response): void => {
  const { short_code } = req.params;

  db.get(
    `SELECT long_url FROM urls WHERE short_code = ?`,
    [short_code],
    (err, row: { long_url: string }) => {
      if (err || !row) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      // log the visit
      const ip = req.ip;
      const userAgent = req.get('user-agent') || 'Unknown';
      db.run(
        `INSERT INTO visits (short_code, ip, user_agent) VALUES (?, ?, ?)`,
        [short_code, ip, userAgent],
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
      res.redirect(row.long_url);
    }
  );
};

export const getAnalytics = (req: Request, res: Response): void => {
  const { short_code } = req.params;

  db.all(
    `SELECT * FROM visits WHERE short_code = ?`,
    [short_code],
    (err, rows: { ip: string; user_agent: string }[]) => {
      if (err) {
        res.status(500).json({ error: 'Failed to get analytics' });
        return;
      }
      res.json({
        short_code,
        visits: rows.length,
        details: rows,
      });
    }
  );
};

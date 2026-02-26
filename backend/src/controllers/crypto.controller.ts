import { Request, Response, NextFunction } from 'express';
import * as cryptoService from '../services/crypto.service';

export async function getCoins(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await cryptoService.getCoins(search, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCoinById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coin = await cryptoService.getCoinById(req.params.id);
    res.json(coin);
  } catch (err) {
    next(err);
  }
}

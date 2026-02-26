import { Router } from 'express';
import * as cryptoController from '../controllers/crypto.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /crypto:
 *   get:
 *     tags: [Crypto]
 *     summary: List cryptocurrencies with search and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter by name, symbol or type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of cryptocurrencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Crypto'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, cryptoController.getCoins);

/**
 * @swagger
 * /crypto/{id}:
 *   get:
 *     tags: [Crypto]
 *     summary: Get cryptocurrency details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: CoinPaprika coin ID (e.g. btc-bitcoin)
 *     responses:
 *       200:
 *         description: Cryptocurrency details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CryptoDetail'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cryptocurrency not found
 */
router.get('/:id', authMiddleware, cryptoController.getCoinById);

export default router;

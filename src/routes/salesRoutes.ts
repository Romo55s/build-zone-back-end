import express from 'express';
import client from '../config/cassandra';
import { authMiddleware, authorize } from '../auth/authMiddleware';
import authService from '../auth/authService';
import { Sale } from '../models/salesModel';
import { types } from 'cassandra-driver';

type Row = types.Row;

const router = express.Router();

router.get('/:storeName', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const storeName = req.params.storeName;
  const storeId = await authService.getStoreIdByName(storeName);
  const query = 'SELECT sale_id, sale_date, store_id, product_id, quantity, unit_price, total_amount FROM sales WHERE store_id = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [storeId], { prepare: true });
    const sales: Sale[] = result.rows.map((row: Row) => ({
      sale_id: row.sale_id,
      sale_date: row.sale_date,
      store_id: row.store_id,
      product_id: row.product_id,
      quantity: row.quantity,
      unit_price: row.unit_price,
      total_amount: row.total_amount
    }));
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
import express from 'express';
import client from '../config/cassandra';
import { authMiddleware, authorize } from '../auth/authMiddleware';
import { ProductStore } from '../models/productStoreModel';
import { types } from 'cassandra-driver';

type Row = types.Row;
const router = express.Router();

router.get('/:storeId/products', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const storeId = req.params.storeId;
  const query = 'SELECT product_id, store_id, product_name, category, price, stock, supplier FROM productstore WHERE store_id = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [storeId], { prepare: true });
    const products: ProductStore[] = result.rows.map((row: Row) => ({
      product_id: row.product_id,
      store_id: row.store_id,
      product_name: row.product_name,
      category: row.category,
      price: row.price,
      stock: row.stock,
      supplier: row.supplier
    }));
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

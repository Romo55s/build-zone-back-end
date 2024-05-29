import express from 'express';
import client from '../config/cassandra';
import { authMiddleware, authorize } from '../auth/authMiddleware';
import { Store } from '../models/storeModel';
import { types } from 'cassandra-driver';
import authService from '../auth/authService';

type Row = types.Row;

const router = express.Router();

router.get('/:storeName', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const storeName = req.params.storeName;
  const query = 'SELECT store_id, store_name, location FROM store WHERE store_name = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [storeName], { prepare: true });
    if (result.rows.length > 0) {
      const store: Store = {
        store_id: result.rows[0].store_id,
        store_name: result.rows[0].store_name,
        location: result.rows[0].location,
        manager_name: result.rows[0].manager_name,
      };
      res.json(store);
    } else {
      throw new Error('Store not found');
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
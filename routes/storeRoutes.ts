import express from 'express';
import client from '../config/cassandra';
import authMiddleware from '../auth/authMiddleware';

const router = express.Router();

router.get('/:storeName', authMiddleware, async (req, res) => {
  const storeName = req.params.storeName;
  const query = 'SELECT store_id FROM store WHERE store_name = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [storeName], { prepare: true });
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

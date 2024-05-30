import express from 'express';
import client from '../config/cassandra';
import { authMiddleware, authorize } from '../auth/authMiddleware';
import { Store } from '../models/storeModel';
import { types } from 'cassandra-driver';

type Row = types.Row;

const router = express.Router();

// Obtener todas las tiendas
// Obtener todas las tiendas
router.get('/all', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const query = 'SELECT * FROM store';
  try {
    const result = await client.execute(query);
    const stores: Store[] = result.rows.map((row: Row) => ({
      store_id: row.get('store_id').toString(),
      store_name: row.get('store_name') !== null ? row.get('store_name') : '',
      location: row.get('location') !== null ? row.get('location') : '',
    }));
    
    res.json(stores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



// Obtener una tienda por nombre
router.get('/bystore/:storeName', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const storeName = req.params.storeName;
  if (!storeName) {
    return res.status(400).json({ error: 'storeName is required' });
  }
  const query = 'SELECT store_id, store_name, location FROM store WHERE store_name = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [storeName], { prepare: true });
    if (result.rows.length > 0) {
      const store: Store = {
        store_id: result.rows[0].get('store_id').toString(),
        store_name: result.rows[0].get('store_name') || '',
        location: result.rows[0].get('location') || '',
      };
      res.json(store);
    } else {
      throw new Error('Store not found');
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// Crear una nueva tienda
router.post('/add', authMiddleware, authorize(['admin']), async (req, res) => {
  const { store_name, location } = req.body;
  if (!store_name || !location) {
    return res.status(400).json({ error: 'store_name and location are required' });
  }
  const store_id = types.Uuid.random();
  const query = 'INSERT INTO store (store_id, store_name, location) VALUES (?, ?, ?)';
  try {
    await client.execute(query, [store_id, store_name, location], { prepare: true });
    res.status(201).json({ message: 'Store created successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// Actualizar una tienda existente
router.put('/update/:storeId', authMiddleware, authorize(['admin']), async (req, res) => {
  const store_id = req.params.storeId;
  const { store_name, location } = req.body;
  if (!store_name || !location) {
    return res.status(400).json({ error: 'store_name and location are required' });
  }
  const query = 'UPDATE store SET store_name = ?, location = ? WHERE store_id = ?';
  try {
    await client.execute(query, [store_name, location, store_id], { prepare: true });
    res.json({ message: 'Store updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// Eliminar una tienda existente
router.delete('/remove/:storeId', authMiddleware, authorize(['admin']), async (req, res) => {
  const store_id = req.params.storeId;
  const query = 'DELETE FROM store WHERE store_id = ?';
  try {
    await client.execute(query, [store_id], { prepare: true });
    res.json({ message: 'Store deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

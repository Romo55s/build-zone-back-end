import express from 'express';
import client from '../config/cassandra';
import { authMiddleware, authorize } from '../auth/authMiddleware';
import { types } from 'cassandra-driver';

const router = express.Router();

// Obtener una venta por su ID
router.get('/getById/:saleId', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const { saleId } = req.params;
  const query = 'SELECT * FROM sales WHERE sale_id = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [saleId], { prepare: true });
    const sale = result.rows[0];
    res.json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las ventas de todas las tiendas
router.get('/getAll', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const query = 'SELECT * FROM sales';
  try {
    const result = await client.execute(query, [], { prepare: true });
    const sales = result.rows;
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las ventas de una tienda
router.get('/getByStore/:storeId', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const { storeId } = req.params;
  const query = 'SELECT * FROM sales WHERE store_id = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [storeId], { prepare: true });
    const sales = result.rows;
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar una nueva venta
router.post('/add', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const { sale_date, store_id, product_id, quantity } = req.body;
  const saleId = types.Uuid.random();
  const queryGetProduct = 'SELECT stock, price FROM productstore WHERE store_id = ? AND product_id = ?';
  const queryInsertSale = 'INSERT INTO sales (sale_id, sale_date, store_id, product_id, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const queryUpdateProduct = 'UPDATE productstore SET stock = ? WHERE store_id = ? AND product_id = ?';
  try {
    const product = await client.execute(queryGetProduct, [store_id, product_id], { prepare: true });
    if (product.rows[0].stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }
    const unit_price = product.rows[0].price;
    const total_amount = unit_price * quantity;
    const newStock = product.rows[0].stock - quantity;
    await client.execute(queryInsertSale, [saleId, sale_date, store_id, product_id, quantity, unit_price, total_amount], { prepare: true });
    await client.execute(queryUpdateProduct, [newStock, store_id, product_id], { prepare: true });
    res.json({ message: 'Sale added successfully', sale_id: saleId  });
  } catch (error: any) {
    console.log('Error',error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una venta
router.delete('/delete/:saleId/:saleDate/:storeId/:productId', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const { saleId, saleDate, storeId, productId } = req.params;
  const queryDeleteSale = 'DELETE FROM sales WHERE sale_id = ? AND sale_date = ? AND store_id = ? AND product_id = ?';
  try {
    await client.execute(queryDeleteSale, [saleId, saleDate, storeId, productId], { prepare: true });
    res.json({ message: 'Sale deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
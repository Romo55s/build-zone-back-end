import express from 'express';
import client from '../config/cassandra';
import { authMiddleware, authorize } from '../auth/authMiddleware';
import authService from '../auth/authService';
import { ProductStore } from '../models/productStoreModel';
import { types } from 'cassandra-driver';

type Row = types.Row;

const router = express.Router();

router.get('/:storeName', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  const storeName = req.params.storeName;
  const storeId = await authService.getStoreIdByName(storeName);
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

function extractDriveImageId(imageLink: string) {
  const regex = /(?:id=)([^\&]+)/;
  const match = imageLink.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error("No se pudo extraer la ID de la imagen de Google Drive.");
  }
}

// Función para validar el formato del enlace de la imagen de Google Drive
function validateImageLink(imageLink: string) {
  const regex = /^https:\/\/drive\.google\.com\/thumbnail\?id=.+$/;
  return regex.test(imageLink);
}

// Agregar un nuevo producto a la tienda
router.post('/', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { storeName, product } = req.body;
    const storeId = await authService.getStoreIdByName(storeName);
    const { category, image, price, product_name, stock, supplier } = product;

    // Validar el enlace de la imagen antes de agregar el producto
    if (!validateImageLink(image)) {
      throw new Error("El enlace de la imagen no es válido.");
    }

    const imageId = extractDriveImageId(image);
    const query = 'INSERT INTO productstore (store_id, product_id, category, image, price, product_name, stock, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await client.execute(query, [storeId, imageId, category, image, price, product_name, stock, supplier], { prepare: true });
    res.status(201).send("Producto agregado exitosamente.");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto existente en la tienda
router.put('/:productId', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { productId } = req.params;
    const { category, image, price, product_name, stock, supplier } = req.body;

    // Validar el enlace de la imagen antes de actualizar el producto
    if (image && !validateImageLink(image)) {
      throw new Error("El enlace de la imagen no es válido.");
    }

    const imageId = extractDriveImageId(image);
    const query = 'UPDATE productstore SET category = ?, image = ?, price = ?, product_name = ?, stock = ?, supplier = ? WHERE product_id = ?';
    await client.execute(query, [category, image, price, product_name, stock, supplier, productId], { prepare: true });
    res.send("Producto actualizado exitosamente.");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//Eliminar un producto
router.delete('/:productId', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
  try{
    const {productId} = req.params;
    const query = "DELETE FROM productstore WHERE product_id = ?";
    await client.execute(query, [productId], {prepare: true});
    res.send("Producto eliminado exitosamente");
  }catch(error: any){
    res.status(500).json({error:error.message});
  }
});
  //Obtener todos los productos

  router.get('/:productId', authMiddleware, authorize(['admin', 'manager']), async (req, res) => {
    try {
      const { productId } = req.params;
      const query = 'SELECT * FROM productstore WHERE product_id = ?';
      const result = await client.execute(query, [productId], { prepare: true });
  
      if (result.rowLength === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
  
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  
  });

export default router;
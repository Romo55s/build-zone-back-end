import express from "express";
import client from "../config/cassandra";
import { authMiddleware, authorize } from "../auth/authMiddleware";
import authService from "../auth/authService";
import { ProductStore } from "../models/productStoreModel";
import { types } from "cassandra-driver";
import { google } from "googleapis";
import multer from "multer";
import googleConfig from "../config/googleConfig";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

type Row = types.Row;
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // Aumenta el límite a 50MB
});

const router = express.Router();
const drive = google.drive({
  version: "v3",
  auth: googleConfig,
});
console.log("googleConfig:", googleConfig);
router.get(
  "/getByStoreId/:storeId",
  authMiddleware,
  authorize(["admin", "manager"]),
  async (req, res) => {
    const storeId = req.params.storeId;
    const query =
      "SELECT product_id, store_id, product_name, category, image, price, stock, supplier FROM productstore WHERE store_id = ? ALLOW FILTERING";
    try {
      const result = await client.execute(query, [storeId], { prepare: true });
      const products: ProductStore[] = result.rows.map((row: Row) => ({
        product_id: row.product_id,
        store_id: row.store_id,
        product_name: row.product_name,
        category: row.category,
        image: row.image,
        price: row.price,
        stock: row.stock,
        supplier: row.supplier,
      }));
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Agregar un producto con una imagen
router.post('/add', upload.single('image') , async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { store_id, product_name, category, price, stock, supplier } = req.body;
    const image = req.file;
    console.log(store_id);
    console.log(req.body);

    if (!image) {
      throw new Error("La imagen es requerida.");
    }

    const response = await drive.files.create({
      requestBody: {
        name: image.originalname,
        parents: ["1c0FJs_H5rOOB0L8oMCJc0fMQSQ8-VuKm"],
      },
      media: {
        mimeType: image.mimetype,
        body: fs.createReadStream(image.path),
      },
    });

    const imageUrl = `https://drive.google.com/thumbnail?id=${response.data.id}`;
    console.log(store_id);
    const query = "INSERT INTO productstore (product_id, store_id, product_name, category, image, price, stock, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await client.execute(query, [uuidv4(), store_id, product_name, category, imageUrl, price, stock, supplier], { prepare: true });

    res.send("Producto agregado exitosamente.");
  } catch (error: any) {
    console.log("Error", error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto existente en la tienda
router.put(
  "/update/:productId",
  authMiddleware,
  authorize(["admin", "manager"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { category, price, product_name, stock, supplier } = req.body;
      const image = req.file;

      if (!image) {
        throw new Error("La imagen es requerida.");
      }

      const response = await drive.files.create({
        requestBody: {
          name: image.originalname,
          parents: ["1c0FJs_H5rOOB0L8oMCJc0fMQSQ8-VuKm"],
        },
        media: {
          mimeType: image.mimetype,
          body: fs.createReadStream(image.path),
        },
      });
      const imageUrl = `https://drive.google.com/thumbnail?id=${response.data.id}`;
      const query =
        "UPDATE productstore SET category = ?, image = ?, price = ?, product_name = ?, stock = ?, supplier = ? WHERE product_id = ?";
      await client.execute(
        query,
        [category, imageUrl, price, product_name, stock, supplier, productId],
        { prepare: true }
      );
      res.send("Producto actualizado exitosamente.");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Eliminar un producto
router.delete(
  "/delete/:productId",
  authMiddleware,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      const { productId } = req.params;

      // Obtener el enlace de la imagen del producto de la base de datos
      const queryGet = "SELECT image FROM productstore WHERE product_id = ?";
      const result = await client.execute(queryGet, [productId], {
        prepare: true,
      });
      const imageUrl = result.rows[0].get("image");

      // Extraer el ID de la imagen de Google Drive del enlace
      const imageId = imageUrl.split("=")[1];

      // Eliminar la imagen de Google Drive
      await drive.files.delete({ fileId: imageId });

      // Eliminar el producto de la base de datos
      const queryDelete = "DELETE FROM productstore WHERE product_id = ?";
      await client.execute(queryDelete, [productId], { prepare: true });

      res.send("Producto eliminado exitosamente");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/getById/:productId",
  authMiddleware,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      const { productId } = req.params;
      const query =
        "SELECT * FROM productstore WHERE product_id = ? ALLOW FILTERING";
      const result = await client.execute(query, [productId], {
        prepare: true,
      });

      if (result.rowLength === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error: any) {
      console.log("Error", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/all",
  authMiddleware,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      const query = "SELECT * FROM productstore";
      const result = await client.execute(query, [], { prepare: true });
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

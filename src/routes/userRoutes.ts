import express from "express";
import client from "../config/cassandra";
import { authMiddleware, authorize } from "../auth/authMiddleware";
import { User } from "../models/userModel";
import { types } from "cassandra-driver";
import axios from "axios";

type Row = types.Row;

const router = express.Router();

// Crear un nuevo usuario
router.post("/add", authMiddleware, authorize(["admin"]), async (req, res) => {
  const { username, password, store_id, role } = req.body;
  if (!username || !password || !store_id || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, store_id and role are required" });
  }

  // Verificar si existe la tienda
  try {
    const storeExists = await axios.get(`/store/exists/${store_id}`);
    if (!storeExists.data.exists) {
      return res.status(400).json({ error: "Store does not exist" });
    }
  } catch (error: any) {
    return res.status(404).json({ error: "Store not found" });
  }

  const user_id = types.Uuid.random();
  const query =
    "INSERT INTO user (user_id, store_id, username, password, role) VALUES (?, ?, ?, ?, ?)";
  try {
    await client.execute(query, [user_id, store_id, username, password, role], {
      prepare: true,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Leer un usuario
router.get(
  "/:userId",
  authMiddleware,
  authorize(["admin"]),
  async (req, res) => {
    const query = "SELECT * FROM user WHERE user_id = ?";
    try {
      const result = await client.execute(query, [req.params.userId], {
        prepare: true,
      });
      res.status(200).json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Actualizar un usuario
router.put(
  "/update/:userId",
  authMiddleware,
  authorize(["admin"]),
  async (req, res) => {
    const { username, email } = req.body;
    const query = "UPDATE user SET username = ?, email = ? WHERE user_id = ?";
    try {
      await client.execute(query, [username, email, req.params.userId], {
        prepare: true,
      });
      res.status(200).json({ message: "User updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Eliminar un usuario
router.delete(
  "/delete/:userId",
  authMiddleware,
  authorize(["admin"]),
  async (req, res) => {
    const query = "DELETE FROM user WHERE user_id = ?";
    try {
      await client.execute(query, [req.params.userId], { prepare: true });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

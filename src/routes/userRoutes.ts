import express from "express";
import client from "../config/cassandra";
import { authMiddleware, authorize } from "../auth/authMiddleware";
import { User } from "../models/userModel";
import { types } from "cassandra-driver";
import bcrypt from 'bcrypt';
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
    if (
      req.cookies.access_token &&
      req.cookies.access_token.user &&
      req.cookies.access_token.token
    ) {
      const { user, token } = req.cookies.access_token;
      console.log("Access Token->>", user);
      console.log("Token Cookie->>", token);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const query = "SELECT store_id FROM store WHERE store_id = ?";
      const storeExists = await client.execute(query, [store_id], {
        prepare: true,
      });
      console.log(storeExists);
      if (storeExists.rowLength === 0) {
        return res.status(400).json({ error: "Store does not exist" });
      }
    } else {
      // Manejar el caso en que 'access_token' o 'user' o 'token' no están definidos...
      return res
        .status(400)
        .json({ error: "Access token or user or token not found" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(404).json({ error: "Store not found" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user_id = types.Uuid.random();
  const query =
    "INSERT INTO users (user_id, store_id, username, password, role) VALUES (?, ?, ?, ?, ?)";
  try {
    await client.execute(query, [user_id, store_id, username, hashedPassword, role], {
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
    const query = "SELECT * FROM users WHERE user_id = ?";
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
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query = "SELECT * FROM users WHERE user_id = ? ALLOW FILTERING";
    try {
      const result = await client.execute(query, [req.params.userId], {
        prepare: true,
      });
      if (result.rowLength === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const updateQuery =
        "UPDATE users SET username = ?, password = ? WHERE user_id = ?";
      await client.execute(updateQuery, [username, hashedPassword, req.params.userId], {
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
    const query = "DELETE FROM users WHERE user_id = ?";
    try {
      await client.execute(query, [req.params.userId], { prepare: true });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

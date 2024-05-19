const cassandra = require("cassandra-driver");
const crypto = require('crypto');

const client = new cassandra.Client({
  contactPoints: ["34.49.185.221"],
  localDataCenter: "datacenter1",
  keyspace: "build_zone",
});

const userQuery =
  "INSERT INTO users (user_id, auth_token, password, role, store_id, username) VALUES (?, ?, ?, ?, ?, ?)";
const storeQuery =
  "INSERT INTO store (store_id, location, store_name, user_id) VALUES (?, ?, ?, ?)";
const productStoreQuery =
  "INSERT INTO productstore (store_id, product_id, category, price, product_name, stock, supplier) VALUES (?, ?, ?, ?, ?, ?, ?)";
const salesQuery =
  "INSERT INTO sales (sale_id, sale_date, store_id, product_id, quantity, total_amount, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)";

const stores = ['build-zone-store1', 'build-zone-store2', 'build-zone-store3'];
const products = ['Grava', 'Cemento', 'Ladrillo'];
const categories = ['Cementos y Aglomerantes', 'Ladrillos y Bloques', 'Aceros y Metales'];
const suppliers = ['Cemex', 'Grupo Lamosa', 'LafargeHolcim'];
const roles = ['manager', 'admin'];
const usernames = ['user1', 'user2', 'user3'];

client.connect()
  .then(() => {
    console.log("Connected to Cassandra");

    for (let i = 0; i < 3; i++) {
      const userId = cassandra.types.Uuid.random();
      const storeId = cassandra.types.Uuid.random();
      const productId = cassandra.types.Uuid.random();
      const saleId = cassandra.types.Uuid.random();

      // Generate a random token and password
      const token = crypto.randomBytes(16).toString('hex');
      const password = crypto.randomBytes(8).toString('hex');

      // Insert user
      client.execute(userQuery, [userId, token, password, roles[i % roles.length], storeId, usernames[i]], { prepare: true });

      // Insert store
      client.execute(storeQuery, [storeId, `location${i}`, stores[i], userId], { prepare: true });

      // Insert productstore
      client.execute(productStoreQuery, [storeId, productId, categories[i], i * 10, products[i], i * 100, suppliers[i]], { prepare: true });

      // Insert sales
      client.execute(salesQuery, [saleId, new Date(), storeId, productId, i * 10, i * 100, i * 10], { prepare: true });
    }
  })
  .then(() => {
    console.log("Data inserted");
  })
  .catch((error) => {
    console.error("Error", error);
  });
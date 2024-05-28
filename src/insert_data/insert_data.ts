import { Client, auth } from 'cassandra-driver';

const cassandra = require('cassandra-driver');
const client = new Client({
    contactPoints: ["34.49.185.221"],
    localDataCenter: "datacenter1",
    keyspace: "build_zone",
    authProvider: new auth.PlainTextAuthProvider(process.env.CASSANDRA_USER || 'default_secret', process.env.CASSANDRA_PASSWORD|| 'default_password')
  });

// Definir los UUIDs manualmente para asegurarnos de la consistencia
const stores = [
    { id: '123e4567-e89b-12d3-a456-426614174000', location: '1234 Main St, Springfield', name: 'Springfield Builders Supply', userId: '123e4567-e89b-12d3-a456-426614174100' },
    { id: '123e4567-e89b-12d3-a456-426614174001', location: '5678 Elm St, Shelbyville', name: 'Shelbyville Construction Depot', userId: '123e4567-e89b-12d3-a456-426614174101' },
    { id: '123e4567-e89b-12d3-a456-426614174002', location: '9101 Oak St, Ogdenville', name: 'Ogdenville Hardware', userId: '123e4567-e89b-12d3-a456-426614174102' },
    { id: '123e4567-e89b-12d3-a456-426614174003', location: '1213 Pine St, Capital City', name: 'Capital City Building Materials', userId: '123e4567-e89b-12d3-a456-426614174103' }
];

const users = [
    { username: 'admin', password: 'securepassword', role: 'admin', storeId: null, userId: '123e4567-e89b-12d3-a456-426614174104' },
    { username: 'mauricio-torres', password: 'managerpassword1', role: 'manager', storeId: stores[0].id, userId: stores[0].userId },
    { username: 'enrique-torres', password: 'managerpassword2', role: 'manager', storeId: stores[1].id, userId: stores[1].userId },
    { username: 'christopher-perez', password: 'managerpassword3', role: 'manager', storeId: stores[2].id, userId: stores[2].userId },
    { username: 'miguel-perez', password: 'managerpassword4', role: 'manager', storeId: stores[3].id, userId: stores[3].userId }
];

const products = [
    // Productos para la tienda con store_id 123e4567-e89b-12d3-a456-426614174000
    { storeId: stores[0].id, category: 'Cement', image: 'image_url', price: 12.99, name: 'Portland Cement', stock: 100, supplier: 'Cement Co.' },
    { storeId: stores[0].id, category: 'Concrete', image: 'image_url', price: 8.99, name: 'Ready Mix Concrete', stock: 200, supplier: 'Concrete Inc.' },
    { storeId: stores[0].id, category: 'Gravel', image: 'image_url', price: 4.99, name: 'Pea Gravel', stock: 150, supplier: 'Gravel Corp.' },
    { storeId: stores[0].id, category: 'Sand', image: 'image_url', price: 3.99, name: 'Play Sand', stock: 120, supplier: 'Sand Supplier Ltd.' },
    { storeId: stores[0].id, category: 'Bricks', image: 'image_url', price: 12.75, name: 'Clay Brick', stock: 500, supplier: 'Brickworks LLC.' },
    { storeId: stores[0].id, category: 'Cement', image: 'image_url', price: 14.50, name: 'Rapid Set Cement', stock: 80, supplier: 'Quick Build Co.' },
    { storeId: stores[0].id, category: 'Concrete', image: 'image_url', price: 9.50, name: 'High Strength Concrete', stock: 90, supplier: 'Strong Concrete Inc.' },
    { storeId: stores[0].id, category: 'Gravel', image: 'image_url', price: 5.50, name: 'River Gravel', stock: 160, supplier: 'Riverstone Corp.' },
    { storeId: stores[0].id, category: 'Sand', image: 'image_url', price: 4.50, name: 'Builder\'s Sand', stock: 130, supplier: 'Builder\'s Supply Ltd.' },
    { storeId: stores[0].id, category: 'Bricks', image: 'image_url', price: 1.50, name: 'Red Brick', stock: 400, supplier: 'Red Brickworks' },
    { storeId: stores[0].id, category: 'Lumber', image: 'image_url', price: 7.50, name: 'Pine Lumber', stock: 250, supplier: 'Wood Co.' },
    { storeId: stores[0].id, category: 'Insulation', image: 'image_url', price: 15.00, name: 'Thermal Insulation', stock: 200, supplier: 'Thermal Solutions' },
    { storeId: stores[0].id, category: 'Drywall', image: 'image_url', price: 10.00, name: 'Fire Resistant Drywall', stock: 300, supplier: 'Drywall Experts' },
    { storeId: stores[0].id, category: 'Roofing', image: 'image_url', price: 26.00, name: 'Metal Roofing Sheets', stock: 90, supplier: 'Roofing Pros' },
    { storeId: stores[0].id, category: 'Rebar', image: 'image_url', price: 2.00, name: 'Steel Rebar', stock: 450, supplier: 'Steel Co.' },
    { storeId: stores[0].id, category: 'Plywood', image: 'image_url', price: 24.00, name: 'Marine Plywood', stock: 120, supplier: 'Plywood Solutions' },
    { storeId: stores[0].id, category: 'Paint', image: 'image_url', price: 20.00, name: 'Interior Paint', stock: 70, supplier: 'Paint Masters' },
    { storeId: stores[0].id, category: 'Tiles', image: 'image_url', price: 1.75, name: 'Porcelain Tile', stock: 1100, supplier: 'Tile Makers' },
    { storeId: stores[0].id, category: 'Tools', image: 'image_url', price: 50.00, name: 'Cordless Drill', stock: 55, supplier: 'Tool World' },
    { storeId: stores[0].id, category: 'Nails', image: 'image_url', price: 3.00, name: 'Galvanized Nails', stock: 550, supplier: 'Nail Experts' },
    { storeId: stores[0].id, category: 'Screws', image: 'image_url', price: 4.00, name: 'Stainless Steel Screws', stock: 420, supplier: 'Screw Depot' },
    { storeId: stores[0].id, category: 'Concrete Blocks', image: 'image_url', price: 1.30, name: 'Lightweight Concrete Block', stock: 650, supplier: 'Concrete Block Co.' },
    { storeId: stores[0].id, category: 'Pipes', image: 'image_url', price: 13.00, name: 'Copper Pipe', stock: 220, supplier: 'Pipe Specialists' },
    { storeId: stores[0].id, category: 'Fittings', image: 'image_url', price: 1.00, name: 'Brass Fittings', stock: 320, supplier: 'Fittings Plus' },
    { storeId: stores[0].id, category: 'Wire', image: 'image_url', price: 25.00, name: 'Copper Electrical Wire', stock: 160, supplier: 'Wire Solutions' },

    // Productos para la tienda con store_id 123e4567-e89b-12d3-a456-426614174001
    { storeId: stores[1].id, category: 'Lumber', image: 'image_url', price: 7.50, name: '2x4 Lumber 8ft', stock: 300, supplier: 'Lumber Yard.' },
    { storeId: stores[1].id, category: 'Insulation', image: 'image_url', price: 14.99, name: 'Fiberglass Insulation Roll', stock: 100, supplier: 'Insulate It Inc.' },
    { storeId: stores[1].id, category: 'Drywall', image: 'image_url', price: 9.99, name: 'Sheetrock 4x8', stock: 250, supplier: 'Drywall Direct.' },
    { storeId: stores[1].id, category: 'Roofing', image: 'image_url', price: 25.00, name: 'Asphalt Shingles Bundle', stock: 75, supplier: 'Roofing Masters.' },
    { storeId: stores[1].id, category: 'Rebar', image: 'image_url', price: 1.99, name: 'Rebar 1/2in x 20ft', stock: 400, supplier: 'Steel Suppliers.' },
    { storeId: stores[1].id, category: 'Plywood', image: 'image_url', price: 23.99, name: 'Plywood 4x8', stock: 100, supplier: 'Wood Products Co.' },
    { storeId: stores[1].id, category: 'Paint', image: 'image_url', price: 19.99, name: 'Exterior Paint 1gal', stock: 80, supplier: 'Paintworks.' },
    { storeId: stores[1].id, category: 'Tiles', image: 'image_url', price: 1.50, name: 'Ceramic Tile 12x12', stock: 1000, supplier: 'Tile Depot.' },
    { storeId: stores[1].id, category: 'Tools', image: 'image_url', price: 49.99, name: 'Electric Drill', stock: 50, supplier: 'Tool Corp.' },
    { storeId: stores[1].id, category: 'Nails', image: 'image_url', price: 2.99, name: 'Nails', stock: 500, supplier: 'Nail Factory.' },
    { storeId: stores[1].id, category: 'Screws', image: 'image_url', price: 3.99, name: 'Wood Screws', stock: 400, supplier: 'Screw Masters.' },
    { storeId: stores[1].id, category: 'Concrete Blocks', image: 'image_url', price: 1.25, name: 'Concrete Block 8x8x16', stock: 600, supplier: 'Block Co.' },
    { storeId: stores[1].id, category: 'Pipes', image: 'image_url', price: 12.99, name: 'PVC Pipe 1in x 10ft', stock: 200, supplier: 'Pipe Solutions.' },
    { storeId: stores[1].id, category: 'Fittings', image: 'image_url', price: 0.99, name: 'Pipe Fittings 1in', stock: 300, supplier: 'Fittings LLC.' },
    { storeId: stores[1].id, category: 'Wire', image: 'image_url', price: 24.99, name: 'Electrical Wire 100ft', stock: 150, supplier: 'Electrical Supplies.' },
    { storeId: stores[1].id, category: 'Cement', image: 'image_url', price: 14.50, name: 'Rapid Set Cement', stock: 80, supplier: 'Quick Build Co.' },
    { storeId: stores[1].id, category: 'Concrete', image: 'image_url', price: 9.50, name: 'High Strength Concrete', stock: 90, supplier: 'Strong Concrete Inc.' },
    { storeId: stores[1].id, category: 'Gravel', image: 'image_url', price: 5.50, name: 'River Gravel', stock: 160, supplier: 'Riverstone Corp.' },
    { storeId: stores[1].id, category: 'Sand', image: 'image_url', price: 4.50, name: 'Builder\'s Sand', stock: 130, supplier: 'Builder\'s Supply Ltd.' },
    { storeId: stores[1].id, category: 'Bricks', image: 'image_url', price: 1.50, name: 'Red Brick', stock: 400, supplier: 'Red Brickworks' },
    { storeId: stores[1].id, category: 'Lumber', image: 'image_url', price: 7.50, name: 'Pine Lumber', stock: 250, supplier: 'Wood Co.' },
    { storeId: stores[1].id, category: 'Insulation', image: 'image_url', price: 15.00, name: 'Thermal Insulation', stock: 200, supplier: 'Thermal Solutions' },
    { storeId: stores[1].id, category: 'Drywall', image: 'image_url', price: 10.00, name: 'Fire Resistant Drywall', stock: 300, supplier: 'Drywall Experts' },
    { storeId: stores[1].id, category: 'Roofing', image: 'image_url', price: 26.00, name: 'Metal Roofing Sheets', stock: 90, supplier: 'Roofing Pros' },
    { storeId: stores[1].id, category: 'Rebar', image: 'image_url', price: 2.00, name: 'Steel Rebar', stock: 450, supplier: 'Steel Co.' },

    // Productos para la tienda con store_id 123e4567-e89b-12d3-a456-426614174002
    { storeId: stores[2].id, category: 'Plywood', image: 'image_url', price: 23.99, name: 'Plywood 4x8', stock: 100, supplier: 'Wood Products Co.' },
    { storeId: stores[2].id, category: 'Paint', image: 'image_url', price: 19.99, name: 'Exterior Paint 1gal', stock: 80, supplier: 'Paintworks.' },
    { storeId: stores[2].id, category: 'Tiles', image: 'image_url', price: 1.50, name: 'Ceramic Tile 12x12', stock: 1000, supplier: 'Tile Depot.' },
    { storeId: stores[2].id, category: 'Tools', image: 'image_url', price: 49.99, name: 'Electric Drill', stock: 50, supplier: 'Tool Corp.' },
    { storeId: stores[2].id, category: 'Nails', image: 'image_url', price: 2.99, name: 'Nails', stock: 500, supplier: 'Nail Factory.' },
    { storeId: stores[2].id, category: 'Insulation', image: 'image_url', price: 14.99, name: 'Fiberglass Insulation Roll', stock: 150, supplier: 'Insulate It Inc.' },
    { storeId: stores[2].id, category: 'Drywall', image: 'image_url', price: 9.99, name: 'Sheetrock 4x8', stock: 200, supplier: 'Drywall Direct.' },
    { storeId: stores[2].id, category: 'Roofing', image: 'image_url', price: 25.00, name: 'Asphalt Shingles Bundle', stock: 75, supplier: 'Roofing Masters.' },
    { storeId: stores[2].id, category: 'Rebar', image: 'image_url', price: 1.99, name: 'Rebar 1/2in x 20ft', stock: 400, supplier: 'Steel Suppliers.' },
    { storeId: stores[2].id, category: 'Lumber', image: 'image_url', price: 7.50, name: '2x4 Lumber 8ft', stock: 300, supplier: 'Lumber Yard.' },
    { storeId: stores[2].id, category: 'Concrete', image: 'image_url', price: 8.99, name: 'Ready Mix Concrete', stock: 200, supplier: 'Concrete Inc.' },
    { storeId: stores[2].id, category: 'Gravel', image: 'image_url', price: 4.99, name: 'Pea Gravel', stock: 150, supplier: 'Gravel Corp.' },
    { storeId: stores[2].id, category: 'Sand', image: 'image_url', price: 3.99, name: 'Play Sand', stock: 120, supplier: 'Sand Supplier Ltd.' },
    { storeId: stores[2].id, category: 'Bricks', image: 'image_url', price: 0.75, name: 'Clay Brick', stock: 500, supplier: 'Brickworks LLC.' },
    { storeId: stores[2].id, category: 'Screws', image: 'image_url', price: 3.99, name: 'Wood Screws', stock: 400, supplier: 'Screw Masters.' },
    { storeId: stores[2].id, category: 'Concrete Blocks', image: 'image_url', price: 1.25, name: 'Concrete Block 8x8x16', stock: 600, supplier: 'Block Co.' },
    { storeId: stores[2].id, category: 'Pipes', image: 'image_url', price: 12.99, name: 'PVC Pipe 1in x 10ft', stock: 200, supplier: 'Pipe Solutions.' },
    { storeId: stores[2].id, category: 'Fittings', image: 'image_url', price: 0.99, name: 'Pipe Fittings 1in', stock: 300, supplier: 'Fittings LLC.' },
    { storeId: stores[2].id, category: 'Wire', image: 'image_url', price: 24.99, name: 'Electrical Wire 100ft', stock: 150, supplier: 'Electrical Supplies.' },
    { storeId: stores[2].id, category: 'Paint', image: 'image_url', price: 19.99, name: 'Interior Paint 1gal', stock: 100, supplier: 'Paintworks.' },
    { storeId: stores[2].id, category: 'Tiles', image: 'image_url', price: 1.50, name: 'Porcelain Tile 12x12', stock: 800, supplier: 'Tile Emporium.' },
    { storeId: stores[2].id, category: 'Tools', image: 'image_url', price: 49.99, name: 'Cordless Drill', stock: 70, supplier: 'ToolWorks.' },
    { storeId: stores[2].id, category: 'Nails', image: 'image_url', price: 2.99, name: 'Finish Nails', stock: 450, supplier: 'Nail Co.' },
    { storeId: stores[2].id, category: 'Screws', image: 'image_url', price: 4.99, name: 'Drywall Screws', stock: 300, supplier: 'ScrewIt.' },
    { storeId: stores[2].id, category: 'Pipes', image: 'image_url', price: 14.99, name: 'Copper Pipe 1/2in x 10ft', stock: 120, supplier: 'Pipe Co.' },

    // Productos para la tienda con store_id 123e4567-e89b-12d3-a456-426614174003
    { storeId: stores[3].id, category: 'Screws', image: 'image_url', price: 3.99, name: 'Wood Screws', stock: 400, supplier: 'Screw Masters.' },
    { storeId: stores[3].id, category: 'Concrete Blocks', image: 'image_url', price: 1.25, name: 'Concrete Block 8x8x16', stock: 600, supplier: 'Block Co.' },
    { storeId: stores[3].id, category: 'Pipes', image: 'image_url', price: 12.99, name: 'PVC Pipe 1in x 10ft', stock: 200, supplier: 'Pipe Solutions.' },
    { storeId: stores[3].id, category: 'Fittings', image: 'image_url', price: 22.99, name: 'Pipe Fittings 1in', stock: 300, supplier: 'Fittings LLC.' },
    { storeId: stores[3].id, category: 'Wire', image: 'image_url', price: 24.99, name: 'Electrical Wire 100ft', stock: 150, supplier: 'Electrical Supplies.' },
    { storeId: stores[3].id, category: 'Nails', image: 'image_url', price: 2.99, name: 'Finish Nails', stock: 500, supplier: 'Nail Co.' },
    { storeId: stores[3].id, category: 'Screws', image: 'image_url', price: 4.99, name: 'Drywall Screws', stock: 300, supplier: 'ScrewIt.' },
    { storeId: stores[3].id, category: 'Pipes', image: 'image_url', price: 14.99, name: 'Copper Pipe 1/2in x 10ft', stock: 120, supplier: 'Pipe Co.' },
    { storeId: stores[3].id, category: 'Fittings', image: 'image_url', price: 9.99, name: 'Plumbing Fittings', stock: 250, supplier: 'Pipe Solutions.' },
    { storeId: stores[3].id, category: 'Insulation', image: 'image_url', price: 18.99, name: 'Foam Insulation Board', stock: 100, supplier: 'Insulation Pros.' },
    { storeId: stores[3].id, category: 'Drywall', image: 'image_url', price: 11.99, name: 'Drywall Screws', stock: 200, supplier: 'Drywall Depot.' },
    { storeId: stores[3].id, category: 'Tiles', image: 'image_url', price: 1.75, name: 'Porcelain Tile 12x12', stock: 800, supplier: 'Tile Supply Outlet.' },
    { storeId: stores[3].id, category: 'Tools', image: 'image_url', price: 59.99, name: 'Power Drill', stock: 50, supplier: 'ToolHub.' },
    { storeId: stores[3].id, category: 'Paint', image: 'image_url', price: 22.99, name: 'Interior Paint 1gal', stock: 100, supplier: 'Paint Pros.' },
    { storeId: stores[3].id, category: 'Lumber', image: 'https://drive.google.com/file/d/1YVVMDLefSc21mfbnMNDeZDJhLyJtuMym/view?usp=sharing', price: 11.50, name: 'Pine Lumber 2x4', stock: 300, supplier: 'Lumber Supply Co.' },
    { storeId: stores[3].id, category: 'Bricks', image: 'image_url', price: 0.99, name: 'Red Brick', stock: 500, supplier: 'Brick Outlet.' },
    { storeId: stores[3].id, category: 'Concrete', image: 'image_url', price: 7.50, name: 'Concrete Mix', stock: 150, supplier: 'Concrete Supply Co.' },
    { storeId: stores[3].id, category: 'Sand', image: 'image_url', price: 2.99, name: 'Fine Sand', stock: 120, supplier: 'Sand Depot.' },
    { storeId: stores[3].id, category: 'Gravel', image: 'image_url', price: 6.99, name: 'River Rock', stock: 200, supplier: 'Rock Supply Co.' }
];  

async function insertData() {
    try {
        await client.connect();

        // Insertar tiendas
        for (const store of stores) {
            const query = 'INSERT INTO build_zone.store (store_id, location, store_name, user_id) VALUES (?, ?, ?, ?)';
            await client.execute(query, [store.id, store.location, store.name, store.userId], { prepare: true });
        }

        // Insertar usuarios
        for (const user of users) {
            const query = 'INSERT INTO build_zone.users (username, password, role, store_id, user_id) VALUES (?, ?, ?, ?, ?)';
            await client.execute(query, [user.username, user.password, user.role, user.storeId, user.userId], { prepare: true });
        }

        // Insertar productos
        for (const product of products) {
            const query = 'INSERT INTO build_zone.productstore (store_id, product_id, category, image, price, product_name, stock, supplier) VALUES (?, uuid(), ?, ?, ?, ?, ?, ?)';
            await client.execute(query, [product.storeId, product.category, 'image_url', product.price, product.name, product.stock, product.supplier], { prepare: true });
        }

        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data', error);
    } finally {
        await client.shutdown();
    }
}

insertData();

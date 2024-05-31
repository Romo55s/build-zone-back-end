import { Client, auth } from 'cassandra-driver';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const cassandra = require('cassandra-driver');

console.log(process.env.CASSANDRA_USER);
console.log(process.env.CASSANDRA_PASSWORD);

const client = new Client({
    contactPoints: ["34.49.185.221"],
    localDataCenter: "datacenter1",
    keyspace: "build_zone",
    authProvider: new auth.PlainTextAuthProvider(process.env.CASSANDRA_USER || 'default_secret', process.env.CASSANDRA_PASSWORD|| 'default_password')
  });

// Definir los UUIDs manualmente para asegurarnos de la consistencia
const stores = [
    { id: uuidv4(), location: '1234 Calle Santa Ana #553, Ciudad de México', name: 'build-zone-cdmx' },
    { id: uuidv4(), location: '5678 Calle Chapalita #202, Guadalajara', name: 'build-zone-gdl' },
    { id: uuidv4(), location: '9101 Calle San Pedro #532, Monterrey', name: 'build-zone-mty' },
    { id: uuidv4(), location: '1213 Calle El charro #102, Aguascalientes', name: 'build-zone-ags' }
];

const users = [
    { username: 'admin', password: 'securepassword', role: 'admin', storeId: uuidv4(), userId: uuidv4() },
    { username: 'mauricio-torres', password: 'managerpassword1', role: 'manager', storeId: stores[0].id, userId: uuidv4() },
    { username: 'enrique-torres', password: 'managerpassword2', role: 'manager', storeId: stores[1].id, userId: uuidv4() },
    { username: 'christopher-perez', password: 'managerpassword3', role: 'manager', storeId: stores[2].id, userId: uuidv4() },
    { username: 'miguel-perez', password: 'managerpassword4', role: 'manager', storeId: stores[3].id, userId: uuidv4() }
];

const imageUrls = {
    'Galvanized Nails': 'https://drive.google.com/thumbnail?id=1-xOiOKQXirOA8JCVl6p8LcvpbQ177Ucw',
    'Play Sand': 'https://drive.google.com/thumbnail?id=10SwC0brcihhM2Uv-DbqEzx6_aXObQMxi',
    'Wood Screws': 'https://drive.google.com/thumbnail?id=10ikzd3MvlVspkpmIPi1L595ZFnS7iO20',
    'Steel Rebar': 'https://drive.google.com/thumbnail?id=11JGUZ09e9NP5kGsgZM6pwzXwz3oiKdvH',
    'Cordless Drill': 'https://drive.google.com/thumbnail?id=15YvWYzDq9ybJ02u1kVhy5T_zvIbhy_DP',
    'Drywall Screws': 'https://drive.google.com/thumbnail?id=15wa5ZlV7PJaI_uYrwZXWqdjtHK8hzlb9',
    'Pine Lumber': 'https://drive.google.com/thumbnail?id=173JK4p_jixtmt996dzVI1Yus-tsJWn8G',
    'Red Brick': 'https://drive.google.com/thumbnail?id=1B5G0BaBtGUy7glrzs8LGiMimqLJey8E5',
    'Electrical Wire 100ft': 'https://drive.google.com/thumbnail?id=1BSHzZ_Q0vS7VFBgFO_JRyOUi9D2wBnJu',
    'Interior Paint-1': 'https://drive.google.com/thumbnail?id=1CD8x9xclHKh4he_AewQyLpYIAMO_Z0Jy',
    'Copper Pipe': 'https://drive.google.com/thumbnail?id=1FNO6CmEibV_xWvjt-ciheCzeF0NOl9H7',
    'Pea-Gravel': 'https://drive.google.com/thumbnail?id=1GY5qxCf25arYZ5SLF3FYhqLrSB237AtU',
    'Ready Mix Concrete': 'https://drive.google.com/thumbnail?id=1HS_pazvRdh0oxyrbrtts8zHz8uVwC_C3',
    'Fiberglass Insulation Roll': 'https://drive.google.com/thumbnail?id=1Jm3yex1geel36eH4CCKOE_Rb6Y1KovZJ',
    'Interior Paint-2': 'https://drive.google.com/thumbnail?id=1KJCpFKux0s63qawbgHMHcgO4gwNhJd4f',
    'Pipe Fittings 1in': 'https://drive.google.com/thumbnail?id=1Np08ycQdxEjb1TLppqQkXo1bi0tsNZ2w',
    'Clay Brick': 'https://drive.google.com/thumbnail?id=1QqDN_q6WzJGbRwgZQ4B6ImQHa_gcFhgV',
    'Nails': 'https://drive.google.com/thumbnail?id=1RI-Ol9urZwL_76zvMclIqoUMlCyLywGw',
    'Porcelain Tile': 'https://drive.google.com/thumbnail?id=1TgiLYFarhUsL4DyS0WS0EGIn5cKnBeTu',
    'Rebar-1.5in-x-20ft': 'https://drive.google.com/thumbnail?id=1UGsvLQAC4gOhRO6a1oQ2cCvvsEPg9d8W',
    'Brass Fittings': 'https://drive.google.com/thumbnail?id=1V18SCKcrcsxsT1jFPgYdXB1OflmKzgRy',
    '2x4 Lumber 8f': 'https://drive.google.com/thumbnail?id=1YVVMDLefSc21mfbnMNDeZDJhLyJtuMym',
    'Electric Drill': 'https://drive.google.com/thumbnail?id=1Zdum3SHu3OoQwBvPK0fxJxzO8AG1hkvA',
    'Builder\'s Sand': 'https://drive.google.com/thumbnail?id=1Zq1CRHEYWezcCfzDjSLf0OUl4YLDvLe4',
    'Portland Cement': 'https://drive.google.com/thumbnail?id=1GqHTbPuhvaJiglh_1j_MUUUGQ2T-5Obn',
    'Stainless Steel Screws': 'https://drive.google.com/thumbnail?id=1ai2gTzbb6Rc8vAMWqMSxAH4cTXatZL1r',
    'Rapid Set Cement': 'https://drive.google.com/thumbnail?id=1eFLjXN5_OWxCF_mv28Gaf7MoF5Ylu6wI',
    'River Gravel': 'https://drive.google.com/thumbnail?id=1fWzdh1BVDT5rjaVBdG__ApJFhfZcGz5z',
    'Copper Electrical Wire': 'https://drive.google.com/thumbnail?id=1gmKCD8H_TMPZS9LZERKKSS8oMjzU4sVJ',
    'Interior Paint-3': 'https://drive.google.com/thumbnail?id=1hUuAnNdGsMqiE8Uc5n0M5qut9CLjppgJ',
    'Plywood 4x8': 'https://drive.google.com/thumbnail?id=1iphN3mjbHOJco81JC3VCmMatmIXejXPG',
    'Marine Plywood': 'https://drive.google.com/thumbnail?id=1j6DilxjZ9KLFHVQhzOENAvI_je8a9VQc',
    'Metal Roofing Sheets': 'https://drive.google.com/thumbnail?id=1jiN3Ywzm1mX7D9ykLaRHi-xy9TrJpQWG',
    'Power Drill': 'https://drive.google.com/thumbnail?id=1lKuyC0C_BqBpBSPaudKPSRWUtObHHrZw',
    'Lightweight Concrete Block': 'https://drive.google.com/thumbnail?id=1lRIUuvOkND6uEg2Mh2Si19M2_6ffUP2k',
    'Asphalt Shingles Bundle': 'https://drive.google.com/thumbnail?id=1mV6aNn8HLL6_5GEkJqsi5X2PTZKG3Tkb',
    'Fire Resistent Drywall': 'https://drive.google.com/thumbnail?id=1nolv49QQk7XU2iEshyQNL8Ld1-mE878w',
    'Thermal Insulation': 'https://drive.google.com/thumbnail?id=1ofNYyEw2MVMMvS-UieeGu_QF4XbphBr7',
    'Concrete Block 8x8x 16': 'https://drive.google.com/thumbnail?id=1oxyq9JX9pbLAT-EV-XFyTn47Zt1NBqOX',
    'High Strength Concrete': 'https://drive.google.com/thumbnail?id=1po57A-YWnC0EWZFsiSTfgGlDRMom7ybU',
    'PVC Pipe 1in x 10ft': 'https://drive.google.com/thumbnail?id=1rnOSBAgh82mmn0k8L3X-1nextdajLWG5',
    'Exterior Paint 1gal': 'https://drive.google.com/thumbnail?id=1u-t1YS5T1PHAbh3_MUb4rgsXfZ4T70id',
    'Ceramic Tile 12x12': 'https://drive.google.com/thumbnail?id=1vHhJiTjwyXU9AH_ZY5872O-77KTsk7Gw'
};
  


const products = [
    // Productos para la tienda con store_id 123e4567-e89b-12d3-a456-426614174000
    { storeId: stores[0].id, productId: uuidv4(), category: 'Cement', image: 'https://drive.google.com/thumbnail?id=1GqHTbPuhvaJiglh_1j_MUUUGQ2T-5Obn', price: 12.99, name: 'Portland Cement', stock: 100, supplier: 'Cement Co.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Concrete', image: 'https://drive.google.com/thumbnail?id=1HS_pazvRdh0oxyrbrtts8zHz8uVwC_C3', price: 8.99, name: 'Ready Mix Concrete', stock: 200, supplier: 'Concrete Inc.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Gravel', image: 'https://drive.google.com/thumbnail?id=1GY5qxCf25arYZ5SLF3FYhqLrSB237AtU', price: 4.99, name: 'Pea Gravel', stock: 150, supplier: 'Gravel Corp.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Sand', image: 'https://drive.google.com/thumbnail?id=10SwC0brcihhM2Uv-DbqEzx6_aXObQMxi', price: 3.99, name: 'Play Sand', stock: 120, supplier: 'Sand Supplier Ltd.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Bricks', image: 'https://drive.google.com/thumbnail?id=1QqDN_q6WzJGbRwgZQ4B6ImQHa_gcFhgV', price: 12.75, name: 'Clay Brick', stock: 500, supplier: 'Brickworks LLC.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Cement', image: 'https://drive.google.com/thumbnail?id=1eFLjXN5_OWxCF_mv28Gaf7MoF5Ylu6wI', price: 14.50, name: 'Rapid Set Cement', stock: 80, supplier: 'Quick Build Co.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Concrete', image: 'https://drive.google.com/thumbnail?id=1po57A-YWnC0EWZFsiSTfgGlDRMom7ybU', price: 9.50, name: 'High Strength Concrete', stock: 90, supplier: 'Strong Concrete Inc.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Gravel', image: 'https://drive.google.com/thumbnail?id=1fWzdh1BVDT5rjaVBdG__ApJFhfZcGz5z', price: 5.50, name: 'River Gravel', stock: 160, supplier: 'Riverstone Corp.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Sand', image: 'https://drive.google.com/thumbnail?id=1Zq1CRHEYWezcCfzDjSLf0OUl4YLDvLe4', price: 4.50, name: 'Builder\'s Sand', stock: 130, supplier: 'Builder\'s Supply Ltd.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Bricks', image: 'https://drive.google.com/thumbnail?id=1B5G0BaBtGUy7glrzs8LGiMimqLJey8E5', price: 1.50, name: 'Red Brick', stock: 400, supplier: 'Red Brickworks' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Lumber', image: 'https://drive.google.com/thumbnail?id=173JK4p_jixtmt996dzVI1Yus-tsJWn8G', price: 7.50, name: 'Pine Lumber', stock: 250, supplier: 'Wood Co.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Insulation', image: 'https://drive.google.com/thumbnail?id=1ofNYyEw2MVMMvS-UieeGu_QF4XbphBr7', price: 15.00, name: 'Thermal Insulation', stock: 200, supplier: 'Thermal Solutions' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Drywall', image: 'https://drive.google.com/thumbnail?id=1nolv49QQk7XU2iEshyQNL8Ld1-mE878w', price: 10.00, name: 'Fire Resistant Drywall', stock: 300, supplier: 'Drywall Experts' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Roofing', image: 'https://drive.google.com/thumbnail?id=1jiN3Ywzm1mX7D9ykLaRHi-xy9TrJpQWG', price: 26.00, name: 'Metal Roofing Sheets', stock: 90, supplier: 'Roofing Pros' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Rebar', image: 'https://drive.google.com/thumbnail?id=11JGUZ09e9NP5kGsgZM6pwzXwz3oiKdvH', price: 2.00, name: 'Steel Rebar', stock: 450, supplier: 'Steel Co.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Plywood', image: 'https://drive.google.com/thumbnail?id=1j6DilxjZ9KLFHVQhzOENAvI_je8a9VQc', price: 24.00, name: 'Marine Plywood', stock: 120, supplier: 'Plywood Solutions' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Paint', image: 'https://drive.google.com/thumbnail?id=1CD8x9xclHKh4he_AewQyLpYIAMO_Z0Jy', price: 20.00, name: 'Interior Paint', stock: 70, supplier: 'Paint Masters' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Tiles', image: 'https://drive.google.com/thumbnail?id=1TgiLYFarhUsL4DyS0WS0EGIn5cKnBeTu', price: 1.75, name: 'Porcelain Tile', stock: 1100, supplier: 'Tile Makers' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Tools', image: 'https://drive.google.com/thumbnail?id=15YvWYzDq9ybJ02u1kVhy5T_zvIbhy_DP', price: 50.00, name: 'Cordless Drill', stock: 55, supplier: 'Tool World' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Nails', image: 'https://drive.google.com/thumbnail?id=1RI-Ol9urZwL_76zvMclIqoUMlCyLywGw', price: 3.00, name: 'Galvanized Nails', stock: 550, supplier: 'Nail Experts' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Screws', image: 'https://drive.google.com/thumbnail?id=1ai2gTzbb6Rc8vAMWqMSxAH4cTXatZL1r', price: 4.00, name: 'Stainless Steel Screws', stock: 420, supplier: 'Screw Depot' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Concrete Blocks', image: 'https://drive.google.com/thumbnail?id=1lRIUuvOkND6uEg2Mh2Si19M2_6ffUP2k', price: 1.30, name: 'Lightweight Concrete Block', stock: 650, supplier: 'Concrete Block Co.' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Pipes', image: 'https://drive.google.com/thumbnail?id=1FNO6CmEibV_xWvjt-ciheCzeF0NOl9H7', price: 13.00, name: 'Copper Pipe', stock: 220, supplier: 'Pipe Specialists' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Fittings', image: 'https://drive.google.com/thumbnail?id=1V18SCKcrcsxsT1jFPgYdXB1OflmKzgRy', price: 1.00, name: 'Brass Fittings', stock: 320, supplier: 'Fittings Plus' },
    { storeId: stores[0].id, productId: uuidv4(), category: 'Wire', image: 'https://drive.google.com/thumbnail?id=1gmKCD8H_TMPZS9LZERKKSS8oMjzU4sVJ', price: 25.00, name: 'Copper Electrical Wire', stock: 160, supplier: 'Wire Solutions' },

    // Productos para la tienda 
    { storeId: stores[1].id, productId: uuidv4(), category: 'Lumber', image: 'https://drive.google.com/thumbnail?id=1YVVMDLefSc21mfbnMNDeZDJhLyJtuMym', price: 7.50, name: '2x4 Lumber 8ft', stock: 300, supplier: 'Lumber Yard.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Insulation', image: 'https://drive.google.com/thumbnail?id=1Jm3yex1geel36eH4CCKOE_Rb6Y1KovZJ', price: 14.99, name: 'Fiberglass Insulation Roll', stock: 100, supplier: 'Insulate It Inc.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Drywall', image: 'https://drive.google.com/thumbnail?id=15wa5ZlV7PJaI_uYrwZXWqdjtHK8hzlb9', price: 9.99, name: 'Sheetrock 4x8', stock: 250, supplier: 'Drywall Direct.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Roofing', image: 'https://drive.google.com/thumbnail?id=1mV6aNn8HLL6_5GEkJqsi5X2PTZKG3Tkb', price: 25.00, name: 'Asphalt Shingles Bundle', stock: 75, supplier: 'Roofing Masters.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Rebar', image: 'https://drive.google.com/thumbnail?id=1UGsvLQAC4gOhRO6a1oQ2cCvvsEPg9d8W', price: 1.99, name: 'Rebar 1/2in x 20ft', stock: 400, supplier: 'Steel Suppliers.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Plywood', image: 'https://drive.google.com/thumbnail?id=1iphN3mjbHOJco81JC3VCmMatmIXejXPG', price: 23.99, name: 'Plywood 4x8', stock: 100, supplier: 'Wood Products Co.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Paint', image: 'https://drive.google.com/thumbnail?id=1u-t1YS5T1PHAbh3_MUb4rgsXfZ4T70id', price: 19.99, name: 'Exterior Paint 1gal', stock: 80, supplier: 'Paintworks.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Tiles', image: 'https://drive.google.com/thumbnail?id=1vHhJiTjwyXU9AH_ZY5872O-77KTsk7Gw', price: 1.50, name: 'Ceramic Tile 12x12', stock: 1000, supplier: 'Tile Depot.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Tools', image: 'https://drive.google.com/thumbnail?id=1Zdum3SHu3OoQwBvPK0fxJxzO8AG1hkvA', price: 49.99, name: 'Electric Drill', stock: 50, supplier: 'Tool Corp.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Nails', image: 'https://drive.google.com/thumbnail?id=1RI-Ol9urZwL_76zvMclIqoUMlCyLywGw', price: 2.99, name: 'Nails', stock: 500, supplier: 'Nail Factory.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Screws', image: 'https://drive.google.com/thumbnail?id=10ikzd3MvlVspkpmIPi1L595ZFnS7iO20', price: 3.99, name: 'Wood Screws', stock: 400, supplier: 'Screw Masters.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Concrete Blocks', image: 'https://drive.google.com/thumbnail?id=1oxyq9JX9pbLAT-EV-XFyTn47Zt1NBqOX', price: 1.25, name: 'Concrete Block 8x8x16', stock: 600, supplier: 'Block Co.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Pipes', image: 'https://drive.google.com/thumbnail?id=1rnOSBAgh82mmn0k8L3X-1nextdajLWG5', price: 12.99, name: 'PVC Pipe 1in x 10ft', stock: 200, supplier: 'Pipe Solutions.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Fittings', image: 'https://drive.google.com/thumbnail?id=1Np08ycQdxEjb1TLppqQkXo1bi0tsNZ2w', price: 0.99, name: 'Pipe Fittings 1in', stock: 300, supplier: 'Fittings LLC.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Wire', image: 'https://drive.google.com/thumbnail?id=1BSHzZ_Q0vS7VFBgFO_JRyOUi9D2wBnJu', price: 24.99, name: 'Electrical Wire 100ft', stock: 150, supplier: 'Electrical Supplies.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Cement', image: 'https://drive.google.com/thumbnail?id=1eFLjXN5_OWxCF_mv28Gaf7MoF5Ylu6wI', price: 14.50, name: 'Rapid Set Cement', stock: 80, supplier: 'Quick Build Co.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Concrete', image: 'https://drive.google.com/thumbnail?id=1po57A-YWnC0EWZFsiSTfgGlDRMom7ybU', price: 9.50, name: 'High Strength Concrete', stock: 90, supplier: 'Strong Concrete Inc.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Gravel', image: 'https://drive.google.com/thumbnail?id=1fWzdh1BVDT5rjaVBdG__ApJFhfZcGz5z', price: 5.50, name: 'River Gravel', stock: 160, supplier: 'Riverstone Corp.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Sand', image: 'https://drive.google.com/thumbnail?id=1Zq1CRHEYWezcCfzDjSLf0OUl4YLDvLe4', price: 4.50, name: 'Builder\'s Sand', stock: 130, supplier: 'Builder\'s Supply Ltd.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Bricks', image: 'https://drive.google.com/thumbnail?id=1B5G0BaBtGUy7glrzs8LGiMimqLJey8E5', price: 1.50, name: 'Red Brick', stock: 400, supplier: 'Red Brickworks' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Lumber', image: 'https://drive.google.com/thumbnail?id=173JK4p_jixtmt996dzVI1Yus-tsJWn8G', price: 7.50, name: 'Pine Lumber', stock: 250, supplier: 'Wood Co.' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Insulation', image: 'https://drive.google.com/thumbnail?id=1ofNYyEw2MVMMvS-UieeGu_QF4XbphBr7', price: 15.00, name: 'Thermal Insulation', stock: 200, supplier: 'Thermal Solutions' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Drywall', image: 'https://drive.google.com/thumbnail?id=1nolv49QQk7XU2iEshyQNL8Ld1-mE878w', price: 10.00, name: 'Fire Resistant Drywall', stock: 300, supplier: 'Drywall Experts' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Roofing', image: 'https://drive.google.com/thumbnail?id=1jiN3Ywzm1mX7D9ykLaRHi-xy9TrJpQWG', price: 26.00, name: 'Metal Roofing Sheets', stock: 90, supplier: 'Roofing Pros' },
    { storeId: stores[1].id, productId: uuidv4(), category: 'Rebar', image: 'https://drive.google.com/thumbnail?id=11JGUZ09e9NP5kGsgZM6pwzXwz3oiKdvH', price: 2.00, name: 'Steel Rebar', stock: 450, supplier: 'Steel Co.' },


    // Productos para la tienda con store_id 123e4567-e89b-12d3-a456-426614174002
    { storeId: stores[2].id, productId: uuidv4(), category: 'Plywood', image: 'https://drive.google.com/thumbnail?id=1iphN3mjbHOJco81JC3VCmMatmIXejXPG', price: 23.99, name: 'Plywood 4x8', stock: 100, supplier: 'Wood Products Co.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Paint', image: 'https://drive.google.com/thumbnail?id=1u-t1YS5T1PHAbh3_MUb4rgsXfZ4T70id', price: 19.99, name: 'Exterior Paint 1gal', stock: 80, supplier: 'Paintworks.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Tiles', image: 'https://drive.google.com/thumbnail?id=1vHhJiTjwyXU9AH_ZY5872O-77KTsk7Gw', price: 1.50, name: 'Ceramic Tile 12x12', stock: 1000, supplier: 'Tile Depot.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Tools', image: 'https://drive.google.com/thumbnail?id=1Zdum3SHu3OoQwBvPK0fxJxzO8AG1hkvA', price: 49.99, name: 'Electric Drill', stock: 50, supplier: 'Tool Corp.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Nails', image: 'https://drive.google.com/thumbnail?id=1RI-Ol9urZwL_76zvMclIqoUMlCyLywGw', price: 2.99, name: 'Nails', stock: 500, supplier: 'Nail Factory.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Insulation', image: 'https://drive.google.com/thumbnail?id=1Jm3yex1geel36eH4CCKOE_Rb6Y1KovZJ', price: 14.99, name: 'Fiberglass Insulation Roll', stock: 150, supplier: 'Insulate It Inc.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Drywall', image: 'https://drive.google.com/thumbnail?id=15wa5ZlV7PJaI_uYrwZXWqdjtHK8hzlb9', price: 9.99, name: 'Sheetrock 4x8', stock: 200, supplier: 'Drywall Direct.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Roofing', image: 'https://drive.google.com/thumbnail?id=1mV6aNn8HLL6_5GEkJqsi5X2PTZKG3Tkb', price: 25.00, name: 'Asphalt Shingles Bundle', stock: 75, supplier: 'Roofing Masters.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Rebar', image: 'https://drive.google.com/thumbnail?id=1UGsvLQAC4gOhRO6a1oQ2cCvvsEPg9d8W', price: 1.99, name: 'Rebar 1/2in x 20ft', stock: 400, supplier: 'Steel Suppliers.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Lumber', image: 'https://drive.google.com/thumbnail?id=1YVVMDLefSc21mfbnMNDeZDJhLyJtuMym', price: 7.50, name: '2x4 Lumber 8ft', stock: 300, supplier: 'Lumber Yard.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Concrete', image: 'https://drive.google.com/thumbnail?id=1HS_pazvRdh0oxyrbrtts8zHz8uVwC_C3', price: 8.99, name: 'Ready Mix Concrete', stock: 200, supplier: 'Concrete Inc.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Gravel', image: 'https://drive.google.com/thumbnail?id=1GY5qxCf25arYZ5SLF3FYhqLrSB237AtU', price: 4.99, name: 'Pea Gravel', stock: 150, supplier: 'Gravel Corp.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Sand', image: 'https://drive.google.com/thumbnail?id=10SwC0brcihhM2Uv-DbqEzx6_aXObQMxi', price: 3.99, name: 'Play Sand', stock: 120, supplier: 'Sand Supplier Ltd.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Bricks', image: 'https://drive.google.com/thumbnail?id=1QqDN_q6WzJGbRwgZQ4B6ImQHa_gcFhgV', price: 0.75, name: 'Clay Brick', stock: 500, supplier: 'Brickworks LLC.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Screws', image: 'https://drive.google.com/thumbnail?id=10ikzd3MvlVspkpmIPi1L595ZFnS7iO20', price: 3.99, name: 'Wood Screws', stock: 400, supplier: 'Screw Masters.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Concrete Blocks', image: 'https://drive.google.com/thumbnail?id=1oxyq9JX9pbLAT-EV-XFyTn47Zt1NBqOX', price: 1.25, name: 'Concrete Block 8x8x16', stock: 600, supplier: 'Block Co.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Pipes', image: 'https://drive.google.com/thumbnail?id=1rnOSBAgh82mmn0k8L3X-1nextdajLWG5', price: 12.99, name: 'PVC Pipe 1in x 10ft', stock: 200, supplier: 'Pipe Solutions.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Fittings', image: 'https://drive.google.com/thumbnail?id=1Np08ycQdxEjb1TLppqQkXo1bi0tsNZ2w', price: 0.99, name: 'Pipe Fittings 1in', stock: 300, supplier: 'Fittings LLC.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Wire', image: 'https://drive.google.com/thumbnail?id=1BSHzZ_Q0vS7VFBgFO_JRyOUi9D2wBnJu', price: 24.99, name: 'Electrical Wire 100ft', stock: 150, supplier: 'Electrical Supplies.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Paint', image: 'https://drive.google.com/thumbnail?id=1CD8x9xclHKh4he_AewQyLpYIAMO_Z0Jy', price: 19.99, name: 'Interior Paint 1gal', stock: 100, supplier: 'Paintworks.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Tiles', image: 'https://drive.google.com/thumbnail?id=1TgiLYFarhUsL4DyS0WS0EGIn5cKnBeTu', price: 1.50, name: 'Porcelain Tile 12x12', stock: 800, supplier: 'Tile Emporium.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Tools', image: 'https://drive.google.com/thumbnail?id=15YvWYzDq9ybJ02u1kVhy5T_zvIbhy_DP', price: 49.99, name: 'Cordless Drill', stock: 70, supplier: 'ToolWorks.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Nails', image: 'https://drive.google.com/thumbnail?id=1-xOiOKQXirOA8JCVl6p8LcvpbQ177Ucw', price: 2.99, name: 'Finish Nails', stock: 450, supplier: 'Nail Co.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Screws', image: 'https://drive.google.com/thumbnail?id=15wa5ZlV7PJaI_uYrwZXWqdjtHK8hzlb9', price: 4.99, name: 'Drywall Screws', stock: 300, supplier: 'ScrewIt.' },
    { storeId: stores[2].id, productId: uuidv4(), category: 'Pipes', image: 'https://drive.google.com/thumbnail?id=1FNO6CmEibV_xWvjt-ciheCzeF0NOl9H7', price: 14.99, name: 'Copper Pipe 1/2in x 10ft', stock: 120, supplier: 'Pipe Co.' },

    // Productos para la tienda con store_id 123e4567-e89b-12d3-a456-426614174003
    { storeId: stores[3].id, productId: uuidv4(), category: 'Screws', image: 'https://drive.google.com/thumbnail?id=10ikzd3MvlVspkpmIPi1L595ZFnS7iO20', price: 3.99, name: 'Wood Screws', stock: 400, supplier: 'Screw Masters.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Concrete Blocks', image: 'https://drive.google.com/thumbnail?id=1oxyq9JX9pbLAT-EV-XFyTn47Zt1NBqOX', price: 1.25, name: 'Concrete Block 8x8x16', stock: 600, supplier: 'Block Co.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Pipes', image: 'https://drive.google.com/thumbnail?id=1rnOSBAgh82mmn0k8L3X-1nextdajLWG5', price: 12.99, name: 'PVC Pipe 1in x 10ft', stock: 200, supplier: 'Pipe Solutions.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Fittings', image: 'https://drive.google.com/thumbnail?id=1Np08ycQdxEjb1TLppqQkXo1bi0tsNZ2w', price: 22.99, name: 'Pipe Fittings 1in', stock: 300, supplier: 'Fittings LLC.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Wire', image: 'https://drive.google.com/thumbnail?id=1BSHzZ_Q0vS7VFBgFO_JRyOUi9D2wBnJu', price: 24.99, name: 'Electrical Wire 100ft', stock: 150, supplier: 'Electrical Supplies.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Nails', image: 'https://drive.google.com/thumbnail?id=1-xOiOKQXirOA8JCVl6p8LcvpbQ177Ucw', price: 2.99, name: 'Finish Nails', stock: 500, supplier: 'Nail Co.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Screws', image: 'https://drive.google.com/thumbnail?id=15wa5ZlV7PJaI_uYrwZXWqdjtHK8hzlb9', price: 4.99, name: 'Drywall Screws', stock: 300, supplier: 'ScrewIt.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Pipes', image: 'https://drive.google.com/thumbnail?id=1FNO6CmEibV_xWvjt-ciheCzeF0NOl9H7', price: 14.99, name: 'Copper Pipe 1/2in x 10ft', stock: 120, supplier: 'Pipe Co.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Fittings', image: 'https://drive.google.com/thumbnail?id=1V18SCKcrcsxsT1jFPgYdXB1OflmKzgRy', price: 9.99, name: 'Plumbing Fittings', stock: 250, supplier: 'Pipe Solutions.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Insulation', image: 'https://drive.google.com/thumbnail?id=1Jm3yex1geel36eH4CCKOE_Rb6Y1KovZJ', price: 18.99, name: 'Foam Insulation Board', stock: 100, supplier: 'Insulation Pros.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Drywall', image: 'https://drive.google.com/thumbnail?id=15wa5ZlV7PJaI_uYrwZXWqdjtHK8hzlb9', price: 11.99, name: 'Drywall Screws', stock: 200, supplier: 'Drywall Depot.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Tiles', image: 'https://drive.google.com/thumbnail?id=1TgiLYFarhUsL4DyS0WS0EGIn5cKnBeTu', price: 1.75, name: 'Porcelain Tile 12x12', stock: 800, supplier: 'Tile Supply Outlet.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Tools', image: 'https://drive.google.com/thumbnail?id=1lKuyC0C_BqBpBSPaudKPSRWUtObHHrZw', price: 59.99, name: 'Power Drill', stock: 50, supplier: 'ToolHub.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Paint', image: 'https://drive.google.com/thumbnail?id=1CD8x9xclHKh4he_AewQyLpYIAMO_Z0Jy', price: 22.99, name: 'Interior Paint 1gal', stock: 100, supplier: 'Paint Pros.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Lumber', image: 'https://drive.google.com/thumbnail?id=1YVVMDLefSc21mfbnMNDeZDJhLyJtuMym', price: 11.50, name: 'Pine Lumber 2x4', stock: 300, supplier: 'Lumber Supply Co.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Bricks', image: 'https://drive.google.com/thumbnail?id=1B5G0BaBtGUy7glrzs8LGiMimqLJey8E5', price: 0.99, name: 'Red Brick', stock: 500, supplier: 'Brick Outlet.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Concrete', image: 'https://drive.google.com/thumbnail?id=1HS_pazvRdh0oxyrbrtts8zHz8uVwC_C3', price: 7.50, name: 'Concrete Mix', stock: 150, supplier: 'Concrete Supply Co.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Sand', image: 'https://drive.google.com/thumbnail?id=10SwC0brcihhM2Uv-DbqEzx6_aXObQMxi', price: 2.99, name: 'Fine Sand', stock: 120, supplier: 'Sand Depot.' },
    { storeId: stores[3].id, productId: uuidv4(), category: 'Gravel', image: 'https://drive.google.com/thumbnail?id=1GY5qxCf25arYZ5SLF3FYhqLrSB237AtU', price: 6.99, name: 'Pear Gravel', stock: 200, supplier: 'Rock Supply Co.' }    
];  

async function insertData() {
    try {
        await client.connect();

        // Insertar tiendas
        for (const store of stores) {
            const query = 'INSERT INTO build_zone.store (store_id, location, store_name) VALUES (?, ?, ?)';
            await client.execute(query, [store.id, store.location, store.name], { prepare: true });
        }

        // Insertar usuarios
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const query = 'INSERT INTO build_zone.users (username, password, role, store_id, user_id) VALUES (?, ?, ?, ?, ?)';
            await client.execute(query, [user.username, hashedPassword, user.role, user.storeId, user.userId], { prepare: true });
        }



        // Insertar productos
        for (const product of products) {
            const query = 'INSERT INTO build_zone.productstore (store_id, product_id, category, image, price, product_name, stock, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            await client.execute(query, [product.storeId,product.productId, product.category, product.image, product.price, product.name, product.stock, product.supplier], { prepare: true });
        }

        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data', error);
    } finally {
        await client.shutdown();
    }
}

insertData();

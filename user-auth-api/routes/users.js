// routes/users.js

// Import express to define routes
const express = require('express');

// Import bcrypt to securely hash passwords
const bcrypt = require('bcryptjs');

// Import the PostgreSQL pool from db.js
const pool = require('../db');

// Create a new router instance (like setting up a Controller class)
const router = express.Router();

const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save to 'uploads' folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Upload Profile Picture
router.post('/uploadProfileImage/:userId', upload.single('profileImage'), async (req, res) => {
  const { userId } = req.params;
  const profileUrl = `http://10.150.14.245:3000/uploads/${req.file.filename}`;

  if (!req.file) return res.status(400).json({message: 'No file uploaded'});

  try {
    await pool.query('UPDATE Users SET profile_url = $1 WHERE userid = $2', [profileUrl, userId]);
    res.json({ success: true, profileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Could not update profile picture' });
  }
});


// ============================
// POST /register – Register a user
// ============================

router.post('/register', async (req, res) => {
  // Destructure request body (like binding a DTO in ASP.NET)
  const { name, surname, password, username } = req.body;

  try {
    // Hash the password before storing it in DB (bcrypt.hash is async)
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Incoming Registration: ", req.body)

    // SQL query to insert the new user (parameterized to prevent SQL injection)
    const result = await pool.query(
      'INSERT INTO Users (name, surname, passwords, username) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, surname, hashedPassword, username]
    );
console.log("Results", result)
    // Respond with success and new user's ID
    res.status(201).json({ message: 'User registered', userId: result.rows[0].userid });
  } catch (error) {
    // Return error if something goes wrong
    console.log(".........",error)
    res.status(500).json({ error: error.message });
  }
});


// ============================
// POST /login – Log in a user
// ============================

router.post('/login', async (req, res) => {
  // Destructure request body
  const { username, password } = req.body;

  console.log("Incoming Login: ", req.body)
  
  try {
    
    // Look up user by username
    const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

    // If user not found, send 400
    if (result.rows.length === 0) {
      console.log("No user found")
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    /*console.log("..1.....",password)
    console.log("...2....",user.passwords)*/

    // Compare provided password with hashed password from DB
    const isValid = await bcrypt.compare(password, user.passwords);

    /*console.log("..3.....",isValid)
    console.log("...4....",user)
    console.log("...5....",hashedPassword)*/

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Successful login
    res.json({ message: 'Login successful', userID: user.userid, username: user.username });
    //Remember to use userID for asyncStorage because you've set it like that from response

  } catch (error) {
    // Return error if something goes wrong
    res.status(500).json({ error: error.message });
  }
});

//Revenue

router.post('/revenue', async (req, res) => {
  const { till, expenditure, netCash, userId } = req.body;

  if (!till || !expenditure || !netCash || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO DailyRevenue (user_id, till, expenditure, net_cash, date) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, till, expenditure, netCash]
    );

    res.status(201).json({ message: 'Revenue saved', data: result.rows[0] });
  } catch (error) {
    console.error('Insert error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//Post to daily summary table
router.post('/daily-summary', async (req, res) => {
  const { userId, netCash } = req.body;

  if (!userId || netCash === undefined) {
    return res.status(400).json({ message: 'Missing userId or netCash' });
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  try {
    // Get openingStock from yesterday's closingStock
    const prev = await pool.query(
      'SELECT closing_stock FROM DailyStockSummary WHERE userid = $1 AND date = $2',
      [userId, yesterday]
    );
    const openingStock = prev.rows[0]?.closing_stock || 0;

    // Get totalStock (if added today)
    const stockResult = await pool.query(
      'SELECT COALESCE(SUM(totalStock), 0) AS total_stock FROM Stock WHERE userid = $1 AND date = $2',
      [userId, today]
    );
    const totalStock = stockResult.rows[0].totalStock || 0;

    // Get damages (if added today)
    const damageResult = await pool.query(
      'SELECT COALESCE(SUM(total_damages), 0) AS totalDamage FROM Damages WHERE userid = $1 AND date = $2',
      [userId, today]
    );
    const totalDamages = damageResult.rows[0].totalDamage || 0;

    const closingStock = openingStock + totalStock - netCash - totalDamages;

    console.log("Insert Summary =>", {
      userId,
      date: today,
      openingStock: openingStock,
      totalStock: totalStock,
      netCash: netCash,
      totalDamages: totalDamages,
      closingStock
    });

    // Save summary (PostgreSQL computes closing_stock automatically)
    await pool.query(
      `INSERT INTO DailyStockSummary (userid, date, opening_stock, total_stock, damages, net_cash, closing_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, summary_date) DO NOTHING`,
      [userId, today, openingStock, totalStock, totalDamages, netCash, closingStock]
    );

    res.json({ message: 'Daily summary saved successfully.' });

  } catch (err) {
    console.error('Error saving daily summary:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Stock Method
router.post('/stock', async (req, res) => {
  const { userId, category, totalStock } = req.body;

  if (!userId || !category || !totalStock) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const currentDate = new Date().toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO Stock (category, totalStock, userId, date)
       VALUES ($1, $2, $3, $4)`,
      [category, totalStock, userId, currentDate]
    );

    res.json({ message: 'Stock saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// routes/damages.js

router.post('/damages', async (req, res) => {
  const { userId, date, totalDamages } = req.body;

  if (!userId || !totalDamages || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Damages (totalDamage, userId, date)
       VALUES ($1, $2, $3) RETURNING *`,
      [totalDamages, userId, date]
    );

    res.status(201).json({ message: 'Damage recorded', data: result.rows[0] });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//ViewDailySummary
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM daily_business_summary ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: error.message });
  }
});


// POST /api/notifications
router.post('/saveNotifications', async (req, res) => {
  const { userId, message } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Notifications (userId, message) VALUES ($1, $2) RETURNING *`,
      [userId, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving notification:', err);
    res.status(500).json({ message: 'Failed to save notification' });
  }
});

// GET /api/notifications/:userId
router.get('/getNotifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM Notifications WHERE userId = $1 ORDER BY date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

//User profile
router.get('/getUserInfo/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM Users WHERE userId = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user information' });
  }
});


// Export router so it can be mounted in index.js
module.exports = router;

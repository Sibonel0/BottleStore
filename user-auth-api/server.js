//Server.js

// Import express framework (like setting up WebHostBuilder)
const express = require('express');

// Import CORS middleware to allow cross-origin requests (like enabling CORS in ASP.NET)
const cors = require('cors');

// Import user routes (controllers)
const userRoutes = require('./routes/users');

//Load environment variables (like using appsettings.json)
require('dotenv').config();

// Create express app instance (like building a WebApplication)
const app = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 3000;

// Middleware: enable CORS for all routes
app.use(cors());

// Middleware: parse incoming JSON bodies (like app.UseEndpoints().UseRouting())
app.use(express.json());

// Mount the user routes at /api/users (like MapControllerRoute)
app.use('/api/users', userRoutes);

//FOR IMAGE
app.use('/uploads', express.static('uploads'));

app.get('/health', (req, res) => {
  res.send('OK');
});

// Start the server (like app.Run())
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express from 'express';
import "dotenv/config";
import cors from 'cors';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import technicalDashboardRoutes from './routes/technicalDashboardRoutes.js';
import creativeDashboardRoutes from './routes/creativeDashboardRoutes.js';
import corporateDashboardRoutes from './routes/corporateDashboardRoutes.js';
import { initializeAdmins } from './controllers/adminController.js';

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','https://hrcc-recruitments.vercel.app/','http://hrcc-recruitments.vercel.app'],
  credentials: true
}));
app.use(express.json());


// Initialize database and then admins
const startServer = async () => {
  try {
    await db();
    await initializeAdmins();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Sample route
app.get('/', (req, res) => {
    res.send('Backend is working');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/technical-dashboard', technicalDashboardRoutes);
app.use('/api/creative-dashboard', creativeDashboardRoutes);
app.use('/api/corporate-dashboard', corporateDashboardRoutes);

// Start the server
startServer();



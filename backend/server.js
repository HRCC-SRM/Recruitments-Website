import express from 'express';
import "dotenv/config";
import cors from 'cors';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import technicalDashboardRoutes from './routes/technicalDashboardRoutes.js';
import creativeDashboardRoutes from './routes/creativeDashboardRoutes.js';
import corporateDashboardRoutes from './routes/corporateDashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());


db();
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



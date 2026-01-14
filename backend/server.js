import 'dotenv/config'; // Load env vars before other imports
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import sadhnaRoutes from './routes/sadhna.js';
import whatsappRoutes from './routes/whatsapp.js';

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            process.env.FRONTEND_URL
        ].filter(Boolean); // Filter out undefined if env var is missing

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sadhna', sadhnaRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Sadhna Tracker API',
        version: '1.0.0',
        status: 'running'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

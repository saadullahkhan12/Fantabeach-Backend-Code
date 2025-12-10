const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');


const app = express();




// Load env
dotenv.config();

// Connect DB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const leagueRoutes = require("./routes/leagueRoutes");
const creditsRoutes = require('./routes/creditsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otpRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/credits', creditsRoutes);
app.use("/api/league", leagueRoutes);
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', adminRoutes);






// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'FantaBeach API is running' });
});

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'production'} on port ${PORT}`);
});

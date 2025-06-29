const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminUserRoute = require('./routes/adminUserRoutes');
const subscriptionRoute = require('./routes/subscriptions');
const courseRoutes = require('./routes/courses');
const videoRoutes = require('./routes/videos');
const courseNotesRoutes = require('./routes/courseNotes');
const blogRoutes = require('./routes/blogs');
const userCourses = require('./routes/userCourses');
const userSubscription = require('./routes/userSubscriptions');
const paymentRoutes = require('./routes/paymentRoutes');
const subscriptionRoutes = require('./routes/subscriptions');
const liveSessionRoutes = require('./routes/liveSessions');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // For parsing JSON bodies

const allowedOrigins = [
  'https://affectionate-kindness-production.up.railway.app',
  'http://localhost:8080'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);

//Admin user managements routes
app.use('/api/manage', adminUserRoute);
//Subscriptionsroutes
app.use('/api/subscriptions', subscriptionRoute);
app.use('/api/user/subscriptions', userSubscription);

//Courses routes
app.use('/api/courses', courseRoutes);
//Videos routes
app.use('/api/videos', videoRoutes);
app.use('/uploads', express.static('uploads'));
//Course Notes routes
app.use('/api/notes', courseNotesRoutes);
//Blogs routes
app.use('/api/blogs', blogRoutes);
//Live sessions
app.use('/api/live-sessions', liveSessionRoutes);

//User courses routes
app.use('/api/user/courses', userCourses);

//Payments
app.use('/api/payments', paymentRoutes);
app.use('/api', subscriptionRoutes);


// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port http://127.0.0.1:${process.env.PORT}`));

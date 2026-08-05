require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
// Security & Auth Packages
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const requestId = require('./middlewares/requestId')

// Route Imports
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const teamRoutes = require('./routes/teamRoutes')
const inviteRoutes = require('./routes/inviteRoutes')
const requestRoutes = require('./routes/requestRoutes')
const teamManagementRoutes = require('./routes/teamManagementRoutes')
const registrationRoutes = require('./routes/registrationRoutes')
const adminRoutes = require('./routes/adminRoutes')
const publicRegistrationRoutes = require('./routes/publicRegistrationRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(requestId)
app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api', limiter)

// Simple Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [${req.id}] ${req.method} ${req.url}`)
  next()
})

// API Versioning & Routes
app.get('/api/v1', (req, res) => {
  res.status(200).json({ message: 'Nexus 2026 API v1 is running...' })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/team', teamRoutes)
app.use('/api/v1/invites', inviteRoutes)
app.use('/api/v1/requests', requestRoutes)
app.use('/api/v1/team-management', teamManagementRoutes)
app.use('/api/v1/registration', registrationRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/public', publicRegistrationRoutes)



// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexus2026')
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection error:', err)
    process.exit(1)
  })

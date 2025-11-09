const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin')

// Development-only routes to help debugging. DO NOT enable in production.
router.get('/admins', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Forbidden' })
    const admins = await Admin.find()
    // return admins including password hash for local debugging only
    res.json(admins)
  } catch (err) { next(err) }
})

module.exports = router

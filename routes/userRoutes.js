const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/authenticateToken');

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get('/user', authenticateToken, UserController.getUserInfo);

module.exports = router;

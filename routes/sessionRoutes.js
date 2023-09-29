const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/SessionController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/book-session/:sessionId', authenticateToken, SessionController.bookSession);
router.post('/create-session', authenticateToken, SessionController.createSession);
router.get('/sessions', authenticateToken, SessionController.getAvailableSessions);
router.get('/dean/sessions/:deanId', authenticateToken, SessionController.getDeanPendingSessions);


module.exports = router;

const express = require('express');
const { getMail, postMail } = require('../controllers/mailController');
const protectedRoute = require('../middleware/protectedRoute');
const router = express.Router();

router.use(protectedRoute);
router.route('/')
.get(getMail)
.post(postMail)
// .post(postMail)

module.exports = router;
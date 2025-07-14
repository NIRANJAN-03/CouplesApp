// Backend\routes\auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { handleFacebookLogin } = require('../components/facebookAuthController');
router.post('/send-email-otp', authController.sendEmailOTP);
router.post('/verify-email-otp', authController.verifyEmailOTP);
router.post('/send-phone-otp', authController.sendPhoneOTP);
router.post('/verify-phone-otp', authController.verifyPhoneOTP);
router.post('/update-user', authController.updateUserDetails);
router.post('/check-user', authController.checkUserExists); 
router.post('/get-user', authController.getUser); // ✅ ADD THIS LINE
router.post('/facebook-login', handleFacebookLogin);
module.exports = router;

const express = require('express');
const router = express.Router();
const { saveSubmission, getSubmissions } = require('../controllers/formController');

router.route('/')
  .post(saveSubmission)
  .get(getSubmissions);

module.exports = router;

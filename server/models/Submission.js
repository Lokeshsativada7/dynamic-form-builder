const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  // Using Schema.Types.Mixed to allow any dynamic form data structure
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Submission', submissionSchema);

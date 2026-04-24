const Submission = require('../models/Submission');

// @desc    Save new form submission
// @route   POST /api/form
exports.saveSubmission = async (req, res) => {
  try {
    const formData = req.body;
    
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ success: false, message: 'Form data is empty' });
    }

    const newSubmission = new Submission({ formData });
    await newSubmission.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: newSubmission
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all form submissions
// @route   GET /api/form
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

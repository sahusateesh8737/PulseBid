const express = require('express');
const router = express.Router();
const { upload } = require('../../config/cloudinary');
const { authMiddleware } = require('../../middleware/authMiddleware');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

router.post('/image', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json(errorResponse('No image provided'));
  }
  return res.status(200).json(successResponse({ url: req.file.path }, 'Image uploaded successfully'));
});

module.exports = router;

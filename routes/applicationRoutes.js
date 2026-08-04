import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createApplication,
  checkApplicationStatus,
} from '../controllers/applicationController.js';
import {
  validateApplicationSubmission,
  validatePublicStatusCheck,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Configure file storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const upload = multer({ storage });

// Public route for checking status
router.get('/check-status', validatePublicStatusCheck, checkApplicationStatus);

// Public endpoint for submitting applications (accept multipart/form-data with files)
const uploadFields = upload.fields([
  { name: 'proofOfAddress', maxCount: 1 },
  { name: 'sketchFile', maxCount: 1 },
  { name: 'authorizationLetter', maxCount: 1 },
  { name: 'brcFile', maxCount: 1 },
  { name: 'nicFront', maxCount: 1 },
  { name: 'nicBack', maxCount: 1 },
]);

router.post('/', uploadFields, validateApplicationSubmission, createApplication);

export default router;

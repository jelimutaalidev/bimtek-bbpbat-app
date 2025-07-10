const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subDir = req.uploadType || 'general';
    const fullPath = path.join(uploadDir, subDir);
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = req.allowedTypes || [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

// Middleware to set upload type
function setUploadType(type) {
  return (req, res, next) => {
    req.uploadType = type;
    next();
  };
}

// Middleware to set allowed file types
function setAllowedTypes(types) {
  return (req, res, next) => {
    req.allowedTypes = types;
    next();
  };
}

// Document upload middleware
const uploadDocument = [
  setUploadType('documents'),
  setAllowedTypes([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]),
  upload.single('file')
];

// Payment proof upload middleware
const uploadPaymentProof = [
  setUploadType('payments'),
  setAllowedTypes([
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]),
  upload.single('file')
];

// Report upload middleware
const uploadReport = [
  setUploadType('reports'),
  setAllowedTypes([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  upload.single('file')
];

// Application letter upload middleware
const uploadApplicationLetter = [
  setUploadType('applications'),
  setAllowedTypes([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  upload.single('file')
];

module.exports = {
  upload,
  uploadDocument,
  uploadPaymentProof,
  uploadReport,
  uploadApplicationLetter,
  setUploadType,
  setAllowedTypes
};
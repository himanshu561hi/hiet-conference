const multer = require('multer');

// Configure memory storage to prevent local disk I/O bottlenecks
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    const err = new Error('Invalid File Type. Only PDFs are allowed.');
    err.code = 'REG_007';
    err.statusCode = 400;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
  fileFilter
});

const uploadMiddleware = (req, res, next) => {
  const uploader = upload.single('paper');
  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false, code: 'REG_008', message: 'File Too Large. Max 10MB.', timestamp: new Date().toISOString()
        });
      }
      return res.status(400).json({
        success: false, code: 'SYS_400', message: err.message, timestamp: new Date().toISOString()
      });
    } else if (err) {
      return res.status(err.statusCode || 400).json({
        success: false, code: err.code || 'SYS_400', message: err.message, timestamp: new Date().toISOString()
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;

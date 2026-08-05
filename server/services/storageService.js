const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class StorageService {
  constructor() {
    this.provider = 'cloudinary';
  }

  uploadBufferStream(buffer, fileName, folder = 'nexus2026/papers') {
    return new Promise((resolve, reject) => {
      // Setup Cloudinary if needed, but it should be configured in server.js or .env
      // Using streamifier to handle memory buffer
      const stream = cloudinary.uploader.upload_stream(
        { folder, public_id: fileName, resource_type: 'raw' }, // raw for PDFs
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }
}

module.exports = new StorageService();

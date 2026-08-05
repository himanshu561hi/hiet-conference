const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class StorageService {
  constructor() {
    this.provider = 'cloudinary';
  }

  uploadBufferStream(buffer, fileName, folder = 'nexus2026/papers') {
    // Ensure filename explicitly ends with .pdf extension
    const pdfFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder, 
          public_id: pdfFileName, 
          resource_type: 'raw'
        },
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

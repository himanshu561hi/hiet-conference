const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

class ReportService {
  
  /**
   * Generates a CSV buffer from an array of objects
   * @param {Array} data - The array of object data
   * @param {Array} fields - Array of strings representing the keys to export
   * @returns {Buffer} - CSV string buffer
   */
  generateCSV(data, fields) {
    try {
      const parser = new Parser({ fields });
      const csv = parser.parse(data);
      return Buffer.from(csv);
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw error;
    }
  }

  /**
   * Generates an Excel buffer from an array of objects
   * @param {Array} data - Array of objects
   * @param {Array} columns - Array of { header, key, width } objects
   * @param {String} sheetName - Name of the worksheet
   * @returns {Promise<Buffer>}
   */
  async generateExcel(data, columns, sheetName = 'Report') {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);
      
      worksheet.columns = columns;
      worksheet.addRows(data);
      
      // Style Header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw error;
    }
  }

  /**
   * Generates a simple PDF buffer for tabular data
   * @param {Array} data - Array of objects
   * @param {Array} columns - Array of keys to print
   * @param {String} title - Document title
   * @returns {Promise<Buffer>}
   */
  generatePDF(data, columns, title = 'Report') {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        
        // Header
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Generated at: ${new Date().toLocaleString()}`, { align: 'right' });
        doc.moveDown(2);

        // Simple Table Implementation
        let y = doc.y;
        const colWidth = 500 / columns.length;

        // Print Headers
        doc.font('Helvetica-Bold').fontSize(10);
        columns.forEach((col, i) => {
          doc.text(col, 30 + (i * colWidth), y, { width: colWidth, align: 'left' });
        });
        
        y += 20;
        doc.moveTo(30, y).lineTo(530, y).stroke();
        y += 10;

        // Print Data Rows
        doc.font('Helvetica').fontSize(9);
        data.forEach((row) => {
          if (y > 750) {
            doc.addPage();
            y = 30;
          }
          columns.forEach((col, i) => {
            const val = row[col] ? String(row[col]) : '';
            doc.text(val.substring(0, 50), 30 + (i * colWidth), y, { width: colWidth, align: 'left', lineBreak: false });
          });
          y += 15;
          doc.moveTo(30, y).lineTo(530, y).lineWidth(0.5).strokeColor('#E0E0E0').stroke();
          y += 10;
        });

        doc.end();
      } catch (error) {
        console.error('Error generating PDF:', error);
        reject(error);
      }
    });
  }
}

module.exports = new ReportService();

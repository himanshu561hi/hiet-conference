const Notification = require('../models/Notification');
const sendEmail = require('../utils/email');

/**
 * Multi-channel Notification Service
 */
class NotificationService {
  /**
   * Sends both an In-App notification and an Email.
   * Runs email non-blocking to prevent transaction delays.
   */
  static async send({ userId, email, title, message, type, link = null, session = null }) {
    try {
      // 1. In-App Channel (Synchronous with Session if provided)
      const notification = new Notification({
        user: userId,
        title,
        message,
        type,
        link
      });
      await notification.save(session ? { session } : {});

      // 2. Email Channel (Asynchronous, no await to block flow)
      if (email) {
        sendEmail({
          email,
          subject: title,
          html: `<div style="font-family: Arial, sans-serif;">
                   <h2>${title}</h2>
                   <p>${message}</p>
                   ${link ? `<a href="${link}" style="display:inline-block; padding:10px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:5px;">View Dashboard</a>` : ''}
                   <hr/>
                   <p style="font-size:12px; color:#666;">This is an automated message from NEXUS 2026.</p>
                 </div>`
        }).catch(err => console.error('[NotificationService Email Error]:', err));
      }

    } catch (error) {
      console.error('[NotificationService Error]:', error);
      // We don't throw here to prevent the main transaction from failing just because an alert failed.
    }
  }
}

module.exports = NotificationService;

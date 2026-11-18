import nodemailer from 'nodemailer';
import { supabase } from './supabase';

export interface SmtpSettings {
  enabled?: boolean;
  host?: string;
  port?: number | string;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromName?: string;
  fromEmail?: string;
  receiverEmail?: string;
  sendAutoReply?: boolean;
}

/**
 * Resolves SMTP settings from:
 * 1. Supabase `profile` table (_customization.smtp)
 * 2. Fallback to process.env variables (like in zenigma / classystem)
 */
export async function getResolvedSmtpSettings(): Promise<SmtpSettings> {
  let dbSmtp: SmtpSettings = {};

  try {
    const { data: profData } = await supabase
      .from('profile')
      .select('socials')
      .limit(1)
      .maybeSingle();

    if (profData?.socials?._customization?.smtp) {
      dbSmtp = profData.socials._customization.smtp;
    }
  } catch (e) {
    console.warn('Could not load SMTP settings from DB, falling back to process.env:', e);
  }

  const host = dbSmtp.host || process.env.SMTP_HOST || '';
  const port = Number(dbSmtp.port || process.env.SMTP_PORT || 587);
  const user = dbSmtp.user || process.env.SMTP_USER || process.env.SMTP_USERNAME || '';
  const pass = dbSmtp.pass || process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
  const fromName = dbSmtp.fromName || process.env.SMTP_FROM_NAME || process.env.SMTP_NAME || 'Portfolio Inquiry';
  const fromEmail = dbSmtp.fromEmail || process.env.SMTP_FROM_EMAIL || process.env.SMTP_FROM || user;
  const receiverEmail = dbSmtp.receiverEmail || process.env.CONTACT_RECEIVER_EMAIL || user;
  const secure = dbSmtp.secure !== undefined ? Boolean(dbSmtp.secure) : port === 465;
  const enabled = dbSmtp.enabled !== undefined ? Boolean(dbSmtp.enabled) : Boolean(host && user);
  const sendAutoReply = Boolean(dbSmtp.sendAutoReply);

  return {
    enabled,
    host,
    port,
    secure,
    user,
    pass,
    fromName,
    fromEmail,
    receiverEmail,
    sendAutoReply,
  };
}

/**
 * Creates a Nodemailer Transporter using the resolved settings
 */
export function createTransporter(config: SmtpSettings) {
  if (!config.host || !config.user) {
    throw new Error('SMTP host and username are required.');
  }

  const portNum = Number(config.port) || 587;
  const isSecure = config.secure !== undefined ? config.secure : portNum === 465;

  return nodemailer.createTransport({
    host: config.host,
    port: portNum,
    secure: isSecure, // true for 465, false for 587/25
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      // Matches the stream_context allow_self_signed in zenigma's MailHelper.php
      rejectUnauthorized: false,
    },
  });
}

/**
 * Dispatches an email notification to the site owner when someone fills the contact form
 */
export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const config = await getResolvedSmtpSettings();

    if (!config.enabled || !config.host || !config.user) {
      console.log('[SMTP] Email notification skipped: SMTP not enabled or unconfigured.');
      return { success: false, error: 'SMTP not configured' };
    }

    const transporter = createTransporter(config);
    const recipient = config.receiverEmail || config.user;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c14; color: #f4f4f5; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background: #181825; border: 1px solid #27273a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 24px 32px; color: #ffffff; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; }
            .content { padding: 32px; }
            .field { margin-bottom: 20px; }
            .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #a1a1aa; letter-spacing: 0.5px; margin-bottom: 6px; }
            .value { font-size: 15px; color: #ffffff; font-weight: 500; }
            .message-box { background: #0c0c14; border: 1px solid #2e2e42; border-radius: 12px; padding: 18px; color: #e4e4e7; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
            .footer { padding: 20px 32px; background: #12121c; border-top: 1px solid #27273a; text-align: center; font-size: 12px; color: #71717a; }
            .reply-btn { display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 20px; border-radius: 8px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Portfolio Inquiry</h1>
              <p>Sent via your public website contact form</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Sender Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Sender Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #a78bfa; text-decoration: none;">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>
              <div style="text-align: center; margin-top: 24px;">
                <a href="mailto:${email}?subject=${encodeURIComponent('Re: Portfolio Inquiry')}" class="reply-btn">Reply directly to ${name}</a>
              </div>
            </div>
            <div class="footer">
              This message was sent from your Portfolio website contact form.
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail || config.user}>`,
      to: recipient,
      replyTo: `"${name}" <${email}>`,
      subject: `📬 New Message from ${name} (${email})`,
      text: `New Portfolio Message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    // Optional: Send auto-reply to the visitor
    if (config.sendAutoReply) {
      try {
        await transporter.sendMail({
          from: `"${config.fromName}" <${config.fromEmail || config.user}>`,
          to: email,
          subject: `Thank you for contacting me, ${name}!`,
          text: `Hi ${name},\n\nThank you for reaching out through my portfolio website. I have received your message and will get back to you as soon as possible.\n\nBest regards,\n${config.fromName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; padding: 24px; background: #0c0c14; color: #fff; border-radius: 12px;">
              <h2 style="color: #a78bfa; margin-top: 0;">Thanks for getting in touch!</h2>
              <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
                Hi <strong>${name}</strong>,<br/><br/>
                I have received your message and will review it and get back to you as soon as possible.
              </p>
              <hr style="border: none; border-top: 1px solid #27273a; margin: 20px 0;" />
              <p style="color: #71717a; font-size: 12px;">Warm regards,<br/><strong>${config.fromName}</strong></p>
            </div>
          `,
        });
      } catch (autoErr) {
        console.warn('[SMTP] Visitor auto-reply error:', autoErr);
      }
    }

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[SMTP_ERROR] Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Tests the SMTP connection and sends a sample test email
 */
export async function testSmtp(customConfig?: Partial<SmtpSettings>): Promise<{ success: boolean; message: string }> {
  try {
    const baseConfig = await getResolvedSmtpSettings();
    const config: SmtpSettings = { ...baseConfig, ...customConfig };

    if (!config.host || !config.user) {
      return { success: false, message: 'SMTP Host and Username are required.' };
    }

    const transporter = createTransporter(config);

    // Verify SMTP connection handshake
    await transporter.verify();

    const targetEmail = config.receiverEmail || config.user;

    // Send a live test email
    await transporter.sendMail({
      from: `"${config.fromName || 'Portfolio SMTP'}" <${config.fromEmail || config.user}>`,
      to: targetEmail,
      subject: '✅ SMTP Configuration Test Successful',
      text: 'Congratulations! Your portfolio SMTP settings are functioning properly and connected to your server.',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 24px; background: #09090f; color: #fff; border: 1px solid #222; border-radius: 12px;">
          <h2 style="color: #10b981; margin-top: 0;">✅ SMTP Test Successful</h2>
          <p style="color: #ccc; font-size: 14px; line-height: 1.6;">
            Your portfolio email notifications are properly configured! You will now receive instant email alerts whenever someone submits the contact form.
          </p>
          <div style="background: #151522; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #a78bfa;">
            Host: ${config.host}<br/>
            Port: ${config.port}<br/>
            User: ${config.user}<br/>
            Security: ${config.secure ? 'SSL (465)' : 'TLS/STARTTLS (587)'}
          </div>
        </div>
      `,
    });

    return {
      success: true,
      message: `SMTP connection verified and test email sent to ${targetEmail}!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'SMTP Connection failed.',
    };
  }
}

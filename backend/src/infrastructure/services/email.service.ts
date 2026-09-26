import nodemailer, { Transporter } from 'nodemailer';

export class EmailService {
  private getTransporter(): Transporter | null {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Only activate real SMTP if user and pass are filled with real non-placeholder values
    if (
      host &&
      user &&
      pass &&
      user !== 'your_email@gmail.com' &&
      pass !== 'your_16_digit_app_password'
    ) {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }

    return null;
  }

  /**
   * Send 6-Digit OTP verification email to user
   */
  async sendVerificationOtp(to: string, name: string, otp: string): Promise<void> {
    const subject = 'Kode Verifikasi Email Anda — Event & Tiket Digital';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">Verifikasi Alamat Email Anda</h2>
        <p>Halo <strong>${name}</strong>,</p>
        <p>Terima kasih telah mendaftar di platform Manajemen Event & Tiket Digital. Gunakan 6-digit kode OTP di bawah ini untuk mengonfirmasi email Anda:</p>
        <div style="background-color: #F3F4F6; padding: 16px; text-align: center; border-radius: 6px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1F2937;">${otp}</span>
        </div>
        <p style="color: #6B7280; font-size: 14px;">Kode ini hanya berlaku selama <strong>15 menit</strong>. Jangan bagikan kode ini kepada siapa pun.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
        <p style="color: #9CA3AF; font-size: 12px; text-align: center;">Jika Anda tidak pernah merasa membuat akun, abaikan email ini.</p>
      </div>
    `;

    const transporter = this.getTransporter();

    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Event Platform" <${process.env.SMTP_USER}>`,
          to,
          subject,
          html,
        });
        console.log(`\n✅ [SMTP] Email OTP terkirim secara nyata ke ${to}`);
      } catch (error) {
        console.error(`\n❌ [SMTP ERROR] Gagal mengirim email ke ${to}:`, error);
        console.log(`📧 [FALLBACK OTP KODE]: ${otp}`);
        throw error;
      }
    } else {
      // Development console fallback output
      console.log(`\n======================================================`);
      console.log(`📧 [EMAIL VERIFICATION MOCK - SMTP Belum Dikonfigurasi]`);
      console.log(`To      : ${to} (${name})`);
      console.log(`Subject : ${subject}`);
      console.log(`OTP Code: >>> ${otp} <<< (Expires in 15 mins)`);
      console.log(`======================================================\n`);
    }
  }
}

export const emailService = new EmailService();

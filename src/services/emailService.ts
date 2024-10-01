import { TestAccount, Transporter } from "nodemailer";
import mailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { promisify } from "util";

class EmailService {
  constructor(
    private transporter: Nullable<Transporter> = null,
    private testAccount: Nullable<TestAccount> = null
  ) {}

  async init() {
    if (this.transporter) {
      return this.transporter;
    }

    if (!this.testAccount) {
      this.testAccount = await mailer.createTestAccount();
    }

    try {
      const _transporter: Transporter = mailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount?.user,
          pass: this.testAccount?.pass,
        },
        pool: true, // use pooled connections
        maxConnections: 5, // limit to 5 simultaneous connections
        maxMessages: 100, // limit to 100 messages per connection
        rateLimit: 5, // limit to 5 messages per second
      });

      this.transporter = _transporter;

      await this.transporter.verify();
      console.log("SMTP connection established successfully");
      console.log("Transporter ready!");

      return this.transporter;
    } catch (error) {
      console.error("Failed to create email transporter:", error);
      throw error;
    }
  }

  async sendEmail(mailOptions: MailOptions) {
    if (!this.transporter) {
      await this.init();
    }
    try {
      const info = await this.transporter!.sendMail(mailOptions);
      console.log("Message sent %s", info.messageId);
      console.log(`Preview: ${mailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async closeTransporter() {
    if (!this.transporter) {
      return;
    }

    await promisify(this.transporter.close).call(this.transporter);
    this.transporter = null;
  }
}

export default new EmailService();

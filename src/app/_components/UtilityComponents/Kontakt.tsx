import React from "react";

export default function Kontakt() {
  async function handleSubmit(formData: FormData) {
    "use server";

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: formData.get("email"),
      subject: formData.get("subject"),
      text: formData.get("message"),
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Failed to send email" };
    }
  }

  return (
    <form method="post" action={handleSubmit} encType="multipart/form-data">
      <input
        type="email"
        name="email"
        required
        placeholder="Recipient's email"
      />
      <input type="text" name="subject" required placeholder="Subject" />
      <textarea name="message" required placeholder="Your message"></textarea>
      <button type="submit">Send Email</button>
    </form>
  );
}

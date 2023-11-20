"use server";

import { revalidatePath } from "next/cache";

export async function submitMail(prevState: any, formData: FormData) {
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "parkbadgt@gmail.com",
      pass: "eFfim$i%Oy!W1tWx",
    },
  });

  const mailOptions = {
    from: "parkbadgt@gmail.com",
    to: formData.get("email"),
    subject: formData.get("subject"),
    text: formData.get("message"),
  };

  try {
    await transporter.sendMail(mailOptions);

    revalidatePath("/Historie&Kontakt");
    return { success: true, message: "Email sent" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to send email",
      message: "Email not sent",
    };
  }
}

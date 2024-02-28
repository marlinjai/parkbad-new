import { EmailTemplate } from "../../_components/email_templates/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define an interface for your expected request body
interface EmailRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const requestBody: EmailRequestBody = await request.json();

    const data = await resend.emails.send({
      from: "sending@whiz-art.com",
      to: ["verwaltung@parkbad-gt.de"],
      subject:
        "Neue Nachricht von " +
        requestBody.firstName +
        " " +
        requestBody.lastName,
      react: EmailTemplate(requestBody),
      text:
        "neue Nachricht von " +
        requestBody.firstName +
        " " +
        requestBody.firstName +
        " " +
        requestBody.email +
        " " +
        requestBody.phone +
        " ",
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}

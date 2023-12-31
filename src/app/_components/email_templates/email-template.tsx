import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  email,
  message,
}) => (
  <div>
    <h1>
      Hello Parkbad Team!
      <br />
      You have a new contact form submission from {firstName} {lastName}.
    </h1>

    <h2>Here are the details:</h2>
    <h3>
      Name: {firstName} {lastName}
    </h3>
    <h3>Email: {email}</h3>
    <h3>Message: {message}</h3>
    <h1>
      Best regards, <br />
      Your WhizArt Team
    </h1>
  </div>
);

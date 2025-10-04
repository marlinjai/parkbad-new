// emails/welcome.tsx
import { WelcomeTemplate } from '../src/app/_components/email_templates/welcome-template';

// Welcome email with confirmation link
export default function WelcomeEmail() {
  return (
    <WelcomeTemplate
      confirmationUrl="https://parkbad-gt.de/api/newsletter/confirm?token=abc123def456&email=max.mustermann%40example.com"
      email="max.mustermann@example.com"
    />
  );
}

// Welcome email for different email
export function WelcomeEmailLong() {
  return (
    <WelcomeTemplate
      confirmationUrl="https://parkbad-gt.de/api/newsletter/confirm?token=xyz789uvw123&email=anna.schmidt.test.email.address%40gmail.com"
      email="anna.schmidt.test.email.address@gmail.com"
    />
  );
}

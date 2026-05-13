import { Resend } from 'resend';

let resend: Resend | null = null;

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set. Skipping email send.');
    return { success: false, error: 'No API key' };
  }

  try {
    if (!resend) {
      resend = new Resend(apiKey);
    }

    const data = await resend.emails.send({
      from: 'SmileCare Clinic <onboarding@resend.dev>', // Use resend's default onboarding domain for testing
      to: [to],
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with the API key from environment variables
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: Request) {
  try {
    const { name, email, company, projectType, countryCode, contactNumber, timeline, message } = await req.json();

    const msg = {
      to: 'gloyas.connect@gmail.com', // Where you want to receive the inquiries
      from: process.env.SENDGRID_FROM_EMAIL || 'gloyas.connect@gmail.com', // Must be a verified sender in SendGrid
      replyTo: email, // This allows you to just hit "Reply" in your email client to reply to the user
      subject: `New Project Inquiry from ${name}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Contact Number:</strong> ${countryCode} ${contactNumber}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    
    if (error.response) {
      console.error(error.response.body);
    }
    
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

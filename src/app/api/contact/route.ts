import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are all required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (String(message).trim().length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters long.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const isPlaceholder = !apiKey || apiKey.includes('REPLACE_WITH_YOUR');

    if (isPlaceholder) {
      console.log('--- CONTACT FORM SUBMISSION (Resend API key not configured, logging instead) ---');
      console.log({ name, email, message, receivedAt: new Date().toISOString() });
      return NextResponse.json({
        success: true,
        mode: 'logged',
        message: "Message received! (Dev mode: no RESEND_API_KEY configured, so this was logged to the server console instead of emailed.)",
      });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'onboarding@resend.dev',
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, mode: 'sent', message: 'Your message has been sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

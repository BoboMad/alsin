import { NextRequest } from 'next/server';
import { render } from '@react-email/render';
import { ConfirmEmail } from '@/emails/ConfirmEmail';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return new Response(JSON.stringify({ error: 'Missing email or token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const base = process.env.EMAIL_CONFIRM_BASE_URL;
  const url = new URL('/confirm', base);
  url.searchParams.set('email', email);
  url.searchParams.set('token', token);
  const confirmationUrl = url.toString();

  if (!name || !confirmationUrl) {
    return new Response(JSON.stringify({ error: 'Missing name or confirmationUrl' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = await render(
    ConfirmEmail({
      name,
      confirmationUrl,
    })
  );

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

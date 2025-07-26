import { NextRequest } from 'next/server';
import { render } from '@react-email/render';
import { ConfirmEmail } from '@/emails/ConfirmEmail';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const validApiKey = process.env.RENDER_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(req.url);

  const name = searchParams.get('name');
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return new Response(JSON.stringify({ error: 'Missing token or email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const safeName = name && /^[a-zA-Z\s'-]+$/.test(name) ? name : '';

  const base = process.env.EMAIL_CONFIRM_BASE_URL;
  const url = new URL('/confirm-email', base);
  url.searchParams.set('token', token);
  url.searchParams.set('email', email);
  const confirmationUrl = url.toString();

  if (!safeName || !confirmationUrl) {
    return new Response(JSON.stringify({ error: 'Missing name or confirmationUrl' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = await render(
    ConfirmEmail({
      name: safeName,
      confirmationUrl,
    })
  );

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

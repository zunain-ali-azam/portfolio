import type { APIRoute } from 'astro';
import { readContact, validateContact } from '@/lib/contact';

// Runs as a Vercel function; every other route stays prerendered
export const prerender = false;

const env = import.meta.env;

async function passesTurnstile(token: string, ip: string) {
  if (!env.TURNSTILE_SECRET_KEY) return import.meta.env.DEV; // no key: allowed in dev only
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const outcome = (await res.json()) as { success: boolean };
  return outcome.success;
}

async function sendEmail(subject: string, text: string, replyTo: string) {
  if (!env.RESEND_API_KEY) {
    if (!import.meta.env.DEV) throw new Error('RESEND_API_KEY is not set');
    console.log(`[contact] Not sent (no RESEND_API_KEY)\nSubject: ${subject}\nReply-To: ${replyTo}\n\n${text}`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    // Plain text only, so nothing a visitor types can be rendered as HTML in the inbox
    body: JSON.stringify({
      from: 'Portfolio <onboarding@resend.dev>',
      to: env.CONTACT_TO_EMAIL,
      reply_to: replyTo,
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  // The form's script asks for JSON; a plain form post (no JavaScript) gets a redirect instead
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const reply = (status: number, body: object, page: '/sent' | '/not-sent') =>
    wantsJson ? Response.json(body, { status }) : redirect(page, 303);

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return reply(400, { error: 'The form couldn’t be read.' }, '/not-sent');
  }

  // Bots fill the hidden field; tell them it worked and send nothing
  if (data.get('_honey')) return reply(200, { ok: true }, '/sent');

  const fields = readContact(data);
  const errors = validateContact(fields);
  if (Object.keys(errors).length) return reply(400, { errors }, '/not-sent');

  if (!(await passesTurnstile(String(data.get('cf-turnstile-response') ?? ''), clientAddress))) {
    return reply(400, { error: 'The spam check didn’t pass.' }, '/not-sent');
  }

  const { name, email, topic, message } = fields;
  try {
    await sendEmail(
      `[${topic}] from ${name.trim()}`,
      `${message.trim()}\n\n— ${name.trim()} <${email.trim()}>\nSent from the contact form on zunainaliazam.vercel.app`,
      email.trim(),
    );
  } catch (err) {
    console.error('[contact]', err);
    return reply(502, { error: 'Your message didn’t go through.' }, '/not-sent');
  }

  return reply(200, { ok: true }, '/sent');
};

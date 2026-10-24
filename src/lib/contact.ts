// Contact form rules, shared by the endpoint and the form's script so both report the same errors

export const TOPICS = ['Full-time role', 'Freelance project', 'Something else'] as const;

export type ContactFields = Record<'name' | 'email' | 'topic' | 'message', string>;
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name, email, topic, message }: ContactFields): ContactErrors {
  const errors: ContactErrors = {};

  if (!name.trim()) errors.name = 'Please enter your name.';
  else if (name.length > 100) errors.name = 'Please keep your name under 100 characters.';

  if (!email.trim()) errors.email = 'Please enter your email so I can reply.';
  else if (email.length > 254 || !EMAIL.test(email.trim())) errors.email = 'That email doesn’t look right. Check for typos.';

  if (!TOPICS.includes(topic as (typeof TOPICS)[number])) errors.topic = 'Please choose what this is about.';

  if (message.trim().length < 10) errors.message = 'Please write a little more, at least 10 characters.';
  else if (message.length > 5000) errors.message = 'Please keep your message under 5,000 characters.';

  return errors;
}

export function readContact(data: FormData): ContactFields {
  const get = (key: string) => String(data.get(key) ?? '');
  return { name: get('name'), email: get('email'), topic: get('topic'), message: get('message') };
}

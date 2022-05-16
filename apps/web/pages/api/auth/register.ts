import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, setCookie } from '@syncit/core/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return;
  }

  const { name, email, password } = req.body;
  const userEmail = email?.toLowerCase();

  if (!name) {
    res.status(422).json({ message: 'Invalid name' });
    return;
  }

  if (!userEmail || !userEmail.includes('@')) {
    res.status(422).json({ message: 'Invalid email' });
    return;
  }

  if (!password || password.trim().length < 7) {
    res.status(422).json({ message: 'Invalid input - password should be at least 7 characters long.' });
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  if (existingUser) {
    const message = 'Email address is already registered';

    res.status(409).json({ message });
    return;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      name,
      email: userEmail,
      password: hashedPassword,
      created: new Date(Date.now()),
    },
    create: {
      name,
      email: userEmail,
      password: hashedPassword,
      created: new Date(Date.now()),
    },
  });
  const newUser = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  setCookie(res, 'token', newUser, { maxAge: 60 * 60 * 60, path: '/' });
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.end(res.getHeader('Set-Cookie'));
}

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { setCookie, verifyPassword } from '@syncit/core/utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return;
  }

  const { email, password } = req.body;
  const userEmail = email?.toLowerCase();

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
    const verified = await verifyPassword(password, existingUser.password);
    if (verified) {
      delete existingUser.password;
      setCookie(res, 'token', existingUser, { maxAge: 60 * 60 * 60, path: '/' });
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.end(res.getHeader('Set-Cookie'));
      return;
    }
  }
  res.status(401).json({ message: 'Unauthorized' });
}

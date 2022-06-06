import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDataFromSessionId } from '@syncit/core/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userData = await getUserDataFromSessionId(req.cookies.sessionID);
  if (userData?.id) {
    res.json({ userData });
    return;
  }
  res.status(401).send('unauthrized');
}

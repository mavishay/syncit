import * as integrations from '@syncit/integrations';

export default function handler(req, res) {
  const { appParams } = req.query;
  const appHandler = integrations[appParams[0]][appParams[1]];
  return appHandler(req, res);
}

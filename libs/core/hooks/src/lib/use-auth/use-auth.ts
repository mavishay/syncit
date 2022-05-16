import { useCallback, useEffect, useState } from 'react';
import cookie from 'js-cookie';
import { b64Decode } from '@syncit/core/utils';

export interface UseAuth {
  isLoggedIn: () => Promise<boolean>;
  userData: any;
}

export function useAuth(): UseAuth {
  const [userData, setUserData] = useState<any>();

  const isLoggedIn = useCallback(async () => {
    const token = cookie.get('token') || '';
    const decoded = b64Decode(token);
    if (typeof decoded === 'string' && decoded.length > 2) {
      setUserData(JSON.parse(decoded));
    }
    return !!token;
  }, []);

  useEffect(() => {
    isLoggedIn();
  }, []);

  return { isLoggedIn, userData };
}

export default useAuth;

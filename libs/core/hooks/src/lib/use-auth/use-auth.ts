import { useCallback, useEffect, useState } from 'react';
import cookie from 'js-cookie';

export interface UseAuth {
  isLoggedIn: () => Promise<boolean>;
  userData: any;
}

export function useAuth(): UseAuth {
  const [userData] = useState({});

  const isLoggedIn = useCallback(async () => {
    const token = cookie.get('authed') || '';
    return !!token;
  }, []);

  useEffect(() => {
    isLoggedIn();
  }, []);

  return { isLoggedIn, userData };
}

export default useAuth;

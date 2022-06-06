import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '@syncit/core/store';
import Layout from '../components/layout/layout';

function Index() {
  const userData = useRecoilValue(userDataState);

  const authGoogle = useCallback(async () => {
    const res = await fetch('/api/integrations/google_calendar/add');

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const json = await res.json();
    window.location.href = json.url;
  }, []);

  return (
    <Layout title="Home">
      Welcome to syncit
      <div>{JSON.stringify(userData)}</div>
      <button type="button" onClick={authGoogle}>google auth</button>
    </Layout>
  );
}

export default Index;

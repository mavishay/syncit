import { useAuth } from '@syncit/core/hooks';
import Layout from '../components/layout/layout';

function Index() {
  const { userData } = useAuth();
  return (
    <Layout title="Home">
      Welcome to syncit
      <div>{JSON.stringify(userData)}</div>
    </Layout>
  );
}

export default Index;

import { useAuth } from '@syncit/core/hooks';
import Layout from '../components/layout/layout';

function Index() {
  const { userData } = useAuth();
  return (
    <Layout title="Home">
      Welcome to syncit
      {userData?.name}
    </Layout>
  );
}
export default Index;

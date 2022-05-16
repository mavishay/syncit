import { useAuth } from '@syncit/core/hooks';

function Index() {
  const { userData } = useAuth();
  return (
    <h1>
      Welcome to syncit
      {userData?.name}
    </h1>
  );
}
export default Index;

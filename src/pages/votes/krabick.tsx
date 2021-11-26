import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/krabick/chat-voting');
  }, []);

  return null;
};

export default Page;

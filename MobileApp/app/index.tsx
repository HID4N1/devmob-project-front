import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    setTimeout(() => {
      router.replace('/screens/Login');
    }, 0);
  }, []);

  return null;
}

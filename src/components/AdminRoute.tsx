// src/components/AdminRoute.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.config';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (!adminDoc.exists()) {
        router.push('/');
      }
    };

    checkAdmin();
  }, [auth, router]);

  return <>{children}</>;
}
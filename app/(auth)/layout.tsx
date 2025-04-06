"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/client"; // Make sure this is the CLIENT SDK

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        router.push("/");
      }
    };

    // Firebase auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/");
      }
    });

    // Initial check
    checkAuth();

    return () => unsubscribe();
  }, [router]);

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
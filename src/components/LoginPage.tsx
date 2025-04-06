"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { app } from '../../firebase/client';
import Image from 'next/image';
import Link from 'next/link';



const auth = getAuth(app);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(getFirebaseError(err.code));
    }
  };

  const handleSocialLogin = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      setError(getFirebaseError(err.code));
    }
  };

  const getFirebaseError = (code: string): string => {
    switch (code) {
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Invalid password';
      case 'auth/popup-closed-by-user':
        return 'Popup closed before completing login';
      default:
        return 'Login failed. Please try again.';
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className='min-h-screen gradient-bg-welcome from-gray-900 to-blue-900'>
      <main className="flex items-center justify-center p-4">
        <div className="swap-container">
          <div className="w-full max-w-md space-y-8 rounded-2xl gradient-bg-services p-8 shadow-xl dark:bg-gray-800">
            <h2 className="text-center text-xl mb-6">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
  {/* Add these input fields */}
  <div className="space-y-2">
    <input
      type="email"
      placeholder="Email"
      className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 bg-transparent dark:border-gray-600 dark:hover:bg-gray-700 w-full"
      required
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />
  </div>

  <div className="space-y-2">
    <input
      type="password"
      placeholder="Password"
      className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 bg-transparent dark:border-gray-600 dark:hover:bg-gray-700 w-full"
      required
      minLength={8}
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    />
  </div>

  {error && <div className="text-red-500 text-sm">{error}</div>}

  <button
    type="submit"
    className="swap-btn w-full"
  >
                Sign In
              </button>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => handleSocialLogin(new GoogleAuthProvider())}
                >
                  <Image 
                    src="/assets/google-icon.svg" 
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => handleSocialLogin(new FacebookAuthProvider())}
                >
                  <Image 
                    src="/assets/facebook-icon.svg" 
                    alt="Facebook"
                    width={20}
                    height={20}
                  />
                  Facebook
                </button>
              </div>

              <div className="auth-switch">
                <span>
                  Don't have an account?{' '}
                  <Link href="/sign-up">
                    Register
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
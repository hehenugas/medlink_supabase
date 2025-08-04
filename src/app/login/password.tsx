'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function PasswordLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { passwordLogin } = useAuth();
  const router = useRouter();

  const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await passwordLogin(username, password);
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err: any){
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <div className="relative">
          <i className="bi bi-person-fill absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
            placeholder="Enter your username"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <i className="bi bi-lock-fill absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <a href="#" className="text-teal-600 hover:text-teal-500">
            Forgot password?
          </a>
        </div>
      </div> */}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-2 px-4 rounded-lg font-bold hover:opacity-90 transition"
      >
        {loading ? (
          <>
          <span className="inline-block animate-spin mr-2">⟳</span>
          Logging in...
          </>

        ) :(
          <>Login</>
        )}
      </button>
    </form>
  );
}

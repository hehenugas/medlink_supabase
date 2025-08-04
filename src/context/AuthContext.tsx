'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserData = {
  id: number;
  username: string;
  email: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  major: string;
  studentId: string;
  avatar: string;
  phoneNumber: string;
};

type AuthContextType = {
  user: UserData | null;
  // setAuthData: (data: { user: UserData; token: string }) => void;
  register: (formData: any) => Promise<void>;
  passwordLogin: (username: string, password: string) => Promise<void>;
  qrLogin: (qrCode: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  const setAuthData = (data: { user: UserData; token: string }) => {
    setUser(data.user);
  };

  const register = async (formData: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Registration failed');

    } catch (err: any) {
        throw new Error("Register:" + err.message);
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const passwordLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      setAuthData({
        user: data.user,
        token: data.token,
      });
    } catch (err: any) {
        throw new Error("Login Error:" + err.message);
    }
  };

  const qrLogin = async (qrCode: string) => {
    try {
      const response = await fetch(`/api/auth/login-qr?code=${qrCode}`,
        { method: 'POST' }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setAuthData({
        user: data.user,
        token: data.token,
      });
    } catch (err: any) {
      throw new Error("Login Error:" + err.message);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setAuthData({ user: data.user, token: data.token });
      } catch (err) {
        console.log('Session check failed:', err);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, passwordLogin, qrLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

'use client';
import { useState } from 'react';
import Link from 'next/link';
import QRCodeLogin from './qrcode';
import PasswordLogin from './password';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'password' | 'qrcode'>('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-700 rounded-full mb-4">
              <i className="bi bi-person-fill text-white text-2xl"></i>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-600">Please enter your credentials to continue</p>
        </div>

        {/* Tab buttons */}
        <div className="flex w-full border-b border-teal-500 mb-6">
          <button
            className={`flex-1 py-3 flex items-center justify-center font-medium transition-all ${
              activeTab === 'password'
                ? 'text-teal-600 border-b-2 border-teal-500'
                : 'text-gray-500 hover:text-teal-500'
            }`}
            onClick={() => setActiveTab('password')}
          >
            <i className="bi bi-person-fill mr-2"></i>
            Username & Password
          </button>
          <button
            className={`flex-1 py-3 flex items-center justify-center font-medium transition-all ${
              activeTab === 'qrcode'
                ? 'text-teal-600 border-b-2 border-teal-500'
                : 'text-gray-500 hover:text-teal-500'
            }`}
            onClick={() => setActiveTab('qrcode')}
          >
            <i className="bi bi-qr-code mr-2"></i>
            QR Code
          </button>
        </div>

        {/* Content */}
        {activeTab === 'password' ? (
            <PasswordLogin />
        ) : (
          <QRCodeLogin />
          // <div>QRCode</div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-teal-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

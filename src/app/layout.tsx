import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Medlink Smart",
  description: "Our Product offers an efficiency that brings together various healtcare services, such as medical records, doctor consultations, medication ordering and treatment reminder.",
  icons: {
    icon: "/favicons.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <style>
          {`
            @media (max-width: 640px) {
              .Toastify__toast-container {
                width: auto !important;
                max-width: 90% !important;
                font-size: 14px !important;
                padding: 8px !important;
                margin: 8px !important;
              }
              .Toastify__toast {
                margin-bottom: 8px !important;
                max-width: 350px !important;
                width: auto !important;
                background-color: rgba(255, 255, 255, 0.9) !important;
                backdrop-filter: blur(8px) !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
              }
            }
          `}
        </style>
      </head>
      <body>
        <AuthProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{
              backgroundColor: 'transparent'
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

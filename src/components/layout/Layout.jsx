// src/components/layout/Layout.jsx
import React from 'react';
import { Header } from './Header';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};





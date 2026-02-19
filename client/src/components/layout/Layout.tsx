import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-gray-400 text-center text-sm py-4">
        © {new Date().getFullYear()} Ligue Sportive d'Auvergne — Tous droits réservés
      </footer>
    </div>
  );
}

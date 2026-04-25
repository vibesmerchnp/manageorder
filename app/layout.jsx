import './globals.css';
import { Header } from '@/components/Header';
import { Tabs } from '@/components/Tabs';

export const metadata = {
  title: 'VibesMerch Desk',
  description: 'Order management for VibesMerch.np',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Tabs />
        {children}
      </body>
    </html>
  );
}

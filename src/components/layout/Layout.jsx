import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CommandPalette from './CommandPalette';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-white relative overflow-hidden">
      {/* Global Background ambient effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <CommandPalette />
        <main className="flex-1 w-full pt-20 flex flex-col relative"> 
          {/* pt-20 accounts for sticky navbar */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

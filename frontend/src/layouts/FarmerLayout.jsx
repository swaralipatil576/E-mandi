import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

export default function FarmerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4fafd]">
      <Navbar />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      <Chatbot />
      <Footer variant="light" />
    </div>
  );
}

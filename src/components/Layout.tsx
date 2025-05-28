import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';

function Layout() {
  useAuth(); // Ensure the hook is called if needed for side effects

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(17, 24, 39)"
      gradientBackgroundEnd="rgb(88, 28, 135)"
      firstColor="18, 113, 255"
      secondColor="221, 74, 255"
      thirdColor="100, 220, 255"
      fourthColor="200, 50, 50"
      fifthColor="180, 180, 50"
      pointerColor="140, 100, 255"
      size="80%"
      blendingValue="hard-light"
      interactive={true}
      containerClassName="fixed inset-0 -z-10"
    >
      <div className="relative min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
            },
          }}
        />
      </div>
    </BackgroundGradientAnimation>
  );
}

export default Layout;